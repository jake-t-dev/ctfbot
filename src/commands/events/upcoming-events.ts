import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import axios from "axios";

export const data = new SlashCommandBuilder()
    .setName("upcoming-events")
    .setDescription(
        "Returns the titles, dates, main organisers and ids of upcoming events."
    );

export async function execute(interaction: ChatInputCommandInteraction) {
    const url = "https://ctftime.org/api/v1/events/?limit=10";

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
                return `${safeTitle} - ${organizer} - ID: ${event.id} - Starts: ${startDate}`;
            })
            .join("\n");

        const message = `**Upcoming Events:**\n${eventList}`;
            await interaction.reply(message);

    } catch (error) {
        console.error("Error fetching upcoming events:", error);
        await interaction.reply(
            "Failed to fetch upcoming events. Please try again later."
        );
    }
}
