const { EmbedBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
    name: 'kiss',
    description: 'Embrasse un membre',
    usage: 'kiss [membre]',
    aliases: ['bisou'],
    cooldown: 5,
    perm: ['public'],
    async execute(client, message, args) {
        const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);

        if (!member) {
            const errorEmbed = new EmbedBuilder()
                .setColor(client.colors.red)
                .setTitle('⛔・Utilisation de la commande')
                .setDescription(`${message.author}, merci de bien utiliser la commande.\n **Utilisation:** \`${client.config.prefix}kiss [membre]\``)
                .setFooter(client.footer)
                .setTimestamp();

            return message.reply({ embeds: [errorEmbed] });
        }

        try {
            const response = await axios.get('https://nekos.life/api/v2/img/kiss');
            const imageUrl = response.data.url;

            const kissEmbed = new EmbedBuilder()
                .setColor(client.colors.blue)
                .setTitle('Bisous')
                .setDescription(`${message.author} a fait un bisou à ${member}!`)
                .setImage(imageUrl)
                .setFooter(client.footer)
                .setTimestamp();

            message.reply({ embeds: [kissEmbed] });
        } catch (error) {
            console.error('Erreur lors de la récupération de l\'image:', error);
            message.reply('Désolé, une erreur s\'est produite lors de la récupération de l\'image.');
        }
    },
};
