const { EmbedBuilder, AuditLogEvent } = require('discord.js');

module.exports = {
    name: 'roleDelete',
    async execute(client, role) {
        const guildId = role.guild.id;
        const logChannelId = await client.db.get(`rolelogs_${guildId}`);
        if (!logChannelId) return;

        const logChannel = role.guild.channels.cache.get(logChannelId);
        if (!logChannel) return;

        const auditLogs = await role.guild.fetchAuditLogs({
            type: AuditLogEvent.RoleDelete,
            limit: 1,
        });

        const deletorLog = auditLogs.entries.first();
        const deletor = deletorLog ? deletorLog.executor : 'Inconnu';

        const embed = new EmbedBuilder()
            .setTitle('Rôle Supprimé ! :wh_role:')
            .setDescription(`> <@${deletor.id}> vient de \`supprimer un rôle\` !\n> Rôle : (\`${role.id}\`) (\`${role.name}\`)`)
            .setFooter(client.footer)
            .setTimestamp()
            .setColor(client.colors.blue);

        logChannel.send({ embeds: [embed] });
    },
};
