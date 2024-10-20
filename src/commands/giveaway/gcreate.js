  const { EmbedBuilder } = require('discord.js');
  const ms = require('ms')
  const config = require('../../../config');

  module.exports = {
      name: 'gcreate',
      description: 'Crée un nouveau giveaway',
      usage: 'gcreate [DURÉE] [NB GAGNANTS] [PRIX] [EMOJI]',
      aliases: ['giveaway-create', 'create-giveaway'],
      cooldown: 5,
      perm: ['giveaway'],
      async execute(client, message, args) {
          if (args.length < 4) {
              const errorEmbed = new EmbedBuilder()
                  .setColor(client.colors.red)
                  .setTitle('⛔・Erreur')
                  .setDescription(`${message.author}, merci d'utiliser correctement la commande !\n **Utilisation:** \`${client.config.prefix}${this.name} ${this.usage}\``)
                  .setFooter(client.footer)
                  .setTimestamp();

              return message.reply({ embeds: [errorEmbed] });
          }

          const duration = ms(args[0]);
          const winnerCount = parseInt(args[1]);
          const prize = args.slice(2, -1).join(' ');
          const emoji = args[args.length - 1];

          if (!duration || isNaN(winnerCount) || winnerCount < 1) {
              return message.reply('Format invalide. Veuillez vérifier la durée et le nombre de gagnants.');
          }

          client.giveawaysManager.start(message.channel, {
              duration: duration,
              winnerCount,
              prize,
              hostedBy: message.author,
              reaction: emoji.match(/\p{Emoji}/u) ? emoji : '🎉',
              messages: {
                  giveaway: `${emoji} **GIVEAWAY** ${emoji}`,
                  giveawayEnded: `${emoji} **GIVEAWAY TERMINÉ** ${emoji}`,
                  timeRemaining: 'Temps restant: **{duration}**!',
                  inviteToParticipate: `Réagis avec ${emoji} pour participer au giveaway!`,
                  winMessage: 'Félicitations, {winners}! Tu as gagné **{prize}**!',
                  embedFooter: 'Terminé le',
                  noWinner: 'Giveaway annulé, aucune participation valide.',
                  hostedBy: 'Organisé par: {this.hostedBy}',
                  winners: 'Gagnant(s)',
                  endedAt: 'Terminé à',
                  units: {
                      seconds: 'secondes',
                      minutes: 'minutes',
                      hours: 'heures',
                      days: 'jours',
                      pluralS: false
                  }
              },
              exemptMembers: () => false,
              lastChance: {
                  enabled: false,
                  content: '⚠️ **DERNIÈRE CHANCE DE PARTICIPER !** ⚠️',
                  threshold: 5000,
                  embedColor: '#FF0000'
              }
          });
      },
  };
