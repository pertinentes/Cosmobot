const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'firstmsg',
    description: 'Affiche le premier message du salon',
    usage: 'firstmsg',
    aliases: ['firstmessage'],
    perm: ['public'],
    cooldown: 5,
    async execute(client, message, args) {
        try {
            const messages = await message.channel.messages.fetch({ limit: 1, after: '0' });
            const firstMessage = messages.first();

            if (!firstMessage) {
                return message.reply("Je n'ai pas pu trouver le premier message de ce salon.");
            }

            const embed = new EmbedBuilder()
                .setColor(client.colors.blue)
                .setTitle(`Premier message du salon <#${message.channel.id}>`)
                .setDescription(`Auteur: <@${firstMessage.author.id}> \nID du message: ${firstMessage.id}\nContenu: ${firstMessage.content}`)
                .setThumbnail(firstMessage.author.displayAvatarURL({ dynamic: true }))
                .setFooter(client.footer)
                .setTimestamp(firstMessage.createdAt);

            await message.reply({ embeds: [embed] });
        } catch (error) {
            console.error('Erreur lors de la récupération du premier message:', error);
            message.reply("Une erreur s'est produite lors de la récupération du premier message.");
        }
    },
};
