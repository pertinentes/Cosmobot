const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'stats',
    description: 'Affiche les statistiques du serveur',
    usage: 'stats',
    aliases: ['serverstats', 'serverinfo'],
    cooldown: 5,
    perm: ['public'],
    async execute(client, message, args) {
        const guild = message.guild;
        if (!guild) return message.reply("Cette commande ne peut être utilisée que dans un serveur.");

        const totalMembers = guild.memberCount;
        const onlineMembers = guild.members.cache.filter(member => member.presence && member.presence.status !== 'offline').size;
        const voiceMembers = guild.members.cache.filter(member => member.voice.channel).size;
        const boostCount = guild.premiumSubscriptionCount;

        const embed = new EmbedBuilder()
            .setColor(client.colors.blue)
            .setTitle('**__' + guild.name + '〃Statistiques__**')
            .setDescription(
                `Membre: **${totalMembers}**\n` +
                `En ligne: **${onlineMembers}**\n` +
                `En vocal: **${voiceMembers}**\n` +
                `Boost: **${boostCount}**`
            )
            .setFooter(client.footer)
            .setTimestamp();

        message.reply({ embeds: [embed] });
    },
};