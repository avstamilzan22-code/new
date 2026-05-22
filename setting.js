const fs = require('fs');
if (fs.existsSync('config.env')) require('dotenv').config({ path: './config.env' });

function convertToBool(text, fault = 'true') {
    return text === fault ? true : false;
}
module.exports = {
// Add Your Session Id Start With SHITSU-MD Hear
SESSION_ID: process.env.SESSION_ID || "SHITSU-MD~eyJub2lzZUtleSI6eyJwcml2YXRlIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiR002L3dlSVdiWHZhWDB4aDJEWTlUODgwWVRVUEh4Y1RTdVNLcmo4MGZXQT0ifSwicHVibGljIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiYWhFakt1N09PSWlSYzJjMXk1S1RQSjZ4dXFFVDV0VFk3RkpoMzNaQzZqQT0ifX0sInBhaXJpbmdFcGhlbWVyYWxLZXlQYWlyIjp7InByaXZhdGUiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJhTWVkWlpsTmNnVC93TEpaMDFPczI1emxaZFJzVWJacHg0eU5qMGVac1hjPSJ9LCJwdWJsaWMiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJCYUtDa1FwRUczbVRKWEUrNFpac1pzOGV3SWFmWTRsWEIzd2FJdGRueWwwPSJ9fSwic2lnbmVkSWRlbnRpdHlLZXkiOnsicHJpdmF0ZSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IlNCKzR4d1F3RXl2cUFhQ1d6WHJBbCs1YndXVFNKeXk0MU1wVnI1Ym9ZMmM9In0sInB1YmxpYyI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IkR4YjcweUxFTWFGYXFFb3B3blF0L2pPbm53eTA0VXMwUHNIM250M3MwaWM9In19LCJzaWduZWRQcmVLZXkiOnsia2V5UGFpciI6eyJwcml2YXRlIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoib010eXgyZVJCZ2E5Q0UrbHZETjMyZ3d4YStpcSt5TVU4S3J0YURSTTIzaz0ifSwicHVibGljIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiYTdETlphNlErZlQzb2k1NmJobkgzTHpUc2xSREN1aExQY3dWWDNxMmszbz0ifX0sInNpZ25hdHVyZSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6InpYaUxpQkphN3c2WmNnekZKa3JUS0Vxd0I3SHU1MmxYUE9LQmtBbjdIVkgzTHgvMjBiVGNyb256TCtLQW91eWpiekJKcFlMN0EvWXRMem95b2xFN2hnPT0ifSwia2V5SWQiOjF9LCJyZWdpc3RyYXRpb25JZCI6MTQzLCJhZHZTZWNyZXRLZXkiOiIzeGN3Qmk5eWJENkxydWhMVW9qWnFuN2VTRndzbmV2bitUTGhaemt0cDMwPSIsInByb2Nlc3NlZEhpc3RvcnlNZXNzYWdlcyI6W3sia2V5Ijp7InJlbW90ZUppZCI6Ijk0NzY0NjQyNDMyQHMud2hhdHNhcHAubmV0IiwiZnJvbU1lIjp0cnVlLCJpZCI6IkE1NTdBRkVENjQ4NzYyM0IwMjA4NjI5QjEyRDZFOEUxIn0sIm1lc3NhZ2VUaW1lc3RhbXAiOjE3Nzk0MTg0ODJ9XSwibmV4dFByZUtleUlkIjo4MTMsImZpcnN0VW51cGxvYWRlZFByZUtleUlkIjo4MTMsImFjY291bnRTeW5jQ291bnRlciI6MCwiYWNjb3VudFNldHRpbmdzIjp7InVuYXJjaGl2ZUNoYXRzIjpmYWxzZX0sInJlZ2lzdGVyZWQiOnRydWUsInBhaXJpbmdDb2RlIjoiWVVQUkFERVYiLCJtZSI6eyJpZCI6Ijk0NzY0NjQyNDMyOjIxQHMud2hhdHNhcHAubmV0IiwibmFtZSI6IsqA4bSAybThtIrhtIDJtCDhtIXJqsqf6pyxypzhtIDJtCIsImxpZCI6IjUyNDUwNjk0MjkxNjQ4OjIxQGxpZCJ9LCJhY2NvdW50Ijp7ImRldGFpbHMiOiJDUGYydFBzR0VOdUt2OUFHR0FnZ0FDZ0EiLCJhY2NvdW50U2lnbmF0dXJlS2V5IjoiVHFnS0ZiOXl3QXE5NkJuS1d2R0h2dUN5SXBwUEFGTzlBYU80NEZ2eHFWND0iLCJhY2NvdW50U2lnbmF0dXJlIjoicmFqdk5DZ0pqUUdBOGkvRFZockQ4UkIwTUc2bG9LbnVZelYrM0hHUHRNeWxKdXROcC9BUlFSTFVaRDhkOEpuV01oeTVSbitoY3NkMG9uNHN4enRhREE9PSIsImRldmljZVNpZ25hdHVyZSI6IkVBai9saitPYWRuMDdPMlIvbFh6V3NtVHY0WFFlaEpaVlI3bzB4dllmd2tUdlhHMjBQazE3RFcvai9aZjVzQmhzZVRWTWN3N2phVkFkNklwOTY5NWpRPT0ifSwic2lnbmFsSWRlbnRpdGllcyI6W3siaWRlbnRpZmllciI6eyJuYW1lIjoiOTQ3NjQ2NDI0MzI6MjFAcy53aGF0c2FwcC5uZXQiLCJkZXZpY2VJZCI6MH0sImlkZW50aWZpZXJLZXkiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJCVTZvQ2hXL2NzQUt2ZWdaeWxyeGg3N2dzaUthVHdCVHZRR2p1T0JiOGFsZSJ9fV0sInBsYXRmb3JtIjoic21iYSIsInJvdXRpbmdJbmZvIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiQ0FzSUJRZ0QifSwibGFzdEFjY291bnRTeW5jVGltZXN0YW1wIjoxNzc5NDE4NDc2LCJteUFwcFN0YXRlS2V5SWQiOiJBQUFBQUNBZSJ9",
// SHITSU MD Api Site Url
API_BASE: process.env.API_BASE || "https://arslan-apis.vercel.app/",
// SHITSU MD Api Key -- Add This To Your Api Key Form Api Site
API_KEY: process.env.API_KEY || "arslanmdofficialadmin",
// Auto Status Seen
AUTO_STATUS_SEEN: process.env.AUTO_STATUS_SEEN || "true",
// make true or false status auto seen
AUTO_STATUS_REPLY: process.env.AUTO_STATUS_REPLY || "false",
// make true if you want auto reply on status 
AUTO_STATUS_REACT: process.env.AUTO_STATUS_REACT || "false",
// make true if you want auto reply on status 
AUTO_STATUS_MSG: process.env.AUTO_STATUS_MSG || "*SEEN YOUR STATUS BY SHITSU-MD 🤍*",

AUTO_BIO: process.env.AUTO_BIO || "true",
// true if want welcome msg in groups
GOODBYE: process.env.GOODBYE || "false",
// true if want goodbye msg in groups    
ADMIN_EVENTS: process.env.ADMIN_EVENTS || "false",
// make true to know who dismiss or promoted a member in group
PREFIX: process.env.PREFIX || ".",
// add your prifix for bot   
BOT_NAME: process.env.BOT_NAME || "SHITSU-MD",
// add bot namw here for menu
STICKER_NAME: process.env.STICKER_NAME || "SHITSU-MD",
// type sticker pack name 
CUSTOM_REACT: process.env.CUSTOM_REACT || "false",
// make this true for custum emoji react    
CUSTOM_REACT_EMOJIS: process.env.CUSTOM_REACT_EMOJIS || "💝,💖,💗,❤️‍🩹,❤️,🧡,💛,💚,💙,💜,🤎,🖤,🤍",
// chose custom react emojis by yourself 
DELETE_LINKS: process.env.DELETE_LINKS || "false",
// automatic delete links witho remove member 
OWNER_NUMBER: process.env.OWNER_NUMBER || "94764642432",
// add your bot owner number
OWNER_NAME: process.env.OWNER_NAME || "LovelyMD Official",

SEND_WELCOME: process.env.SEND_WELCOME || "false",
// add alive msg here 
READ_MESSAGE: process.env.READ_MESSAGE || "false",
// make true for auto read message
READ_CMD_ONLY: process.env.READ_CMD_ONLY || "true",
// Turn true or false for automatic read msgs
AUTO_REACT: process.env.AUTO_REACT || "false",
// make this true or false for auto react on all msgs
ANTI_BAD: process.env.ANTI_BAD || "true",
// false or true for anti Calls
ANTI_CALL: process.env.ANTI_CALL || "true",
// false or true for anti bad words  
MODE: process.env.MODE || "public",
// make bot public-private-inbox-group 
ANTI_LINK: process.env.ANTI_LINK || "true",
// make anti link true,false for groups 
AUTO_VOICE: process.env.AUTO_VOICE || "false",
// make true for send automatic voices
AUTO_STICKER: process.env.AUTO_STICKER || "false",
// make true for automatic stickers 
AUTO_REPLY: process.env.AUTO_REPLY || "false",
// make true or false automatic text reply 
ALWAYS_ONLINE: process.env.ALWAYS_ONLINE || "true",
// maks true for always online 
 //Bot olways offline
PUBLIC_MODE: process.env.PUBLIC_MODE || "true",
// make false if want private mod
AUTO_TYPING: process.env.AUTO_TYPING || "true",
// true for automatic show typing   
READ_CMD: process.env.READ_CMD || "false",
// true if want mark commands as read 
DEV: process.env.DEV || "94764642432",
//replace with your whatsapp number        
ANTI_VV: process.env.ANTI_VV || "true",

ANTI_BOT: process.env.ANTI_BOT || "true",
// true for anti once view 

ANTI_DELETE: process.env.ANTI_DELETE || "true",
// true for anti delete 
ANTI_DELETE_TYPE: process.env.ANTI_DELETE_TYPE || "same", 
// change it to 'same' if you want to resend deleted message in same chat 
AUTO_RECORDING: process.env.AUTO_RECORDING || "true",
// make it true for auto recoding 
AUTO_BLOCK: process.env.AUTO_BLOCK || "false"
// make it true for auto block
};







