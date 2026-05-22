const fs = require('fs');
if (fs.existsSync('bot.env')) require('dotenv').config({ path: './bot.env' });

function convertToBool(text, fault = 'true') {
    return text === fault ? true : false;
}
module.exports = {
BOT_URL: process.env.BOT_URL || "https://raw.githubusercontent.com/ArslanMDofficial/ARSLAN-MD-DATA/refs/heads/main/datafile.json",
AUTO_SITE: process.env.AUTO_SITE || "https://arslan-apis.vercel.app",
BAND_URL: process.env.BAND_URL || "https://raw.githubusercontent.com/ArslanMDofficial/ARSLAN-MD-DATA/refs/heads/main/bandusers.json",
REPO_LINK: process.env.REPO_LINK || "https://github.com/Arslan-MD/KIRA-MD",
REPO_NAME: process.env.REPO_NAME || "SHITSU-MD",
BOT_NAME: process.env.BOT_NAME || "SHITSU-MD",
DESCRIPTION: process.env.DESCRIPTION || "SHITSU MD POWERFULL WHATSAPP BOT",
OWNER_NUMBER: process.env.OWNER_NUMBER || "923392616263",
OWNER_NAME: process.env.OWNER_NAME || "SHITSU-MD Official",
ST_SAVE: process.env.ST_SAVE || "SHITSU-MD-STATUS-SERVER",
BIO_TEXT: process.env.BIO_TEXT || "SHITSU-MD-OFFICIAL",
AUTO_STATUS_MSG: process.env.AUTO_STATUS_MSG || "*`STATUS SEEN BY SHITSU-MD`* _*POWERD BY*_ *SHITSU-MD Official Whtsapp Bot*",
FOOTER: process.env.FOOTER || "SHITSU-MD",
COPYRIGHT: process.env.COPYRIGHT || "*㋛ SHITSU-MD OFFICIAL*",
VERSION: process.env.VERSION || "9.0.0",
NEWSLETTER: process.env.NEWSLETTER || "120363348739987203@newsletter",
WA_CHANNEL: process.env.WA_CHANNEL || "https://whatsapp.com/channel/0029VarfjW04tRrmwfb8x306",
INSTA: process.env.INSTA || "https://Instagram.com/arslanmdofficial",
ALIVE_IMG: process.env.ALIVE_IMG || "https://files.catbox.moe/n2c0lu.png",
OWNER_IMG: process.env.OWNER_IMG || "https://files.catbox.moe/n2c0lu.png",
CONVERT_IMG: process.env.CONVERT_IMG || "https://files.catbox.moe/n2c0lu.png",
AI_IMG: process.env.AI_IMG || "https://files.catbox.moe/n2c0lu.png",
SEARCH_IMG: process.env.SEARCH_IMG || "https://files.catbox.moe/n2c0lu.png",
DOWNLOAD_IMG: process.env.DOWNLOAD_IMG || "https://files.catbox.moe/n2c0lu.png",
MAIN_IMG: process.env.MAIN_IMG || "https://files.catbox.moe/n2c0lu.png",
GROUP_IMG: process.env.GROUP_IMG || "https://files.catbox.moe/n2c0lu.png",
FUN_IMG: process.env.FUN_IMG || "https://files.catbox.moe/n2c0lu.png",
TOOLS_IMG: process.env.TOOLS_IMG || "https://files.catbox.moe/n2c0lu.png",
OTHER_IMG: process.env.OTHER_IMG || "https://files.catbox.moe/n2c0lu.png",
MOVIE_IMG: process.env.MOVIE_IMG || "https://files.catbox.moe/n2c0lu.png",
NEWS_IMG: process.env.NEWS_IMG || "https://files.catbox.moe/n2c0lu.png",
PP_IMG: process.env.PP_IMG || "https://files.catbox.moe/n2c0lu.png"
};
