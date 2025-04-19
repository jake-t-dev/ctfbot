import {
  ChatInputCommandInteraction,
  EmbedBuilder,
  SlashCommandBuilder,
} from "discord.js";
import axios from "axios";

export const data = new SlashCommandBuilder()
  .setName("team")
  .setDescription("Returns information about a team.")
  .addIntegerOption((option) =>
    option
      .setName("team-id")
      .setDescription("The id of the team.")
      .setRequired(true)
  );

export async function execute(interaction: ChatInputCommandInteraction) {
  const teamID = interaction.options.getInteger("team-id") || 0;
  const url = `https://ctftime.org/api/v1/teams/${teamID}/`;

  try {
    const response = await axios.get(url);
    const team = response.data;

    if (!team) {
      await interaction.reply("Team not found.");
      return;
    }

    const safeName = team.name.replace(/[*_`~]/g, "\\$&");
    const country = team.country || "Unknown Country";
    const aliases = team.aliases?.length
      ? team.aliases.map((alias: string) => `\`${alias}\``).join(", ")
      : "None";

    const ratings = team.rating || {};
    const years = Object.keys(ratings).map(Number);
    const validYears = years.filter((year) => ratings[year] !== null);
    const activeSince = Math.min(...validYears);
    const sortedYears = years.sort((a, b) => b - a);
    let ratingSummary = "No recent rating data available.";

    for (const year of sortedYears) {
      const stats = ratings[year];
      if (stats.rating_points !== undefined) {
        ratingSummary =
          `**Active Since:** ${activeSince}\n` +
          `**Global Rank:** ${stats.rating_place ?? "N/A"}\n` +
          `**Country Rank:** ${stats.country_place ?? "N/A"}\n` +
          `**Rating Points:** ${stats.rating_points.toFixed(2)}`;
        break;
      }
    }

    const embedReturn = new EmbedBuilder()
      .setColor("#df1e28")
      .setTitle(safeName)
      .setDescription(`Information about the team with ID: ${teamID}`)
      .setThumbnail(
        team.logo ||
          "https://ctftime.org/media/cache/6a/d2/6ad2d93358ef6a2769edf61b1a946af6.png"
      )
      .addFields(
        {
          name: "Academic Team?",
          value: team.academic ? "Yes" : "No",
          inline: false,
        },
        { name: "Country", value: country, inline: true },
        { name: "Aliases", value: aliases, inline: true },
        { name: "Rating Summary", value: ratingSummary, inline: false }
      )
      .setFooter({ text: "CTFTime API" })
      .setTimestamp();

    await interaction.reply({ embeds: [embedReturn] });
  } catch (error) {
    console.error("Error fetching team information:", error);
    await interaction.reply(
      "Failed to fetch team information. Please try again later."
    );
  }
}
