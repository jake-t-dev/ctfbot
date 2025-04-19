import {
  ChatInputCommandInteraction,
  EmbedBuilder,
  SlashCommandBuilder,
} from "discord.js";

export const data = new SlashCommandBuilder()
  .setName("about")
  .setDescription("Returns information about the bot");

export async function execute(interaction: ChatInputCommandInteraction) {
  const embedReturn = new EmbedBuilder()
    .setColor("#df1e28")
    .setTitle("CTFTime Bot")
    .setDescription(
      "A Discord bot built for the QUB Cybersecurity Society to return information from the CTFTime API\n\n Source code available on GitHub: [CTFBot](https://github.com/jake-t-dev/ctfbot)"
    )
    .setThumbnail(
      "https://ctftime.org/media/cache/6a/d2/6ad2d93358ef6a2769edf61b1a946af6.png"
    )
    .setFooter({ text: "CTFTime API" })
    .setTimestamp();

  await interaction.reply({ embeds: [embedReturn] });
}
