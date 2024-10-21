const { EmbedBuilder, AuditLogEvent } = require('discord.js');

module.exports = {
    name: 'emojiCreate',
    async execute(client, emoji) {
        const guildId = emoji.guild.id;
        const logChannelId = await client.db.get(`emojilogs_${guildId}`);
        if (!logChannelId) return;

        const logChannel = emoji.guild.channels.cache.get(logChannelId);
        if (!logChannel) return;

        const auditLogs = await emoji.guild.fetchAuditLogs({
            type: AuditLogEvent.EmojiCreate,
            limit: 1,
        });

        const creatorLog = auditLogs.entries.first();
        const creator = creatorLog ? creatorLog.executor : 'Inconnu';

        const embed = new EmbedBuilder()
            .setTitle('Emojis Créer')
            .setDescription(`> Emoji : ${emoji}\n> Nom de l'emoji : ${emoji.name}\n> Id de l'emoji : ${emoji.id}\n> Url de l'emoji : ${emoji.url}\n> Auteur : ${creator.tag} (${creator.id})`)
            .setFooter(client.footer)
            .setTimestamp()
            .setColor(client.colors.blue)
            .setThumbnail(emoji.url);

        logChannel.send({ embeds: [embed] });
    },
};
