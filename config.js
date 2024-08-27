const fs = require('fs');
if (fs.existsSync('config.env')) require('dotenv').config({ path: './config.env' });

function convertToBool(text, fault = 'true') {
    return text === fault ? true : false;
}

module.exports = {
    SESSION_ID: process.env.SESSION_ID || "o6thzIyK#mk6bQFGC9-w_rYAPgFlLjeXlWTwdEXBG9YtHaQjKglA",
    MONGODB: process.env.MONGODB || "mongodb+srv://SithumKalhara:97531@cluster0.iva7dbo.mongodb.net/?retryWrites=true&w=majority"
};
