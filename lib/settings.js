const fs = require('fs');
const path = require('path');
const config = require('../setting');

const SETTINGS_FILE = path.join(__dirname, '..', 'database', 'bot_settings.json');

function loadOverrides() {
  try {
    if (fs.existsSync(SETTINGS_FILE)) {
      return JSON.parse(fs.readFileSync(SETTINGS_FILE, 'utf8'));
    }
  } catch (e) {
    console.error("Settings load error:", e);
  }
  return {};
}

function saveOverrides(overrides) {
  try {
    const dir = path.dirname(SETTINGS_FILE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(SETTINGS_FILE, JSON.stringify(overrides, null, 2), 'utf8');
  } catch (e) {
    console.error("Settings save error:", e);
  }
}

const DEFAULTS = {
  MODE: "public",
  ANTI_DELETE: "true",
  ANTI_DELETE_TYPE: "same",
  ANTI_LINK: "true",
  ANTI_BAD: "true",
  ANTI_CALL: "true",
  ANTI_VV: "true",
  ANTI_BOT: "true",
  AUTO_REACT: "false",
  AUTO_TYPING: "true",
  AUTO_RECORDING: "true",
  ALWAYS_ONLINE: "true",
  AUTO_BIO: "true",
  READ_MESSAGE: "false",
  READ_CMD: "false",
  AUTO_STATUS_SEEN: "true",
  AUTO_STATUS_REPLY: "false",
  AUTO_STATUS_MSG: "*SEEN YOUR STATUS BY SHITSU-MD 🤍*",
  AUTO_VOICE: "false",
  AUTO_STICKER: "false",
  AUTO_REPLY: "false",
  CUSTOM_REACT: "false",
  CUSTOM_REACT_EMOJIS: "💝,💖,💗,❤️‍🩹,❤️,🧡,💛,💚,💙,💜,🤎,🖤,🤍",
  DELETE_LINKS: "false",
  ADMIN_EVENTS: "false",
  GOODBYE: "false",
  SEND_WELCOME: "false",
  PUBLIC_MODE: "true",
  READ_CMD_ONLY: "true",
  AUTO_BLOCK: "false",
  AUTO_READ_STATUS: "false",
  ANTI_EDIT: "true",
  AUTO_ADD_Country_Code: "94"
};

function get(key) {
  const overrides = loadOverrides();
  if (overrides[key] !== undefined) return overrides[key];
  if (config[key] !== undefined) return config[key];
  return DEFAULTS[key] !== undefined ? DEFAULTS[key] : '';
}

function set(key, value) {
  const overrides = loadOverrides();
  overrides[key] = value;
  saveOverrides(overrides);
}

function getAll() {
  const overrides = loadOverrides();
  return { ...DEFAULTS, ...config, ...overrides };
}

module.exports = { get, set, getAll };
