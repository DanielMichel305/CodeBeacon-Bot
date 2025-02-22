import { ChatInputCommandInteraction, EmbedBuilder, Interaction, MessageFlags, MessagePayload, Options, SlashCommandBuilder, SlashCommandSubcommandBuilder } from 'discord.js';
import { MQHandler, MQListener } from '../../../util/MQHandler';
 
const setupMentionRoles = {
    data: new SlashCommandSubcommandBuilder()
    .setName("mention-role")
    .setDescription("The Role to mention whenever a new Inspection is created.")
    .addRoleOption(option=>option.setName('role').setDescription('The Role to Mention (example: @dev)')),
    
    async execute(interaction: ChatInputCommandInteraction){
        await interaction.deferReply();

        const role = interaction.options.getRole('role');
        const roleId = role?.id;

        await interaction.editReply(`${role} (role id : ${roleId}) set as mention role`);

    }
}

export default setupMentionRoles;