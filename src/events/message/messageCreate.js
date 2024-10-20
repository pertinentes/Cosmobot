const Discord = require('discord.js');

module.exports = {
    name: 'messageCreate',
    async execute(client, message) {
        if (message.author.bot) return;
        const guildId = message.guildId;
        const prefix = client.db.get(`prefix_${guildId}`) || client.config.prefix;

        const mentionRegex = new RegExp(`^<@!?${client.user.id}>( |)`);
        if (message.content.match(mentionRegex)) {
            return message.reply(`Mon préfixe est \`${prefix}\``);
        }

        const roleMention = /<@&\d+>/;
        if (roleMention.test(message.content)) {
            return;
        }

        if (!message.content.startsWith(prefix)) return;

        const args = message.content.slice(prefix.length).trim().split(/ +/);
        const commandName = args.shift().toLowerCase();

        const command = client.commands.get(commandName) || client.commands.get(client.aliases.get(commandName));

        if (!command) return;

        const member = message.member;
        const guild = message.guild;

        const checkPermission = (permKey) => {
            const roleId = client.db.get(`${permKey}_${guildId}`);
            return roleId && member.roles.cache.has(roleId);
        };

        const hasPermission = (perms) => {
            if (!perms) return true;
            if (perms.includes('public')) return true;
            if (client.db.get(`owners_${message.author.id}`)) return true;
            for (const perm of perms) {
                if (perm === 'owner' && client.db.get(`owners_${message.author.id}`)) return true;
                if (checkPermission(perm)) return true;
            }
            return false;
        };

        const permsFromDB = client.db.get(`permissions_${guildId}_${command.name}`);
        const permsToCheck = permsFromDB ? permsFromDB.split(',') : command.perm;

        if (!hasPermission(permsToCheck)) {
            return;
        }

        const { cooldowns } = client;

        if (!cooldowns.has(command.name)) {
            cooldowns.set(command.name, new Discord.Collection());
        }

        const now = Date.now();
        const timestamps = cooldowns.get(command.name);
        const cooldownAmount = (command.cooldown || 3) * 1000;

        if (timestamps.has(message.author.id)) {
            const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

            if (now < expirationTime) {
                const timeLeft = (expirationTime - now) / 1000;
                return message.reply(`Merci d'attendre ${timeLeft.toFixed(1)} seconde(s) avant de réutiliser la commande \`${command.name}\`.`);
            }
        }

        timestamps.set(message.author.id, now);
        setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

        try {
            await command.execute(client, message, args, prefix);
        } catch (error) {
            console.error(error);
        }
    },
};