const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'ping',
    description: 'Affiche la latence du bot',
    usage: 'ping',
    aliases: ['speed'],
    cooldown: 5,
    perm: ['public'],
    async execute(client, message, args) {
        const initialMessage = await message.reply('Calcul du ping...');

        await new Promise(resolve => setTimeout(resolve, 3000));

        const apiLatency = Math.round(client.ws.ping);

        const embed = new EmbedBuilder()
            .setTitle('**Latence**')
            .setDescription(`Latence de l'API : ${apiLatency}ms`)
            .setColor(client.colors.blue)
            .setFooter(client.footer)
            .setTimestamp();

        await initialMessage.edit({ content: null, embeds: [embed] });
    },
};
