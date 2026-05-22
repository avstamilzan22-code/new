const { cmd } = require('../lib/command')
const os = require("os")
const fs = require('fs')
const path = require('path')
const axios = require('axios')

const API_KEY = "SK-3tlxedd6f7m-moqfh796"
const DB_PATH = path.join(__dirname, '..', 'database', 'autosong.json')
const MAX_HISTORY = 20
const MAX_SENT_VIDEOS = 100

if (!global.autoSong) global.autoSong = {}
if (!global.sentVideos) global.sentVideos = []

//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  PERSISTENCE
//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function ensureDbDir() {
  const dir = path.dirname(DB_PATH)
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
}

function saveConfigs() {
  try {
    ensureDbDir()
    const data = {
      configs: {},
      sentVideos: global.sentVideos.slice(-MAX_SENT_VIDEOS)
    }
    for (const [chatId, cfg] of Object.entries(global.autoSong)) {
      data.configs[chatId] = {
        jids: cfg.jids,
        category: cfg.category,
        delay: cfg.delay,
        enabled: cfg.enabled,
        history: cfg.history.slice(-MAX_HISTORY)
      }
    }
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2))
  } catch (e) {
    console.log("⚠️ autosong save error:", e?.message)
  }
}

function loadConfigs() {
  try {
    if (!fs.existsSync(DB_PATH)) return
    const data = JSON.parse(fs.readFileSync(DB_PATH, 'utf-8'))
    if (data.sentVideos) global.sentVideos = data.sentVideos
    if (!data.configs) return
    for (const [chatId, saved] of Object.entries(data.configs)) {
      if (!global.autoSong[chatId]) {
        global.autoSong[chatId] = {
          enabled: saved.enabled || false,
          jids: Array.isArray(saved.jids) ? [...new Set(saved.jids)] : [],
          category: saved.category || "latest tamil songs",
          delay: saved.delay || 600,
          history: saved.history || [],
          sending: false
        }
      }
    }
  } catch (e) {
    console.log("⚠️ autosong load error:", e?.message)
  }
}

function getCfg(chatId) {
  if (!global.autoSong[chatId]) {
    global.autoSong[chatId] = {
      enabled: false,
      jids: [],
      category: "latest tamil songs",
      delay: 600,
      history: [],
      sending: false
    }
  }
  return global.autoSong[chatId]
}

//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  AUTO-RESUME
//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function resumeAutoSongs(conn) {
  if (!conn?.user?.id) return
  for (const [chatId, cfg] of Object.entries(global.autoSong)) {
    if (cfg.enabled && !cfg.sending) {
      console.log(`♻️ Resuming autosong for ${chatId}`)
      startLoop(conn, chatId)
    }
  }
}

//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  MAIN LOOP — sends to ALL configured JIDs
//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function startLoop(conn, chatId) {
  const cfg = global.autoSong[chatId]
  if (!cfg || !cfg.enabled) return

  const run = async () => {
    try {

      if (!cfg.enabled) return
      if (!conn?.user?.id) { setTimeout(run, 10000); return }
      if (cfg.sending) return setTimeout(run, cfg.delay * 1000)
      if (!cfg.jids.length) {
        cfg.sending = false
        return setTimeout(run, cfg.delay * 1000)
      }

      cfg.sending = true

      const prompt = `Suggest ONE trending ${cfg.category} song. Avoid: ${cfg.history.join(", ")}. Reply ONLY song name, max 6 words.`

      const aiRes = await axios.get(
        `https://shyracore.indevs.in/api/ai/gemini?prompt=${encodeURIComponent(prompt)}&apikey=${API_KEY}`,
        { timeout: 30000 }
      )

      let songName = (aiRes.data?.data?.text || "")
        .split("\n")[0]
        .replace(/[*"•\d]/g, '')
        .trim()

      if (!songName || songName.length < 2) {
        cfg.sending = false
        return setTimeout(run, cfg.delay * 1000)
      }

      const searchRes = await axios.get(
        `https://shyracore.indevs.in/api/search/youtube?query=${encodeURIComponent(songName)}&apikey=${API_KEY}`,
        { timeout: 30000 }
      )

      const videos = (searchRes.data?.results || [])
        .filter(v => (v.seconds || 0) > 120 && (v.views || 0) > 50000)

      if (!videos.length) {
        cfg.sending = false
        return setTimeout(run, cfg.delay * 1000)
      }

      const video = videos[0]
      const vidId = video.videoId || video.url

      //━━ GLOBAL duplicate check — never send same song anywhere
      if (global.sentVideos.includes(vidId)) {
        cfg.sending = false
        return setTimeout(run, cfg.delay * 1000)
      }

      const dlRes = await axios.get(
        `https://shyracore.indevs.in/api/downloader/ytmp3?url=${encodeURIComponent(video.url)}&apikey=${API_KEY}`,
        { timeout: 60000 }
      )

      const dlUrl = dlRes.data?.downloadUrl || dlRes.data?.data?.downloadUrl || dlRes.data?.url
      if (!dlUrl) {
        cfg.sending = false
        return setTimeout(run, cfg.delay * 1000)
      }

      const title = (dlRes.data?.title || video.title || "Song").replace(/[\\/:*?"<>|]/g, "")
      const thumbUrl = dlRes.data?.thumbnail || video.thumbnail

      const [mp3Buf, imgBuf] = await Promise.all([
        axios.get(dlUrl, { responseType: 'arraybuffer', timeout: 60000 }).then(r => r.data),
        axios.get(thumbUrl, { responseType: 'arraybuffer', timeout: 30000 }).then(r => r.data)
      ])

      const caption = `
☘️ _*Tɪᴛʟᴇ :*_ ${video?.title || "Unknown"}

▫️📅 _*Rᴇʟᴇᴀꜱᴇ Dᴀᴛᴇ :*_ ${video?.ago || "Unknown"}
▫️⏱️ _*Dᴜʀᴀᴛɪᴏɴ :*_ ${video?.timestamp || "Unknown"}
▫️🎭 _*Vɪᴇᴡꜱ :*_ ${video?.views || "Unknown"}
▫️🔗 _*Lɪɴᴋ :*_ ${video?.url || "Unknown"}

*➟➟➟➟➟➟➟➟➟➟➟➟➟➟*
▫️🎵 *Check out this group for more songs!*
*➟➟➟➟➟➟➟➟➟➟➟➟➟➟*
`

      //━━ Send to ALL configured JIDs
      for (const targetJid of cfg.jids) {
        try {
          await conn.sendMessage(targetJid, {
            image: Buffer.from(imgBuf),
            caption
          })
          await conn.sendMessage(targetJid, {
            audio: Buffer.from(mp3Buf),
            mimetype: "audio/mpeg",
            fileName: `${title}.mp3`
          })
        } catch (e) {
          console.log(`⚠️ autosong send fail to ${targetJid}:`, e?.message)
        }
      }

      //━━ Global sentVideos — shared across all configs
      global.sentVideos.push(vidId)
      if (global.sentVideos.length > MAX_SENT_VIDEOS) global.sentVideos.shift()

      cfg.history.push(songName)
      if (cfg.history.length > MAX_HISTORY) cfg.history.shift()

    } catch (e) {
      console.log("⚠️ autosong loop error:", e?.message || e)
    } finally {
      cfg.sending = false
      setTimeout(run, cfg.delay * 1000)
    }
  }

  run()
}

//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  HELPERS
//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function allJids() {
  const set = new Set()
  for (const cfg of Object.values(global.autoSong)) {
    for (const jid of cfg.jids) set.add(jid)
  }
  return [...set]
}

function totalSongsSent() {
  return global.sentVideos.length
}

function activeConfigs() {
  return Object.values(global.autoSong).filter(c => c.enabled).length
}

//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  LOAD SAVED CONFIGS
//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
loadConfigs()

//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  COMMAND
//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
cmd({
  pattern: "autosong",
  alias: ["asong"],
  desc: "24/7 Auto Song Player",
  category: "owner",
  react: "🎵",
  use: '.autosong on',
  filename: __filename
},

async (conn, mek, m, { from, reply, args, sender, isOwner }) => {

  try {

    if (!isOwner) return reply("❌ Owner Only Command")

    const cfg = getCfg(m.chat)
    const sub = args[0]

    if (!sub) return reply(`
🎧 *AUTO SONG MENU*

▸ autosong setjid <jid>
▸ autosong addjid <jid>
▸ autosong deljid <jid>
▸ autosong listjids
▸ autosong category <name>
▸ autosong delay <seconds>
▸ autosong on
▸ autosong off
▸ autosong status
▸ autosong resume
    `)

    //━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    //  ADD JID  (setjid alias for old command)
    //━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    if (sub === 'setjid' || sub === 'addjid') {
      const jid = args[1]
      if (!jid) return reply("❌ Enter group/channel JID")
      if (!jid.includes('@')) return reply("❌ Invalid JID — must contain @")
      if (cfg.jids.includes(jid)) return reply("⚠️ JID already in list")
      cfg.jids.push(jid)
      saveConfigs()
      return reply(`✅ JID added → ${jid}\n📋 Total: ${cfg.jids.length} JIDs`)
    }

    //━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    //  DELETE JID
    //━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    if (sub === 'deljid') {
      const jid = args[1]
      if (!jid) return reply("❌ Enter JID to remove")
      const idx = cfg.jids.indexOf(jid)
      if (idx === -1) return reply("❌ JID not found in list")
      cfg.jids.splice(idx, 1)
      saveConfigs()
      return reply(`✅ JID removed → ${jid}\n📋 Remaining: ${cfg.jids.length} JIDs`)
    }

    //━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    //  LIST JIDS
    //━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    if (sub === 'listjids') {
      if (!cfg.jids.length) return reply("📋 No JIDs configured.\nUse: autosong addjid <jid>")
      let msg = `📋 *TARGET JIDs* (${cfg.jids.length})\n\n`
      cfg.jids.forEach((j, i) => msg += `${i + 1}. ${j}\n`)
      return reply(msg)
    }

    //━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    //  CATEGORY
    //━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    if (sub === 'category') {
      const cat = args.slice(1).join(" ")
      if (!cat) return reply("❌ Enter category")
      cfg.category = cat
      saveConfigs()
      return reply(`✅ Category → ${cat}`)
    }

    //━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    //  DELAY
    //━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    if (sub === 'delay') {
      const sec = parseInt(args[1])
      if (!sec || sec < 10) return reply("❌ Enter delay ≥ 10 seconds")
      cfg.delay = sec
      saveConfigs()
      return reply(`✅ Delay → ${sec}s`)
    }

    //━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    //  STATUS — show ALL configs aggregated
    //━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    if (sub === 'status') {
      let msg = `🎧 *AUTO SONG — FULL STATUS*\n\n`
      msg += `🌐 *Global*\n`
      msg += `▸ Total songs sent: ${totalSongsSent()}\n`
      msg += `▸ Active configs: ${activeConfigs()}\n`
      msg += `▸ Unique target JIDs: ${allJids().length}\n\n`

      let idx = 0
      for (const [chatId, c] of Object.entries(global.autoSong)) {
        idx++
        msg += `━━━ ${idx}. Chat: ${chatId}\n`
        msg += `▸ Enabled: ${c.enabled}\n`
        msg += `▸ JIDs (${c.jids.length}): ${c.jids.join(', ') || 'none'}\n`
        msg += `▸ Category: ${c.category}\n`
        msg += `▸ Delay: ${c.delay}s\n`
        msg += `▸ History: ${c.history.length} songs\n`
        msg += `▸ Sending: ${c.sending}\n\n`
      }

      return reply(msg)
    }

    //━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    //  OFF
    //━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    if (sub === 'off') {
      cfg.enabled = false
      saveConfigs()
      return reply("❌ Auto Song Disabled")
    }

    //━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    //  ON
    //━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    if (sub === 'on') {
      if (!cfg.jids.length) return reply("❌ Add at least one JID first\nUse: autosong addjid <jid>")
      if (cfg.enabled) return reply("⚠️ Already running")
      cfg.enabled = true
      saveConfigs()
      reply(`✅ Auto Song Started\nTargets: ${cfg.jids.length} JIDs\nCategory: ${cfg.category}\nDelay: ${cfg.delay}s`)
      startLoop(conn, m.chat)
    }

    //━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    //  RESUME
    //━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    if (sub === 'resume') {
      let count = 0
      for (const [chatId, c] of Object.entries(global.autoSong)) {
        if (c.enabled && !c.sending) {
          startLoop(conn, chatId)
          count++
        }
      }
      return reply(`✅ Resumed ${count} autosong loops`)
    }

  } catch (e) {
    console.log("⚠️ autosong cmd error:", e)
    reply(`Error: ${e.message}`)
  }
})

//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  AUTO-RESUME ON CONNECT
//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
let resumeAttempted = false

cmd({
  on: "body"
}, async (conn, mek, m, { from, isOwner }) => {
  if (!resumeAttempted && conn?.user?.id) {
    resumeAttempted = true
    resumeAutoSongs(conn)
  }
})
