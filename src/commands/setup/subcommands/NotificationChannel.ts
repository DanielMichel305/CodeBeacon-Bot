import { ChatInputCommandInteraction, EmbedBuilder, Interaction, MessageFlags, MessagePayload, Options, SlashCommandBuilder, SlashCommandSubcommandBuilder } from 'discord.js';
import { MQHandler, MQListener } from '../../../util/MQHandler';
 



const setupNotificationChannel  = {
    data : new SlashCommandSubcommandBuilder()
    .setName('notification-channel')
    .setDescription('Set The Channel to get build, CI and Bot notificaions in.')
    .addChannelOption(option=>option.setName('channel').setDescription('Channel for notifications')),

    async execute(interaction: ChatInputCommandInteraction){

        await interaction.deferReply({flags: MessageFlags.Ephemeral})    ///Maybe reply and delete later?
        
        const channelName = interaction.options.getChannel("channel");

        if(!channelName){
            return interaction.editReply({content: `${channelName} is Invalid, double check the channel name!`});
        }

        const mq: MQHandler = new MQHandler("SCD-BOT-SETUP");
        await mq.initConnection();

        mq.sendMessage(mq.getQueueDefaultName(),JSON.stringify({
            message: "TEST from discord",
            guildID: interaction.guildId,
            channelId: channelName.id
        }))

        .then(async ()=>{ 
            const channelId = channelName.id;
                const embed = new EmbedBuilder()
                .setTitle("Setup Action")
                .setDescription('/setup notifaction-channel was used to set the channel for receiving Notifactions')
                .addFields(
                    {name: "Channel Name", value:`${channelName}`},
                    {name: "Channel ID", value: `${channelId}`}
                )
                .setTimestamp()
                //await interaction.editReply('Notification channel set successfully');
                //await interaction.editReply({embeds: [embed]});
                await interaction.followUp({embeds:[embed]});
        })

        .catch(async (err)=>{
            console.log(`Error Setting Channel ${err}`);
            await interaction.editReply("Error Setting Notifactions channel");    //maybe change the message to be visible not ephemeral using a followup
        });
      
       

    }


}

//setupBaseCommand.data.addSubcommand(setupNotificationChannel.data);


export default setupNotificationChannel;