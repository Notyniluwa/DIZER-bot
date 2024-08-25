const { cmd, commands } = require('../command');
const fg = require('api-dylux');
const yts = require('yt-search');

cmd({
    pattern: "song",
    desc: "Download songs",
    category: "download",
    filename: __filename
},
async (conn, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {
        if (!q) return reply("*❌ Please provide a song name to search.*");

        const search = await yts(q);
        if (!search.videos.length) return reply("*🚫 Sorry, I couldn't find the song.*");

        const data = search.videos[0];
        const url = data.url;

        // Download the song using api-dylux or another downloader
        const song = await fg.downloader.ytmp3(url);
        const { title, dl_link } = song;

        let desc = `🎶 *Song Details:*\n\n` +
                   `*📌 Title:* ${title}\n` +
                   `*⏱ Duration:* ${data.timestamp}\n` +
                   `*👁 Views:* ${data.views.toLocaleString()}\n` +
                   `*🔗 YouTube Link:* ${url}`;

        await conn.sendMessage(from, {
            audio: { url: dl_link },
            mimetype: 'audio/mp4',
            ptt: false
        }, { quoted: mek });

        reply(`*🎵 Here is your song:*\n\n${desc}\n\n*💡 Powered by Dizer MD*`);
    } catch (e) {
        console.error(e);
        reply(`*⚠️ An error occurred:* ${e.message}`);
    }
});
