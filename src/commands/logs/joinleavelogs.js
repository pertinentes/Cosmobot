
const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'joinleavelogs',
    description: 'Configure le salon pour les logs d\'arrivée et de départ',
    usage: 'joinleavelogs [salon/off]',
    cooldown: 5,
    aliases: ["joinleavelog"],
    perm: ['owner', '8'],
    async execute(client, message, args) {
        const guildId = message.guild.id;

        if (!args[0]) {
            return message.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(client.colors.red)
                        .setTitle('⛔・Erreur')
                        .setDescription(`${message.author}, merci d'utiliser correctement la commande !\n **Utilisation:** \`${client.prefix}joinleavelogs [salon/off]\``)
                        .setFooter(client.footer)
                        .setTimestamp()
                ]
            });
        }

        if (args[0] === 'off') {
            await client.db.delete(`joinleavelogs_${guildId}`);
            return message.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(client.colors.green)
                        .setTitle('Logs arrivée/départ')
                        .setDescription(`${message.author}, les logs d'arrivée et de départ ont été désactivés !`)
                        .setFooter(client.footer)
                        .setTimestamp()
                ]
            });
        }

        const channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[0]);

        if (!channel) {
            return message.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(client.colors.red)
                        .setTitle('⛔・Erreur')
                        .setDescription(`${message.author}, le salon spécifié est invalide !`)
                        .setFooter(client.footer)
                        .setTimestamp()
                ]
            });
        }

        const currentChannel = await client.db.get(`joinleavelogs_${guildId}`);

        if (currentChannel === channel.id) {
            return message.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(client.colors.red)
                        .setTitle('⛔・Erreur')
                        .setDescription(`${message.author}, les logs d'arrivée et de départ sont déjà définis sur ce salon !`)
                        .setFooter(client.footer)
                        .setTimestamp()
                ]
            });
        }

        await client.db.set(`joinleavelogs_${guildId}`, channel.id);

        return message.reply({
            embeds: [
                new EmbedBuilder()
                    .setColor(client.colors.green)
                    .setTitle('Logs arrivée/départ')
                    .setDescription(`${message.author}, les logs d'arrivée et de départ ont été définis sur le salon ${channel} !`)
                    .setFooter(client.footer)
                    .setTimestamp()
            ]
        });
    },
};
