import {
  ChatInputCommandInteraction,
  EmbedBuilder,
  SlashCommandBuilder,
  SlashCommandStringOption,
} from "discord.js";
import axios from "axios";

interface Choice {
  name: string;
  value: string;
}

export const data = new SlashCommandBuilder()
  .setName("top-teams-by-country")
  .setDescription("Returns top teams for the current year by country")
  .addStringOption((option: SlashCommandStringOption) =>
    option
      .setName("country")
      .setDescription("Country to get top teams for (Default: US)")
      .setRequired(true)
      .addChoices(
        { name: "Ireland", value: "IE" },
        { name: "United Kingdom", value: "GB" },
        { name: "United States", value: "US" },
        { name: "Russia", value: "RU" },
        { name: "India", value: "IN" },
        { name: "China", value: "CN" },
        { name: "Germany", value: "DE" },
        { name: "France", value: "FR" },
        { name: "Japan", value: "JP" },
        { name: "South Korea", value: "KR" },
        { name: "Vietnam", value: "VN" },
        { name: "Italy", value: "IT" },
        { name: "Taiwan", value: "TW" },
        { name: "Poland", value: "PL" },
        { name: "Indonesia", value: "ID" },
        { name: "Brazil", value: "BR" },
        { name: "Canada", value: "CA" },
        { name: "Turkey", value: "TR" },
        { name: "Iran", value: "IR" },
        { name: "Malaysia", value: "MY" },
        { name: "Spain", value: "ES" },
        { name: "Ukraine", value: "UA" },
        { name: "Israel", value: "IL" },
        { name: "Singapore", value: "SG" },
        { name: "Egypt", value: "EG" }
      )
  );

export async function execute(interaction: ChatInputCommandInteraction) {
  const country = interaction.options.getString("country") || "US";
  const url = `https://ctftime.org/api/v1/top-by-country/${country}/`;

  try {
    const response = await axios.get(url);
    const data = response.data;

    if (!Array.isArray(data)) {
      console.error("Expected array, got:", data);
      await interaction.reply("Unexpected response from CTFTime API.");
      return;
    }

    const limitedData = data.slice(0, 20);

    const teamList = limitedData
      .map((team: any, index: number) => {
        const safeName = team.team_name.replace(/[*_`~]/g, "\\$&");
        return `${index + 1}. ${safeName} - ${team.points} points`;
      })
      .join("\n");

    const embedReturn = new EmbedBuilder()
      .setColor("#df1e28")
      .setTitle(`Top Teams for ${country}`)
      .setDescription("Top teams for the current year by country.")
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
