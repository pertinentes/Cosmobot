const { EmbedBuilder, AuditLogEvent } = require('discord.js');

module.exports = {
    name: 'messageDelete',
    async execute(client, message) {
        const guildId = message.guild.id;
        const logChannelId = await client.db.get(`messagelogs_${guildId}`);
        if (!logChannelId) return;

        const logChannel = message.guild.channels.cache.get(logChannelId);
        if (!logChannel) return;

        const auditLogs = await message.guild.fetchAuditLogs({
            type: AuditLogEvent.MessageDelete,
            limit: 1,
        });

        const deletorLog = auditLogs.entries.first();
        const deletor = deletorLog ? deletorLog.executor : 'Inconnu';

        const embed = new EmbedBuilder()
            .setTitle('Message supprimé')
            .setDescription(`<@${deletor.id}> (\`${deletor.tag} / ${deletor.id}\`) a supprimé un message dans <#${message.channel.id}>`)
            .addFields(
                { name: '**Contenu du message supprimé**', value: message.content || "Aucun contenu (probablement une embed)" }
            )
            .setFooter(client.footer)
            .setTimestamp()
            .setColor(client.colors.blue);

        let imageUrl = null;

        if (message.attachments.size > 0) {
            const attachmentUrls = [];
            for (const attachment of message.attachments.values()) {
                if (client.config.imgur) {
                    try {
                        const response = await client.axios.post('https://api.imgur.com/3/image', {
                            image: attachment.url
                        }, {
                            headers: {
                                'Authorization': `Client-ID ${client.config.imgur}`
                            }
                        });
                        attachmentUrls.push(response.data.data.link);
                        if (!imageUrl) {
                            imageUrl = response.data.data.link;
                        }
                    } catch (error) {
                        console.error(error);
                        attachmentUrls.push(attachment.url);
                        if (!imageUrl) {
                            imageUrl = attachment.url;
                        }
                    }
                } else {
                    attachmentUrls.push(attachment.url);
                    if (!imageUrl) {
                        imageUrl = attachment.url;
                    }
                }
            }
            embed.addFields({ name: 'Pièces jointes', value: attachmentUrls.join('\n') || "Aucune" });
        }

        if (message.embeds.length > 0) {
            embed.addFields({ name: 'Embeds', value: `${message.embeds.length} embed(s)` });
        }

        if (imageUrl) {
            embed.setImage(imageUrl);
        }

        logChannel.send({ embeds: [embed] });
    },
};