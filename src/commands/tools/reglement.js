const { EmbedBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
    name: 'reglement',
    description: 'Affiche le règlement du serveur',
    usage: 'reglement',
    aliases: ['rules'],
    cooldown: 10,
    perm: ['4'],
    async execute(client, message, args) {
        if (!message.member.permissions.has(PermissionsBitField.Flags.ManageGuild)) {
            return message.reply("Vous n'avez pas la permission d'utiliser cette commande.");
        }

        const reglementEmbed = new EmbedBuilder()
            .setColor(client.colors.blue)
            .setTitle('📜 Règlement de **' + message.guild.name + '**')
            .setDescription(`**1. Conformité aux règles de Discord**
Assurez-vous de respecter les conditions d'utilisation et les directives communautaires de Discord. L'équipe de **${message.guild.name}** a établi ces règles pour garantir un environnement agréable et respectueux.

**2. Adhésion aux documents officiels**
Chaque membre doit prendre connaissance de ce règlement ainsi que des Termes de Service (ToS) et des Directives de Discord. La conformité est essentielle pour une coexistence harmonieuse.

**3. Respect mutuel**
Le respect est primordial. Toute forme de discours haineux, y compris le racisme, l'homophobie, le sexisme, ou la misogynie, est strictement interdite et sera sévèrement punie.

**4. Signalement des failles**
Si vous découvrez des failles ou des erreurs dans le serveur, telles que des permissions incorrectes ou des salons inaccessibles, veuillez les signaler immédiatement via le salon #support. N'abusez pas des vulnérabilités.

**5. Respect des thèmes des salons**
Chaque salon a un but spécifique. Par exemple, le salon #suggestion est dédié aux idées pour améliorer le serveur. Assurez-vous que vos messages sont pertinents pour le salon où vous postez. Le non-respect pourra entraîner des mesures de la part du staff.

**6. Utilisation du bon sens**
Même si une action n'est pas explicitement interdite par le règlement, utilisez toujours votre bon sens. Le staff peut intervenir en cas de comportement inapproprié ou imprudent.

🔗 Veuillez lire attentivement cette politique. Pour consulter les Termes de Service de Discord, cliquez [ici](https://discordapp.com/terms).

✅ Réagissez avec ✅ ci-dessous pour confirmer que vous avez pris connaissance des règles de **${message.guild.name}**.`)
            .setFooter(client.footer)
            .setTimestamp();

        const sentMessage = await message.channel.send({ embeds: [reglementEmbed] });
        await sentMessage.react('✅');
    },
};
