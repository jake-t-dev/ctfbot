import {
  ChatInputCommandInteraction,
  Embed,
  EmbedBuilder,
  SlashCommandBuilder,
} from "discord.js";
import axios from "axios";

export const data = new SlashCommandBuilder()
  .setName("upcoming-events")
  .setDescription(
    "Returns the titles, dates, main organisers and ids of upcoming events."
  );

export async function execute(interaction: ChatInputCommandInteraction) {
  const url = "https://ctftime.org/api/v1/events/?limit=5";

  try {
    const response = await axios.get(url);
    const events = response.data;

    if (!Array.isArray(events) || events.length === 0) {
      await interaction.reply("No upcoming events found.");
      return;
    }

    const eventList = events
      .map((event: any) => {
        const safeTitle = event.title.replace(/[*_`~]/g, "\\$&");
        const organizer = event.organizers[0]?.name || "Unknown Organizer";
        const startDate = new Date(event.start).toLocaleString();
        const endDate = new Date(event.finish).toLocaleString();
        const eventId = event.id || "N/A";
        const eventUrl = `https://ctftime.org/event/${eventId}`;
        return (
          `**Title:** ${safeTitle}\n` +
          `**Organizer:** ${organizer}\n` +
          `**Start Date:** ${startDate}\n` +
          `**End Date:** ${endDate}\n` +
          `**Event ID:** [${eventId}](${eventUrl})\n` +
          `---`
        );
      })
      .join("\n");

    const embedReturn = new EmbedBuilder()
      .setColor("#df1e28")
      .setTitle("Upcoming Events")
      .setDescription("Here are the upcoming events:")
      .addFields({ name: "Events", value: eventList })
      .setThumbnail(
        "https://ctftime.org/media/cache/6a/d2/6ad2d93358ef6a2769edf61b1a946af6.png"
      )
      .setFooter({ text: "CTFTime API" })
      .setTimestamp();

    await interaction.reply({ embeds: [embedReturn] });
  } catch (error) {
    console.error("Error fetching upcoming events:", error);
    await interaction.reply(
      "Failed to fetch upcoming events. Please try again later."
    );
  }
}
