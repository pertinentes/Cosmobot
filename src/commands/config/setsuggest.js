const { EmbedBuilder, ChannelType } = require('discord.js');
module.exports = {
      name: 'setsuggest',
      description: 'Permet de configurer le salon des suggestions',
      usage: `setsuggest [salon/off]`,
      cooldown: 5,
      perm: ['7'],
      async execute(client, message, args) {
          if (!args.length) {
              const errorEmbed = new EmbedBuilder()
                  .setColor(client.colors.blue)
                  .setTitle('⛔・Erreur')
                  .setDescription(`${message.author}, merci de bien utiliser la commande.\n **Utilisation:** \`&setsuggest [salon/off]\``)
                  .setFooter(client.footer)
                  .setTimestamp();
              return message.reply({ embeds: [errorEmbed] });
          }

          if (args[0] === 'off') {
              client.db.delete(`suggestChannel_${message.guild.id}`);
              const offEmbed = new EmbedBuilder()
                  .setColor(client.colors.blue)
                  .setTitle('⛔・Suggestions désactivé')
                  .setDescription(`${message.author}, le salon des suggestions a bien été désactivé !`)
                  .setFooter(client.footer)
                  .setTimestamp();
              return message.reply({ embeds: [offEmbed] });
          }

          const channel = message.guild.channels.cache.get(args[0]) || message.mentions.channels.first();

          if (!channel || channel.type !== ChannelType.GuildText) {
              const errorEmbed = new EmbedBuilder()
                  .setColor(client.colors.blue)
                  .setTitle('⛔・Erreur')
                  .setDescription(`${message.author}, merci de fournir un ID de salon textuel valide ou de mentionner un salon textuel !`)
                  .setFooter(client.footer)
                  .setTimestamp();
              return message.reply({ embeds: [errorEmbed] });
          }

          client.db.set(`suggestChannel_${message.guild.id}`, channel.id);

          const successEmbed = new EmbedBuilder()
              .setColor(client.colors.blue)
              .setTitle('✅・Suggestions activé')
              .setDescription(`${message.author}, le salon des suggestions a bien été activé ! Pour envoyer des suggestions, faîtes la commande \`&suggest [TEXT]\``)
              .setFooter(client.footer)
              .setTimestamp();
          message.reply({ embeds: [successEmbed] });
      },
  };