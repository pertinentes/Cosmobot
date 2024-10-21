const { EmbedBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
    name: 'unban',
    description: 'Débannir un utilisateur du serveur',
    usage: 'unban [ID utilisateur] (raison)',
    cooldown: 5,
    perm: ['4'],
    async execute(client, message, args) {
        const errorem = new EmbedBuilder()
            .setColor(client.colors.red)
            .setTitle('⛔・Erreur')
            .setDescription(`${message.author}, merci d'utiliser correctement la commande !\n **Utilisation:** \`${client.config.prefix}unban [ID utilisateur] (raison)\``)
            .setFooter(client.footer)
            .setTimestamp();
        if (!args[0]) {
            return message.reply({ embeds: [errorem] });
        }

        const userId = args[0];
        let reason = 'Aucune raison spécifiée';

        if (args.length >= 2) {
            reason = args.slice(1).join(' ');
        }

        try {
            const banList = await message.guild.bans.fetch();
            const bannedUser = banList.find(ban => ban.user.id === userId);

            if (!bannedUser) {
                return message.reply("Cet utilisateur n'est pas banni du serveur.");
            }

            await message.guild.members.unban(userId, reason);

            const unbanEmbed = new EmbedBuilder()
                .setColor(client.colors.blue)
                .setTitle('Membre Débanni !')
                .setDescription(`Membre : <@${userId}> \nDébanni par : ${message.author} \nRaison : ${reason}`)
                .setFooter(client.footer)
                .setTimestamp();

            message.reply({ embeds: [unbanEmbed] });
        } catch (error) {
            console.error(error);
            message.reply("Impossible de débannir cet utilisateur. Vérifiez que j'ai les permissions nécessaires et que l'ID de l'utilisateur est correct.");
        }
    },
};
