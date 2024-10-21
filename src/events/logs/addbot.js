const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'guildMemberAdd',
    async execute(member, client) {
        const guildId = member.guild.id;
        const logChannelId = await client.db.get(`botlogs_${guildId}`);

        if (!logChannelId) return;

        const logChannel = member.guild.channels.cache.get(logChannelId);
        if (!logChannel) return;

        if (member.user.bot) {
            const embed = new EmbedBuilder()
                .setColor(client.colors.blue)
                .setTitle('Bot ajouté !')
                .setDescription(`Le bot ${member} (\`${member.id}\`) vient d'être ajouté au serveur !`)
                .setFooter(client.footer)
                .setTimestamp();

            logChannel.send({ embeds: [embed] });
        }
    },
};
