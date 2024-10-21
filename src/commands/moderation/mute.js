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
          let target;
          let duration = 27 * 24 * 60 * 60 * 1000;
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
              return message.reply("Vous ne pouvez pas mute cet utilisateur car son rôle est supérieur ou égal au vôtre.");
          }

          if (args.length >= 2) {
              const parsedDuration = ms(args[1]);
              if (parsedDuration && !isNaN(parsedDuration) && parsedDuration <= 28 * 24 * 60 * 60 * 1000) {
                  duration = parsedDuration;
              }
          }

          if (args.length >= 3) {
              reason = args.slice(2).join(' ');
          }

          try {
              await target.timeout(duration, reason);
              const muteEmbed = new EmbedBuilder()
                  .setColor(client.colors.blue)
                  .setTitle('Mute')
                  .setDescription(`${target} a été mute temporairement par ${message.author} pour la raison suivante : **${reason}**\nDurée : ${ms(duration, { long: true })}`)
                  .setFooter(client.footer)
                  .setTimestamp();

              message.reply({ embeds: [muteEmbed] });

              const logChannel = await client.db.get(`modlogs_${message.guild.id}`);
              if (logChannel) {
                  const channel = message.guild.channels.cache.get(logChannel);
                  if (channel) {
                      const logEmbed = new EmbedBuilder()
                          .setColor(client.colors.blue)
                          .setTitle('Mute')
                          .setDescription(`${target} a été mute temporairement par ${message.author} pour la raison suivante : **${reason}**\nDurée : ${ms(duration, { long: true })}`)
                          .setFooter(client.footer)
                          .setTimestamp();
                  
                      channel.send({ embeds: [logEmbed] });
                  }
              }
          } catch (error) {
              console.error(error);
              message.reply("Impossible de mute cet utilisateur. Vérifiez que j'ai les permissions nécessaires et que le rôle de l'utilisateur n'est pas supérieur au mien.");
          }
      },
  };