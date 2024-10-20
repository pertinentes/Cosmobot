const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'serverinfo',
    description: 'Affiche les informations du serveur',
    usage: 'serverinfo',
    aliases: ['si', 'server'],
    cooldown: 5,
    perm: ['public'],
    async execute(client, message, args) {
        const guild = message.guild;
        if (!guild) return message.reply("Cette commande ne peut être utilisée que dans un serveur.");

        const owner = await guild.fetchOwner();
        const createdAt = Math.floor(guild.createdTimestamp / 1000);
        const channels = guild.channels.cache;
        const roles = guild.roles.cache;

        const embed = new EmbedBuilder()
            .setColor(client.colors.blue)
            .setTitle('Informations sur le serveur')
            .setDescription(
                `**Informations sur le serveur**
- **Nom :** ${guild.name}
- **Description :** ${guild.description || 'Aucune'}
- **ID :** ${guild.id}
- **Owner :** ${owner}
- **Créé le :** <t:${createdAt}:F>
- **URL :** ${guild.vanityURLCode ? `https://discord.gg/${guild.vanityURLCode}` : 'Aucune'}

**Statistiques du serveur**
- **Utilisateurs :** ${guild.memberCount}
- **Humains :** ${guild.members.cache.filter(member => !member.user.bot).size}
- **Bots :** ${guild.members.cache.filter(member => member.user.bot).size}
- **Salons textuels :** ${channels.filter(channel => channel.type === 0).size}
- **Salons vocaux :** ${channels.filter(channel => channel.type === 2).size}
- **Rôles :** ${roles.size}
- **Plus haut rôle :** ${roles.sort((a, b) => b.position - a.position).first()}
- **Emojis :** ${guild.emojis.cache.size}

**Autres**
- **Boosts :** ${guild.premiumSubscriptionCount}
- **Boosters :** ${guild.premiumSubscriptionCount}
- **Niveau de boost :** ${guild.premiumTier}
- **Niveau de vérification :** ${guild.verificationLevel}
- **Salon système :** ${guild.systemChannel ? guild.systemChannel : 'Aucun'}
- **Salon règlement :** ${guild.rulesChannel ? guild.rulesChannel : 'Aucun'}
- **Partenaire :** ${guild.partnered ? 'Oui' : 'Non'}
- **Vérifié :** ${guild.verified ? 'Oui' : 'Non'}
- **Notifications :** ${guild.defaultMessageNotifications}
- **Salon AFK :** ${guild.afkChannel ? guild.afkChannel : 'Aucun'}`
            )
            .setFooter(client.footer)
            .setTimestamp();

        message.reply({ embeds: [embed] });
    },
};
