const { EmbedBuilder, AuditLogEvent } = require('discord.js')

module.exports = {
    name: 'channelCreate',
    async execute(client, channel) {
        const guildId = channel.guild.id
        const logChannelId = await channel.client.db.get(`channellogs_${guildId}`)
        if (!logChannelId) return

        const logChannel = channel.guild.channels.cache.get(logChannelId)
        if (!logChannel) return

        const auditLogs = await channel.guild.fetchAuditLogs({
            type: AuditLogEvent.ChannelCreate,
            limit: 1,
        })

        const creatorLog = auditLogs.entries.first()
        const creator = creatorLog ? creatorLog.executor : 'Inconnu'

        const embed = new EmbedBuilder()
            .setTitle('Nouveau salon créé !')
            .setDescription(`> <@${creator.id}> vient de \`créer un salon\` !\n> Nom du salon: <#${channel.id}>\n> Type: **${channel.type === 0 ? 'Salon Textuel' : 'Salon Vocal'}**`)
            .setFooter(client.footer)
            .setTimestamp()
            .setColor(client.colors.blue)

        logChannel.send({ embeds: [embed] })
    },
}
