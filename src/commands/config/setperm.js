const { EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, ButtonBuilder, ButtonStyle, ChannelSelectMenuBuilder, ChannelType, ModalBuilder, TextInputBuilder, TextInputStyle, RoleSelectMenuBuilder } = require('discord.js');

module.exports = {
    name: 'setperm',
    description: 'Configure les permissions du bot',
    usage: `setperm`,
    cooldown: 5,
    perm: ['owner'],
    async execute(client, message, args) {

        const guildId = message.guild.id;

        const embed = new EmbedBuilder()
            .setColor(client.colors.blue)
            .setTitle('Permissions')
            .addFields(
                { name: 'Permissions 1', value: formatRoles(client.db.get(`perm1_${guildId}`) || []), inline: true },
                { name: 'Permissions 2', value: formatRoles(client.db.get(`perm2_${guildId}`) || []), inline: true },
                { name: 'Permissions 3', value: formatRoles(client.db.get(`perm3_${guildId}`) || []), inline: true },
                { name: 'Permissions 4', value: formatRoles(client.db.get(`perm4_${guildId}`) || []), inline: true },
                { name: 'Permissions 5', value: formatRoles(client.db.get(`perm5_${guildId}`) || []), inline: true },
                { name: 'Permissions 6', value: formatRoles(client.db.get(`perm6_${guildId}`) || []), inline: true },
                { name: 'Permissions 7', value: formatRoles(client.db.get(`perm7_${guildId}`) || []), inline: true },
                { name: 'Permissions 8', value: formatRoles(client.db.get(`perm8_${guildId}`) || []), inline: true },
                { name: 'Permissions Giveaways', value: formatRoles(client.db.get(`permgiveaway_${guildId}`) || []), inline: true },
                { name: 'Permissions Ticket', value: formatRoles(client.db.get(`permticket_${guildId}`) || []), inline: true }
            )
            .setFooter(client.footer)
            .setTimestamp();

        const row = new ActionRowBuilder()
            .addComponents(
                new StringSelectMenuBuilder()
                    .setCustomId('perm-menu')
                    .setPlaceholder('Choisissez une option')
                    .addOptions([
                        { label: 'Permissions 1', value: 'perm_1' },
                        { label: 'Permissions 2', value: 'perm_2' },
                        { label: 'Permissions 3', value: 'perm_3' },
                        { label: 'Permissions 4', value: 'perm_4' },
                        { label: 'Permissions 5', value: 'perm_5' },
                        { label: 'Permissions 6', value: 'perm_6' },
                        { label: 'Permissions 7', value: 'perm_7' },
                        { label: 'Permissions 8', value: 'perm_8' },
                        { label: 'Permissions giveaways', value: 'perm_giveaways' },
                        { label: 'Permissions ticket', value: 'perm_ticket' },
                    ])
            );

        const msg = await message.reply({ embeds: [embed], components: [row] });

        const filter = i => i.user.id === message.author.id;
        const collector = msg.createMessageComponentCollector({ filter, time: 300000 });

        collector.on('collect', async interaction => {
            if (interaction.isStringSelectMenu()) {
                const selectedValue = interaction.values[0];
                const permKey = selectedValue.replace('perm_', '');
                await permInteraction(interaction, client, guildId, permKey === 'giveaways' ? 'permgiveaway' : permKey === 'ticket' ? 'permticket' : `perm${permKey}`);
            }
        });

        collector.on('end', collected => {
            msg.edit({ components: [] });
        });
    },
};

function formatRoles(roles) {
    if (!Array.isArray(roles)) {
        roles = [];
    }
    return roles.map(roleId => `<@&${roleId}>`).join('\n') || "Aucune permission";
}

async function permInteraction(interaction, client, guildId, permKey) {
    try {
        const roleSelectMenu = new RoleSelectMenuBuilder()
            .setCustomId('select-role')
            .setPlaceholder('Sélectionnez un rôle');

        const actionRow = new ActionRowBuilder()
            .addComponents(roleSelectMenu);

        await interaction.update({ content: 'Veuillez choisir un rôle à attribuer à la permission.', embeds: [], components: [actionRow] });

        const filter = i => i.customId === 'select-role' && i.user.id === interaction.user.id;
        const collector = interaction.channel.createMessageComponentCollector({ filter, time: 60000 });

        collector.on('collect', async i => {
            const selectedRole = i.values[0];
            let currentRoles = client.db.get(`${permKey}_${guildId}`) || [];
            if (!Array.isArray(currentRoles)) {
                currentRoles = [];
            }
            if (currentRoles.length > 0) {
                currentRoles = [];
            }
            currentRoles.push(selectedRole);

            client.db.set(`${permKey}_${guildId}`, currentRoles);

            const embed = new EmbedBuilder()
                .setColor(client.colors.blue)
                .setTitle('Permissions')
                .addFields(
                    { name: 'Permissions 1', value: formatRoles(client.db.get(`perm1_${guildId}`) || []), inline: true },
                    { name: 'Permissions 2', value: formatRoles(client.db.get(`perm2_${guildId}`) || []), inline: true },
                    { name: 'Permissions 3', value: formatRoles(client.db.get(`perm3_${guildId}`) || []), inline: true },
                    { name: 'Permissions 4', value: formatRoles(client.db.get(`perm4_${guildId}`) || []), inline: true },
                    { name: 'Permissions 5', value: formatRoles(client.db.get(`perm5_${guildId}`) || []), inline: true },
                    { name: 'Permissions 6', value: formatRoles(client.db.get(`perm6_${guildId}`) || []), inline: true },
                    { name: 'Permissions 7', value: formatRoles(client.db.get(`perm7_${guildId}`) || []), inline: true },
                    { name: 'Permissions 8', value: formatRoles(client.db.get(`perm8_${guildId}`) || []), inline: true },
                    { name: 'Permissions Giveaways', value: formatRoles(client.db.get(`permgiveaway_${guildId}`) || []), inline: true },
                    { name: 'Permissions Ticket', value: formatRoles(client.db.get(`permticket_${guildId}`) || []), inline: true }
                )
                .setFooter(client.footer)
                .setTimestamp();

            const row = new ActionRowBuilder()
                .addComponents(
                    new StringSelectMenuBuilder()
                        .setCustomId('perm-menu')
                        .setPlaceholder('Choisissez une option')
                        .addOptions([
                            { label: 'Permissions 1', value: 'perm_1' },
                            { label: 'Permissions 2', value: 'perm_2' },
                            { label: 'Permissions 3', value: 'perm_3' },
                            { label: 'Permissions 4', value: 'perm_4' },
                            { label: 'Permissions 5', value: 'perm_5' },
                            { label: 'Permissions 6', value: 'perm_6' },
                            { label: 'Permissions 7', value: 'perm_7' },
                            { label: 'Permissions 8', value: 'perm_8' },
                            { label: 'Permissions giveaways', value: 'perm_giveaways' },
                            { label: 'Permissions ticket', value: 'perm_ticket' },
                        ])
                );

            await i.update({ content: null, embeds: [embed], components: [row] });
        });

        collector.on('end', collected => {
            if (collected.size === 0) {
                interaction.followUp({ content: 'Le temps est écoulé, aucun rôle n\'a été sélectionné.', components: [] });
            }
        });
    } catch (error) {
        console.error(error);
    }
}
