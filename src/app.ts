import fs from 'fs'; 
import path from 'path';
import { GatewayIntentBits, Collection } from 'discord.js';
import { DiscordClient } from "./util/lib/DiscordClient";



require('dotenv').config();		///////////////ALL URLS ARE LOCALLL/DOCKER


////jjw


const client = new DiscordClient({intents: [GatewayIntentBits.Guilds]});


const foldersPath = path.join(__dirname, "commands");
const commandFolder = fs.readdirSync(foldersPath);


(async()=>{

	for(const folder of commandFolder){

		const commandsPath = path.join(foldersPath, folder);
		const commandFiles = fs.readdirSync(commandsPath).filter((file: string) => file.endsWith('.ts'));
	
		for (const file of commandFiles) {
	
			const filePath = path.join(commandsPath, file);
			const command = await import(`file://${filePath}`);
			// Set a new item in the Collection with the key as the command name and the value as the exported module
			if (command.default && 'data' in command.default && 'execute' in command.default) {
				client.commands.set(command.default.data.name, command.default);	
			} else {
				console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
			}
		}
	
	}
	



})();



const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter((file :string)=> file.endsWith('.ts'));



for (const file of eventFiles) {
	const filePath = path.join(eventsPath, file);
	const event = require(filePath);
	if (event.once) {
		client.once(event.name, (...args: any) => event.execute(...args));
	} else {
		client.on(event.name, (...args:any) => event.execute(...args));
	}
}




client.login(process.env.DISCORD_TOKEN);