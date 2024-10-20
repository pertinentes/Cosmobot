const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    name: 'botinvite',
    description: 'Affiche le lien d\'invitation du bot',
    usage: `botinvite`,
    aliases: ['invite'],
    cooldown: 5,
    perm: ['public'],
    async execute(client, message, args) {
        const embed = new EmbedBuilder()
            .setTitle('INVITATIONS DU ROBOT')
            .setAuthor({ name: message.guild.name })
            .setFooter(client.footer)
            .setColor('#7289DA');

        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setStyle(ButtonStyle.Link)
                    .setLabel('Invitations')
                    .setURL(`https://discordapp.com/oauth2/authorize?client_id=${client.user.id}&scope=bot&permissions=8`)
            );

        await message.reply({ embeds: [embed], components: [row] });
    },
};
