const { EmbedBuilder, AuditLogEvent } = require('discord.js');

module.exports = {
    name: 'guildBanRemove',
    async execute(client, ban) {
        const guildId = ban.guild.id;
        const logChannelId = await client.db.get(`banlogs_${guildId}`);
        if (!logChannelId) return;

        const logChannel = ban.guild.channels.cache.get(logChannelId);
        if (!logChannel) return;

        const auditLogs = await ban.guild.fetchAuditLogs({
            type: AuditLogEvent.MemberBanRemove,
            limit: 1,
        });

        const banLog = auditLogs.entries.first();
        const unbanner = banLog ? banLog.executor : 'Inconnu';

        const embed = new EmbedBuilder()
            .setTitle('‣ LOGS | Membres Débanis')
            .setDescription(`Information de l'utilisateur:\n > **Membre: <@${ban.user.id}>** \n > **ID: ${ban.user.id}**\n > **Auteur: ${unbanner.tag}**`)
            .setFooter(client.footer)
            .setTimestamp()
            .setColor(client.colors.blue)
            .setThumbnail(ban.user.displayAvatarURL({ dynamic: true }));

        logChannel.send({ embeds: [embed] });
    },
};
