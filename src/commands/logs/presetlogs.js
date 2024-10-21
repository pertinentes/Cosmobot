const { ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionsBitField } = require('discord.js');
const fs = require('fs');
const path = require('path');

module.exports = {
    name: 'presetlogs',
    description: 'Crée une catégorie de logs prédéfinie avec les salons et permissions appropriés',
    usage: 'presetlogs',
    cooldown: 10,
    perm: ['owner', '8'],
    async execute(client, message, args) {
        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('confirm')
                    .setLabel('Valider')
                    .setStyle(ButtonStyle.Secondary)
                    .setEmoji('✅'),
                new ButtonBuilder()
                    .setCustomId('cancel')
                    .setLabel('Annuler')
                    .setStyle(ButtonStyle.Secondary)
                    .setEmoji('❌')
            );

        const msg = await message.reply({ content: "Veuillez confirmer la création de la **catégorie des logs**.", components: [row] });

        const filter = i => i.user.id === message.author.id;
        const collector = msg.createMessageComponentCollector({ filter, time: 30000 });

        collector.on('collect', async interaction => {
            if (interaction.customId === 'confirm') {
                await interaction.update({ content: 'Création de la **catégorie des logs** en cours...', embeds: [], components: [] });

                try {
                    const category = await message.guild.channels.create({
                        name: '📚・LOGS',
                        type: 4,
                        permissionOverwrites: [
                            {
                                id: message.guild.id,
                                deny: [PermissionsBitField.Flags.ViewChannel],
                            },
                        ],
                    });

                    const logChannels = [
                        { name: '📁・logs-mods', topic: 'Logs des modérateurs', dbKey: 'modlogs' },
                        { name: '📁・logs-channel', topic: 'Logs des salons', dbKey: 'channellogs' },
                        { name: '📁・logs-joinleave', topic: 'Logs des arrivées et départs', dbKey: 'joinleavelogs' },
                        { name: '📁・logs-vocaux', topic: 'Logs des salons vocaux', dbKey: 'voicelogs' },
                        { name: '📁・logs-ban-unban', topic: 'Logs des bannissements et débannissements', dbKey: 'banlogs' },
                        { name: '📁・logs-tickets', topic: 'Logs des tickets', dbKey: 'ticketlogs' },
                        { name: '📁・logs-antiraid', topic: 'Logs de l\'antiraid', dbKey: 'antiraidlogs' },
                        { name: '📁・logs-message', topic: 'Logs des messages', dbKey: 'messagelogs' },
                        { name: '📁・logs-roles', topic: 'Logs des rôles', dbKey: 'rolelogs' },
                        { name: '📁・logs-addbot', topic: 'Logs des ajouts de bots', dbKey: 'botlogs' },
                        { name: '📁・logs-invites', topic: 'Logs des invitations', dbKey: 'invitelogs' },
                        { name: '📁・logs-emojis', topic: 'Logs des emojis', dbKey: 'botlogs' },
                        { name: '📁・logs-boost', topic: 'Logs des boosts', dbKey: 'boostlogs' }
                    ];

                    for (const channelData of logChannels) {
                        const channel = await message.guild.channels.create({
                            name: channelData.name,
                            type: 0,
                            parent: category.id,
                            topic: channelData.topic,
                            permissionOverwrites: [
                                {
                                    id: message.guild.id,
                                    deny: [PermissionsBitField.Flags.ViewChannel],
                                },
                            ],
                        });

                        await client.db.set(`${channelData.dbKey}_${message.guild.id}`, channel.id);
                    }

                    await interaction.editReply('Création de la **catégorie des logs** effectuée avec succès.');
                } catch (error) {
                    console.error(error);
                    await interaction.editReply('Une erreur est survenue lors de la création de la catégorie des logs.');
                }
            } else if (interaction.customId === 'cancel') {
                await interaction.update({ content: 'Opération annulée.', embeds: [], components: [] });
            }
        });

        collector.on('end', collected => {
            if (collected.size === 0) {
                msg.edit({ content: 'Temps écoulé. Opération annulée.', embeds: [], components: [] });
            }
        });
    },
};