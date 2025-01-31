import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';


const setupBaseCommand = {
    data: new SlashCommandBuilder()
    .setName("setup")
    .setDescription("Setup the bot with things like notification channel, etc.."),
    async execute(interaction: ChatInputCommandInteraction){
        await interaction.reply('Use any of the subcommands\nSuggestions: - /setup notification-channel');
    }
};


export default setupBaseCommand;