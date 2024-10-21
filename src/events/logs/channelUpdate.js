const { EmbedBuilder, AuditLogEvent } = require('discord.js');

module.exports = {
    name: 'channelUpdate',
    async execute(client, oldChannel, newChannel) {
        const guildId = newChannel.guild.id;
        const logChannelId = await client.db.get(`channellogs_${guildId}`);
        if (!logChannelId) return;

        const logChannel = newChannel.guild.channels.cache.get(logChannelId);
        if (!logChannel) return;

        const auditLogs = await newChannel.guild.fetchAuditLogs({
            type: AuditLogEvent.ChannelUpdate,
            limit: 1,
        });

        const updateLog = auditLogs.entries.first();
        const updater = updateLog ? updateLog.executor : 'Inconnu';

        const embed = new EmbedBuilder()
            .setTitle('Salon Modifié ! :channel:')
            .setDescription(`> <@${updater.id}> a \`modifié un salon\` !\n> Salon : <#${newChannel.id}>`)
            .setFooter(client.footer)
            .setTimestamp()
            .setColor(client.colors.blue);

        const changes = [];

        if (oldChannel.name !== newChannel.name) {
            changes.push({
                name: 'Changement de nom',
                value: `Ancien : **${oldChannel.name}**\nNouveau : **${newChannel.name}**`,
                inline: false
            });
        }

        if (oldChannel.topic !== newChannel.topic) {
            changes.push({
                name: 'Changement de sujet',
                value: `Ancien : **${oldChannel.topic || 'Aucun'}**\nNouveau : **${newChannel.topic || 'Aucun'}**`,
                inline: false
            });
        }

        if (oldChannel.nsfw !== newChannel.nsfw) {
            changes.push({
                name: 'Changement NSFW',
                value: `Ancien : **${oldChannel.nsfw ? 'Oui' : 'Non'}**\nNouveau : **${newChannel.nsfw ? 'Oui' : 'Non'}**`,
                inline: false
            });
        }

        embed.addFields(changes);

        logChannel.send({ embeds: [embed] });
    },
};
