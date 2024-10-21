const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'guildMemberRemove',
    async execute(member, client) {
        const guildId = member.guild.id;
        const logChannelId = await client.db.get(`botlogs_${guildId}`);

        if (!logChannelId) return;

        const logChannel = member.guild.channels.cache.get(logChannelId);
        if (!logChannel) return;

        if (member.user.bot) {
            const embed = new EmbedBuilder()
                .setColor(client.colors.red)
                .setTitle('Bot retiré !')
                .setDescription(`Le bot ${member} (\`${member.id}\`) vient d'être retiré du serveur !`)
                .setFooter(client.footer)
                .setTimestamp();

            logChannel.send({ embeds: [embed] });
        }
    },
};
