const fs = require('fs');
if (fs.existsSync('config.env')) require('dotenv').config({ path: './config.env' });

function convertToBool(text, fault = 'true') {
    return text === fault ? true : false;
}
module.exports = {
SESSION_ID: process.env.SESSION_ID,
ALIVE_IMG: process.env.ALIVE_IMG || "https://telegra.ph/file/600fb1c5551ef67e24d76.jpg",
ALIVE_MSG: process.env.ALIVE_MSG || "hey i am alive, i am dizer multidevice whatsapp bot",
};
