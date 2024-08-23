const {cmd , commands} = require('../command')
const fg = require('api-dylux')
const yts = require('yt-search')

cmd({
    pattern: "song",
    desc: "download songs",
    category: "download",
    filename: __filename
},
async (conn, mek, m, {from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply}) => {
    try {
        if (!q) return reply("Please provide a song name.");

        const search = await yts(q);
        if (!search.videos.length) return reply("Sorry, I couldn't find the song.");

        const data = search.videos[0];
        const url = data.url;

        // Use api-dylux or another downloader here to get the download link
        const song = await fg.downloader.ytmp3(url);
        const { title, dl_link } = song;

        let desc = `*Title:* ${title}\n*Duration:* ${data.timestamp}\n*Views:* ${data.views}\n*Link:* ${url}`;

        await conn.sendMessage(from, {
            audio: { url: dl_link },
            mimetype: 'audio/mp4',
            ptt: false
        }, { quoted: mek });

        reply(`Here is your song:\n\n${desc}`);
    } catch (e) {
        console.log(e);
        reply(`An error occurred: ${e}`);
    }
});
