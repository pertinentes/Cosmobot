const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'guildMemberUpdate',
    async execute(oldMember, newMember, client) {
        if (!oldMember.premiumSince && newMember.premiumSince) {
            const guildId = newMember.guild.id;
            const logChannelId = await client.db.get(`boostlogs_${guildId}`);

            if (!logChannelId) return;

            const logChannel = newMember.guild.channels.cache.get(logChannelId);
            if (!logChannel) return;

            const embed = new EmbedBuilder()
                .setColor(client.colors.pink)
                .setTitle('Nouveau boost !')
                .setDescription(`${newMember.user} (\`${newMember.user.id}\`) vient de booster le serveur !\nNous avons maintenant **${newMember.guild.premiumSubscriptionCount}** boost(s) !`)
                .setFooter(client.footer)
                .setTimestamp();

            logChannel.send({ embeds: [embed] });
        }
    },
};
