import { Events, Client } from 'discord.js';
import { BotEventHandler } from './baseEventHandler';

module.exports = {
    name: Events.ClientReady,
    once: true,
    execute(client: Client){
        console.log(`Logged in as ${client.user?.tag}`);
        
        //add logging
    }    

}