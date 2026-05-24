const fs = require('fs');
const dotenvPath = fs.existsSync('bot.env')
  ? './bot.env'
  : fs.existsSync('config.env')
  ? './config.env'
  : null;
if (dotenvPath) require('dotenv').config({ path: dotenvPath });

module.exports = {
  SESSION_ID: process.env.SESSION_ID || ""
};
