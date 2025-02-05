import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';
import setupNotificationChannel from './subcommands/NotificationChannel';

const setupBaseCommand = {
    data: new SlashCommandBuilder()
    .setName("setup")
    .setDescription("Setup the bot with things like notification channel, etc..")
    .addSubcommand(setupNotificationChannel.data),
    async execute(interaction: ChatInputCommandInteraction){
        //
        switch (interaction.options.getSubcommand()) {
            case "notification-channel":
                setupNotificationChannel.execute(interaction);    
            break;
        
            default:
                await interaction.reply('Use any of the subcommands\nSuggestions: - /setup notification-channel');
            break;
        }
    }
};


export default setupBaseCommand;