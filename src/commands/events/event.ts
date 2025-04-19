import {
  ChatInputCommandInteraction,
  EmbedBuilder,
  SlashCommandBuilder,
  SlashCommandIntegerOption,
} from "discord.js";
import axios from "axios";

export const data = new SlashCommandBuilder()
  .setName("event")
  .setDescription("Returns information about a specific event.")
  .addIntegerOption((option: SlashCommandIntegerOption) =>
    option
      .setName("id")
      .setDescription("ID of the event to get information about.")
      .setRequired(true)
  );

export async function execute(interaction: ChatInputCommandInteraction) {
  const eventID = interaction.options.getInteger("id") || 0;
  const url = `https://ctftime.org/api/v1/events/${eventID}/`;

  try {
    const response = await axios.get(url);
    const event = response.data;

    if (!event) {
      await interaction.reply("Event not found.");
      return;
    }

    const safeTitle = event.title.replace(/[*_`~]/g, "\\$&");
    const organizer = event.organizers[0]?.name || "Unknown Organizer";
    const startDate = new Date(event.start).toLocaleString();
    const endDate = new Date(event.finish).toLocaleString();
    const description =
      event.description?.substring(0, 500) || "No description available.";
    const format = event.format || "Unknown format";
    const eventUrl = event.url || "No URL available";

    const embedReturn = new EmbedBuilder()
      .setColor("#df1e28")
      .setTitle(safeTitle)
      .setDescription(description)
      .addFields(
        { name: "Organizer", value: organizer, inline: true },
        { name: "Start Date", value: startDate, inline: true },
        { name: "End Date", value: endDate, inline: true },
        { name: "Format", value: format, inline: true },
        { name: "Event URL", value: eventUrl, inline: true }
      )
      .setThumbnail(
        "https://ctftime.org/media/cache/6a/d2/6ad2d93358ef6a2769edf61b1a946af6.png"
      )
      .setFooter({ text: "CTFTime API" })
      .setTimestamp();

    await interaction.reply({ embeds: [embedReturn] });
  } catch (error) {
    console.error("Error fetching event information:", error);
    await interaction.reply(
      "Failed to fetch event information. Please try again later."
    );
  }
}
