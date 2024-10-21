const { EmbedBuilder, AuditLogEvent } = require('discord.js')

module.exports = {
    name: 'channelDelete',
    async execute(client, channel) {
        const guildId = channel.guild.id
        const logChannelId = await channel.client.db.get(`channellogs_${guildId}`)
        if (!logChannelId) return

        const logChannel = channel.guild.channels.cache.get(logChannelId)
        if (!logChannel) return

        const auditLogs = await channel.guild.fetchAuditLogs({
            type: AuditLogEvent.ChannelDelete,
            limit: 1,
        })

        const deleterLog = auditLogs.entries.first()
        const deleter = deleterLog ? deleterLog.executor : 'Inconnu'

        const embed = new EmbedBuilder()
            .setTitle('Salon supprimé ! :wastebasket:')
            .setDescription(`> <@${deleter.id}> vient de \`supprimer un salon\` !\n> Nom du salon: ${channel.name}\n> Type: **${channel.type === 0 ? 'Salon Textuel' : 'Salon Vocal'}**`)
            .setFooter(client.footer)
            .setTimestamp()
            .setColor(client.colors.red)

        logChannel.send({ embeds: [embed] })
    },
}
