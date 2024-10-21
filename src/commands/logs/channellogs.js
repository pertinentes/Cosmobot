  const { EmbedBuilder } = require('discord.js');

  module.exports = {
      name: 'channellogs',
      description: 'Configure le salon pour les logs de canaux',
      usage: 'channellogs [salon/off]',
      cooldown: 5,
      aliases: ["channellog"],
      perm: ['owner', '8'],
      async execute(client, message, args) {
          const guildId = message.guild.id;

          if (!args[0]) {
              return message.reply({
                  embeds: [
                      new EmbedBuilder()
                          .setColor(client.colors.red)
                          .setTitle('⛔・Erreur')
                          .setDescription(`${message.author}, merci d'utiliser correctement la commande !\n **Utilisation:** \`${client.prefix}channellogs [salon/off]\``)
                          .setFooter(client.footer)
                          .setTimestamp()
                  ]
              });
          }

          if (args[0] === 'off') {
              await client.db.delete(`channellogs_${guildId}`);
              return message.reply({
                  embeds: [
                      new EmbedBuilder()
                          .setColor(client.colors.green)
                          .setTitle('Logs des canaux')
                          .setDescription(`${message.author}, les logs des canaux ont été désactivés !`)
                          .setFooter(client.footer)
                          .setTimestamp()
                  ]
              });
          }

          const channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[0]);

          if (!channel) {
              return message.reply({
                  embeds: [
                      new EmbedBuilder()
                          .setColor(client.colors.red)
                          .setTitle('⛔・Erreur')
                          .setDescription(`${message.author}, le salon spécifié est invalide !`)
                          .setFooter(client.footer)
                          .setTimestamp()
                  ]
              });
          }

          const currentChannel = await client.db.get(`channellogs_${guildId}`);

          if (currentChannel === channel.id) {
              return message.reply({
                  embeds: [
                      new EmbedBuilder()
                          .setColor(client.colors.red)
                          .setTitle('⛔・Erreur')
                          .setDescription(`${message.author}, les logs des canaux sont déjà définis sur ce salon !`)
                          .setFooter(client.footer)
                          .setTimestamp()
                  ]
              });
          }

          await client.db.set(`channellogs_${guildId}`, channel.id);

          return message.reply({
              embeds: [
                  new EmbedBuilder()
                      .setColor(client.colors.green)
                      .setTitle('Logs des canaux')
                      .setDescription(`${message.author}, les logs des canaux ont été définis sur le salon ${channel} !`)
                      .setFooter(client.footer)
                      .setTimestamp()
              ]
          });
      },
  };