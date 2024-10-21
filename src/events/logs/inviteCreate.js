const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'inviteCreate',
    async execute(client, invite) {
        const guildId = invite.guild.id;
        const logChannelId = await client.db.get(`invitelogs_${guildId}`);

        if (!logChannelId) return;

        const logChannel = invite.guild.channels.cache.get(logChannelId);
        if (!logChannel) return;

        const inviteCreator = invite.inviter;
        const inviteChannel = invite.channel;

        const embed = new EmbedBuilder()
            .setColor(client.colors.blue)
            .setTitle('Invitation créée')
            .setDescription(`<@${inviteCreator.id}> (\`${inviteCreator.id}\`) a créé une invitation à partir du salon <#${inviteChannel.id}> (\`${inviteChannel.id}\`)

    Url: ${invite.url}
    Utilisation maximale: ${invite.maxUses ? invite.maxUses : 'Illimité'}
    Temps d'utilisation: <t:${Math.floor(invite.expiresAt ? invite.expiresAt.getTime() / 1000 : Date.now() / 1000 + 86400)}:R>`)
            .setFooter(client.footer)
            .setTimestamp();

        await logChannel.send({ embeds: [embed] });
    },
};