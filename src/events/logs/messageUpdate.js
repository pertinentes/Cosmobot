const { EmbedBuilder, AuditLogEvent } = require('discord.js');

module.exports = {
    name: 'messageUpdate',
    async execute(client, oldMessage, newMessage) {
        if (oldMessage.content === newMessage.content) return;

        const guildId = newMessage.guild.id;
        const logChannelId = await client.db.get(`messagelogs_${guildId}`);
        if (!logChannelId) return;

        const logChannel = newMessage.guild.channels.cache.get(logChannelId);
        if (!logChannel) return;

        const embed = new EmbedBuilder()
            .setTitle('Message édité')
            .setDescription(`<@${newMessage.author.id}> (\`${newMessage.author.tag} / ${newMessage.author.id}\`) a édité un message dans <#${newMessage.channel.id}>`)
            .addFields(
                { name: '**Ancien message**', value: oldMessage.content || "Aucun contenu (probablement une embed)" },
                { name: '**Nouveau message**', value: newMessage.content || "Aucun contenu (probablement une embed)" }
            )
            .setFooter(client.footer)
            .setTimestamp()
            .setColor(client.colors.blue);

        let imageUrl = null;

        if (oldMessage.attachments.size > 0 || newMessage.attachments.size > 0) {
            const oldAttachmentUrls = [];
            const newAttachmentUrls = [];

            for (const attachment of oldMessage.attachments.values()) {
                if (client.config.imgur) {
                    try {
                        const response = await client.axios.post('https://api.imgur.com/3/image', {
                            image: attachment.url
                        }, {
                            headers: {
                                'Authorization': `Client-ID ${client.config.imgur}`
                            }
                        });
                        oldAttachmentUrls.push(response.data.data.link);
                        if (!imageUrl) {
                            imageUrl = response.data.data.link;
                        }
                    } catch (error) {
                        console.error(error);
                        oldAttachmentUrls.push(attachment.url);
                        if (!imageUrl) {
                            imageUrl = attachment.url;
                        }
                    }
                } else {
                    oldAttachmentUrls.push(attachment.url);
                    if (!imageUrl) {
                        imageUrl = attachment.url;
                    }
                }
            }

            for (const attachment of newMessage.attachments.values()) {
                if (client.config.imgur) {
                    try {
                        const response = await client.axios.post('https://api.imgur.com/3/image', {
                            image: attachment.url
                        }, {
                            headers: {
                                'Authorization': `Client-ID ${client.config.imgur}`
                            }
                        });
                        newAttachmentUrls.push(response.data.data.link);
                        if (!imageUrl) {
                            imageUrl = response.data.data.link;
                        }
                    } catch (error) {
                        console.error(error);
                        newAttachmentUrls.push(attachment.url);
                        if (!imageUrl) {
                            imageUrl = attachment.url;
                        }
                    }
                } else {
                    newAttachmentUrls.push(attachment.url);
                    if (!imageUrl) {
                        imageUrl = attachment.url;
                    }
                }
            }

            embed.addFields({ 
                name: 'Pièces jointes', 
                value: `Ancien: ${oldAttachmentUrls.join('\n') || "Aucune"}\nNouveau: ${newAttachmentUrls.join('\n') || "Aucune"}`
            });
        }

        if (oldMessage.embeds.length > 0 || newMessage.embeds.length > 0) {
            embed.addFields({ 
                name: 'Embeds', 
                value: `Ancien: ${oldMessage.embeds.length} embed(s)\nNouveau: ${newMessage.embeds.length} embed(s)` 
            });
        }

        if (imageUrl) {
            embed.setImage(imageUrl);
        }

        logChannel.send({ embeds: [embed] });
    },
};