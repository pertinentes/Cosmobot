const { EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");

module.exports = {
    name: "change",
    description: "Permet de changer les permissions d'une commande",
    usage: "change <commande>",
    perm: ["owner"],
    async execute(client, message, args) {

        if (args.length < 1) {
            return message.reply("Usage : `change <commande>`");
        }

        const [commandName] = args;
        const command = client.commands.get(commandName.toLowerCase());

        if (!command) {
            return message.reply("La commande spécifiée n'existe pas.");
        }

        const guildId = message.guildId;
        const currentPerms = await client.db.get(`permissions_${guildId}_${commandName.toLowerCase()}`) || '';

        const createEmbed = (perms) => new EmbedBuilder()
            .setColor(client.colors.green)
            .setTitle('Configuration des permissions')
            .setDescription(`Configurez les permissions pour la commande \`${commandName}\`.`)
            .addFields(
                { name: 'Permissions actuelles', value: perms || 'Aucune' }
            )
            .setFooter(client.footer)
            .setTimestamp();

        const embed = createEmbed(currentPerms);

        const row = new ActionRowBuilder()
            .addComponents(
                new StringSelectMenuBuilder()
                    .setCustomId('perm-menu')
                    .setPlaceholder('Choisissez une ou plusieurs permissions')
                    .setMinValues(0)
                    .setMaxValues(12)
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

        const clearButton = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('clear-perms')
                    .setLabel('Effacer les permissions')
                    .setStyle(ButtonStyle.Danger)
            );

        const msg = await message.reply({ embeds: [embed], components: [row, clearButton] });

        const filter = i => i.user.id === message.author.id;
        const collector = msg.createMessageComponentCollector({ filter, time: 60000 });

        collector.on('collect', async interaction => {
            if (interaction.isStringSelectMenu()) {
                const selectedValues = interaction.values;
                let currentPerms = await client.db.get(`permissions_${guildId}_${commandName.toLowerCase()}`) || '';
                currentPerms = currentPerms.split(',').filter(Boolean);

                if (selectedValues.includes('public') || selectedValues.includes('owner')) {
                    currentPerms = selectedValues.filter(value => value === 'public' || value === 'owner');
                } else {
                    selectedValues.forEach(value => {
                        if (currentPerms.includes(value)) {
                            currentPerms = currentPerms.filter(perm => perm !== value);
                        } else {
                            currentPerms.push(value);
                        }
                    });
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

                await interaction.update({ embeds: [updatedEmbed], components: [row, clearButton] });
            } else if (interaction.isButton() && interaction.customId === 'clear-perms') {
                await client.db.delete(`permissions_${guildId}_${commandName.toLowerCase()}`);

                await interaction.reply({
                    content: 'Les permissions ont été effacées avec succès.',
                    ephemeral: true
                });

                const updatedPerms = await client.db.get(`permissions_${guildId}_${commandName.toLowerCase()}`) || '';
                const updatedEmbed = createEmbed(updatedPerms);

                await msg.edit({ embeds: [updatedEmbed], components: [row, clearButton] });
            }
        });

        collector.on('end', () => {
            msg.edit({ components: [] });
        });
    },
}