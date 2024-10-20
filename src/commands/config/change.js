const { EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder } = require("discord.js");

module.exports = {
    name: "change",
    description: "Permet de changer les permissions d'une commande",
    usage: "change <commande> <perms>",
    perm: ["owner"],
    async execute(client, message, args) {

        if (args.length < 2) {
            return message.reply("Usage : `change <commande> <perms>`");
        }

        const [commandName, ...permissions] = args;
        const command = client.commands.get(commandName.toLowerCase());

        if (!command) {
            return message.reply("La commande spécifiée n'existe pas.");
        }

        const guildId = message.guildId;
        await client.db.set(`permissions_${guildId}_${commandName.toLowerCase()}`, permissions.join(','));

        const embed = new EmbedBuilder()
            .setColor(client.colors.green)
            .setTitle('Permissions mises à jour')
            .setDescription(`Les permissions pour la commande \`${commandName}\` ont été mises à jour.`)
            .addFields(
                { name: 'Nouvelles permissions', value: permissions.join(', ') || 'Aucune' }
            )
            .setFooter(client.footer)
            .setTimestamp();

        const row = new ActionRowBuilder()
            .addComponents(
                new StringSelectMenuBuilder()
                    .setCustomId('perm-menu')
                    .setPlaceholder('Choisissez une option')
                    .addOptions([
                        { label: 'Permissions 1', value: 'perm1' },
                        { label: 'Permissions 2', value: 'perm2' },
                        { label: 'Permissions 3', value: 'perm3' },
                        { label: 'Permissions 4', value: 'perm4' },
                        { label: 'Permissions 5', value: 'perm5' },
                        { label: 'Permissions 6', value: 'perm6' },
                        { label: 'Permissions 7', value: 'perm7' },
                        { label: 'Permissions 8', value: 'perm8' },
                        { label: 'Permissions giveaways', value: 'permgiveaway' },
                        { label: 'Permissions ticket', value: 'permticket' },
                        { label: 'Public', value: 'public' },
                        { label: 'Owner', value: 'owner' },
                    ])
            );

        const msg = await message.reply({ embeds: [embed], components: [row] });

        const filter = i => i.user.id === message.author.id;
        const collector = msg.createMessageComponentCollector({ filter, time: 60000 });

        collector.on('collect', async interaction => {
            if (interaction.isStringSelectMenu()) {
                const selectedValue = interaction.values[0];
                let currentPerms = await client.db.get(`permissions_${guildId}_${commandName.toLowerCase()}`) || '';
                currentPerms = currentPerms.split(',');

                if (selectedValue === 'public' || selectedValue === 'owner') {
                    currentPerms = [selectedValue];
                } else if (!currentPerms.includes(selectedValue)) {
                    currentPerms.push(selectedValue);
                } else {
                    currentPerms = currentPerms.filter(perm => perm !== selectedValue);
                }

                await client.db.set(`permissions_${guildId}_${commandName.toLowerCase()}`, currentPerms.join(','));

                const updatedEmbed = new EmbedBuilder()
                    .setColor(client.colors.green)
                    .setTitle('Permissions mises à jour')
                    .setDescription(`Les permissions pour la commande \`${commandName}\` ont été mises à jour.`)
                    .addFields(
                        { name: 'Nouvelles permissions', value: currentPerms.join(', ') || 'Aucune' }
                    )
                    .setFooter(client.footer)
                    .setTimestamp();

                await interaction.update({ embeds: [updatedEmbed], components: [row] });
            }
        });

        collector.on('end', () => {
            msg.edit({ components: [] });
        });
    },
};
