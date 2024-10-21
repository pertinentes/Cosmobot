const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'setprefix',
    description: 'Change le préfixe du bot pour ce serveur',
    usage: 'setprefix [nouveau_préfixe]',
    cooldown: 5,
    aliases: ['prefix'],
    perm: ['owner'],
    async execute(client, message, args, prefix) {
        const guildId = message.guild.id;

        if (args.length === 0) {
            const errorEmbed = new EmbedBuilder()
                .setColor(client.colors.red)
                .setTitle('⛔・Erreur')
                .setDescription(`<@${message.author.id}>, merci de bien utiliser la commande.\n **Utilisation:** \`${prefix}setprefix [nouveau_préfixe]\``)
                .setFooter(client.footer)
                .setTimestamp();

            return message.reply({ embeds: [errorEmbed] });
        }

        const newPrefix = args[0];

        client.db.set(`prefix_${guildId}`, newPrefix);

        const successEmbed = new EmbedBuilder()
            .setColor(0x4e5d94)
            .setTitle('Nouveau préfix')
            .setDescription(`<@${message.author.id}>, le préfix du bot est maintenant ${newPrefix} !`)
            .setFooter(client.footer)
            .setTimestamp();

        message.reply({ embeds: [successEmbed] });
    },
};