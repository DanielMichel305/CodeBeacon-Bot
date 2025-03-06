import { Client, ClientOptions, Collection } from "discord.js";


export class DiscordClient extends Client{

    public cooldowns: Collection<string,number> ;
    public commands: Collection<string, object> ;  //idk really whattype of object

    constructor(options: ClientOptions){
        super(options);
        this.commands = new Collection();
        this.cooldowns = new Collection();
        
    }


}

