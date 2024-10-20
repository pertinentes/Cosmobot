const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    name: 'suggest',
    description: 'Permet de faire une suggestion',
    usage: `suggest <suggestion>`,
    aliases: ['suggestion'],
    cooldown: 0,
    perm: ['public'],
    async execute(client, message, args) {
        if (!args.length) {
            const errorEmbed = new EmbedBuilder()
                .setColor(client.colors.blue)
                .setTitle('⛔・Erreur')
                .setDescription(`${message.author}, merci de renseigner un texte !`)
                .setFooter(client.footer)
                .setTimestamp();
            return message.reply({ embeds: [errorEmbed] });
        }

        const suggestion = args.join(' ');
        const suggestChannelId = await client.db.get(`suggestChannel_${message.guild.id}`);

        if (!suggestChannelId) {
            const errorEmbed = new EmbedBuilder()
                .setColor(client.colors.blue)
                .setTitle('⛔・Erreur')
                .setDescription(`${message.author}, le serveur n'a pas renseigné le salon des suggestions ou il est invalide, pour configurer ce salon faîtes cette commande \`&setsuggest [channel]\``)
                .setFooter(client.footer)
                .setTimestamp();
            return message.reply({ embeds: [errorEmbed] });
        }

        const suggestChannel = message.guild.channels.cache.get(suggestChannelId);

        if (!suggestChannel) {
            const errorEmbed = new EmbedBuilder()
                .setColor(client.colors.blue)
                .setTitle('⛔・Erreur')
                .setDescription(`${message.author}, le salon des suggestions configuré n'existe plus. Veuillez contacter un administrateur pour le reconfigurer avec \`&setsuggest [channel]\``)
                .setFooter(client.footer)
                .setTimestamp();
            return message.reply({ embeds: [errorEmbed] });
        }

        const embed = new EmbedBuilder()
            .setColor(client.colors.blue)
            .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
            .setTitle('Nouvelle Suggestion')
            .setDescription(suggestion)
            .setFooter(client.footer)
            .setTimestamp();

        const acceptButton = new ButtonBuilder()
            .setCustomId('accept')
            .setLabel('Accepter')
            .setStyle(ButtonStyle.Success);

        const rejectButton = new ButtonBuilder()
            .setCustomId('reject')
            .setLabel('Refuser')
            .setStyle(ButtonStyle.Danger);

        const deleteButton = new ButtonBuilder()
            .setCustomId('delete')
            .setLabel('🗑️')
            .setStyle(ButtonStyle.Secondary);

        const row = new ActionRowBuilder()
            .addComponents(acceptButton, rejectButton, deleteButton);

        const suggestionMessage = await suggestChannel.send({ embeds: [embed], components: [row] });
        await suggestionMessage.react('✅');
        await suggestionMessage.react('⛔');

        message.reply('Votre suggestion a été envoyée avec succès !');
    },
};