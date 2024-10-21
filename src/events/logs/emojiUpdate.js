const { EmbedBuilder, AuditLogEvent } = require('discord.js');

module.exports = {
    name: 'emojiUpdate',
    async execute(client, oldEmoji, newEmoji) {
        const guildId = newEmoji.guild.id;
        const logChannelId = await client.db.get(`emojilogs_${guildId}`);
        if (!logChannelId) return;

        const logChannel = newEmoji.guild.channels.cache.get(logChannelId);
        if (!logChannel) return;

        const auditLogs = await newEmoji.guild.fetchAuditLogs({
            type: AuditLogEvent.EmojiUpdate,
            limit: 1,
        });

        const updateLog = auditLogs.entries.first();
        const updater = updateLog ? updateLog.executor : 'Inconnu';

        const embed = new EmbedBuilder()
            .setTitle('Emojis Modifié :emoji_7:')
            .setDescription(`> Emoji : ${newEmoji}\n> Ancien: ${oldEmoji.name}\n> Nouveau: ${newEmoji.name}\n> Auteur: ${updater.tag} (${updater.id})`)
            .setFooter(client.footer)
            .setTimestamp()
            .setColor(client.colors.blue)
            .setThumbnail(newEmoji.url);

        const changes = [];

        if (oldEmoji.name !== newEmoji.name) {
            changes.push({
                name: 'Changement de nom',
                value: `Ancien : **${oldEmoji.name}**\nNouveau : **${newEmoji.name}**`,
                inline: false
            });
        }

        embed.addFields(changes);

        logChannel.send({ embeds: [embed] });
    },
};
