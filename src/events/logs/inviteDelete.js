const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'inviteDelete',
    async execute(client, invite) {
        const guildId = invite.guild.id;
        const logChannelId = await client.db.get(`invitelogs_${guildId}`);

        if (!logChannelId) return;

        const logChannel = invite.guild.channels.cache.get(logChannelId);
        if (!logChannel) return;

        const inviteCreator = invite.inviter;
        const inviteChannel = invite.channel;

        const embed = new EmbedBuilder()
            .setColor(client.colors.red)
            .setTitle('Invitation supprimée')
            .setDescription(`Une invitation créée par <@${inviteCreator.id}> (\`${inviteCreator.id}\`) dans le salon <#${inviteChannel.id}> (\`${inviteChannel.id}\`) a été supprimée

    Code: ${invite.code}
    Utilisations: ${invite.uses}`)
            .setFooter(client.footer)
            .setTimestamp();

        await logChannel.send({ embeds: [embed] });
    },
};