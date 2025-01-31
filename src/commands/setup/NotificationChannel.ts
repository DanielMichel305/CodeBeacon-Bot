import { ChatInputCommandInteraction, Interaction, MessageFlags, Options, SlashCommandBuilder, SlashCommandSubcommandBuilder } from 'discord.js';
import setupBaseCommand  from './SetupBase';  



const setupNotificationChannel  = {
    data : new SlashCommandSubcommandBuilder()
    .setName('notification-channel')
    .setDescription('Set The Channel to get build, CI and Bot notificaions in.')
    .addChannelOption(option=>option.setName('channel').setDescription('Channel for notifications'))
    ,
    async execute(interaction: ChatInputCommandInteraction){
        await interaction.deferReply({flags:MessageFlags.Ephemeral})    ///Maybe reply and delete later?
        ///do the fetch
        const channelName = interaction.options.getChannel("channel");

        if(!channelName){
            return interaction.reply({content: `${channelName} is Invalid, double check the channel name!`, ephemeral: true});
        }
        const channelId = channelName.id;
        await interaction.reply(`Set channel ${channelName} (channel id: ${channelId}) as notifications channel`); 

    }

    


}

setupBaseCommand


export default setupNotificationChannel;