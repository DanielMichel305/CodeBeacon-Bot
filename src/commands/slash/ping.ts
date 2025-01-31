import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';

export default {
    data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("PING PONG!"),
    cooldown:1,
    async execute(interaction: ChatInputCommandInteraction){
        await interaction.reply('PONG!!');
    },

};