const axios = require('axios');
const { cmd } = require('../command'); // Adjust the import path if needed

cmd({
    pattern: 'ai',
    desc: 'Get a response from the AI service',
    category: 'main',
    filename: __filename
}, async (conn, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, sender, reply }) => {
    try {
        if (!q) return reply('*❌ Please provide a query for the AI.*');

        // Construct the API URL
        const apiUrl = `https://chatgptforprabath-md.vercel.app/api/gptv1?q=${encodeURIComponent(q)}`;

        // Make a request to the AI API
        const response = await axios.get(apiUrl);

        // Extract the result from the response
        const aiResponse = response.data || 'No response from AI.';

        // Send the response back to the user
        reply(`*🤖 AI Response:*\n\n${aiResponse}`);
    } catch (error) {
        console.error(error);
        reply(`*⚠️ An error occurred:* ${error.message}`);
    }
});
