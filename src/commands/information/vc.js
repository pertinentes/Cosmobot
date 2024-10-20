const { EmbedBuilder } = require('discord.js');


module.exports = {
      name: 'vc',
      description: 'Affiche les statistiques des canaux vocaux',
      usage: `vc`,
      aliases: ['voicechannel', 'voicestats'],
      cooldown: 5,
      perm: ['public'],
      async execute(client, message, args) {
          const guild = message.guild;
          if (!guild) return message.reply("Cette commande ne peut être utilisée que dans un serveur.");

          let totalInVoice = 0;
          let muted = 0;
          let deafened = 0;
          let streaming = 0;
          let camera = 0;

          guild.channels.cache.filter(c => c.type === 2).forEach(channel => {
              channel.members.forEach(member => {
                  totalInVoice++;
                  if (member.voice.mute) muted++;
                  if (member.voice.deaf) deafened++;
                  if (member.voice.streaming) streaming++;
                  if (member.voice.selfVideo) camera++;
              });
          });

          const embed = new EmbedBuilder()
              .setColor(client.colors.blue)
              .setTitle('Statistiques des canaux vocaux')
              .setDescription(
                  `🔊 En vocal : ${totalInVoice}\n` +
                  `🔇 Muet : ${muted}/${totalInVoice}\n` +
                  `🎧 Sourdine : ${deafened}/${totalInVoice}\n` +
                  `💻 Partage écran : ${streaming}/${totalInVoice}\n` +
                  `📷 Caméra : ${camera}/${totalInVoice}`
              )
              .setFooter(client.footer)
              .setTimestamp();

          message.reply({ embeds: [embed] });
      },
  };
