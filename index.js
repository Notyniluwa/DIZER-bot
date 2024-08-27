const {
    default: makeWASocket,
    useMultiFileAuthState,
    DisconnectReason,
    jidNormalizedUser,
    getContentType,
    fetchLatestBaileysVersion,
    Browsers
} = require('@whiskeysockets/baileys');
const { getBuffer, getGroupAdmins, fetchJson } = require('./lib/functions');
const fs = require('fs');
const P = require('pino');
const config = require('./config');
const qrcode = require('qrcode-terminal');
const axios = require('axios');
const { File } = require('megajs');
const express = require('express');
const { sms } = require('./lib/msg');

//===================SESSION-AUTH============================
if (!fs.existsSync(__dirname + '/auth_info_baileys/creds.json')) {
    if (!config.SESSION_ID) return console.log('Please add your session to SESSION_ID env !!');
    const sessdata = config.SESSION_ID;
    const filer = File.fromURL(`https://mega.nz/file/${sessdata}`);
    filer.download((err, data) => {
        if (err) throw err;
        fs.writeFile(__dirname + '/auth_info_baileys/creds.json', data, () => {
            console.log("Session downloaded ✅");
        });
    });
}

// Express app setup
const app = express();
const port = process.env.PORT || 8000;

async function connectToWA() {
    const connectDB = require('./lib/mongodb');
    connectDB();

    const { readEnv } = require('./lib/database');
    const config = await readEnv();
    const prefix = config.PREFIX;

    console.log("Connecting dizermdwa bot 🧬...");
    const { state, saveCreds } = await useMultiFileAuthState(__dirname + '/auth_info_baileys/');
    const { version } = await fetchLatestBaileysVersion();

    const conn = makeWASocket({
        logger: P({ level: 'silent' }),
        printQRInTerminal: false,
        browser: Browsers.macOS("Firefox"),
        syncFullHistory: true,
        auth: state,
        version
    });

    conn.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect } = update;
        if (connection === 'close') {
            if (lastDisconnect.error.output.statusCode !== DisconnectReason.loggedOut) {
                connectToWA();
            }
        } else if (connection === 'open') {
            console.log('😼 Installing... ');
            fs.readdirSync("./plugins/").forEach((plugin) => {
                if (plugin.endsWith('.js')) {
                    require("./plugins/" + plugin);
                }
            });
            console.log('Plugins installed successfully ✅');
            console.log('Bot connected to WhatsApp ✅');

            let up = `Dizer-md connected successfully ✅\n\nPREFIX: ${prefix}`;
            conn.sendMessage(config.ownerNumber + "@s.whatsapp.net", { image: { url: `https://telegra.ph/file/600fb1c5551ef67e24d76.jpg` }, caption: up });
        }
    });

    conn.ev.on('creds.update', saveCreds);

    conn.ev.on('messages.upsert', async (mek) => {
        mek = mek.messages[0];
        if (!mek.message) return;

        mek.message = (getContentType(mek.message) === 'ephemeralMessage') ? mek.message.ephemeralMessage.message : mek.message;
        const m = sms(conn, mek);
        const from = mek.key.remoteJid;
        const isCmd = m.body.startsWith(prefix);
        const command = isCmd ? m.body.slice(prefix.length).trim().split(' ').shift().toLowerCase() : '';
        const args = m.body.trim().split(/ +/).slice(1);
        const q = args.join(' ');
        const isGroup = from.endsWith('@g.us');
        const sender = mek.key.fromMe ? conn.user.id.split(':')[0] + '@s.whatsapp.net' : mek.key.participant || mek.key.remoteJid;
        const senderNumber = sender.split('@')[0];
        const botNumber = conn.user.id.split(':')[0];
        const isOwner = config.ownerNumber.includes(senderNumber) || botNumber.includes(senderNumber);
        const isBotAdmins = isGroup ? (await getGroupAdmins(await conn.groupMetadata(from).participants)).includes(botNumber) : false;
        const isAdmins = isGroup ? (await getGroupAdmins(await conn.groupMetadata(from).participants)).includes(sender) : false;

        const reply = (teks) => conn.sendMessage(from, { text: teks }, { quoted: mek });

        conn.sendFileUrl = async (jid, url, caption, quoted, options = {}) => {
            let mime = (await axios.head(url)).headers['content-type'];
            let type = mime.split("/")[0] + "Message";

            if (mime === "application/pdf") {
                return conn.sendMessage(jid, { document: await getBuffer(url), mimetype: 'application/pdf', caption, ...options }, { quoted, ...options });
            }

            if (mime.split("/")[0] === "image") {
                return conn.sendMessage(jid, { image: await getBuffer(url), caption, ...options }, { quoted, ...options });
            }

            if (mime.split("/")[0] === "video") {
                return conn.sendMessage(jid, { video: await getBuffer(url), caption, mimetype: 'video/mp4', ...options }, { quoted, ...options });
            }

            if (mime.split("/")[0] === "audio") {
                return conn.sendMessage(jid, { audio: await getBuffer(url), caption, mimetype: 'audio/mpeg', ...options }, { quoted, ...options });
            }

            if (mime.split("/")[1] === "gif") {
                return conn.sendMessage(jid, { video: await getBuffer(url), caption, gifPlayback: true, ...options }, { quoted, ...options });
            }
        };

        const events = require('./command');
        const cmd = events.commands.find((cmd) => cmd.pattern === command) || events.commands.find((cmd) => cmd.alias && cmd.alias.includes(command));
        if (cmd) {
            if (cmd.react) conn.sendMessage(from, { react: { text: cmd.react, key: mek.key } });

            try {
                cmd.function(conn, mek, m, { from, quoted: mek, body: m.body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber, isOwner, isBotAdmins, isAdmins, reply });
            } catch (e) {
                console.error("[PLUGIN ERROR] " + e);
            }
        }
    });
}

// Start Express server and connect to WhatsApp
app.get("/", (req, res) => res.send("Hey, bot started ✅"));
app.listen(port, () => console.log(`Server listening on http://localhost:${port}`));

setTimeout(() => connectToWA(), 4000);
