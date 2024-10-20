const { EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const fs = require('fs');
const path = require('path');
const config = require('../../../config');

module.exports = {
    name: 'help',
    description: 'Affiche la liste des commandes disponibles',
    usage: `help [commande]`,
    aliases: ['h', 'commands'],
    cooldown: 5,
    perm: ['public'],
    async execute(client, message, args) {
        if (args.length > 0) {
            const commandName = args[0].toLowerCase();
            const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

            if (!command) {
                return message.reply("Cette commande n'existe pas.");
            }

            const commandEmbed = new EmbedBuilder()
                .setColor(client.colors.blue)
                .setTitle(`Commande: ${command.name}`)
                .addFields(
                    { name: 'Description', value: command.description || 'Aucune description disponible', inline: false },
                    { name: 'Usage', value: command.usage ? `\`${client.config.prefix}${command.name} ${command.usage}\`` : 'Aucun usage spécifié', inline: false },
                    { name: 'Aliases', value: command.aliases ? command.aliases.join(', ') : 'Aucun alias', inline: false },
                    { name: 'Permissions', value: formatPermissions(command.perm) || 'Aucune permission spécifiée', inline: false }
                )
                .setFooter(client.footer)
                .setTimestamp();

            return message.reply({ embeds: [commandEmbed] });
        }

        const embed = new EmbedBuilder()
            .setColor(client.colors.blue)
            .setTitle('Sélectionnez une catégorie')
            .setDescription('Choisissez une catégorie ci-dessous pour voir les commandes disponibles.')
            .setFooter(client.footer)
            .setTimestamp();

        const categories = [
            { label: 'Général', value: 'general', emoji: '📋' },
            { label: 'Modération', value: 'moderation', emoji: '🚨' },
            { label: 'Information', value: 'information', emoji: 'ℹ️' },
            { label: 'Outils', value: 'tools', emoji: '🛠️' },
            { label: 'Divertissement', value: 'fun', emoji: '🎮' },
            { label: 'Musique', value: 'music', emoji: '🎵' },
            { label: 'Giveaway', value: 'giveaway', emoji: '🎉' },
            { label: 'Image', value: 'image', emoji: '📷' },
            { label: 'Configuration', value: 'config', emoji: '⚙️' },
            { label: 'Antiraid', value: 'antiraid', emoji: '🛡️' },
            { label: 'Backup', value: 'backup', emoji: '💾' },
            { label: 'Logs', value: 'logs', emoji: '📜' },
            { label: 'Tickets', value: 'tickets', emoji: '🎫' }
        ];

        const row = new ActionRowBuilder()
            .addComponents(
                new StringSelectMenuBuilder()
                    .setCustomId('select-category')
                    .setPlaceholder('Choisissez une catégorie')
                    .addOptions(categories)
            );

        const supportButton = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setStyle(ButtonStyle.Link)
                    .setURL(client.config.support)
                    .setLabel('Support')
            );

        const response = await message.reply({ embeds: [embed], components: [row, supportButton] });

        const filter = i => i.customId === 'select-category' && i.user.id === message.author.id;
        const collector = response.createMessageComponentCollector({ filter, time: 60000 });

        collector.on('collect', async interaction => {
            const selectedCategory = interaction.values[0];
            const categoryCommands = [];

            const categoryPath = path.join(__dirname, '..', '..', 'commands', selectedCategory);
            fs.readdirSync(categoryPath).filter(file => file.endsWith('.js')).forEach(file => {
                const command = require(path.join(categoryPath, file));
                categoryCommands.push(`- \`${command.name}\`\n┖ ${command.description}\n┖ Permissions: ${formatPermissions(command.perm)}`);
            });

            const categoryEmbed = new EmbedBuilder()
                .setColor(client.colors.blue)
                .setTitle(`${categories.find(c => c.value === selectedCategory).emoji} ${categories.find(c => c.value === selectedCategory).label}`)
                .setDescription(categoryCommands.join('\n\n'))
                .setFooter(client.footer)
                .setTimestamp();

            await interaction.update({ embeds: [categoryEmbed], components: [row, supportButton] });
        });

        collector.on('end', collected => {
            if (collected.size === 0) {
                response.edit({ components: [] });
            }
        });
    },
};

function formatPermissions(perms) {
    if (!perms) return 'Public';
    if (perms.includes('public')) return 'Public';
    return perms.map(perm => {
        if (perm === 'owner') return 'Owners';
        if (perm === 'giveaway') return 'Giveaway';
        if (perm === 'ticket') return 'Ticket';
        return `Perm ${perm}`;
    }).join(', ');
}