const { Events, MessageFlags, Collection } = require('discord.js');

module.exports = {
	name: Events.InteractionCreate,
	async execute(interaction) {
		if (!interaction.isChatInputCommand()) return;

		const {cooldowns} = interaction.client

		const command = interaction.client.commands.get(interaction.commandName);

		if (!command) {
			console.error(`No command matching ${interaction.commandName} was found.`);
			return;
		}
		if(!cooldowns.has(command.data.name)){
			cooldowns.set(command.data.name, new Collection())
		}
		
		const now = Date.now();
		const timestamps = cooldowns.get(command.data.name);
		const defaultCooldown = 1;
		const cooldownAmmountMillisec = (command.cooldown ?? defaultCooldown) * 1000;

		if(timestamps.has(interaction.user.id)){
			const cooldownExpiryTime = timestamps.get(interaction.user.id) + cooldownAmmountMillisec;

			if(now < cooldownExpiryTime){
				return interaction.reply({content: `This command Has a cooldown! Try again later.` ,flags: MessageFlags.Ephemeral});
			}
		}

		timestamps.set(interaction.user.id, now);
		setTimeout(() => timestamps.delete(interaction.user.id), cooldownAmmountMillisec);

		try {
			await command.execute(interaction);
		} catch (error) {
			console.error(error);
			if (interaction.replied || interaction.deferred) {
				await interaction.followUp({ content: 'There was an error while executing this command!', flags: MessageFlags.Ephemeral });
			} else {
				await interaction.reply({ content: 'There was an error while executing this command!', flags: MessageFlags.Ephemeral });
			}
		}
	},
};