const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'invitescrapper',
    description: 'Affiche les informations d\'un serveur à partir d\'une invitation',
    usage: 'invitescrapper <lien_invitation>',
    aliases: ['is', 'inviteinfo'],
    cooldown: 5,
    perm: ['public'],
    async execute(client, message, args) {
        if (!args[0]) {
            return message.reply("Veuillez fournir un lien d'invitation ou un code d'invitation valide.");
        }

        let invite;
        try {
            invite = await client.fetchInvite(args[0]);
        } catch (error) {
            return message.reply("L'invitation fournie est invalide ou a expiré.");
        }

        const guild = invite.guild;
        if (!guild) return message.reply("Impossible de récupérer les informations du serveur.");

        const createdAt = Math.floor(guild.createdTimestamp / 1000);

        const embed = new EmbedBuilder()
            .setColor(client.colors.blue)
            .setTitle(`Informations sur le serveur ${guild.name}`)
            .setThumbnail(guild.iconURL({ dynamic: true, size: 512 }))
            .setDescription(
                `➔ **Informations sur le serveur**
      > \`•\` **Nom :** ${guild.name}
      > \`•\` **Description :** ${guild.description || 'Aucune'}
      > \`•\` **ID :** ${guild.id}
      > \`•\` **Créé le :** <t:${createdAt}:F>
      > \`•\` **URL :** ${invite.url}
      ➔ **Autres**
      > \`•\` **Boosts :** ${guild.premiumSubscriptionCount}
      > \`•\` **Niveau de boost :** ${guild.premiumTier}
      > \`•\` **Niveau de vérification :** ${guild.verificationLevel}
      > \`•\` **Salon système :** ${guild.systemChannel ? guild.systemChannel.name : 'Aucun'}
      > \`•\` **Salon règlement :** ${guild.rulesChannel ? guild.rulesChannel.name : 'Aucun'}
      > \`•\` **Partenaire :** ${guild.partnered ? 'Oui' : 'Non'}
      > \`•\` **Vérifié :** ${guild.verified ? 'Oui' : 'Non'}
      > \`•\` **Salon AFK :** ${guild.afkChannel ? guild.afkChannel.name : 'Aucun'}
      ➔ **Bannière**`
            )
            .setImage(guild.bannerURL({ dynamic: true, size: 1024 }))
            .setFooter(client.footer)
            .setTimestamp();

        message.reply({ embeds: [embed] });
    },
};
