import { CommandInteraction, SlashCommandBuilder } from "discord.js";

export const data = new SlashCommandBuilder()
  .setName("test")
  .setDescription("Test command");

export async function execute(interaction: CommandInteraction) {
  await interaction.reply("Test command executed successfully!");
}
