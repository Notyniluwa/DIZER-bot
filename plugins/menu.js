const config = require('../config');
const { cmd, commands } = require('../command');

cmd({
    pattern: "menu",
    desc: "📜 Get the command list",
    category: "main",
    filename: __filename
}, async (conn, mek, m, {
    from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply
}) => {
    try {
        // Define the initial menu structure with categories
        let menu = {
            main: `*🌟 Main Commands:*\n`,
            download: `*📥 Download Commands:*\n`,
            group: `*👥 Group Commands:*\n`,
            others: `*🔧 Other Commands:*\n`
        };

        // Iterate over all commands and add them to the appropriate category
        for (let i = 0; i < commands.length; i++) {
            if (commands[i].pattern && !commands[i].dontAddCommandList) {
                if (menu[commands[i].category]) {
                    menu[commands[i].category] += `• ${commands[i].pattern}\n`;
                } else {
                    menu['others'] += `${config.PREFIX}${commands[i].pattern}\n`; // Default to 'others' category if not categorized
                }
            }
        }

        // Combine the menu sections
        let fullMenu = `
👋 *Hello, ${pushname}!*

*🤖 WhatsApp Bot Menu*

${menu.main}
${menu.download}
${menu.group}
${menu.others}

Type the relevant command to use.
        `;

        // Send the menu with an image if ALIVE_IMG is defined
        if (config.ALIVE_IMG) {
            await conn.sendMessage(from, { image: { url: config.ALIVE_IMG }, caption: fullMenu });
        } else {
            // Send the menu as a reply if no image is defined
            reply(fullMenu);
        }

    } catch (err) {
        console.error(err);
        reply('⚠️ There was an error fetching the menu.');
    }
});
```
