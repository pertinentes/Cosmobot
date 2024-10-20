const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    name: 'botlist',
    description: 'Affiche la liste des bots du serveur',
    usage: 'botlist',
    aliases: ['listbots', 'bots'],
    perm: ['public'],
    cooldown: 5,
    async execute(client, message, args) {
        const bots = message.guild.members.cache
            .filter(member => member.user.bot)
            .map(bot => `**${bot.user.username}**:\`${bot.id}\``);

        const pageSize = 10;
        const pages = [];

        for (let i = 0; i < bots.length; i += pageSize) {
            pages.push(bots.slice(i, i + pageSize));
        }

        let currentPage = 0;

        const embed = new EmbedBuilder()
            .setColor(client.colors.blue)
            .setTitle(`Liste des bots (${bots.length} bots)`)
            .setDescription(pages[currentPage].join('\n'))
            .setFooter(client.footer)
            .setTimestamp();

        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('previous')
                    .setLabel('Précédent')
                    .setStyle(ButtonStyle.Primary)
                    .setDisabled(true),
                new ButtonBuilder()
                    .setCustomId('next')
                    .setLabel('Suivant')
                    .setStyle(ButtonStyle.Primary)
                    .setDisabled(pages.length <= 1)
            );

        const reply = await message.reply({ embeds: [embed], components: [row] });

        if (pages.length > 1) {
            const filter = i => ['previous', 'next'].includes(i.customId) && i.user.id === message.author.id;
            const collector = reply.createMessageComponentCollector({ filter, time: 60000 });

            collector.on('collect', async i => {
                if (i.customId === 'previous') {
                    currentPage = currentPage > 0 ? --currentPage : pages.length - 1;
                } else if (i.customId === 'next') {
                    currentPage = currentPage + 1 < pages.length ? ++currentPage : 0;
                }

                row.components[0].setDisabled(currentPage === 0);
                row.components[1].setDisabled(currentPage === pages.length - 1);

                embed.setDescription(pages[currentPage].join('\n'));
                await i.update({ embeds: [embed], components: [row] });
            });

            collector.on('end', () => {
                row.components.forEach(button => button.setDisabled(true));
                reply.edit({ components: [row] });
            });
        }
    },
};
