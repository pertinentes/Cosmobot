  const { EmbedBuilder } = require('discord.js');

  module.exports = {
      name: 'voiceStateUpdate',
      async execute(client, oldState, newState) {
          const guildId = newState.guild.id;
          const logChannelId = await client.db.get(`voicelogs_${guildId}`);

          if (!logChannelId) return;

          const logChannel = newState.guild.channels.cache.get(logChannelId);
          if (!logChannel) return;

          if (!oldState.channelId && newState.channelId) {
              const embed = new EmbedBuilder()
                  .setColor(client.colors.green)
                  .setDescription(`<@${newState.member.id}> s'est connecté à <#${newState.channelId}>`)
                  .setFooter(client.footer)
                  .setTimestamp();

              logChannel.send({ embeds: [embed] });
          } else if (oldState.channelId && !newState.channelId) {
              const embed = new EmbedBuilder()
                  .setColor(client.colors.red)
                  .setDescription(`<@${oldState.member.id}> s'est déconnecté de <#${oldState.channelId}>`)
                  .setFooter(client.footer)
                  .setTimestamp();

              logChannel.send({ embeds: [embed] });
          } else if (oldState.channelId !== newState.channelId) {
              const embed = new EmbedBuilder()
                  .setColor(client.colors.orange)
                  .setDescription(`<@${newState.member.id}> s'est déplacé de <#${oldState.channelId}> vers <#${newState.channelId}>`)
                  .setFooter(client.footer)
                  .setTimestamp();

              logChannel.send({ embeds: [embed] });
          }

          if (oldState.mute !== newState.mute) {
              const action = newState.mute ? "s'est mis en sourdine" : "a réactivé son micro";
              const embed = new EmbedBuilder()
                  .setColor(newState.mute ? client.colors.orange : client.colors.green)
                  .setDescription(`<@${newState.member.id}> ${action}`)
                  .setFooter(client.footer)
                  .setTimestamp();

              logChannel.send({ embeds: [embed] });
          }

          if (oldState.deaf !== newState.deaf) {
              const action = newState.deaf ? "a désactivé son casque" : "a réactivé son casque";
              const embed = new EmbedBuilder()
                  .setColor(newState.deaf ? client.colors.orange : client.colors.green)
                  .setDescription(`<@${newState.member.id}> ${action}`)
                  .setFooter(client.footer)
                  .setTimestamp();

              logChannel.send({ embeds: [embed] });
          }

          if (oldState.selfVideo !== newState.selfVideo) {
              const action = newState.selfVideo ? "a activé sa caméra" : "a désactivé sa caméra";
              const embed = new EmbedBuilder()
                  .setColor(newState.selfVideo ? client.colors.green : client.colors.orange)
                  .setDescription(`<@${newState.member.id}> ${action}`)
                  .setFooter(client.footer)
                  .setTimestamp();

              logChannel.send({ embeds: [embed] });
          }

          if (oldState.streaming !== newState.streaming) {
              const action = newState.streaming ? "a commencé un stream" : "a arrêté son stream";
              const embed = new EmbedBuilder()
                  .setColor(newState.streaming ? client.colors.green : client.colors.orange)
                  .setDescription(`<@${newState.member.id}> ${action}`)
                  .setFooter(client.footer)
                  .setTimestamp();

              logChannel.send({ embeds: [embed] });
          }
      },
  };
