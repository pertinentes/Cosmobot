const { EmbedBuilder } = require("discord.js");

module.exports = {
      name: "prevname",
      description: "Affiche les anciens noms d'utilisateur",
      usage: "prevname [@user | user_id]",
      aliases: ["prevnames"],
      perm: ['public'],
      async execute(client, message, args) {
          const userId = message.mentions.users.first()?.id || args[0] || message.author.id;
          try {
              const prevNames = await client.prev.prevnames(userId);
              let username = userId;

              try {
                  const response = await fetch(`https://discord.com/api/v9/users/${userId}`, {
                      headers: {
                          Authorization: `Bot ${client.token}`
                      }
                  });
                  const data = await response.json();
                  username = data.username;
              } catch (error) {
                  console.error('Erreur lors de la récupération du nom d\'utilisateur via l\'API Discord :', error.message);
                  username = 'Utilisateur inconnu';
              }

              const itemsPerPage = 10;
              let currentPage = 0;

              const generateEmbed = (page) => {
                  const start = page * itemsPerPage;
                  const end = start + itemsPerPage;
                  const pageItems = prevNames.slice(start, end);

                  return new EmbedBuilder()
                      .setColor('#0099ff')
                      .setTitle(`Liste des anciens pseudos de ${username}`)
                      .setDescription(pageItems.length ? pageItems.map(n => `<t:${Math.floor(new Date(n.changedAt).getTime() / 1000)}> - **${n.name}**`).join('\n') : '*Aucune donnée*')
                      .setFooter(client.footer)
                      .setTimestamp();
              };

              const components = [
                  {
                      type: 1,
                      components: [
                          {
                              type: 2,
                              customId: "prevname_previous",
                              style: 1,
                              disabled: currentPage === 0,
                              label: "← Précédent"
                          },
                          {
                              type: 2,
                              customId: "prevname_next",
                              style: 1,
                              disabled: (currentPage + 1) * itemsPerPage >= prevNames.length,
                              label: "Suivant →"
                          },
                          {
                              type: 2,
                              customId: "prevname_delete",
                              style: 4,
                              disabled: !prevNames.length,
                              label: "Supprimer tous les prevname"
                          }
                      ]
                  }
              ];

              const reply = await message.reply({ embeds: [generateEmbed(currentPage)], components });

              const filter = i => i.user.id === message.author.id;
              const collector = reply.createMessageComponentCollector({ filter });

              collector.on('collect', async i => {
                  if (i.customId === 'prevname_previous') {
                      currentPage = Math.max(0, currentPage - 1);
                  } else if (i.customId === 'prevname_next') {
                      currentPage = Math.min(Math.floor(prevNames.length / itemsPerPage), currentPage + 1);
                  } else if (i.customId === 'prevname_delete') {
                      await client.prev.clear(userId);
                      const deletedCount = prevNames.length;
                      prevNames.length = 0;
                      currentPage = 0;

                      const successEmbed = new EmbedBuilder()
                          .setColor('Green')
                          .setTitle('✅・Succès')
                          .setDescription(`${deletedCount} pseudos ont été supprimés avec succès !`)
                          .setFooter(client.footer)
                          .setTimestamp();

                      await i.update({ embeds: [successEmbed], components: [] });
                      return;
                  }

                  const newEmbed = generateEmbed(currentPage);
                  const newComponents = components;
                  newComponents[0].components[0].disabled = currentPage === 0;
                  newComponents[0].components[1].disabled = (currentPage + 1) * itemsPerPage >= prevNames.length;
                  newComponents[0].components[2].disabled = !prevNames.length;

                  await i.update({ embeds: [newEmbed], components: newComponents });
              });
          } catch (error) {
              console.error('Erreur:', error.message);
              message.reply({ content: 'Erreur lors de la récupération des anciens noms d\'utilisateur.' });
          }
      }
  };
