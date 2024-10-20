const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'userUpdate',
    async execute(client, oldUser, newUser) {
        if (oldUser.username !== newUser.username || oldUser.displayName !== newUser.displayName) {
            try {
                const data = {
                    user_id: newUser.id,
                    username: newUser.username,
                    name: newUser.displayName,
                    changedAt: new Date().toISOString(),
                };
                await client.prev.save(data);
            } catch (error) {
                console.error(error);
            }
        }
    },
};
0