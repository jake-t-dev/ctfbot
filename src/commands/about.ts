import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";

export const data = new SlashCommandBuilder()
  .setName("about")
  .setDescription("Returns information about the bot");

export async function execute(interaction: ChatInputCommandInteraction) {
  await interaction.reply(`
    **CTFTime Bot** is a Discord bot that provides information about CTF (Capture The Flag) competitions and teams.
    It allows users to query for top teams, upcoming events, and more.
    `);
}
