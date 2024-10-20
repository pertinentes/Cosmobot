const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'confess',
    description: 'Permet de faire une confession',
    usage: `confess <confession>`,
    aliases: ['confession'],
    cooldown: 5,
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

        const confession = args.join(' ');
        const confessChannelId = await client.db.get(`confessChannel_${message.guild.id}`);

        if (!confessChannelId) {
            const errorEmbed = new EmbedBuilder()
                .setColor(client.colors.blue)
                .setTitle('⛔・Erreur')
                .setDescription(`${message.author}, le serveur n'a pas renseigné le salon des confessions ou il est invalide. Pour configurer ce salon, faites cette commande \`&setconfess [channel]\``)
                .setFooter(client.footer)
                .setTimestamp();
            return message.reply({ embeds: [errorEmbed] });
        }

        const confessChannel = message.guild.channels.cache.get(confessChannelId);

        if (!confessChannel) {
            const errorEmbed = new EmbedBuilder()
                .setColor(client.colors.blue)
                .setTitle('⛔・Erreur')
                .setDescription(`${message.author}, le salon des confessions configuré n'existe plus. Veuillez contacter un administrateur pour le reconfigurer avec \`&setconfess [channel]\``)
                .setFooter(client.footer)
                .setTimestamp();
            return message.reply({ embeds: [errorEmbed] });
        }

        const confessionCount = await client.db.get(`confessionCount_${message.guild.id}`) || 0;
        await client.db.set(`confessionCount_${message.guild.id}`, confessionCount + 1);

        const embed = new EmbedBuilder()
            .setColor(client.colors.blue)
            .setTitle(`Nouvelle Confession ! (#${confessionCount + 1})`)
            .setDescription(confession)
            .setFooter(client.footer)
            .setTimestamp();

        await confessChannel.send({ embeds: [embed] });

        await message.delete();
        
        const confirmEmbed = new EmbedBuilder()
            .setColor(client.colors.blue)
            .setDescription(`Votre confession a été transférée ici ${confessChannel}`)
            .setFooter(client.footer);

        try {
            await message.author.send({ embeds: [confirmEmbed] });
        } catch (error) {
            console.error("Couldn't send DM to user", error);
        }
    },
};
