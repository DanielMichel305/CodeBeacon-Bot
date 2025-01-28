import {ChatInputCommandInteraction, Client, ClientOptions, Collection} from 'discord.js'

export class DiscordClient extends Client{
    
    public commands : Collection<string, ChatInputCommandInteraction>;

    constructor(options: ClientOptions){
        super(options);
        this.commands = new Collection();
    }



}