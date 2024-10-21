
const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'logs',
    description: 'Affiche les logs actifs ou non',
    usage: 'logs',
    cooldown: 5,
    perm: ['owner', '8'],
    async execute(client, message, args) {
        const guildId = message.guild.id;

        const logChannels = [
            { name: 'Ban-Unban', dbKey: 'banlogs' },
            { name: 'Bot', dbKey: 'botlogs' },
            { name: 'Salon', dbKey: 'channellogs' },
            { name: 'Message', dbKey: 'messagelogs' },
            { name: 'Rôle', dbKey: 'rolelogs' },
            { name: 'Boost', dbKey: 'boostlogs' },
            { name: 'Joinleave', dbKey: 'joinleavelogs' },
            { name: 'Emoji', dbKey: 'botlogs' },
            { name: 'Vocal', dbKey: 'voicelogs' },
            { name: 'AntiRaid', dbKey: 'antiraidlogs' },
            { name: 'Mods', dbKey: 'modlogs' },
            { name: 'Invitations', dbKey: 'invitelogs' },
            { name: 'Ticket', dbKey: 'ticketlogs' }
        ];

        let description = '';

        for (const channel of logChannels) {
            const channelId = await client.db.get(`${channel.dbKey}_${guildId}`);
            const channelStatus = channelId ? `<#${channelId}>` : 'Indéfini';
            description += `**${channel.name}** : ${channelStatus}\n`;
        }

        const embed = new EmbedBuilder()
            .setColor(client.colors.blue)
            .setTitle('📚 Logs')
            .setDescription(description)
            .setFooter(client.footer)
            .setTimestamp();

        return message.reply({ embeds: [embed] });
    },
};
