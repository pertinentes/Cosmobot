const { EmbedBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
    name: 'unmute',
    description: 'Retire le mute d\'un utilisateur',
    usage: 'unmute [utilisateur]',
    aliases: ['untimeout'],
    cooldown: 5,
    perm: ['4'],
    async execute(client, message, args) {
        const errorem = new EmbedBuilder()
            .setColor(client.colors.blue)
            .setTitle('⛔・Erreur')
            .setDescription(`${message.author}, merci d'utiliser correctement la commande !\n **Utilisation:** \`${client.config.prefix}unmute [utilisateur]\``)
            .setFooter(client.footer)
            .setTimestamp();

        if (!message.member.permissions.has(PermissionsBitField.Flags.ModerateMembers)) {
            return message.reply("Vous n'avez pas la permission d'utiliser cette commande.");
        }

        if (args.length < 1) {
            return message.reply({ embeds: [errorem] });
        }

        const target = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        if (!target) {
            return message.reply({ embeds: [errorem] });
        }

        try {
            if (!target.isCommunicationDisabled()) {
                return message.reply(`${target} n'est pas actuellement mute.`);
            }

            await target.timeout(null);
            message.reply(`${target} a été unmute avec succès.`);
        } catch (error) {
            console.error(error);
            message.reply("Le bot ne peut pas retirer le mute de ce membre.");
        }
    },
};
