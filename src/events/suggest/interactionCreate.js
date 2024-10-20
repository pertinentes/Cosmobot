const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');

module.exports = {
    name: 'interactionCreate',
    async execute(client, interaction) {
        if (!interaction.isButton() && !interaction.isModalSubmit()) return;

        const action = interaction.customId;

        if (action === 'accept' || action === 'reject') {
            const message = interaction.message;
            const originalEmbed = message.embeds[0];
            
            if (!originalEmbed) {
                await interaction.reply({ content: 'Une erreur s\'est produite. L\'embed original n\'a pas été trouvé.', ephemeral: true });
                return;
            }

            const suggestion = originalEmbed.description;
            const author = originalEmbed.author;

            if (action === 'accept') {
                const modal = new ModalBuilder()
                    .setCustomId(`accept_modal`)
                    .setTitle('Accepter la suggestion');

                const reasonInput = new TextInputBuilder()
                    .setCustomId('reason')
                    .setLabel('Raison')
                    .setStyle(TextInputStyle.Paragraph)
                    .setRequired(false)
                    .setMaxLength(4000);

                const actionRow = new ActionRowBuilder().addComponents(reasonInput);
                modal.addComponents(actionRow);

                await interaction.showModal(modal);
            } else if (action === 'reject') {
                const modal = new ModalBuilder()
                    .setCustomId(`reject_modal`)
                    .setTitle('Refuser la suggestion');

                const reasonInput = new TextInputBuilder()
                    .setCustomId('reason')
                    .setLabel('Raison')
                    .setStyle(TextInputStyle.Paragraph)
                    .setRequired(false)
                    .setMaxLength(4000);

                const actionRow = new ActionRowBuilder().addComponents(reasonInput);
                modal.addComponents(actionRow);

                await interaction.showModal(modal);
            }
        } else if (interaction.isModalSubmit()) {
            if (interaction.customId === 'accept_modal' || interaction.customId === 'reject_modal') {
                const action = interaction.customId.split('_')[0];
                const reason = interaction.fields.getTextInputValue('reason') || 'Aucune raison';
                const message = await interaction.channel.messages.fetch(interaction.message.id);
                const originalEmbed = message.embeds[0];
                
                if (!originalEmbed) {
                    await interaction.reply({ content: 'Une erreur s\'est produite. L\'embed original n\'a pas été trouvé.', ephemeral: true });
                    return;
                }

                const suggestion = originalEmbed.description;
                const author = originalEmbed.author;

                const newEmbed = new EmbedBuilder()
                    .setColor(client.colors.blue)
                    .setAuthor({ name: author.name, iconURL: author.iconURL })
                    .setFooter(client.footer)
                    .setTimestamp();

                if (action === 'accept') {
                    newEmbed.setTitle('✅ Suggestion Acceptée')
                        .setDescription(`\n\n**Suggestion**: ${suggestion}\n\n**Raison**: ${reason}`);
                } else {
                    newEmbed.setTitle('⛔ Suggestion Refusée')
                        .setDescription(`\n\n**Suggestion**: ${suggestion}\n\n**Raison**: ${reason}`);
                }

                await message.edit({ embeds: [newEmbed], components: [] });
            }
        } else if (action === 'delete') {
            const message = interaction.message;
            await message.delete();
            await interaction.reply({ content: 'La suggestion a été supprimée.', ephemeral: true });
        }
    },
};
