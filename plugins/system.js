const os = require('os');
const { cmd } = require('../command'); // Adjust the import path if needed
const { formatDuration } = require('humanize-duration'); // For better uptime formatting

cmd({
    pattern: 'status',
    desc: 'Get the bot system status',
    category: 'info',
    filename: __filename
}, async (conn, mek, m, { from, reply }) => {
    try {
        // Function to format uptime
        const formatUptime = (seconds) => {
            return formatDuration(seconds * 1000, { round: true });
        };

        // Gather system information
        let status = `*System Status:*\n\n` +
                     `*📅 Uptime:* ${formatUptime(process.uptime())}\n` +
                     `*💾 RAM Usage:* ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)}MB / ${Math.round(os.totalmem() / 1024 / 1024)}MB\n` +
                     `*💻 Hostname:* ${os.hostname()}\n` +
                     `*👤 Owner:* Dizer & jester\n`;

        // Send the system status to the user
        reply(status);
    } catch (error) {
        console.error(error);
        reply(`*⚠️ An error occurred:* ${error.message}`);
    }
});
