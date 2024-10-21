const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'antiraidlogs',
    description: 'Configure le salon pour les logs anti-raid',
    usage: 'antiraidlogs [salon/off]',
    cooldown: 5,
    aliases: ["antiraidlog"],
    perm: ['owner', '8'],
    async execute(client, message, args, prefix) {
        const guildId = message.guild.id;

        if (!args[0]) {
            return message.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(client.colors.red)
                        .setTitle('⛔・Erreur')
                        .setDescription(`${message.author}, merci d'utiliser correctement la commande !\n **Utilisation:** \`${client.prefix}antiraidlogs [salon/off]\``)
                        .setFooter(client.footer)
                        .setTimestamp()
                ]
            });
        }

        if (args[0] === 'off') {
            await client.db.delete(`antiraidlogs_${guildId}`);
            return message.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(client.colors.green)
                        .setTitle('Logs anti-raid')
                        .setDescription(`${message.author}, les logs anti-raid ont été désactivés !`)
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

        const currentChannel = await client.db.get(`antiraidlogs_${guildId}`);

        if (currentChannel === channel.id) {
            return message.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(client.colors.red)
                        .setTitle('⛔・Erreur')
                        .setDescription(`${message.author}, les logs anti-raid sont déjà définis sur ce salon !`)
                        .setFooter(client.footer)
                        .setTimestamp()
                ]
            });
        }

        await client.db.set(`antiraidlogs_${guildId}`, channel.id);

        return message.reply({
            embeds: [
                new EmbedBuilder()
                    .setColor(client.colors.green)
                    .setTitle('Logs anti-raid')
                    .setDescription(`${message.author}, les logs anti-raid ont été définis sur le salon ${channel} !`)
                    .setFooter(client.footer)
                    .setTimestamp()
            ]
        });
    },
};
