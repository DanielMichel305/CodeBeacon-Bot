import { ChatInputCommandInteraction, EmbedBuilder, Interaction, MessageFlags, MessagePayload, Options, SlashCommandBuilder, SlashCommandSubcommandBuilder } from 'discord.js';
import { MQHandler, MQListener } from '../../../util/MQHandler';
 
const setupMentionRoles = {
    data: new SlashCommandSubcommandBuilder()
    .setName("mention-role")
    .setDescription("The Role to mention whenever a new Inspection is created.")
    .addRoleOption(option=>option.setName('role').setDescription('The Role to Mention (example: @dev)').setRequired(true)),
    
    async execute(interaction: ChatInputCommandInteraction){
        await interaction.deferReply();

        const role = interaction.options.getRole('role');
        const roleId = role?.id;
        
        MQHandler.getInstance();
        const channel : any = await MQHandler.createChannel('SCD-CH1');
        (await MQHandler.getInstance()).sendToQueue(channel,"SCD-BOT-ROLE",Buffer.from(JSON.stringify(
            {
                channelId: interaction.channel?.id,
                role_id: roleId,
                role_name : `@${role?.name}`
            }
        )))

        await interaction.editReply(`${role} (role id : ${roleId}) set as mention role `); ///Maybe Change this to Embeds

    }
}

export default setupMentionRoles;