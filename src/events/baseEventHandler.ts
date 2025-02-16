import { DiscordClient } from "../util/lib/DiscordClient";
import { MQHandler, MQListener } from "../util/MQHandler";
import {Channel, ConsumeMessage} from 'amqplib';


export class BotEventHandler {

    private queueListener? : MQListener;
    

    public constructor(private Client? : DiscordClient){}

    public async init(){

        MQHandler.url = process.env.SCD_RMQ_URL as string;
        await MQHandler.connect();

    }
    /** DEPRECATED */
    public async onMessageReceived(fn: Function, args: any[]) : Promise<any>{

        this.queueListener?.on('messageReceived', async ()=>{
            const returns = await fn(...args);
            if(returns) return returns;
        });
    }

    public async startMessageQueueListener(channelName: string){
        const channel: Channel = await MQHandler.createChannel(channelName);

        const botSetupEventListener = new MQListener(channel);
        botSetupEventListener.subscribe('SCD-INSPECTION-CREATE', {noAck: false});
        botSetupEventListener.on('messageReceived', (msg: ConsumeMessage)=>{
            const inspectionData = JSON.parse(msg.content.toString());
            console.log(`RECEIVED DATA IN QUEUE 'SCD-INSPECTION-CREATE'. RAW DATA ${JSON.stringify(inspectionData)}`);
            this.inspectionCreationRoutine(inspectionData);
        })


    }

    public async inspectionCreationRoutine(inspectionData: any){
        console.log(`Inspection on repo ${inspectionData.inspectionData.repoName} was created and Discord channelID: ${inspectionData.discordChannel}`);
        const channel =  await this.Client?.channels.fetch(inspectionData.discordChannel);
        if(channel && channel.isSendable()){
            console.log('LHWFLHAWF WAWAWAWAWAWAWAWWAW KAKA ');
            await channel.send({content: `An Inspection on repo ${inspectionData.inspectionData.repoName} was created and this is a notification telling you so`})
        }
    }

    
}


