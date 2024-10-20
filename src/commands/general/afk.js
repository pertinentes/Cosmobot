const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'afk',
    description: 'Permet de se mettre en mode AFK',
    usage: `afk [raison]`,
    cooldown: 5,
    perm: ['public'],
    async execute(client, message, args) {
        const reason = args.join(' ') || 'Aucune Raison';

        client.db.set(`afk_${message.author.id}_${message.guild.id}`, reason);

        const afkEmbed = new EmbedBuilder()
            .setColor(client.colors.blue)
            .setTitle('AFK')
            .setDescription(`Tu as activé le mode AFK\n**Raison :** ${reason}`)
            .setFooter(client.footer)
            .setTimestamp();

        message.reply({ embeds: [afkEmbed] });
    },
};
