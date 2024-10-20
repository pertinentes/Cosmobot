const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'greroll',
    description: 'Relance un giveaway terminé',
    usage: 'greroll [ID du message du giveaway]',
    aliases: ['giveaway-reroll', 'reroll-giveaway'],
    cooldown: 5,
    perm: ['giveaway'],
    async execute(client, message, args) {
        let giveawayMessage;

        if (message.reference) {
            const repliedMessage = await message.channel.messages.fetch(message.reference.messageId);
            giveawayMessage = repliedMessage;
        } else if (args[0]) {
            try {
                giveawayMessage = await message.channel.messages.fetch(args[0]);
            } catch (error) {
                const errorEmbed = new EmbedBuilder()
                    .setColor(client.colors.red)
                    .setTitle('⛔・Erreur')
                    .setDescription(`${message.author}, le message avec l'ID spécifié n'a pas été trouvé.`)
                    .setFooter(client.footer)
                    .setTimestamp();

                return message.reply({ embeds: [errorEmbed] });
            }
        } else {
            const errorEmbed = new EmbedBuilder()
                .setColor(client.colors.red)
                .setTitle('⛔・Erreur')
                .setDescription(`${message.author}, veuillez répondre à un message de giveaway ou fournir l'ID du message du giveaway.`)
                .setFooter(client.footer)
                .setTimestamp();

            return message.reply({ embeds: [errorEmbed] });
        }

        try {
            const giveaway = client.giveawaysManager.giveaways.find(
                (g) => g.messageId === giveawayMessage.id && g.guildId === message.guild.id
            );

            if (!giveaway) {
                return message.reply('Impossible de trouver un giveaway pour ce message.');
            }

            await client.giveawaysManager.reroll(giveaway.messageId, {
                messages: {
                    congrat: 'Félicitations, {winners}! Vous avez gagné **{prize}**!',
                    error: 'Il n\'y a pas assez de participants pour faire un reroll'
                }
            });
            return message.reply('Le giveaway a été relancé avec succès !');
        } catch (error) {
            console.error(error);
            return message.reply('Une erreur est survenue lors de la tentative de relancer le giveaway.');
        }
    },
};
