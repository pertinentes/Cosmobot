const { EmbedBuilder, AuditLogEvent } = require('discord.js');

module.exports = {
    name: 'roleUpdate',
    async execute(client, oldRole, newRole) {
        const guildId = newRole.guild.id;
        const logChannelId = await client.db.get(`rolelogs_${guildId}`);
        if (!logChannelId) return;

        const logChannel = newRole.guild.channels.cache.get(logChannelId);
        if (!logChannel) return;

        const auditLogs = await newRole.guild.fetchAuditLogs({
            type: AuditLogEvent.RoleUpdate,
            limit: 1,
        });

        const updateLog = auditLogs.entries.first();
        const updater = updateLog ? updateLog.executor : 'Inconnu';

        const embed = new EmbedBuilder()
            .setTitle('Rôle Modifié ! :wh_role:')
            .setDescription(`> <@${updater.id}> vient de \`modifier un rôle\` !\n> Rôle : <@&${newRole.id}> (\`${newRole.id}\`) (\`${newRole.name}\`)`)
            .setFooter(client.footer)
            .setTimestamp()
            .setColor(client.colors.blue);

        const changes = [];

        if (oldRole.name !== newRole.name) {
            changes.push({
                name: 'Changement de nom',
                value: `Avant : **${oldRole.name}**\nAprès : **${newRole.name}**`,
                inline: false
            });
        }

        if (oldRole.permissions.bitfield !== newRole.permissions.bitfield) {
            changes.push({
                name: 'Changement de permissions',
                value: `Avant : **${oldRole.permissions.bitfield}**\nAprès : **${newRole.permissions.bitfield}**`,
                inline: false
            });
        }

        if (oldRole.color !== newRole.color) {
            changes.push({
                name: 'Changement de couleur',
                value: `Avant : **${oldRole.hexColor}**\nAprès : **${newRole.hexColor}**`,
                inline: false
            });
        }

        if (oldRole.hoist !== newRole.hoist) {
            changes.push({
                name: 'Affichage séparé',
                value: `Avant : **${oldRole.hoist ? 'Oui' : 'Non'}**\nAprès : **${newRole.hoist ? 'Oui' : 'Non'}**`,
                inline: false
            });
        }

        if (oldRole.mentionable !== newRole.mentionable) {
            changes.push({
                name: 'Mentionnable',
                value: `Avant : **${oldRole.mentionable ? 'Oui' : 'Non'}**\nAprès : **${newRole.mentionable ? 'Oui' : 'Non'}**`,
                inline: false
            });
        }

        embed.addFields(changes);

        logChannel.send({ embeds: [embed] });
    },
};
