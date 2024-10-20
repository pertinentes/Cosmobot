const { EmbedBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
    name: 'wiki',
    description: 'Recherche un article sur Wikipédia',
    usage: 'wiki <recherche>',
    aliases: ['wikipedia'],
    cooldown: 5,
    perm: ['public'],
    async execute(client, message, args) {
        if (args.length === 0) {
            const errorEmbed = new EmbedBuilder()
                .setColor(client.colors.red)
                .setTitle("⛔・Erreur")
                .setDescription(`<@${message.author.id}>, merci de bien utiliser la commande.\n **Utilisation:** \`&wiki [recherche]\``)
                .setFooter({
                    text: "Celestia",
                    iconURL: "https://media.discordapp.net/attachments/1273638472808271913/1277360701421125744/logo_gif.gif?ex=6716b65b&is=671564db&hm=7e9fb6b88f9ace336e65f632b3afbe155db50579348a736b526311e408b4e04e&width=160&height=160&"
                })
                .setTimestamp();

            return message.reply({ embeds: [errorEmbed] });
        }

        const searchTerm = args.join(' ');
        const apiUrl = `https://fr.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(searchTerm)}`;

        try {
            const response = await axios.get(apiUrl);
            const data = response.data;

            const embed = new EmbedBuilder()
                .setColor(client.colors.blue)
                .setTitle(data.title)
                .setDescription(`${data.extract}\n\n[Lire l'article complet](${data.content_urls.desktop.page})`)
                .setFooter(client.footer)
                .setTimestamp();

            if (data.thumbnail) {
                embed.setThumbnail(data.thumbnail.source);
            }

            message.reply({ embeds: [embed] });
        } catch (error) {
            console.error('Erreur lors de la recherche Wikipedia:', error);
            message.reply("Désolé, je n'ai pas pu trouver d'informations sur ce sujet.");
        }
    },
};
