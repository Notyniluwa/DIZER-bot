const config = require('../config')
const {cmd, commands} = require('../command')

cmd({
    pattern: "menu",
    desc: "📜 Get the command list",
    category: "main",
    filename: __filename
},
async(conn, mek, m, {
    from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply
}) => {
    try {
        // Define the menu structure with emojis
        let menu = {
            main: `
*🌟 Main Commands:*
1. 🌟 *!start* - Start the bot
2. ℹ️ *!help* - Get help with commands
3. 📝 *!info* - Get bot information
            `,
            download: `
*📥 Download Commands:*
1. 🎥 *!yt [link]* - Download YouTube video
2. 📺 *!fb [link]* - Download Facebook video
            `,
            group: `
*👥 Group Commands:*
1. ➕ *!add [number]* - Add member to group
2. ➖ *!kick [number]* - Remove member from group
3. 🆙 *!promote [number]* - Promote member to admin
4. ⬇️ *!demote [number]* - Demote admin to member
            `
        }

        // Combine the menu sections
        let fullMenu = `
👋 *Hello, ${pushname}!*

*🤖 WhatsApp Bot Menu*

${menu.main}
${menu.download}
${menu.group}

Type the relevant command to use.
        `;

        // Send the menu as a reply
        reply(fullMenu);

    } catch (err) {
        console.error(err);
        reply('⚠️ There was an error fetching the menu.');
    }
});
