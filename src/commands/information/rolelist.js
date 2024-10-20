const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    name: 'rolelist',
    description: 'Affiche la liste des rôles du serveur',
    usage: 'rolelist',
    aliases: ['listroles', 'roles'],
    cooldown: 5,
    perm: ['public'],
    async execute(client, message, args) {
        const roles = message.guild.roles.cache
            .sort((a, b) => b.position - a.position)
            .filter(role => role.id !== message.guild.id)
            .map(role => `<@&${role.id}> \`${role.id}\` \`(${role.members.size} Membres)\``);

        const pageSize = 10;
        const pages = [];

        for (let i = 0; i < roles.length; i += pageSize) {
            pages.push(roles.slice(i, i + pageSize));
        }

        let currentPage = 0;

        const embed = new EmbedBuilder()
            .setColor(client.colors.blue)
            .setTitle(`Liste des rôles (${roles.length})`)
            .setDescription(pages[currentPage].join('\n'))
            .setFooter(client.footer)
            .setTimestamp();

        const reply = await message.reply({ embeds: [embed] });

        if (pages.length > 1) {
            const row = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('previous_role')
                        .setLabel('Précédent')
                        .setStyle(ButtonStyle.Success),
                    new ButtonBuilder()
                        .setCustomId('next_role')
                        .setLabel('Suivant')
                        .setStyle(ButtonStyle.Success)
                );

            await reply.edit({ embeds: [embed], components: [row] });

            const filter = i => ['previous_role', 'next_role'].includes(i.customId) && i.user.id === message.author.id;
            const collector = reply.createMessageComponentCollector({ filter, time: 60000 });

            collector.on('collect', async i => {
                if (i.customId === 'previous_role') {
                    currentPage = currentPage > 0 ? --currentPage : pages.length - 1;
                } else if (i.customId === 'next_role') {
                    currentPage = currentPage + 1 < pages.length ? ++currentPage : 0;
                }

                embed.setDescription(pages[currentPage].join('\n'));
                await i.update({ embeds: [embed], components: [row] });
            });

            collector.on('end', () => {
                reply.edit({ components: [] });
            });
        }
    },
};
