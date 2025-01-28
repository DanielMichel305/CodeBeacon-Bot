import {CommandInteraction, Events, Interaction, MessageFlags} from 'discord.js'
import { DiscordClient } from '../util/DiscordClient';

export default  {

    name: Events.InteractionCreate,
    async execute(interaction: Interaction){
        if(!interaction.isChatInputCommand()) return;

        const client = interaction.client as DiscordClient; 
        const command : any = client.commands.get(interaction.commandName); ///the type of any is just a quick dirty solution to the ChatInputCommandInteraction not having a function 'execute()'
        if(!command){
            console.error(`No command Matching ${interaction.commandName}`);
            return;
        }
        try {
            await command.execute(interaction);
        } catch (error) {
            //log error
        }

    }


}