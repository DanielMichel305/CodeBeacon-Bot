import { ChatInputCommandInteraction, EmbedBuilder, Interaction, MessageFlags, MessagePayload, Options, SlashCommandBuilder, SlashCommandSubcommandBuilder } from 'discord.js';
import { MQHandler, MQListener } from '../../../util/MQHandler';
 



const setupNotificationChannel  = {
    data : new SlashCommandSubcommandBuilder()
    .setName('notification-channel')
    .setDescription('Set The Channel to get build, CI and Bot notificaions in.')
    .addChannelOption(option=>option.setName('channel').setDescription('Channel for notifications'))
    .addStringOption(option=>option.setName('webhook-id').setDescription('The Webhook Id associated with your webhook url')),

    async execute(interaction: ChatInputCommandInteraction){

        await interaction.deferReply({flags: MessageFlags.Ephemeral})    ///Maybe reply and delete later?
        
        const channelName = interaction.options.getChannel("channel");
        const webhookId   = interaction.options.getString('webhook-id');
        
        if(!channelName){
            return interaction.editReply({content: `${channelName} is Invalid, double check the channel name!`});
        }

        MQHandler.url = process.env.SCD_RMQ_URL as string
        await MQHandler.connect();                                  //////I DON'T NEED TO CONNECT EVERYTIME THO, RIGHT? just use getInstance() maybe? or initialize con in app.ts
        const channel : any = await MQHandler.createChannel('SCD-CH1');

        (await MQHandler.getInstance()).sendToQueue(channel,'SCD-BOT-SETUP',Buffer.from(JSON.stringify(
            {
                message: "TEST from discord",
                guildID: interaction.guildId,
                channelId: channelName.id,
                webhookId: webhookId
            }))
        )
        .then(async ()=>{ 
            const channelId = channelName.id;
                const embed = new EmbedBuilder()
                .setTitle("Setup Action")
                .setDescription('/setup notifaction-channel was used to set the channel for receiving Notifactions')
                .addFields(
                    {name: "Webhook Id", value: `${webhookId}`},
                    {name: "Channel Name", value:`${channelName}`, inline: true},
                    {name: "Channel ID", value: `${channelId}`, inline: true}
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