module.exports = {
      name: "messageCreate",
      async execute(client, message) {
          if (message.author.bot) return;

          const afkUser = client.db.get(`afk_${message.author.id}_${message.guild.id}`);

          if (afkUser) {
              client.db.delete(`afk_${message.author.id}_${message.guild.id}`);
              await message.reply('Le statut d\'AFK a été désactivé !');
          }
      
          const mentionedUsers = message.mentions.users;
          if (mentionedUsers.size > 0) {
              for (const [userId, user] of mentionedUsers) {
                  const mentionedAFK = client.db.get(`afk_${userId}_${message.guild.id}`);
                  if (mentionedAFK) {
                      await message.reply(`${user.username} est actuellement AFK: ${mentionedAFK}`);
                  }
              }
          }
      },
  };