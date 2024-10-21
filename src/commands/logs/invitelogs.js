const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'invitelogs',
    description: 'Configure le salon pour les logs d\'invitation',
    usage: 'invitelogs [salon/off]',
    cooldown: 5,
    aliases: ["invitelog"],
    perm: ['owner', '8'],
    async execute(client, message, args) {
        const guildId = message.guild.id;

        if (!args[0]) {
            return message.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(client.colors.red)
                        .setTitle('⛔・Erreur')
                        .setDescription(`${message.author}, merci d'utiliser correctement la commande !\n **Utilisation:** \`${client.prefix}invitelogs [salon/off]\``)
                        .setFooter(client.footer)
                        .setTimestamp()
                ]
            });
        }

        if (args[0] === 'off') {
            await client.db.delete(`invitelogs_${guildId}`);
            return message.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(client.colors.green)
                        .setTitle('Logs d\'invitation')
                        .setDescription(`${message.author}, les logs d'invitation ont été désactivés !`)
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

        const currentChannel = await client.db.get(`invitelogs_${guildId}`);

        if (currentChannel === channel.id) {
            return message.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(client.colors.red)
                        .setTitle('⛔・Erreur')
                        .setDescription(`${message.author}, les logs d'invitation sont déjà définis sur ce salon !`)
                        .setFooter(client.footer)
                        .setTimestamp()
                ]
            });
        }

        await client.db.set(`invitelogs_${guildId}`, channel.id);

        return message.reply({
            embeds: [
                new EmbedBuilder()
                    .setColor(client.colors.green)
                    .setTitle('Logs d\'invitation')
                    .setDescription(`${message.author}, les logs d'invitation ont été définis sur le salon ${channel} !`)
                    .setFooter(client.footer)
                    .setTimestamp()
            ]
        });
    },
};
