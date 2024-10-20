const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const os = require('os');

module.exports = {
    name: 'botinfo',
    description: 'Affiche les informations détaillées sur le bot',
    usage: `botinfo`,
    aliases: ['bi', 'infobot'],
    cooldown: 5,
    perm: ['public'],
    async execute(client, message, args) {
        const totalMemory = os.totalmem() / (1024 * 1024);
        const usedMemory = process.memoryUsage().heapUsed / (1024 * 1024);
        const cpuUsage = os.loadavg()[0];

        const embed = new EmbedBuilder()
            .setColor(client.colors.blue)
            .setTitle('🤖 **Détails du Bot et du Système** 🖥️')
            .setDescription(`**🔧 Informations générales :**
- **Nom du bot :** ${client.user.username}
- **Serveurs :** ${client.guilds.cache.size}
- **Utilisateurs :** ${client.users.cache.size}
- **Salons :** ${client.channels.cache.size}
- **Latence API :** ${client.ws.ping}ms
- **Développeur :** <@>

**💻 Détails système :**
- **RAM utilisée :** ${usedMemory.toFixed(2)} MB / ${totalMemory.toFixed(2)} MB
- **Processeur :** ${os.cpus()[0].model}
- **Utilisation CPU :** ${cpuUsage.toFixed(2)}%
- **Plateforme :** ${os.platform()} (${os.arch()})
- **Version Node.js :** ${process.version}
- **Version Discord.js :** v${require('discord.js').version}`)
            .setThumbnail(client.user.displayAvatarURL())
            .setFooter(client.footer)
            .setTimestamp();

        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setStyle(ButtonStyle.Link)
                    .setURL(`https://discord.com/oauth2/authorize?client_id=${client.user.id}&permissions=8&scope=bot`)
                    .setLabel('Inviter Moi'),
                new ButtonBuilder()
                    .setStyle(ButtonStyle.Link)
                    .setURL('https://discord.gg/gestion')
                    .setLabel('Support')
            );

        await message.reply({ embeds: [embed], components: [row] });
    },
};
 