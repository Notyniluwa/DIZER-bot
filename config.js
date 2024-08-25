const fs = require('fs');
if (fs.existsSync('config.env')) require('dotenv').config({ path: './config.env' });

function convertToBool(text, fault = 'true') {
    return text === fault ? true : false;
}
module.exports = {
SESSION_ID: process.env.SESSION_ID || "12sk1ZwC#ue6Ni-jfVvK8CjoW6v7Xx4W4zAE4kgPYqJeF5O5_EYo",
ALIVE_IMG: process.env.ALIVE_IMG || "https://telegra.ph/file/600fb1c5551ef67e24d76.jpg",
ALIVE_MSG: process.env.ALIVE_MSG || "hey i am alive, i am dizer multidevice whatsapp bot",
AUTO_READ_STATUS: process.env.AUTO_READ_STATUS || 'true',    
};
