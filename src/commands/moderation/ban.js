const { EmbedBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
    name: 'ban',
    description: 'Bannir un utilisateur du serveur',
    usage: 'ban [utilisateur] (raison)',
    cooldown: 5,
    perm: ['4'],
    async execute(client, message, args) {
        const errorem = new EmbedBuilder()
            .setColor(client.colors.red)
            .setTitle('⛔・Erreur')
            .setDescription(`${message.author}, merci d'utiliser correctement la commande !\n **Utilisation:** \`${client.config.prefix}ban [utilisateur] (raison)\``)
            .setFooter(client.footer)
            .setTimestamp();
        let target;
        let reason = 'Aucune raison spécifiée';

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
            return message.reply("Vous ne pouvez pas bannir cet utilisateur car son rôle est supérieur ou égal au vôtre.");
        }

        if (args.length >= 2) {
            reason = args.slice(1).join(' ');
        }

        try {
            await target.ban({ reason: reason });
            const banEmbed = new EmbedBuilder()
                .setColor(client.colors.blue)
                .setTitle('Membre Banni !')
                .setDescription(`Membre : ${target} \nBanni par : ${message.author} \nRaison : ${reason}`)
                .setFooter(client.footer)
                .setTimestamp();

            message.reply({ embeds: [banEmbed] });

            const logChannel = await client.db.get(`banlogs_${message.guild.id}`);
            if (logChannel) {
                const channel = message.guild.channels.cache.get(logChannel);
                if (channel) {
                    const logEmbed = new EmbedBuilder()
                        .setColor(client.colors.blue)
                        .setTitle(':InoxBan1: ‣ LOGS | Membres Bannis')
                        .setDescription(`Information de l'utilisateur:\n > **Membre: ${target}** \n > **ID: ${target.id}**\n > **Auteur: ${message.author.tag}**`)
                        .setThumbnail(target.user.displayAvatarURL({ dynamic: true }))
                        .setFooter(client.footer)
                        .setTimestamp();
                
                    channel.send({ embeds: [logEmbed] });
                }
            }
        } catch (error) {
            console.error(error);
            message.reply("Impossible de bannir cet utilisateur. Vérifiez que j'ai les permissions nécessaires et que le rôle de l'utilisateur n'est pas supérieur au mien.");
        }
    },
};
