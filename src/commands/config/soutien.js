  const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, RoleSelectMenuBuilder } = require('discord.js');

  module.exports = {
      name: 'soutien',
      description: 'Configure le système de soutien',
      usage: 'soutien',
      cooldown: 5,
      perm: ['perm7'],
      async execute(client, message, args) {
          const guildId = message.guild.id;
          const db = await client.db.get(`soutien_${guildId}`) || {
              status: false,
              role: null,
              vanity: null
          };

          const embed = new EmbedBuilder()
              .setColor(client.colors.blue)
              .setTitle('Paramètre Soutien')
              .addFields(
                  { name: 'Rôle soutien', value: db.role ? `<@&${db.role}>` : 'Non défini', inline: true },
                  { name: 'Vanity', value: db.vanity || 'Non défini', inline: true },
                  { name: 'Module', value: db.status ? 'Activé' : 'Désactivé', inline: true }
              )
              .setFooter(client.footer)
              .setTimestamp();

          const row = new ActionRowBuilder()
              .addComponents(
                  new ButtonBuilder()
                      .setCustomId('rolesoutien')
                      .setLabel('Rôle')
                      .setStyle(ButtonStyle.Primary),
                  new ButtonBuilder()
                      .setCustomId('vanitysoutien')
                      .setLabel('Vanity')
                      .setStyle(ButtonStyle.Primary),
                  new ButtonBuilder()
                      .setCustomId('activatesoutien')
                      .setLabel(db.status ? 'Désactiver' : 'Activer')
                      .setStyle(db.status ? ButtonStyle.Danger : ButtonStyle.Success)
              );

          const msg = await message.reply({ embeds: [embed], components: [row] });

          const filter = i => i.user.id === message.author.id;
          const collector = msg.createMessageComponentCollector({ filter, time: 60000 });

          collector.on('collect', async interaction => {
              if (interaction.customId === 'rolesoutien') {
                  const roleMenu = new ActionRowBuilder()
                      .addComponents(
                          new RoleSelectMenuBuilder()
                              .setCustomId('selectSoutienRole')
                              .setPlaceholder('Sélectionnez un rôle')
                      );

                  await interaction.update({ components: [roleMenu] });

                  const roleCollector = interaction.channel.createMessageComponentCollector({ filter, time: 30000 });

                  roleCollector.on('collect', async i => {
                      if (i.customId === 'selectSoutienRole') {
                          const selectedRole = i.values[0];
                          db.role = selectedRole;
                          await client.db.set(`soutien_${guildId}`, db);
                          const updatedEmbed = new EmbedBuilder()
                              .setColor(client.colors.blue)
                              .setTitle('Paramètre Soutien')
                              .addFields(
                                  { name: 'Rôle soutien', value: `<@&${selectedRole}>`, inline: true },
                                  { name: 'Vanity', value: db.vanity || 'Non défini', inline: true },
                                  { name: 'Module', value: db.status ? 'Activé' : 'Désactivé', inline: true }
                              )
                              .setFooter(client.footer)
                              .setTimestamp();

                          await i.update({ embeds: [updatedEmbed], components: [row] });
                          roleCollector.stop();
                      }
                  });
              } else if (interaction.customId === 'vanitysoutien') {
                  await interaction.update({ content: 'Veuillez envoyer la vanity de soutien:', embeds: [], components: [] });

                  const messageFilter = m => m.author.id === message.author.id;
                  const messageCollector = interaction.channel.createMessageCollector({ filter: messageFilter, max: 1 });

                  messageCollector.on('collect', async m => {
                      db.vanity = m.content;
                      await client.db.set(`soutien_${guildId}`, db);
                      await m.delete();
                      const updatedEmbed = new EmbedBuilder()
                          .setColor(client.colors.blue)
                          .setTitle('Paramètre Soutien')
                          .addFields(
                              { name: 'Rôle soutien', value: db.role ? `<@&${db.role}>` : 'Non défini', inline: true },
                              { name: 'Vanity', value: m.content, inline: true },
                              { name: 'Module', value: db.status ? 'Activé' : 'Désactivé', inline: true }
                          )
                          .setFooter(client.footer)
                          .setTimestamp();
                      await interaction.editReply({ content: null, embeds: [updatedEmbed], components: [row] });
                  });
              } else if (interaction.customId === 'activatesoutien') {
                  db.status = !db.status;
                  await client.db.set(`soutien_${guildId}`, db);
                  const updatedEmbed = new EmbedBuilder()
                      .setColor(client.colors.blue)
                      .setTitle('Paramètre Soutien')
                      .addFields(
                          { name: 'Rôle soutien', value: db.role ? `<@&${db.role}>` : 'Non défini', inline: true },
                          { name: 'Vanity', value: db.vanity || 'Non défini', inline: true },
                          { name: 'Module', value: db.status ? 'Activé' : 'Désactivé', inline: true }
                      )
                      .setFooter(client.footer)
                      .setTimestamp();
                  await interaction.update({ embeds: [updatedEmbed], components: [row] });
              }
          });

          collector.on('end', () => {
              msg.edit({ components: [] });
          });
      },
  };
