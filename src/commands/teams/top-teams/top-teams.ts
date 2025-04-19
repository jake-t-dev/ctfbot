import {
  ChatInputCommandInteraction,
  EmbedBuilder,
  SlashCommandBuilder,
} from "discord.js";
import axios from "axios";

export const data = new SlashCommandBuilder()
  .setName("top-teams")
  .setDescription("Returns top teams for current year")
  .addIntegerOption((option) =>
    option
      .setName("number")
      .setDescription("Number of teams to return (Default: 10)")
      .setRequired(false)
      .setMinValue(1)
      .setMaxValue(20)
  )
  .addIntegerOption((option) =>
    option
      .setName("year")
      .setDescription(
        `Year to get top teams for (Default: ${new Date().getFullYear()})`
      )
      .setRequired(false)
      .setMinValue(2011)
      .setMaxValue(new Date().getFullYear())
  );

export async function execute(interaction: ChatInputCommandInteraction) {
  const numberOfTeams = interaction.options.getInteger("number") || 10;
  const year =
    interaction.options.getInteger("year") || new Date().getFullYear();

  console.log(`https://ctftime.org/api/v1/top/${year}/?limit=${numberOfTeams}`);
  const url = `https://ctftime.org/api/v1/top/${year}/?limit=${numberOfTeams}`;

  try {
    const response = await axios.get(url);
    const data = response.data;
    const teams = data[year];

    if (!Array.isArray(teams)) {
      console.error("Expected array, got:", teams);
      await interaction.reply("Unexpected response from CTFTime API.");
      return;
    }

    const teamList = teams
      .map((team: any, index: number) => {
        const safeName = team.team_name.replace(/[*_`~]/g, "\\$&");
        return `${index + 1}. ${safeName} - ${team.points} points`;
      })
      .join("\n");

    const embedReturn = new EmbedBuilder()
      .setColor("#df1e28")
      .setTitle(`Top ${numberOfTeams} Teams for ${year}`)
      .addFields({ name: "Teams", value: teamList })
      .setThumbnail(
        "https://ctftime.org/media/cache/6a/d2/6ad2d93358ef6a2769edf61b1a946af6.png"
      )
      .setFooter({
        text: "CTFTime API",
        iconURL:
          "https://ctftime.org/media/cache/6a/d2/6ad2d93358ef6a2769edf61b1a946af6.png",
      })
      .setTimestamp();

    await interaction.reply({ embeds: [embedReturn] });
  } catch (error) {
    console.error("Error fetching top teams:", error);
    await interaction.reply(
      "Failed to fetch top teams. Please try again later."
    );
  }
}
