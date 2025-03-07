import { Events, MessageFlags, Collection, BaseInteraction, Guild, EmbedBuilder } from 'discord.js';
import {Channel, ConsumeMessage} from 'amqplib'
import { MQHandler } from '../util/MQHandler';
import { uuid } from '../util/lib/util';
///INCLUDE GUILDDELETE EVENT


type verificationMessage = {
    allowed : number
}

function isInstanceAllowedInGuild(messageString: string) : boolean{

    const messageJson = JSON.parse(messageString) as verificationMessage;
    if(messageJson.allowed == 1){
        return true;
    }
    return false;

}


module.exports = {
    name:Events.GuildCreate,
    async execute(guild: Guild){
        console.log(`[LOG] Joined ${guild.name} `);

        const corrId = uuid()

        const channel : Channel = await MQHandler.createChannel('SCD-CH1');
        ////
        const replyQ = await channel.assertQueue(`rpc.dashboard.auth.guild_access.reply`,{durable:true, exclusive: true});
        
        channel.consume(replyQ.queue, async(msg)=>{
            if(!msg) return;
            if(msg.properties.correlationId === corrId){
                if(!isInstanceAllowedInGuild(msg.content.toString())){


                    const embed = new EmbedBuilder()
                        .setTitle("Bot Setup Failed!")
                        .setDescription('This Bot Instance wasn\'t invited to this server correctly. Kindly visit our website, create an account and Invite the Bot from the Dashboard')
                        .addFields({name:"\u200B", value:"The Bot will leave the server, Try again from your account's dashboard."})
                        .setTimestamp()
                        .setColor('Yellow');
                    await guild.systemChannel?.send({embeds :[embed]})
                    await guild.leave();
                    
                }
            }
            channel.ack(msg)
        });
        


        (await MQHandler.getInstance()).sendToQueue(channel,'rpc.dashboard.auth.guild_access',Buffer.from(JSON.stringify(
                {
                    guild_id: guild.id,
                    guild_name : guild.name
            })), {
                replyTo: replyQ.queue,
                correlationId: corrId
            }
        )
    }
}