const { EmbedBuilder, AuditLogEvent } = require('discord.js');

module.exports = {
    name: 'roleCreate',
    async execute(client, role) {
        const guildId = role.guild.id;
        const logChannelId = await client.db.get(`rolelogs_${guildId}`);
        if (!logChannelId) return;

        const logChannel = role.guild.channels.cache.get(logChannelId);
        if (!logChannel) return;

        const auditLogs = await role.guild.fetchAuditLogs({
            type: AuditLogEvent.RoleCreate,
            limit: 1,
        });

        const creatorLog = auditLogs.entries.first();
        const creator = creatorLog ? creatorLog.executor : 'Inconnu';

        const embed = new EmbedBuilder()
            .setTitle('Rôle Créé !')
            .setDescription(`> <@${creator.id}> vient de \`créer un rôle\` !\n> Rôle : <@&${role.id}> (\`${role.id}\`) (\`${role.name}\`)`)
            .setFooter(client.footer)
            .setTimestamp()
            .setColor(client.colors.blue);

        logChannel.send({ embeds: [embed] });
    },
};
