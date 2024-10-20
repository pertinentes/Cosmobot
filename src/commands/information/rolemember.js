const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    name: 'rolemember',
    description: 'Affiche les membres ayant un rôle spécifique',
    usage: 'rolemember [role]',
    aliases: ['rolemembers', 'memberrole'],
    cooldown: 5,
    perm: ['public'],
    async execute(client, message, args) {
        if (!args[0]) {
            return message.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(client.colors.red)
                        .setTitle('⛔・Erreur')
                        .setDescription(`${message.author}, merci d'utiliser correctement la commande !\n **Utilisation:** \`${this.usage}\``)
                        .setFooter(client.footer)
                        .setTimestamp()
                ]
            });
        }

        const role = message.mentions.roles.first() || message.guild.roles.cache.get(args[0]) || message.guild.roles.cache.find(r => r.name.toLowerCase() === args.join(' ').toLowerCase());

        if (!role) {
            return message.reply("Je n'ai pas trouvé ce rôle.");
        }

        const members = role.members.map(m => `**<@${m.user.id}>**: \`${m.user.id}\``);
        const pageSize = 10;
        const pages = [];

        for (let i = 0; i < members.length; i += pageSize) {
            pages.push(members.slice(i, i + pageSize));
        }

        let currentPage = 0;

        const embed = new EmbedBuilder()
            .setColor(client.colors.blue)
            .setTitle(`Membres avec le rôle ${role.name}`)
            .setDescription(pages[currentPage].join('\n'))
            .setFooter(client.footer)
            .setTimestamp();

        const reply = await message.reply({ embeds: [embed] });

        if (pages.length > 1) {
            const row = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('previous_page')
                        .setLabel('Précédent')
                        .setStyle(ButtonStyle.Primary),
                    new ButtonBuilder()
                        .setCustomId('next_page')
                        .setLabel('Suivant')
                        .setStyle(ButtonStyle.Primary)
                );

            await reply.edit({ embeds: [embed], components: [row] });

            const filter = i => ['previous_page', 'next_page'].includes(i.customId) && i.user.id === message.author.id;
            const collector = reply.createMessageComponentCollector({ filter, time: 60000 });

            collector.on('collect', async i => {
                if (i.customId === 'previous_page') {
                    currentPage = currentPage > 0 ? --currentPage : pages.length - 1;
                } else if (i.customId === 'next_page') {
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
