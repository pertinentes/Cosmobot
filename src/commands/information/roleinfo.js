const { EmbedBuilder, PermissionsBitField } = require('discord.js');
const moment = require('moment');

module.exports = {
    name: 'roleinfo',
    description: 'Affiche les informations d\'un rôle',
    usage: 'roleinfo [role]',
    aliases: ['ri', 'role'],
    cooldown: 5,
    perm: ['public'],
    async execute(client, message, args) {
        if (!args[0]) {
            return message.reply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle('⛔・Erreur')
                        .setDescription(`${message.author}, merci de bien utiliser la commande.\n **Utilisation:** \`${this.usage}\``)
                        .setColor(client.colors.red)
                        .setFooter(client.footer)
                        .setTimestamp()
                ]
            });
        }

        let role = message.mentions.roles.first() || message.guild.roles.cache.get(args[0]) || message.guild.roles.cache.find(r => r.name.toLowerCase() === args.join(' ').toLowerCase());

        if (!role) {
            return message.reply('Je n\'ai pas trouvé ce rôle.');
        }

        const permissions = role.permissions.toArray().map(perm => {
            return perm.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
        }).join(', ') || 'Aucune permission';

        const createdAt = moment(role.createdAt);
        const daysAgo = moment().diff(createdAt, 'days');

        const embed = new EmbedBuilder()
            .setTitle(`**Information du rôle** ${role.name}`)
            .setDescription(
                `➔ **Information sur le rôle**
      > \`•\` **Nom :** ${role.name}
      > \`•\` **ID :** ${role.id}
      > \`•\` **Couleur :** ${role.hexColor}
      > \`•\` **Visibilité :** ${role.hoist ? 'Oui' : 'Non'}
      > \`•\` **Utilisateurs :** ${role.members.size}
      > \`•\` **Mentionable :** ${role.mentionable ? 'Oui' : 'Non'}
      > \`•\` **Position :** \`${role.position}\`/\`${message.guild.roles.cache.size}\`
      > \`•\` **Créé le :** ${createdAt.format('Do MMMM YYYY, HH:mm:ss')} | Il y a ${daysAgo} jour(s)
      > \`•\` **Permissions :** ${permissions}`
            )
            .setColor(client.colors.blue)
            .setFooter(client.footer)
            .setTimestamp();

        message.reply({ embeds: [embed] });
    },
};