const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'guildMemberRemove',
    async execute(member, client) {
        const guildId = member.guild.id;
        const logChannelId = await client.db.get(`joinleavelogs_${guildId}`);

        if (!logChannelId) return;

        const logChannel = member.guild.channels.cache.get(logChannelId);
        if (!logChannel) return;

        const embed = new EmbedBuilder()
            .setColor(client.colors.red)
            .setTitle('Membre quitté !')
            .setDescription(`${member} (\`${member.id}\`) vient de quitter le serveur !\nNous sommes maintenant **${member.guild.memberCount}** membres !`)
            .setFooter(client.footer)
            .setTimestamp();

        logChannel.send({ embeds: [embed] });
    },
};