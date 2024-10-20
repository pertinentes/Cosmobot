const { EmbedBuilder } = require('discord.js');
const moment = require('moment');

module.exports = {
    name: 'channelinfo',
    description: 'Affiche les informations d\'un salon',
    usage: 'channelinfo [salon]',
    aliases: ['ci', 'channel'],
    perm: ['public'],
    cooldown: 5,
    async execute(client, message, args) {
        let channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[0]) || message.channel;

        if (!channel) {
            return message.reply('Je n\'ai pas trouvé ce salon.');
        }

        const createdAt = moment(channel.createdAt);
        const daysAgo = moment().diff(createdAt, 'days');

        const embed = new EmbedBuilder()
            .setTitle('Information du salon')
            .setDescription(
                `➔ **Information sur le salon ${channel}**
      > \`•\` **Nom :** ${channel.name}
      > \`•\` **Identifiant :** ${channel.id}
      > \`•\` **Type :** ${channel.type}
      > \`•\` **Utilisateurs :** ${channel.members.size}
      > \`•\` **Création :** ${createdAt.format('Do MMMM YYYY')} | Il y a ${daysAgo} jour(s)
      > \`•\` **NSFW :** ${channel.nsfw ? 'Oui' : 'Non'}`
            )
            .setColor(client.colors.blue)
            .setFooter(client.footer)
            .setTimestamp();

        message.reply({ embeds: [embed] });
    },
};
