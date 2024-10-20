const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const config = require('../../../config');

module.exports = {
    name: 'support',
    description: 'Affiche les informations de support',
    usage: `support`,
    aliases: ['assistance'],
    cooldown: 5,
    perm: ['public'],
    async execute(client, message, args) {
        const embed = new EmbedBuilder()
            .setTitle('SERVEUR SUPPORT DE COSMO')
            .setAuthor({ name: message.guild.name })
            .setFooter(client.footer)
            .setColor('#7289DA');

        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setStyle(ButtonStyle.Link)
                    .setLabel('Serveur de support')
                    .setURL(client.config.support)
            );

        await message.reply({ embeds: [embed], components: [row] });
    },
};
