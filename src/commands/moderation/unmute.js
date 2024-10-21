const { EmbedBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
    name: 'unmute',
    description: 'Retire le mute d\'un utilisateur',
    usage: 'unmute [utilisateur]',
    aliases: ['untimeout'],
    cooldown: 5,
    perm: ['4'],
    async execute(client, message, args) {
        const errorem = new EmbedBuilder()
            .setColor(client.colors.blue)
            .setTitle('⛔・Erreur')
            .setDescription(`${message.author}, merci d'utiliser correctement la commande !\n **Utilisation:** \`${client.config.prefix}unmute [utilisateur]\``)
            .setFooter(client.footer)
            .setTimestamp();
        let target;
        if (message.reference && message.reference.messageId) {
            const repliedMessage = await message.channel.messages.fetch(message.reference.messageId);
            target = repliedMessage.author;
        } else if (args.length > 0) {
            target = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        }

        if (!target) {
            return message.reply({ embeds: [errorem] });
        }

        if (message.member.roles.highest.position <= target.roles.highest.position) {
            return message.reply("Vous ne pouvez pas unmute cet utilisateur car son rôle est supérieur ou égal au vôtre.");
        }

        try {
            if (!target.isCommunicationDisabled()) {
                return message.reply(`${target} n'est pas actuellement mute.`);
            }

            await target.timeout(null);
            message.reply({ content: `${target} a été unmute avec succès.` });

            const logChannel = await client.db.get(`modlogs_${message.guild.id}`);
            if (logChannel) {
                const channel = message.guild.channels.cache.get(logChannel);
                if (channel) {
                    const logEmbed = new EmbedBuilder()
                        .setColor(client.colors.blue)
                        .setTitle('Unmute')
                        .setDescription(`${message.author} a retiré le mute de ${target}`)
                        .setFooter(client.footer)
                        .setTimestamp();
                
                    channel.send({ embeds: [logEmbed] });
                }
            }
        } catch (error) {
            console.error(error);
            message.reply("Le bot ne peut pas retirer le mute de ce membre.");
        }
    },
};
