import { ChatInputCommandInteraction, Interaction, MessageFlags, Options, SlashCommandBuilder, SlashCommandSubcommandBuilder } from 'discord.js';
import { MQHandler, MQListener } from '../../../util/MQHandler';
 



const setupNotificationChannel  = {
    data : new SlashCommandSubcommandBuilder()
    .setName('notification-channel')
    .setDescription('Set The Channel to get build, CI and Bot notificaions in.')
    .addChannelOption(option=>option.setName('channel').setDescription('Channel for notifications')),
    async execute(interaction: ChatInputCommandInteraction){
        await interaction.deferReply({flags:MessageFlags.Ephemeral})    ///Maybe reply and delete later?
        ///do the fetch
        const channelName = interaction.options.getChannel("channel");

        if(!channelName){
            return interaction.reply({content: `${channelName} is Invalid, double check the channel name!`});
        }

        fetch('http://scd-http:8080/api/webhooks/5697ws/notification', {
            method:'HEAD'
        }).then(async res=>{
            const mq =  new MQHandler("SCD-DISCORD-QUEUE");
            await mq.initConnection();
            //const mqListener = new MQListener(mq);
            mq.sendMessage(mq.getQueueDefaultName(),JSON.stringify({message: "TEST from discord", guildID: interaction.guildId})).then(()=>{console.log("sent message to SCD_QUEUE!!")});
        }).then(async ()=>{
            const channelId = channelName.id;
            await interaction.editReply(`Set channel ${channelName} (channel id: ${channelId}) as notifications channel`); 
        }
        ).catch(async err=>{
            console.log("ERROR SENDING HEAD REQUEST", err);
            await interaction.editReply(`Error Setting Channel!`); 

        })

       

    }


}

//setupBaseCommand.data.addSubcommand(setupNotificationChannel.data);


export default setupNotificationChannel;