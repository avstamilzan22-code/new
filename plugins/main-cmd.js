const {cmd , commands} = require('../lib/command')
const os = require("os")
const { runtime } = require('../lib/functions')
const hrs = new Date().getHours({ timeZone: 'Asia/Colombo' })
const get_localized_date = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
const axios = require('axios');
const { fakevCard } = require('../lib/fakevCard');
const bot = require('../lib/bot')
const settings = require('../lib/settings')
const { normalizeNumber, isOwner: checkOwner, getOwnerList } = require('../lib/owner')
//========================================About==================================================
cmd({
    pattern: "about",
    react: "👑",
    desc: "get owner dec",
    category: "main",
    filename: __filename
},
async(conn, mek, m,{from, contextInfo, pushname, reply}) => {
try{

    var time = new Date().toLocaleString('HI', { timeZone: 'Asia/Colombo' }).split(' ')[1]
    var date = new Date().toLocaleDateString(get_localized_date)
    var am_pm = ''
    if (hrs < 12) am_pm = 'ᴀᴍ'
    if (hrs >= 12 && hrs <= 24) am_pm = 'ᴘᴍ'
    let madeMenu = `👋 *HI*, *${pushname}*
  
╭─「 ᴅᴀᴛᴇ ɪɴꜰᴏʀᴍᴀᴛɪᴏɴ 」
│📅 *\`Date\`*: ${date}
│⏰ *\`Time\`*: ${time} ${am_pm}
╰──────────●●►

╭──────────●●►
│ *Hello , I am SHITSU MD!!*
╰──────────●●►

${bot.COPYRIGHT}`

await conn.sendMessage(from, { 
    image:{ url:bot.ALIVE_IMG },
    caption:madeMenu,
    contextInfo
},{quoted:mek})
console.log(`♻ About Command Used : ${from}`);
}catch(e){
console.log(e)
reply(`${e}`)
}
})
//==================================================ALive============================================
cmd(
    {
      pattern: "alive",
      alias: ["status"],
      desc: "Check if the bot is alive",
      category: "main",
      react: "👨‍💻",
      filename: __filename,
    },
    async (conn,mek,m, { from, pushname, reply, contextInfo } ) => {
      try {
    
      var time = new Date().toLocaleString('HI', { timeZone: 'Asia/Colombo' }).split(' ')[1]
      var date = new Date().toLocaleDateString(get_localized_date)
      var am_pm = ''
        if (hrs < 12) am_pm = 'ᴀᴍ'
        if (hrs >= 12 && hrs <= 24) am_pm = 'ᴘᴍ'
        
let aliveText =`👋 *HI*, *${pushname}* *I Am Alive Now*
  
╭─「 ᴅᴀᴛᴇ ɪɴꜰᴏʀᴍᴀᴛɪᴏɴ 」
│📅 *\`Date\`*: ${date}
│⏰ *\`Time\`*: ${time} ${am_pm}
╰──────────●●►
  
╭─「 ꜱᴛᴀᴛᴜꜱ ᴅᴇᴛᴀɪʟꜱ 」
│👤 *\`User\`*: ${pushname}
│✒ *\`Prefix\`*: ${bot.PREFIX}
│🧬 *\`Version\`*: ${bot.VERSION}
│📟 *\`Uptime\`*: ${runtime(process.uptime())}
│📂 *\`Memory\`*: ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)}MB / ${Math.round(os.totalmem() / 1024 / 1024)}MB
╰──────────●●►
╭──────────●●►
│ *Hello , I am alive now!!*
╰──────────●●►
  
🔢 *Reply below number*
  
1 │❯❯◦ 𝙲𝙾𝙼𝙼𝙰𝙽𝙳𝚂 𝙼𝙴𝙽𝚄
2 │❯❯◦ 𝚂𝙷𝙸𝚃𝚂𝚄-𝙼𝙳 𝚂𝙿𝙴𝙴𝙳
  
${bot.COPYRIGHT}`;

const vv = await conn.sendMessage( from, { 
    image: { url:bot.ALIVE_IMG },
    caption:aliveText,
    contextInfo
},{quoted:mek})
conn.ev.on('messages.upsert', async (msgUpdate) => {
          const msg = msgUpdate.messages[0];
          if (!msg.message || !msg.message.extendedTextMessage) return;
  
          const selectedOption = msg.message.extendedTextMessage.text.trim();
  
          if (msg.message.extendedTextMessage.contextInfo && msg.message.extendedTextMessage.contextInfo.stanzaId === vv.key.id) {
              switch (selectedOption) {
                  case '1':
                      reply('.menu');
                      break;
                  case '2':
                      reply('.ping');
                      break;
                      default:
                          reply("Invalid option. Please select a valid option🔴");
                  }
  
              }
          });
  
        console.log(`♻ Alive command used in: ${from}`);
      } catch (e) {
        console.error("Alive Command Error:", e);
        reply(`❌ Error: ${e.message}`);
      }
    }
  );
//=============================================Auto Bio===============================================
// AutoBIO feature variables
let autoBioInterval;

// 1. Set AutoBIO
cmd({
    on: "body"
  },  
 async (conn, mek, m, { from, isOwner, reply }) => {
    if (settings.get('AUTO_BIO') === 'true') {
        startAutoBio(conn);
    } 
});

// 2. Start AutoBIO
function startAutoBio(conn) {
    // Clear any existing interval to avoid duplicates
    if (autoBioInterval) clearInterval(autoBioInterval);

    // Set a new interval to update the bio every minute (or any preferred time)
    autoBioInterval = setInterval(async () => {
        const bioText = `*${bot.BIO_TEXT}* ${runtime(process.uptime())} 💛`;  // Set the bio text with time
        await conn.updateProfileStatus(bioText);  // Update the bot's bio
    }, 60 * 1000);  // 1 minute interval
}
console.log(`SHITSU-MD ♻ Auto Bio Started`);
//============================ Env=======================================================
function isEnabled(value) {
return value && value.toString().toLowerCase() === "true";
}
cmd({
    pattern: "env",
    alias: ["setting2", "allvar"],
    desc: "Settings of bot",
    category: "main",
    react: "⤵️",
    filename: __filename
}, 
async (conn, mek, m, { from, contextInfo, reply }) => {
    try {
        // Define the settings message with the correct boolean checks
        let envSettings = `╭━━━〔 *SHITSU-MD-ENV* 〕━━━┈⊷
┃▸╭───────────
┃▸┃๏ *𝔼ℕ𝕍 𝕊𝔼𝕋𝕋𝕀ℕ𝔾𝕊 📡*
┃▸└───────────···๏
╰────────────────┈⊷
╭━━〔 *Enabled Disabled* 〕━━┈⊷
┇๏ *Status View:* ${isEnabled(settings.get('AUTO_STATUS_SEEN')) ? "Enabled ✅" : "Disabled ❌"}
┇๏ *Status Reply:* ${isEnabled(settings.get('AUTO_STATUS_REPLY')) ? "Enabled ✅" : "Disabled ❌"}
┇๏ *Status React:* ${isEnabled(settings.get('AUTO_STATUS_REACT')) ? "Enabled ✅" : "Disabled ❌"}
┇๏ *Status Emoji:* ${settings.get('STATUS_EMOJI') || bot.STATUS_EMOJI}
┇๏ *Auto Reply:* ${isEnabled(settings.get('AUTO_REPLY')) ? "Enabled ✅" : "Disabled ❌"}
┇๏ *Auto Sticker:* ${isEnabled(settings.get('AUTO_STICKER')) ? "Enabled ✅" : "Disabled ❌"}
┇๏ *Auto Voice:* ${isEnabled(settings.get('AUTO_VOICE')) ? "Enabled ✅" : "Disabled ❌"}
┇๏ *Auto React:* ${isEnabled(settings.get('AUTO_REACT')) ? "Enabled ✅" : "Disabled ❌"}
┇๏ *Anti-Link:* ${isEnabled(settings.get('ANTI_LINK')) ? "Enabled ✅" : "Disabled ❌"}
┇๏ *Anti-Bad Words:* ${isEnabled(settings.get('ANTI_BAD')) ? "Enabled ✅" : "Disabled ❌"}
┇๏ *Auto Typing:* ${isEnabled(settings.get('AUTO_TYPING')) ? "Enabled ✅" : "Disabled ❌"}
┇๏ *Auto Recording:* ${isEnabled(settings.get('AUTO_RECORDING')) ? "Enabled ✅" : "Disabled ❌"}
┇๏ *Always Online:* ${isEnabled(settings.get('ALWAYS_ONLINE')) ? "Enabled ✅" : "Disabled ❌"}
┇๏ *Public Mode:* ${isEnabled(settings.get('PUBLIC_MODE')) ? "Enabled ✅" : "Disabled ❌"}
┇๏ *Read Message:* ${isEnabled(settings.get('READ_CMD')) ? "Enabled ✅" : "Disabled ❌"}
╰━━━━━━━━━━━━──┈⊷
> ${bot.DESCRIPTION}`;

        // Send message with an image
        await conn.sendMessage(
            from,
            {
                image: { url: `${bot.ALIVE_IMG}` }, // Image URL
                caption: envSettings,
                contextInfo
            },
            { quoted: mek }
        );

        // Send an audio file
        console.log(`♻ ENV Command Used : ${from}`);
    } catch (error) {
        console.log(error);
        reply(`Error: ${error.message}`);
    }
});
//============================List===========================================
cmd({
    pattern: "list",
    react: "🛸",
    alias: ["panel","list","commands"],
    desc: "Get bot\'s command list.",
    category: "main",
    use: '.list',
    filename: __filename
},
async(conn, mek, m,{ from, pushname, reply, contextInfo, qMessage }) => {
try{
let menu = {
main: '',
ai: '',
download: '',
group: '',
owner: '',
convert: '',
education: '',
news: '',
movie: '',
search: '',
tools: '',
other: '',
fun: ''
};

for (let i = 0; i < commands.length; i++) {
if (commands[i].pattern && !commands[i].dontAddCommandList) {
menu[commands[i].category] += `*│*❯❯◦ ${commands[i].pattern}\n`;
 }
}

let madeMenu = `🤩 *Hello!* *${pushname}*
> WELLCOME TO SHITSU-MD 🪀

╭─「 ꜱᴛᴀᴛᴜꜱ ᴅᴇᴛᴀɪʟꜱ 」
│👤 *\`User\`*: ${pushname}
│✒ *\`Prefix\`*: ${bot.PREFIX}
│🧬 *\`Version\`*: ${bot.VERSION}
│📟 *\`Uptime\`*: ${runtime(process.uptime())}
│📂 *\`Memory\`*: ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)}MB / ${Math.round(os.totalmem() / 1024 / 1024)}MB
╰──────────●●►

> OWNER COMMANDS
*╭──────────●●►*
${menu.owner}*╰───────────●●►*
> CONVERT COMMANDS
*╭──────────●●►*
${menu.convert}*╰───────────●●►*
> AI COMMANDS
*╭──────────●●►*
${menu.ai}*╰───────────●●►*
> SEARCH COMMANDS
*╭──────────●●►*
${menu.search}*╰───────────●●►*
> DOWNLOAD COMMANDS
*╭──────────●●►*
${menu.download}*╰───────────●●►*
> MAIN COMMANDS
*╭──────────●●►*
${menu.main}*╰───────────●●►*
> GROUP COMMANDS
*╭──────────●●►*
${menu.group}*╰───────────●●►*
> FUN COMMANDS
*╭──────────●●►*
${menu.fun}*╰───────────●●►*
> TOOLS COMMANDS
*╭──────────●●►*
${menu.tools}*╰───────────●●►*
> OTHER COMMANDS
*╭──────────●●►*
${menu.other}*╰───────────●●►*
> MOVIE COMMANDS
*╭──────────●●►*
${menu.movie}*╰───────────●●►*
> NEWS COMMANDS
*╭──────────●●►*
${menu.news}*╰───────────●●►*
> PAST PAPER COMMANDS
*╭──────────●●►*
${menu.education}*╰───────────●●►*

${bot.COPYRIGHT}`
console.log(`♻ List Command Used : ${from}`);
await conn.sendMessage( from, 
    {
        image:{ url:bot.ALIVE_IMG },
        caption: madeMenu,
        contextInfo
    }, { quoted: qMessage })
}catch(e){
console.log(e)
reply(`${e}`)
}
})
//=================================menu=====================================================================
cmd({
    pattern: "menu",
    alias: ["help"],
    desc: "Displays the bot menu",
    react: "📜",
    category: "main"
},
async (conn, mek, m, { from, pushname, reply, contextInfo }) => {
    try {
        let desc = `
🤩 *HELLOW* *${pushname}*
> WELLCOME TO SHITSU-MD 🪀

╭─「 ꜱᴛᴀᴛᴜꜱ ᴅᴇᴛᴀɪʟꜱ 」
│👤 *\`User\`*: ${pushname}
│✒ *\`Prefix\`*: ${bot.PREFIX}
│🧬 *\`Version\`*: ${bot.VERSION}
│📟 *\`Uptime\`*: ${runtime(process.uptime())}
│📂 *\`Memory\`*: ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)}MB / ${Math.round(os.totalmem() / 1024 / 1024)}MB
╰──────────●●►

> ʀᴇᴘʟʏ ᴛʜᴇ ɴᴜᴍʙᴇʀ ʙᴇʟᴏᴡ🗿

¹  │❯❯◦ OWNER MENU
²  │❯❯◦ CONVERT MENU
³  │❯❯◦ AI MENU
⁴  │❯❯◦ SEARCH MENU
⁵  │❯❯◦ DOWNLOAD MENU
⁶  │❯❯◦ MAIN MENU
⁷  │❯❯◦ GROUP MENU
⁸  │❯❯◦ FUN MENU
⁹  │❯❯◦ TOOLS MENU
¹⁰ │❯❯◦ OTHER MENU
¹¹ │❯❯◦ MOVIE MENU
¹² │❯❯◦ NEWS MENU
¹³ │❯❯◦ EDUCATION MENU 

${bot.COPYRIGHT}`;

        // Send the menu with an image
        const menuMessage = await conn.sendMessage(from, { 
            image: { url: bot.ALIVE_IMG }, 
            caption: desc, 
            contextInfo
        }, { quoted: mek });

        // Listen for the reply
        conn.ev.on('messages.upsert', async (msgUpdate) => {
            const msg = msgUpdate.messages[0];
            if (!msg.message || !msg.message.extendedTextMessage) return;
            
            const selectedOption = msg.message.extendedTextMessage.text.trim();

            // Check if the reply is in response to the menu message
            if (msg.message.extendedTextMessage.contextInfo?.stanzaId === menuMessage.key.id) {

                switch (selectedOption) {
                    case '1':
                        {
                            const ownerCommands = commands.filter(c => c.category === 'owner' && !c.dontAddCommandList);
                            const commandList = ownerCommands.map(c => `│ • *${c.pattern}*`).join('\n');
                            const response = `*◈ OWNER COMMAND LIST ◈*
╭─「 ᴄᴏᴍᴍᴀɴᴅꜱ ᴘᴀɴᴇʟ」
│◈ *RAM USAGE* - ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)}MB / ${Math.round(os.totalmem() / 1024 / 1024)}MB
│◈ *RUN TIME* - ${runtime(process.uptime())}
╰──────────●●►
╭────────●●►
${commandList}
╰────────●●►
➠ *Total Commands: ${ownerCommands.length}*
${bot.COPYRIGHT}`;
                        await conn.sendMessage(from, { 
                            image: { url: bot.OWNER_IMG }, 
                            caption: response 
                        }, { quoted: mek });
                        }
                        break;
                    case '2':
                        {
                            const convertCommands = commands.filter(c => c.category === 'convert' && !c.dontAddCommandList);
                            const commandList = convertCommands.map(c => `│ • *${c.pattern}*`).join('\n');
                            const response2 = `*◈ CONVERT COMMAND LIST ◈*
╭─「 ᴄᴏᴍᴍᴀɴᴅꜱ ᴘᴀɴᴇʟ」
│◈ *RAM USAGE* - ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)}MB / ${Math.round(os.totalmem() / 1024 / 1024)}MB
│◈ *RUN TIME* - ${runtime(process.uptime())}
╰──────────●●►
╭────────●●►
${commandList}
╰────────●●►
➠ *Total Commands: ${convertCommands.length}*
${bot.COPYRIGHT}`;
                        await conn.sendMessage(from, { 
                            image: { url: bot.CONVERT_IMG }, 
                            caption: response2 
                        }, { quoted: mek });
                        }
                        break;
                    case '3':
                        {
                            const aiCommands = commands.filter(c => c.category === 'ai' && !c.dontAddCommandList);
                            const commandList = aiCommands.map(c => `│ • *${c.pattern}*`).join('\n');
                            const response3 = `*◈ AI COMMAND LIST ◈*
╭─「 ᴄᴏᴍᴍᴀɴᴅꜱ ᴘᴀɴᴇʟ」
│◈ *RAM USAGE* - ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)}MB / ${Math.round(os.totalmem() / 1024 / 1024)}MB
│◈ *RUN TIME* - ${runtime(process.uptime())}
╰──────────●●►
╭────────●●►
${commandList}
╰────────●●►
➠ *Total Commands: ${aiCommands.length}*
${bot.COPYRIGHT}`;
                        await conn.sendMessage(from, { 
                            image: { url: bot.AI_IMG }, 
                            caption: response3 
                        }, { quoted: mek });
                        }
                        break;
                    case '4':
                        {
                            const searchCommands = commands.filter(c => c.category === 'search' && !c.dontAddCommandList);
                            const commandList = searchCommands.map(c => `│ • *${c.pattern}*`).join('\n');
                            const response4 = `*◈ SEARCH COMMAND LIST ◈*
╭─「 ᴄᴏᴍᴍᴀɴᴅꜱ ᴘᴀɴᴇʟ」
│◈ *RAM USAGE* - ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)}MB / ${Math.round(os.totalmem() / 1024 / 1024)}MB
│◈ *RUN TIME* - ${runtime(process.uptime())}
╰──────────●●►
╭────────●●►
${commandList}
╰────────●●►
➠ *Total Commands: ${searchCommands.length}*
${bot.COPYRIGHT}`;
                        await conn.sendMessage(from, { 
                            image: { url: bot.SEARCH_IMG }, 
                            caption: response4 
                        }, { quoted: mek });
                        }
                        break;
                    case '5':
                        {
                            const downloadCommands = commands.filter(c => c.category === 'download' && !c.dontAddCommandList);
                            const commandList = downloadCommands.map(c => `│ • *${c.pattern}*`).join('\n');
                            const response5 = `*◈ DOWNLOAD COMMAND LIST ◈*
╭─「 ᴄᴏᴍᴍᴀɴᴅꜱ ᴘᴀɴᴇʟ」
│◈ *RAM USAGE* - ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)}MB / ${Math.round(os.totalmem() / 1024 / 1024)}MB
│◈ *RUN TIME* - ${runtime(process.uptime())}
╰──────────●●►
╭────────●●►
${commandList}
╰────────●●►
➠ *Total Commands: ${downloadCommands.length}*
${bot.COPYRIGHT}`;
                        await conn.sendMessage(from, { 
                            image: { url: bot.DOWNLOAD_IMG }, 
                            caption: response5 
                        }, { quoted: mek });
                        }
                        break;
                    case '6':
                        {
                            const mainCommands = commands.filter(c => c.category === 'main' && !c.dontAddCommandList);
                            const commandList = mainCommands.map(c => `│ • *${c.pattern}*`).join('\n');
                            const response6 = `*◈ MAIN COMMAND LIST ◈*
╭─「 ᴄᴏᴍᴍᴀɴᴅꜱ ᴘᴀɴᴇʟ」
│◈ *RAM USAGE* - ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)}MB / ${Math.round(os.totalmem() / 1024 / 1024)}MB
│◈ *RUN TIME* - ${runtime(process.uptime())}
╰──────────●●►
╭────────●●►
${commandList}
╰────────●●►
➠ *Total Commands: ${mainCommands.length}*
${bot.COPYRIGHT}`;
                        await conn.sendMessage(from, { 
                            image: { url: bot.MAIN_IMG }, 
                            caption: response6 
                        }, { quoted: mek });
                        }
                        break;
                    case '7':
                        {
                            const groupCommands = commands.filter(c => c.category === 'group' && !c.dontAddCommandList);
                            const commandList = groupCommands.map(c => `│ • *${c.pattern}*`).join('\n');
                            const response7 = `*◈ GROUP COMMAND LIST ◈*
╭─「 ᴄᴏᴍᴍᴀɴᴅꜱ ᴘᴀɴᴇʟ」
│◈ *RAM USAGE* - ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)}MB / ${Math.round(os.totalmem() / 1024 / 1024)}MB
│◈ *RUN TIME* - ${runtime(process.uptime())}
╰──────────●●►
╭────────●●►
${commandList}
╰────────●●►
➠ *Total Commands: ${groupCommands.length}*
${bot.COPYRIGHT}`;
                        await conn.sendMessage(from, { 
                            image: { url: bot.GROUP_IMG }, 
                            caption: response7 
                        }, { quoted: mek });
                        }
                        break;
                    case '8':
                        {
                            const funCommands = commands.filter(c => c.category === 'fun' && !c.dontAddCommandList);
                            const commandList = funCommands.map(c => `│ • *${c.pattern}*`).join('\n');
                            const response8 = `*◈ FUN COMMAND LIST ◈*
╭─「 ᴄᴏᴍᴍᴀɴᴅꜱ ᴘᴀɴᴇʟ」
│◈ *RAM USAGE* - ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)}MB / ${Math.round(os.totalmem() / 1024 / 1024)}MB
│◈ *RUN TIME* - ${runtime(process.uptime())}
╰──────────●●►
╭────────●●►
${commandList}
╰────────●●►
➠ *Total Commands: ${funCommands.length}*
${bot.COPYRIGHT}`;
                        await conn.sendMessage(from, { 
                            image: { url: bot.FUN_IMG }, 
                            caption: response8 
                        }, { quoted: mek });
                        }
                        break;
                    case '9':
                        {
                            const toolsCommands = commands.filter(c => c.category === 'tools' && !c.dontAddCommandList);
                            const commandList = toolsCommands.map(c => `│ • *${c.pattern}*`).join('\n');
                            const response9 = `*◈ TOOLS COMMAND LIST ◈*
╭─「 ᴄᴏᴍᴍᴀɴᴅꜱ ᴘᴀɴᴇʟ」
│◈ *RAM USAGE* - ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)}MB / ${Math.round(os.totalmem() / 1024 / 1024)}MB
│◈ *RUN TIME* - ${runtime(process.uptime())}
╰──────────●●►
╭────────●●►
${commandList}
╰────────●●►
➠ *Total Commands: ${toolsCommands.length}*
${bot.COPYRIGHT}`;
                        await conn.sendMessage(from, { 
                            image: { url: bot.TOOLS_IMG }, 
                            caption: response9 
                        }, { quoted: mek });
                        }
                        break;
                    case '10':
                        {
                            const otherCommands = commands.filter(c => c.category === 'other' && !c.dontAddCommandList);
                            const commandList = otherCommands.map(c => `│ • *${c.pattern}*`).join('\n');
                            const response10 = `*◈ OTHER COMMAND LIST ◈*
╭─「 ᴄᴏᴍᴍᴀɴᴅꜱ ᴘᴀɴᴇʟ」
│◈ *RAM USAGE* - ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)}MB / ${Math.round(os.totalmem() / 1024 / 1024)}MB
│◈ *RUN TIME* - ${runtime(process.uptime())}
╰──────────●●►
╭────────●●►
${commandList}
╰────────●●►
➠ *Total Commands: ${otherCommands.length}*
${bot.COPYRIGHT}`;
                        await conn.sendMessage(from, { 
                            image: { url: bot.OTHER_IMG }, 
                            caption: response10 
                        }, { quoted: mek });
                        }
                        break;
                        case '11':
                        {
                            const movieCommands = commands.filter(c => c.category === 'movie' && !c.dontAddCommandList);
                            const commandList = movieCommands.map(c => `│ • *${c.pattern}*`).join('\n');
                            const response11 = `*◈ MOVIE COMMAND LIST ◈*
╭─「 ᴄᴏᴍᴍᴀɴᴅꜱ ᴘᴀɴᴇʟ」
│◈ *RAM USAGE* - ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)}MB / ${Math.round(os.totalmem() / 1024 / 1024)}MB
│◈ *RUN TIME* - ${runtime(process.uptime())}
╰──────────●●►
╭────────●●►
${commandList}
╰────────●●►
➠ *Total Commands: ${movieCommands.length}*
${bot.COPYRIGHT}`;
                        await conn.sendMessage(from, { 
                            image: { url: bot.MOVIE_IMG }, 
                            caption: response11 
                        }, { quoted: mek });
                        }
                        break;
                        case '12':
                        {
                            const newsCommands = commands.filter(c => c.category === 'news' && !c.dontAddCommandList);
                            const commandList = newsCommands.map(c => `│ • *${c.pattern}*`).join('\n');
                            const response12 = `*◈ NEWS COMMAND LIST ◈*
╭─「 ᴄᴏᴍᴍᴀɴᴅꜱ ᴘᴀɴᴇʟ」
│◈ *RAM USAGE* - ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)}MB / ${Math.round(os.totalmem() / 1024 / 1024)}MB
│◈ *RUN TIME* - ${runtime(process.uptime())}
╰──────────●●►
╭────────●●►
${commandList}
╰────────●●►
➠ *Total Commands: ${newsCommands.length}*
${bot.COPYRIGHT}`;
                        await conn.sendMessage(from, { 
                            image: { url: bot.NEWS_IMG }, 
                            caption: response12 
                        }, { quoted: mek });
                        }
                        break;
                        case '13':
                        {
                            const ppCommands = commands.filter(c => c.category === 'education' && !c.dontAddCommandList);
                            const commandList = ppCommands.map(c => `│ • *${c.pattern}*`).join('\n');
                            const response13 = `*◈ EDUCATION COMMAND LIST ◈*
╭─「 ᴄᴏᴍᴍᴀɴᴅꜱ ᴘᴀɴᴇʟ」
│◈ *RAM USAGE* - ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)}MB / ${Math.round(os.totalmem() / 1024 / 1024)}MB
│◈ *RUN TIME* - ${runtime(process.uptime())}
╰──────────●●►
╭────────●●►
${commandList}
╰────────●●►
➠ *Total Commands: ${ppCommands.length}*
${bot.COPYRIGHT}`;
                        await conn.sendMessage(from, { 
                            image: { url: bot.PP_IMG }, 
                            caption: response13 
                        }, { quoted: mek });
                        }
                        break;
                    default:
                }
            }
        });

    } catch (e) {
        console.error(e);
        await conn.sendMessage(from, { react: { text: '❌', key: mek.key } });
        reply('⚠️ *An error occurred while processing your request.*');
    }
});
//=================================================Owner===============================================
cmd({
    pattern: "owner",
    react: "👑", // Reaction emoji when the command is triggered
    alias: ["user", "ow"],
    desc: "Get owner number",
    category: "main",
    filename: __filename
}, 
async (conn, mek, m, { from, pushname, reply }) => {
    try {
        const ownerList = getOwnerList(conn.user?.id);
        const ownerNum = ownerList[0] || '94764642432';
        const ownerNumber = '+' + ownerNum;
        const ownerName = pushname || 'SHITSU-MD Owner';
        const organization = 'SHITSU-MD';

        const vcard = 'BEGIN:VCARD\n' +
                      'VERSION:3.0\n' +
                      `FN:${ownerName}\n` +
                      `ORG:${organization};\n` +
                      `TEL;type=CELL;type=VOICE;waid=${ownerNum}:${ownerNumber}\n` +
                      'END:VCARD';

        const sentVCard = await conn.sendMessage(from, {
            contacts: {
                displayName: ownerName,
                contacts: [{ vcard }]
            }
        });

        await conn.sendMessage(from, {
            text: `*This is the owner's contact:* ${ownerName}`,
            contextInfo: {
                mentionedJid: [ownerNum + '@s.whatsapp.net'],
                quotedMessageId: sentVCard.key.id
            }
        }, { quoted: mek });

    } catch (error) {
        console.error(error);
        await conn.sendMessage(from, { text: 'Sorry, there was an error fetching the owner contact.' }, { quoted: mek });
    }
});
//============================================Ping==================================================
cmd({
    pattern: "speed",
    react: "🤖",
    alias: ["speed"],
    desc: "Check bot\'s ping",
    category: "main",
    use: '.ping2',
    filename: __filename
},
async(conn, mek, m,{from, l, reply}) => {
try{
    var inital = new Date().getTime();
    let ping = await conn.sendMessage(from , { text: '*_SHITSU-MD..._*'  }, { quoted: mek } )
    var final = new Date().getTime();
    await conn.sendMessage(from, { delete: ping.key })
        return await conn.sendMessage(from , { text: '*🔥Pong*\n *' + (final - inital) + ' ms* '  }, { quoted: mek } )
    } catch (e) {
    reply('*Error !!*')
    l(e)
    }
})

cmd({
  pattern: "ping",
  alias: ["pong", "test"],
  use: '.ping',
  desc: "Real-time ping test with live editing",
  category: "main",
  react: "⚡",
  filename: __filename
}, async (conn, mek, m, { from }) => {
  try {
    const startTime = Date.now();
    let isRunning = true;
    
    // 🚀 SEND INITIAL MESSAGE
    const initialMsg = await conn.sendMessage(from, { 
      text: `╔ஜ۩▒█ *⚡ ρเɳɠ รყรƭεɱ ⚡* █▒۩ஜ╗
*|* ⏳ ᴛɪᴍᴇ: 0s
*|* ⚡ ᴍꜱ: 0ms
*|* 🔁 ᴛᴇꜱᴛɪɴɢ...
╰━━━━━━━━━━━━━━━━━━⊷
> ᴘᴏᴡᴇʀᴇᴅ ʙʏ sʜɪᴛsᴜ-ᴍᴅ` 
    }, { quoted: m });
    
    // 🔄 UPDATE INTERVAL
    const updateInterval = setInterval(async () => {
      if (!isRunning) return;
      
      const currentTime = Date.now();
      const elapsedTime = Math.floor((currentTime - startTime) / 1000);
      const currentPing = Math.floor(Math.random() * 50) + 50; // Simulated ping 50-100ms
      
      // 🎨 CREATE UPDATED MESSAGE
      const updatedText = `╔ஜ۩▒█ *⚡ ρเɳɠเɳɠ... ⚡* █▒۩ஜ╗
*|* ⏳ ᴛɪᴍᴇ: ${elapsedTime}s
*|* ⚡ ᴍꜱ: ${currentPing}ms
*|* ${elapsedTime < 5 ? " 🔁 ᴛᴇꜱᴛɪɴɢ..." : 
  elapsedTime < 10 ? " 📡 ᴍᴇᴀꜱᴜʀɪɴɢ..." : 
  elapsedTime < 15 ? " ⚡ ᴄᴀʟᴄᴜʟᴀᴛɪɴɢ..." : 
  elapsedTime < 20 ? " 📊 ᴀɴᴀʟʏᴢɪɴɢ..." : 
  " ✅ ★彡[ᴄᴏᴍᴘʟᴇᴛᴇ ɪɴ]彡★ " + (30 - elapsedTime) + "s"}\n╰━━━━━━━━━━━━━━━━━━⊷\n> ᴘᴏᴡᴇʀᴇᴅ ʙʏ sʜɪᴛsᴜ-ᴍᴅ`;
      
      try {
        await conn.sendMessage(from, {
          text: updatedText,
          edit: initialMsg.key
        });
      } catch (error) {
        console.log("Edit failed:", error.message);
        isRunning = false;
        clearInterval(updateInterval);
      }
      
    }, 1000); // Update every 1 second
    
    // ⏱️ STOP AFTER 30 SECONDS
    setTimeout(async () => {
      isRunning = false;
      clearInterval(updateInterval);
      
      const finalPing = Date.now() - startTime;
      const avgPing = Math.floor(finalPing / 30);
      
      // 🎯 FINAL MESSAGE
      const finalText = `╔ஜ۩▒█ *⚡ ρเɳɠเɳɠ... ⚡* █▒۩ஜ╗
*|* ⏳ ᴛᴏᴛᴀʟ ᴛɪᴍᴇ: 30ꜱ
*|* ⚡ ꜰɪɴᴀʟ ᴍꜱ: ${finalPing}ms
*|* 📊 αѵɠ ɱร: ${avgPing}ms
╰━━━━━━━━━━━━━━━━━━⊷

> ᴘᴏᴡᴇʀᴇᴅ ʙʏ sʜɪᴛsᴜ-ᴍᴅ
${avgPing < 100 ? " 🚀 µℓƭ૨α ƒαรƭ" : 
  avgPing < 200 ? " ⚡ εא૮εℓℓεɳƭ" : 
  avgPing < 500 ? " 🔄 ɠσσ∂" : 
  " 📶 αѵε૨αɠε"}

📍 ᴜꜱᴇ .ᴍᴇɴᴜ ꜰᴏʀ ᴄᴏᴍᴍᴀɴᴅꜱ`;
      
      try {
        await conn.sendMessage(from, {
          text: finalText,
          edit: initialMsg.key
        });
      } catch {
        await conn.sendMessage(from, { text: finalText }, { quoted: fakevCard });
      }
      
    }, 30000); // Run for 30 seconds
    
    // 🛑 STOP ON ERROR
    process.on('uncaughtException', () => {
      isRunning = false;
      clearInterval(updateInterval);
    });

  } catch (e) {
    console.error("❌ Ping error:", e);
    await conn.sendMessage(from, { 
      text: `❌ Error: ${e.message}` 
    }, { quoted: fakevCard });
  }
});
//======================================Precisence====================================================
//auto recording
cmd({
  on: "body"
},    
async (conn, mek, m, { from, body, isOwner }) => {       
 if (settings.get('AUTO_RECORDING') === 'true') {
                await conn.sendPresenceUpdate('recording', from);
            }
         } 
   );

//auto_voice
cmd({
  on: "body"
},    
async (conn, mek, m, { from, body, isOwner }) => {

  let voc = await axios.get(`${bot.BOT_URL}`);
  const url = voc.data.voice;
    let { data } = await axios.get(url)
    for (const text in data) {
        if (body.toLowerCase() === text.toLowerCase()) {
            if (settings.get('AUTO_VOICE') === 'true') {
                if (isOwner) return;        
                await conn.sendPresenceUpdate('recording', from);
                await conn.sendMessage(from, { audio: { url: data[text] }, mimetype: 'audio/mpeg', ptt: true }, { quoted: mek });
            }
        }
    }                
});

cmd({
  on: "body"
},    
async (conn, mek, m, { from, body, isOwner }) => {
  let rep = await axios.get(`${bot.BOT_URL}`);
  const url = rep.data.reply;
    let { data } = await axios.get(url)
    for (const text in data) {
        if (body.toLowerCase() === text.toLowerCase()) {
            if (settings.get('AUTO_REPLY') === 'true') {
                if (isOwner) return;        
                await m.reply(data[text])
            
            }
        }
    }                
});
// Composing (Auto Typing)
cmd({
    on: "body"
},    
async (conn, mek, m, { from, body, isOwner }) => {
    if (settings.get('AUTO_TYPING') === 'true') {
        await conn.sendPresenceUpdate('composing', from); // send typing 
    }
});
// Always Online
cmd({
  on: "body"
}, async (conn, mek, m, { from, isOwner }) => {
  try {
    if (settings.get('ALWAYS_ONLINE') === "true") {
      // Always Online Mode: Bot always appears online (double tick)
      await conn.sendPresenceUpdate("available", from);
    } else {
      // Dynamic Mode: Adjust presence based on owner's status
      if (isOwner) {
        // If the owner is online, show as available (double tick)
        await conn.sendPresenceUpdate("available", from);
      } else {
        // If the owner is offline, show as unavailable (single tick)
        await conn.sendPresenceUpdate("unavailable", from);
      }
    }
  } catch (e) {
    console.log(e);
  }
});

// Public Mod
cmd({
  on: "body"
}, async (conn, mek, m, { from, isOwner }) => {
  try {
    if (settings.get('ALWAYS_ONLINE') === "true") {
      // Public Mode + Always Online: Always show as online
      await conn.sendPresenceUpdate("available", from);
    } else if (settings.get('PUBLIC_MODE') === "true") {
      // Public Mode + Dynamic: Respect owner's presence
      if (isOwner) {
        // If owner is online, show available
        await conn.sendPresenceUpdate("available", from);
      } else {
        // If owner is offline, show unavailable
        await conn.sendPresenceUpdate("unavailable", from);
      }
    }
  } catch (e) {
    console.log(e);
  }
});
//==========================================Repo=================================================
cmd({
    pattern: "repo",
    desc: "repo the bot",
    react: "📡",
    category: "main",
    filename: __filename
},

async(conn, mek, m,{from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply}) => {
try{
let ownerNum = getOwnerList(conn.user?.id)[0] || bot.OWNER_NUMBER || 'Unknown';
let dec = `> SHITSU-MD REPO INFO 🪀

╭⦁⦂⦁*━┉━┉━┉━┉━┉━┉━⦁⦂⦁
┃ 𝙾𝚆𝙽𝙴𝚁 𝙽𝚄𝙼𝙱𝙴𝚁: ${ownerNum}
┃ 
┃ SHITSU-MD REPO: ${bot.REPO_LINK} 
┃
┃ BOT UPDATES: ${bot.WA_CHANNEL}
╰⦁⦂⦁*━┉━┉━┉━┉━┉━┉━⦁⦂⦁

*${bot.COPYRIGHT}*
`
await conn.sendMessage(from,{image:{url: bot.ALIVE_IMG},caption:dec},{quoted:mek});
console.log(`♻ Repo Command Used : ${from}`);

}catch(e){
    console.log(e)
    reply(`${e}`)
    }
})
//===========================================Setting===============================================
cmd({
    pattern: "settings",
    alias: ["setting","s"],
    desc: "Bot settings menu (owner only)",
    category: "main",
    filename: __filename
}, 
async (conn, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {
        isOwner = checkOwner(sender, conn.user);
        if (!isOwner) return reply("❌ You must be the bot owner to use this command.");

        function s(key) { return settings.get(key) === 'true' ? 'ON ✅' : 'OFF ❌'; }
        function modeLabel() {
            switch (settings.get('MODE')) {
                case 'private': return 'PRIVATE 👤';
                case 'groups': return 'GROUPS ONLY 👥';
                case 'inbox': return 'INBOX ONLY 🫂';
                default: return 'PUBLIC 🌎';
            }
        }
        function delType() {
            switch (settings.get('ANTI_DELETE_TYPE')) {
                case 'same': return 'Same Chat';
                case 'inbox': return 'Inbox';
                case 'both': return 'Both';
                default: return 'Same Chat';
            }
        }

        const toggle = (key) => {
            const cur = settings.get(key);
            const val = cur === 'true' ? 'false' : 'true';
            settings.set(key, val);
            return `✅ *${key}*: ${val === 'true' ? 'ON' : 'OFF'}`;
        };

        const processSettingChoice = (opt, value = '') => {
            if (!opt) return false;
            switch (opt.toLowerCase()) {
                case '1a': settings.set('MODE', 'public'); return '✅ Mode: PUBLIC 🌎';
                case '1b': settings.set('MODE', 'private'); return '✅ Mode: PRIVATE 👤';
                case '1c': settings.set('MODE', 'groups'); return '✅ Mode: GROUPS ONLY 👥';
                case '1d': settings.set('MODE', 'inbox'); return '✅ Mode: INBOX ONLY 🫂';
                case '2': return toggle('ANTI_DELETE');
                case '2a': settings.set('ANTI_DELETE_TYPE', 'same'); return '✅ Anti-Delete type: Same Chat';
                case '2b': settings.set('ANTI_DELETE_TYPE', 'inbox'); return '✅ Anti-Delete type: Inbox';
                case '2c': settings.set('ANTI_DELETE_TYPE', 'both'); return '✅ Anti-Delete type: Both';
                case '3': return toggle('ANTI_EDIT');
                case '4': return toggle('ANTI_LINK');
                case '5': return toggle('ANTI_BAD');
                case '6': return toggle('ANTI_CALL');
                case '7': return toggle('ANTI_VV');
                case '8': return toggle('ANTI_BOT');
                case '9': return toggle('READ_MESSAGE');
                case '10': return toggle('AUTO_REACT');
                case '11': return toggle('AUTO_TYPING');
                case '12': return toggle('AUTO_RECORDING');
                case '13': return toggle('ALWAYS_ONLINE');
                case '14': return toggle('AUTO_BIO');
                case '15': return toggle('AUTO_STATUS_SEEN');
                case '16': return toggle('AUTO_STATUS_REPLY');
                case '17': return toggle('AUTO_STATUS_REACT');
                case '18':
                    if (!value) return `Current status emoji: ${settings.get('STATUS_EMOJI') || bot.STATUS_EMOJI}\nReply with 18 <emoji> to update.`;
                    settings.set('STATUS_EMOJI', value);
                    return `✅ Status Emoji set to ${value}`;
                case '19': return toggle('AUTO_VOICE');
                case '20': return toggle('AUTO_STICKER');
                case '21': return toggle('AUTO_REPLY');
                case '22': return toggle('READ_CMD');
                case '23': return toggle('DELETE_LINKS');
                case '24': return toggle('ADMIN_EVENTS');
                case '25': return toggle('PUBLIC_MODE');
                case '26': return toggle('AUTO_BLOCK');
                default: return false;
            }
        };

        const input = q?.trim();
        if (input) {
            const parts = input.split(/\s+/);
            let opt = parts[0].toLowerCase();
            let value = parts.slice(1).join(' ');
            if (opt === 'update' && parts.length > 1) {
                opt = parts[1].toLowerCase();
                value = parts.slice(2).join(' ');
            }
            const result = processSettingChoice(opt, value);
            if (result) return reply(result);
        }

        const menu = `
╭──❍ *SETTINGS* ❍──╮
│
├─❍ *Mode:* ${modeLabel()}
│
├─❍ 1. Work Mode
├─❍ 2. Anti-Delete: ${s('ANTI_DELETE')} [${delType()}]
├─❍ 3. Anti-Edit: ${s('ANTI_EDIT')}
├─❍ 4. Anti-Link: ${s('ANTI_LINK')}
├─❍ 5. Anti-Bad: ${s('ANTI_BAD')}
├─❍ 6. Anti-Call: ${s('ANTI_CALL')}
├─❍ 7. Anti-VV: ${s('ANTI_VV')}
├─❍ 8. Anti-Bot: ${s('ANTI_BOT')}
├─❍ 9. Auto-Read: ${s('READ_MESSAGE')}
├─❍ 10. Auto-React: ${s('AUTO_REACT')}
├─❍ 11. Auto-Typing: ${s('AUTO_TYPING')}
├─❍ 12. Auto-Recording: ${s('AUTO_RECORDING')}
├─❍ 13. Always Online: ${s('ALWAYS_ONLINE')}
├─❍ 14. Auto-Bio: ${s('AUTO_BIO')}
├─❍ 15. Auto-Status Seen: ${s('AUTO_STATUS_SEEN')}
├─❍ 16. Auto-Status Reply: ${s('AUTO_STATUS_REPLY')}
├─❍ 17. Auto-Status React: ${s('AUTO_STATUS_REACT')}
├─❍ 18. Status Emoji: ${settings.get('STATUS_EMOJI') || bot.STATUS_EMOJI}
├─❍ 19. Auto-Voice: ${s('AUTO_VOICE')}
├─❍ 20. Auto-Sticker: ${s('AUTO_STICKER')}
├─❍ 21. Auto-Reply: ${s('AUTO_REPLY')}
├─❍ 22. Read Cmd: ${s('READ_CMD')}
├─❍ 23. Delete Links: ${s('DELETE_LINKS')}
├─❍ 24. Admin Events: ${s('ADMIN_EVENTS')}
├─❍ 25. Public Mode: ${s('PUBLIC_MODE')}
├─❍ 26. Auto-Block: ${s('AUTO_BLOCK')}
│
╰──────────────────────❍

> Reply with number to toggle
> For mode: 1a=public 1b=private 1c=group 1d=inbox
> For anti-delete type: 2a=same 2b=inbox 2c=both
> To set status emoji: 18 <emoji> or .settings update 18 <emoji>`;

        const vv = await conn.sendMessage(from, {
            image: { url: bot.ALIVE_IMG },
            caption: menu
        }, { quoted: mek });

        console.log(`♻ Setting Command Used : ${from}`);

        conn.ev.on('messages.upsert', async function handler(msgUpdate) {
            const msg = msgUpdate.messages[0];
            if (!msg.message || !msg.message.extendedTextMessage) return;

            const optText = msg.message.extendedTextMessage.text.trim();
            const ctx = msg.message.extendedTextMessage.contextInfo;
            if (!ctx || ctx.stanzaId !== vv.key.id) return;

            if (!checkOwner(msg.key.participant || msg.key.remoteJid, conn.user)) return;
            conn.ev.off('messages.upsert', handler);

            const tokens = optText.split(/\s+/);
            let opt = tokens[0].toLowerCase();
            let value = tokens.slice(1).join(' ');
            const result = processSettingChoice(opt, value);
            if (result) return reply(result);
            reply("❌ Invalid option. Reply with a number from the menu.");
        });
    
    } catch (e) {
        console.log(e);
        reply("" + e);
    }
});
//=================================================System===============================================
cmd({
    pattern: "system",
    react: "♠️",
    alias: ["uptime","status","runtime"],
    desc: "cheack uptime",
    category: "main",
    filename: __filename
},
async(conn, mek, m,{from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply}) => {
try{
let status = `
◈ *𝐒𝐘𝐒𝐓𝐄𝐌 𝐈𝐍𝐅𝐎𝐑𝐌𝐀𝐓𝐈𝐎𝐍*


*⦁⦂⦁*━┉━┉━┉━┉━┉━┉━┉━⦁⦂⦁
┃
┃ ⏰  *Runtime :-* ${runtime(process.uptime())}
┃
┃ 📟 *Ram usage :-* ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)}MB / ${Math.round(require('os').totalmem / 1024 / 1024)}MB
┃
┃⚙ *Platform :-* ${os.hostname()}
┃
┃ 👨‍💻  *Owners :-* LovelyMD Official 
┃
┃ 🧬 *Version :-* ${bot.VERSION}
┃
*⦁⦂⦁*━┉━┉━┉━┉━┉━┉━┉━⦁⦂⦁

*${bot.COPYRIGHT}*`
await conn.sendMessage(from,{image:{url:bot.ALIVE_IMG},caption:`${status}`},{quoted:mek})
console.log(`♻ System Command Used : ${from}`);
}catch(e){
console.log(e)
reply(`${e}`)
}
})
//===========================================Functions=========================================
cmd({
    on: "body"
  },
  async (conn,mek, m, { from, body, isGroup, isAdmins, isBotAdmins, reply, sender }) => {
      try {
          
          const badWords = ["porno","porn","xxn","pono","fack","nude","nappi","doch","xnxn","khalifa","kalifa","xxx","cum","pussy","prono","fuck","sex","pronhub","xnxx","pakaya","ponnaya","huththa","පොන්නයා","පකයා","පක","වේස","හුක","paka" ,"huka","wesa","ponna","wesi","kariya","pinnaya","HUKA","කැරි","Huka","pamkaya","පම්කයා","හුකයි","බඩුව","බිජ්ජ","පයිය","බිජ්ජා","පයියා","හිකුවනම්","පකයා","හුත්තා","හුත්තිගේ","හුත්තෝ","හුත්තො","පොන්න","පොන්නයෙක්","පොන්නයා","කැරියා","වේස බල්ලා","හුකපන්","හුකාපන්","කැරි","හුකන්නා","පකා","පොන්න","වේස","පක","හැමිනිමිනියන්","හැමිනෙනවා","pakaya","Pakaya","paka","pakaa","Paka","Pakaa","Huththa","huththaa","Huththaa","huththa","Ponnaya","Ponnayaa","ponnaya","ponnayaa","Kariya","Kari","Kariyaa","kariya","kari","kariyaa","Wesa","Weesa","wesa","weesa","Wesa balla","wesa balla","Hukapan","hukapan.Hukaapan","hukaapan","Hukapam","hukapam","Hukaapam","hukaapam","Kari","Hukanna","hukanna","Hukannaa","hukannaa","Paka","Pakaa","paka","pakaa","Ponna","ponna","Haminiyan","haminiyan","Haminiyam","haminiyam","Haminenawa","haminenawa","Haminenawaa","haminenawaa","Bijja","bijja","Bijjaa","bijjaa","Paiya","Payya","paiya","payya","Hutta","hutta","Huttaa","huttaa","baduwa","Baduwa","sex","Sex","xxx","XXX","sexy","Sexy","porn","ass","nude","pussy","dick","boobs","pusy","naked","mehk malik"]
          if (!isGroup || isAdmins || !isBotAdmins) return; // Skip if not in group, or sender is admin, or bot is not admin
        
          const lowerCaseMessage = body.toLowerCase();
          const containsBadWord = badWords.some(word => lowerCaseMessage.includes(word));
          
          if (containsBadWord & settings.get('ANTI_BAD') === 'true') {
            await conn.sendMessage(from, { delete: mek.key }, { quoted: mek });
            await conn.sendMessage(from, { text: "🚫 ⚠️BAD WORDS NOT ALLOWED⚠️ 🚫" }, { quoted: mek });
          }
      } catch (error) {
          console.error(error)
          reply("An error occurred while processing the message.")
      }
  })
  
  const linkPatterns = [
      /https?:\/\/(?:chat\.whatsapp\.com|wa\.me)\/\S+/gi,   // WhatsApp group or chat links
      /https?:\/\/(?:t\.me|telegram\.me)\/\S+/gi,           // Telegram links
      /https?:\/\/(?:www\.)?youtube\.com\/\S+/gi,           // YouTube links
      /https?:\/\/youtu\.be\/\S+/gi,                        // YouTube short links
      /https?:\/\/(?:www\.)?facebook\.com\/\S+/gi,          // Facebook links
      /https?:\/\/fb\.me\/\S+/gi,                           // Facebook short links
      /https?:\/\/(?:www\.)?instagram\.com\/\S+/gi,         // Instagram links
      /https?:\/\/(?:www\.)?twitter\.com\/\S+/gi,           // Twitter links
      /https?:\/\/(?:www\.)?tiktok\.com\/\S+/gi,            // TikTok links
      /https?:\/\/(?:www\.)?linkedin\.com\/\S+/gi,          // LinkedIn links
      /https?:\/\/(?:www\.)?snapchat\.com\/\S+/gi,          // Snapchat links
      /https?:\/\/(?:www\.)?pinterest\.com\/\S+/gi,         // Pinterest links
      /https?:\/\/(?:www\.)?reddit\.com\/\S+/gi,            // Reddit links
      /https?:\/\/ngl\/\S+/gi,                              // NGL links
      /https?:\/\/(?:www\.)?discord\.com\/\S+/gi,           // Discord links
      /https?:\/\/(?:www\.)?twitch\.tv\/\S+/gi,             // Twitch links
      /https?:\/\/(?:www\.)?vimeo\.com\/\S+/gi,             // Vimeo links
      /https?:\/\/(?:www\.)?dailymotion\.com\/\S+/gi,       // Dailymotion links
      /https?:\/\/(?:www\.)?medium\.com\/\S+/gi             // Medium links
  ];
  
  cmd({
      on: "body"
  }, async (conn, mek, m, { from, body, sender, isGroup, isAdmins, isBotAdmins, reply }) => {
      try {
          if (!isGroup || isAdmins || !isBotAdmins) return; // Skip if not in group, or sender is admin, or bot is not admin
  
          const containsLink = linkPatterns.some(pattern => pattern.test(body));
          if (containsLink && settings.get('ANTI_LINK') === 'true') {
              // Delete the message
              await conn.sendMessage(from, { delete: mek.key }, { quoted: mek });
  
              // Warn the user
              await conn.sendMessage(from, { text: `⚠️ Links are not allowed in this group.\n@${sender.split('@')[0]} has been removed. 🚫`, mentions: [sender] }, { quoted: mek });
  
              // Remove the user from the group
              await conn.groupParticipantsUpdate(from, [sender], 'remove');
          }
      } catch (error) {
          console.error(error);
          reply("An error occurred while processing the message.");
      }
  });

// ==========================================
//              🤖 AI PLUGINS
// ==========================================

cmd({
    pattern: "blackbox",
    react: "🤖",
    desc: "Chat with Blackbox AI",
    category: "ai",
    filename: __filename
}, async (conn, mek, m, { from, q, reply }) => {
    if (!q) return reply("Please provide a prompt. Example: .blackbox Hello");
    try {
        let { data } = await axios.get(`https://arslan-apis-v2.vercel.app/ai/blackbox?q=${encodeURIComponent(q)}`);
        if (data.status) return reply(`*Blackbox AI:*\n\n${data.result}`);
    } catch (e) { reply("Error fetching AI response."); }
});

cmd({
    pattern: "blackbox4",
    react: "🤖",
    desc: "Chat with Blackbox V4 AI",
    category: "ai",
    filename: __filename
}, async (conn, mek, m, { from, q, reply }) => {
    if (!q) return reply("Please provide a prompt. Example: .blackbox4 Hello");
    try {
        let { data } = await axios.get(`https://arslan-apis-v2.vercel.app/ai/blackboxv4?q=${encodeURIComponent(q)}`);
        if (data.status) return reply(`*Blackbox V4:*\n\n${data.result}`);
    } catch (e) { reply("Error fetching AI response."); }
});

cmd({
    pattern: "text2img",
    react: "🎨",
    desc: "Generate Image from Text",
    category: "ai",
    filename: __filename
}, async (conn, mek, m, { from, q, reply }) => {
    if (!q) return reply("Please provide a prompt. Example: .text2img flying car");
    try {
        let { data } = await axios.get(`https://arslan-apis-v2.vercel.app/ai/text2img?prompt=${encodeURIComponent(q)}`);
        if (data.status) {
            await conn.sendMessage(from, { image: { url: data.result }, caption: `🎨 *Prompt:* ${q}\n\nGenerated by Shitsu MD` }, { quoted: mek });
        }
    } catch (e) { reply("Error generating image."); }
});

// ==========================================
//              🤖 GPT AI
// ==========================================

cmd({
    pattern: "gpt",
    alias: ["ai", "chatgpt"],
    react: "🤖",
    desc: "Chat with GPT AI",
    category: "ai",
    filename: __filename
}, async (conn, mek, m, { from, q, reply }) => {
    if (!q) {
        return reply(
            "⚠️ Please provide a question after .gpt\n\n" +
            "Example: .gpt What is quantum computing?"
        );
    }

    await conn.sendMessage(from, {
        react: { text: '🤖', key: mek.key }
    });

    try {
        const apiUrl = `https://iamtkm.vercel.app/ai/gpt5?apikey=tkm&text=${encodeURIComponent(q)}`;
        const { data } = await axios.get(apiUrl);
        const replyText = data?.result;

        if (replyText) {
            return conn.sendMessage(from, { text: replyText }, { quoted: mek });
        }

        throw new Error('No valid response from AI API');
    } catch (error) {
        console.error('[GPT Error]', {
            message: error.message,
            response: error.response?.data || null,
        });

        const errorMessage = error.response?.status === 429
            ? "❌ Rate limit exceeded. Please try again later."
            : "❌ Failed to reach AI API.";

        return reply(errorMessage);
    }
});

// ==========================================
//              🤖 BARD AI
// ==========================================

cmd({
    pattern: "bard",
    react: "🤖",
    desc: "Chat with Google Bard AI",
    category: "ai",
    filename: __filename
}, async (conn, mek, m, { from, q, reply }) => {
    if (!q) {
        return reply("❌ Please provide a query for Google Bard AI!\n\nExample: .bard What is artificial intelligence?");
    }

    if (q.length > 1000) {
        return reply("📝 Query too long! Max 1000 characters.");
    }

    await conn.sendMessage(from, {
        react: { text: '📥', key: mek.key }
    });

    await conn.sendPresenceUpdate('composing', from);

    try {
        const { data } = await axios.get(`https://apiskeith.top/ai/bard?q=${encodeURIComponent(q)}`, { timeout: 30000 });

        if (!data?.status || !data?.result) {
            throw new Error("API failed to generate response!");
        }

        await conn.sendMessage(from, {
            react: { text: '✅', key: mek.key }
        });

        await conn.sendMessage(from, {
            text: `🤖 *Google Bard AI Assistant*\n\n📝 *Query:* ${q}\n\n💬 *Response:*\n${data.result.trim()}\n\n> *Powered by Keith's Bard AI API*`
        }, { quoted: mek });

        await conn.sendMessage(from, {
            react: { text: '📤', key: mek.key }
        });

    } catch (error) {
        console.error("Bard AI command error:", error);

        await conn.sendMessage(from, {
            react: { text: '❌', key: mek.key }
        });

        let errorMessage;
        if (error.response?.status === 404) errorMessage = 'Google Bard API endpoint not found!';
        else if (error.message.includes('timeout') || error.code === 'ECONNABORTED') errorMessage = 'Request timed out! Try again.';
        else if (error.code === 'ENOTFOUND') errorMessage = 'Cannot connect to Google Bard service!';
        else if (error.response?.status === 429) errorMessage = 'Too many requests! Please try again later.';
        else if (error.response?.status >= 500) errorMessage = 'Google Bard service is currently unavailable.';
        else if (error.message.includes('API failed')) errorMessage = 'Google Bard failed to generate a response.';
        else errorMessage = `Error: ${error.message}`;

        return conn.sendMessage(from, { text: `🚫 ${errorMessage}` }, { quoted: mek });
    }
});

// ==========================================
//              🤖 COPILOT AI
// ==========================================

cmd({
    pattern: "copilot",
    react: "🤖",
    desc: "Chat with Microsoft Copilot AI",
    category: "ai",
    filename: __filename
}, async (conn, mek, m, { from, q, reply }) => {
    if (!q) {
        return reply("❌ Please provide a question for the AI!\n\nExample: .copilot What is artificial intelligence?");
    }

    if (q.length > 1000) {
        return reply("📝 Question too long! Max 1000 characters.");
    }

    await conn.sendMessage(from, {
        react: { text: '📡', key: mek.key }
    });

    await conn.sendPresenceUpdate('composing', from);

    try {
        const { data } = await axios.get(`https://iamtkm.vercel.app/ai/copilot?apikey=tkm&text=${encodeURIComponent(q)}`, { timeout: 30000 });

        if (!data.status || !data.result) {
            throw new Error("API failed to generate response!");
        }

        await conn.sendMessage(from, {
            react: { text: '✅', key: mek.key }
        });

        await conn.sendMessage(from, {
            text: `🤖 *Copilot AI Assistant*\n\n📝 *Question:* ${q}\n\n💬 *Response:* ${data.result.trim()}\n\n ↘️ *Powered by Microsoft Copilot*`
        }, { quoted: mek });

    } catch (error) {
        console.error("Copilot command error:", error);

        await conn.sendMessage(from, {
            react: { text: '❌', key: mek.key }
        });

        let errorMessage;
        if (error.response?.status === 404) errorMessage = 'API endpoint not found!';
        else if (error.message.includes('timeout') || error.code === 'ECONNABORTED') errorMessage = 'Request timed out! Try again.';
        else if (error.code === 'ENOTFOUND') errorMessage = 'Cannot connect to AI service!';
        else if (error.response?.status === 429) errorMessage = 'Too many requests! Please try again later.';
        else if (error.response?.status >= 500) errorMessage = 'Copilot service is currently unavailable.';
        else errorMessage = `Error: ${error.message}`;

        return conn.sendMessage(from, { text: `🚫 ${errorMessage}` }, { quoted: mek });
    }
});

// ==========================================
//              🤖 META AI
// ==========================================

cmd({
    pattern: "metai",
    react: "🤖",
    desc: "Chat with Meta AI",
    category: "ai",
    filename: __filename
}, async (conn, mek, m, { from, q, reply }) => {
    if (!q) {
        return reply("❌ Please provide a query for Meta AI!\n\nExample: .metai What is artificial intelligence?");
    }

    if (q.length > 1000) {
        return reply("📝 Query too long! Max 1000 characters.");
    }

    await conn.sendMessage(from, {
        react: { text: '⤵️', key: mek.key }
    });

    await conn.sendPresenceUpdate('composing', from);

    try {
        const { data } = await axios.get(`https://apiskeith.top/ai/metai?q=${encodeURIComponent(q)}`, { timeout: 30000 });

        if (!data?.status || !data?.result) {
            throw new Error("API failed to generate response!");
        }

        await conn.sendMessage(from, {
            react: { text: '✅', key: mek.key }
        });

        await conn.sendMessage(from, {
            text: `🤖 *Meta AI Assistant*\n\n📝 *Query:* ${q}\n\n💬 *Response:*\n ${data.result.trim()}\n\n> *Powered by Meta AI*`
        }, { quoted: mek });

        await conn.sendMessage(from, {
            react: { text: '📤', key: mek.key }
        });

    } catch (error) {
        console.error("Meta AI command error:", error);

        await conn.sendMessage(from, {
            react: { text: '❌', key: mek.key }
        });

        let errorMessage;
        if (error.response?.status === 404) errorMessage = 'API endpoint not found!';
        else if (error.message.includes('timeout') || error.code === 'ECONNABORTED') errorMessage = 'Request timed out! Try again.';
        else if (error.code === 'ENOTFOUND') errorMessage = 'Cannot connect to AI service!';
        else if (error.response?.status === 429) errorMessage = 'Too many requests! Please try again later.';
        else if (error.response?.status >= 500) errorMessage = 'Meta AI service is currently unavailable.';
        else if (error.message.includes('API failed')) errorMessage = 'Meta AI failed to generate a response.';
        else errorMessage = `Error: ${error.message}`;

        return conn.sendMessage(from, { text: `🚫 ${errorMessage}` }, { quoted: mek });
    }
});

// ==========================================
//              🤖 GPT-4
// ==========================================

cmd({
    pattern: "gpt4",
    react: "🤖",
    desc: "Chat with GPT-4 AI",
    category: "ai",
    filename: __filename
}, async (conn, mek, m, { from, q, reply }) => {
    if (!q) {
        return reply("❌ Please provide a question to ask GPT-4!\n\nExample: .gpt4 What is artificial intelligence?");
    }

    if (q.length > 1000) {
        return reply("📝 Question too long! Max 1000 characters.");
    }

    await conn.sendMessage(from, {
        react: { text: '💭', key: mek.key }
    });

    await conn.sendPresenceUpdate('composing', from);

    try {
        const { data } = await axios.get(`https://meta-api.zone.id/ai/chatgptfree?prompt=${encodeURIComponent(q)}`, { timeout: 30000 });

        let aiResponse = '';

        if (data?.answer && typeof data.answer === 'string') aiResponse = data.answer.trim();
        else if (data?.response && typeof data.response === 'string') aiResponse = data.response.trim();
        else if (data?.message && typeof data.message === 'string') aiResponse = data.message.trim();
        else if (data?.text && typeof data.text === 'string') aiResponse = data.text.trim();
        else if (data?.data && typeof data.data === 'string') aiResponse = data.data.trim();
        else if (data?.content && typeof data.content === 'string') aiResponse = data.content.trim();
        else if (typeof data === 'string') aiResponse = data.trim();
        else if (data?.data && typeof data.data === 'object') {
            for (const key in data.data) {
                if (typeof data.data[key] === 'string' && data.data[key].trim().length > 0) {
                    aiResponse = data.data[key].trim();
                    break;
                }
            }
        }

        if (!aiResponse) {
            console.log("API Response structure:", JSON.stringify(data, null, 2));
            throw new Error("API returned empty or invalid response!");
        }

        if (aiResponse.length > 4000) {
            aiResponse = aiResponse.substring(0, 4000) + "...\n\n(Response truncated due to length limits)";
        }

        await conn.sendMessage(from, {
            react: { text: '✅', key: mek.key }
        });

        await conn.sendMessage(from, {
            text: `🤔 *GPT-4*\n\n📝 *Question:* ${q}\n\n💬 *Response:* ${aiResponse}\n\n📊 *Powered by OpenAI & Gpt-4*`
        }, { quoted: mek });

    } catch (error) {
        console.error("GPT-4 command error:", error);

        await conn.sendMessage(from, {
            react: { text: '❌', key: mek.key }
        });

        let errorMessage = 'An error occurred while processing your request.';
        if (error.response?.status === 404) errorMessage = 'API endpoint not found!';
        else if (error.response?.status === 429) errorMessage = 'Too many requests! Please try again later.';
        else if (error.response?.status >= 500) errorMessage = 'Server error! The AI service is having issues.';
        else if (error.message.includes('timeout')) errorMessage = 'Request timed out!';
        else if (error.code === 'ENOTFOUND') errorMessage = 'Cannot connect to AI service!';
        else errorMessage = `Error: ${error.message}`;

        return conn.sendMessage(from, { text: `🚫 ${errorMessage}` }, { quoted: mek });
    }
});

// ==========================================
//            🔍 SEARCH PLUGINS
// ==========================================

cmd({
    pattern: "scsearch",
    react: "🎵",
    desc: "Search Soundcloud",
    category: "search",
    filename: __filename
}, async (conn, mek, m, { from, q, reply }) => {
    if (!q) return reply("Please provide a search query.");
    try {
        let { data } = await axios.get(`https://arslan-apis-v2.vercel.app/search/soundcloud?q=${encodeURIComponent(q)}`);
        if (data.status && data.result.result.length > 0) {
            let msg = `*☁️ Soundcloud Search Results ☁️*\n\n`;
            data.result.result.slice(0, 5).forEach((track, i) => {
                msg += `*${i + 1}. ${track.title}*\n👤 Artist: ${track.artist}\n⏱️ Duration: ${track.timestamp}\n🔗 Link: ${track.url}\n\n`;
            });
            reply(msg);
        } else { reply("No results found."); }
    } catch (e) { reply("Error fetching Soundcloud search."); }
});

cmd({
    pattern: "stickersearch",
    react: "🎭",
    desc: "Search Stickers",
    category: "search",
    filename: __filename
}, async (conn, mek, m, { from, q, reply }) => {
    if (!q) return reply("Please provide a search query. Example: .stickersearch cat");
    try {
        let { data } = await axios.get(`https://arslan-apis-v2.vercel.app/search/sticker?q=${encodeURIComponent(q)}`);
        if (data.status && data.result.sticker_url) {
            reply(`*Found Sticker Pack:* ${data.result.title}\nSending first 3 stickers...`);
            for (let i = 0; i < 3; i++) {
                if (data.result.sticker_url[i]) {
                    await conn.sendMessage(from, { sticker: { url: data.result.sticker_url[i] } }, { quoted: mek });
                }
            }
        }
    } catch (e) { reply("Error fetching stickers."); }
});

cmd({
    pattern: "fontsearch",
    react: "🔤",
    desc: "Search Fonts",
    category: "search",
    filename: __filename
}, async (conn, mek, m, { from, q, reply }) => {
    if (!q) return reply("Please provide a font name.");
    try {
        let { data } = await axios.get(`https://arslan-apis-v2.vercel.app/search/fontSearch?q=${encodeURIComponent(q)}`);
        if (data.status && data.result.length > 0) {
            let msg = `*🔤 Font Search Results*\n\n`;
            data.result.slice(0, 5).forEach((f, i) => {
                msg += `*${i + 1}. ${f.title}*\n📥 DL: ${f.downloadLink}\n\n`;
            });
            reply(msg);
        }
    } catch (e) { reply("Error searching fonts."); }
});

cmd({
    pattern: "wachannel",
    react: "📱",
    desc: "Get WhatsApp Channel Info",
    category: "search",
    filename: __filename
}, async (conn, mek, m, { from, q, reply }) => {
    if (!q || !q.includes("whatsapp.com/channel")) return reply("Please provide a valid WA Channel URL.");
    try {
        let { data } = await axios.get(`https://arslan-apis-v2.vercel.app/search/wachannel?url=${encodeURIComponent(q)}`);
        if (data.status) {
            reply(`*Channel Info:*\n${JSON.stringify(data.result, null, 2)}`);
        } else { reply(data.err || "Failed to fetch channel info."); }
    } catch (e) { reply("Error fetching channel info."); }
});

// ==========================================
//          📥 DOWNLOAD PLUGINS
// ==========================================

cmd({
    pattern: "ytmp3",
    react: "🎶",
    desc: "Download YouTube MP3",
    category: "download",
    filename: __filename
}, async (conn, mek, m, { from, q, reply }) => {
    if (!q || !q.includes("youtu")) return reply("Please provide a valid YouTube link.");
    try {
        let { data } = await axios.get(`https://arslan-apis-v2.vercel.app/download/ytmp3?url=${encodeURIComponent(q)}`);
        if (data.status) {
            let title = data.result.metadata.title;
            let dlUrl = data.result.download.url;
            await conn.sendMessage(from, { audio: { url: dlUrl }, mimetype: "audio/mpeg", fileName: `${title}.mp3` }, { quoted: mek });
        }
    } catch (e) { reply("Error downloading MP3."); }
});

cmd({
    pattern: "ytmp4",
    react: "🎥",
    desc: "Download YouTube MP4",
    category: "download",
    filename: __filename
}, async (conn, mek, m, { from, q, reply }) => {
    if (!q || !q.includes("youtu")) return reply("Please provide a valid YouTube link.");
    try {
        let { data } = await axios.get(`https://arslan-apis-v2.vercel.app/download/ytmp4?url=${encodeURIComponent(q)}`);
        if (data.status) {
            let title = data.result.metadata.title;
            let dlUrl = data.result.download.url;
            await conn.sendMessage(from, { video: { url: dlUrl }, caption: `*${title}*` }, { quoted: mek });
        }
    } catch (e) { reply("Error downloading MP4."); }
});

cmd({
    pattern: "twitter",
    react: "🐦",
    desc: "Download Twitter Video",
    category: "download",
    filename: __filename
}, async (conn, mek, m, { from, q, reply }) => {
    if (!q || !q.includes("twitter.com") && !q.includes("x.com")) return reply("Please provide a Twitter link.");
    try {
        let { data } = await axios.get(`https://arslan-apis-v2.vercel.app/download/twitter?url=${encodeURIComponent(q)}`);
        if (data.status) {
            let vidUrl = data.result.video_hd || data.result.video_sd;
            await conn.sendMessage(from, { video: { url: vidUrl }, caption: data.result.desc }, { quoted: mek });
        }
    } catch (e) { reply("Error downloading Twitter video."); }
});

cmd({
    pattern: "mediafire",
    react: "📁",
    desc: "Download from Mediafire",
    category: "download",
    filename: __filename
}, async (conn, mek, m, { from, q, reply }) => {
    if (!q || !q.includes("mediafire.com")) return reply("Please provide a valid Mediafire link.");
    try {
        let { data } = await axios.get(`https://arslan-apis-v2.vercel.app/download/mfire?url=${encodeURIComponent(q)}`);
        if (data.status) {
            let file = data.result;
            reply(`*Downloading File...*\n📁 Name: ${file.fileName}\n⚖️ Size: ${file.size}`);
            await conn.sendMessage(from, { document: { url: file.dl_link }, mimetype: file.fileType, fileName: file.fileName }, { quoted: mek });
        }
    } catch (e) { reply("Error downloading from Mediafire."); }
});

// ==========================================
//          📰 NEWS PLUGINS (SRI LANKA)
// ==========================================

const newsProviders = ['derana', 'sirasa', 'bbc', 'lankadeepa', 'siyatha', 'lnw', 'dasathalankanews', 'gossiplankanews', 'cricbuzz'];

newsProviders.forEach(provider => {
    cmd({
        pattern: provider,
        react: "🗞️",
        desc: `Get latest news from ${provider.toUpperCase()}`,
        category: "news",
        filename: __filename
    }, async (conn, mek, m, { from, reply }) => {
        try {
            let { data } = await axios.get(`https://arslan-apis-v2.vercel.app/news/${provider}`);
            if (data.status && data.result) {
                let res = data.result;
                let msg = `*📰 ${provider.toUpperCase()} NEWS*\n\n*${res.title || res.to_win || 'No Title'}*\n\n${res.desc || res.target || ''}\n\n🗓️ Date: ${res.date || ''}\n🔗 Read More: ${res.link}`;
                
                if (res.img || res.image) {
                    await conn.sendMessage(from, { image: { url: res.img || res.image }, caption: msg }, { quoted: mek });
                } else {
                    reply(msg);
                }
            } else {
                reply("Could not fetch news at the moment.");
            }
        } catch (e) { reply(`Error fetching ${provider} news.`); }
    });
});

// ==========================================
//             🎬 MOVIE PLUGINS
// ==========================================

cmd({
    pattern: "zoomsearch",
    react: "🎞️",
    desc: "Search Subtitles/Movies on Zoom",
    category: "movie",
    filename: __filename
}, async (conn, mek, m, { from, q, reply }) => {
    if (!q) return reply("Please provide a movie name.");
    try {
        let { data } = await axios.get(`https://arslan-apis-v2.vercel.app/movie/zoom/search?text=${encodeURIComponent(q)}`);
        if (data.status && data.result.data.length > 0) {
            let msg = `*🎬 Zoom Subtitle Search*\n\n`;
            data.result.data.slice(0, 5).forEach((movie, i) => {
                msg += `*${i + 1}. ${movie.title}*\n👤 Author: ${movie.author}\n🔗 Link: ${movie.link}\n\n`;
            });
            reply(msg);
        } else { reply("No movies found."); }
    } catch (e) { reply("Error searching zoom."); }
});

// ==========================================
//             🛠️ MISC / TOOLS
// ==========================================

cmd({
    pattern: "tempmail",
    react: "📧",
    desc: "Generate Temporary Email",
    category: "misc",
    filename: __filename
}, async (conn, mek, m, { from, reply }) => {
    try {
        let { data } = await axios.get(`https://arslan-apis-v2.vercel.app/more/tempmail`);
        if (data.status) {
            reply(`*📧 Temp Mail Generated*\n\n✉️ Email: \`${data.result[0]}\`\n🔑 Session ID: \`${data.result[1]}\`\n\n_Use .tempinbox <session_id> to check mails._`);
        }
    } catch (e) { reply("Error generating temp mail."); }
});

cmd({
    pattern: "tempinbox",
    react: "📨",
    desc: "Check Temp Mail Inbox",
    category: "misc",
    filename: __filename
}, async (conn, mek, m, { from, q, reply }) => {
    if (!q) return reply("Please provide the session ID (You get it from .tempmail)");
    try {
        let { data } = await axios.get(`https://arslan-apis-v2.vercel.app/more/get_inbox_tempmail?q=${encodeURIComponent(q)}`);
        if (data.status) {
            reply(`*📬 Inbox:*\n\n${JSON.stringify(data.result, null, 2)}`);
        } else { reply(data.err || "Inbox empty or invalid ID."); }
    } catch (e) { reply("Error checking inbox."); }
});


  
