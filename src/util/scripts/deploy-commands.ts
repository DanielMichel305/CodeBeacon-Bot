import { Base, BaseInteraction, REST, Routes } from 'discord.js';
import fs from 'fs';
import path from 'path';



require('dotenv').config();

let commands :Array<BaseInteraction>= [];

const foldersPath = path.join(__dirname, '../../commands');
const commandFolders = fs.readdirSync(foldersPath);



async function loadCommands(){
	for (const folder of commandFolders) {
	
		const commandsPath = path.join(foldersPath, folder);
		const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.ts'));
		
		for (const file of commandFiles) {
			const filePath = path.join(commandsPath, file);
			const commandModule = await import(`file://${filePath}`);
			const command = commandModule.default;
			
			if (command && 'data' in command && 'execute' in command) {
				commands.push(command.data.toJSON());
			} else {
				console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
			}
		}
	}

}

async function registerCommands() :Promise<void> {

	const rest = new REST().setToken(process.env.DISCORD_TOKEN as string);
	try {
		console.log(`Started refreshing ${commands.length} application (/) commands.`);
		
		// The put method is used to fully refresh all commands in the guild with the current set
		const data = await rest.put(
			Routes.applicationCommands(process.env.CLIENT_ID as string),	////this needs updating to handle server/instance specific commands (future update) 
			{ body: commands },
		) as any;

		
		console.log(`Successfully reloaded ${data.length} application (/) commands.`);
		
	} catch (error) {
		// And of course, make sure you catch and log any errors!

		console.error("ERROR DEPLOYING COMMANDS " , error);
	}


}

async function main() : Promise<void>{
	await loadCommands();
	//console.log('\nCommands array:', JSON.stringify(commands, null, 2), `\n SIZE OF ARRAY ${commands.length}`);
	await registerCommands();
}



main()



