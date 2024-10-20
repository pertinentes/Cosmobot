  const { EmbedBuilder, PermissionsBitField } = require('discord.js');
  const ms = require('ms');

  module.exports = {
      name: 'mute',
      description: 'Mute temporairement un utilisateur',
      usage: 'mute [utilisateur] [durée] (raison)',
      aliases: ['timeout'],
      cooldown: 5,
      perm: ['4'],
      async execute(client, message, args) {
          const errorem = new EmbedBuilder()
              .setColor(client.colors.blue)
              .setTitle('⛔・Erreur')
              .setDescription(`${message.author}, merci d'utiliser correctement la commande !\n **Utilisation:** \`${client.config.prefix}mute [utilisateur] [durée] (raison)\``)
              .setFooter(client.footer)
              .setTimestamp();

          if (!message.member.permissions.has(PermissionsBitField.Flags.ModerateMembers)) {
              return message.reply("Vous n'avez pas la permission d'utiliser cette commande.");
          }

          if (args.length < 2) {
              return message.reply({ embeds: [errorem] });
          }

          const target = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
          if (!target) {
              return message.reply({ embeds: [errorem] });
          }

          if (message.member.roles.highest.position <= target.roles.highest.position) {
              return message.reply("Vous ne pouvez pas mute cet utilisateur car son rôle est supérieur ou égal au vôtre.");
          }

          const duration = ms(args[1]);
          if (!duration || isNaN(duration) || duration > 28 * 24 * 60 * 60 * 1000) {
              return message.reply("La durée n'est pas valide ou dépasse 28 jours !");
          }

          const reason = args.slice(2).join(' ') || 'Aucune raison spécifiée';

          try {
              await target.timeout(duration, reason);
              const muteEmbed = new EmbedBuilder()
                  .setColor(client.colors.blue)
                  .setTitle('Mute')
                  .setDescription(`${target} a été mute temporairement par ${message.author} pour la raison suivante : **${reason}**\nDurée : ${ms(duration, { long: true })}`)
                  .setFooter(client.footer)
                  .setTimestamp();

              message.reply({ embeds: [muteEmbed] });
          } catch (error) {
              console.error(error);
              message.reply("Impossible de mute cet utilisateur. Vérifiez que j'ai les permissions nécessaires et que le rôle de l'utilisateur n'est pas supérieur au mien.");
          }
      },
  };
