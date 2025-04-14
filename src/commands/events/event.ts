import { ChatInputCommandInteraction, SlashCommandBuilder, SlashCommandIntegerOption } from "discord.js";
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
        const description = event.description?.substring(0, 500) || "No description available.";
        const format = event.format || "Unknown format";
        const eventUrl = event.url || "No URL available";

        const message = `**Event:** ${safeTitle}\n**Organizer:** ${organizer}\n**ID:** ${event.id}\n**Starts:** ${startDate}\n**Ends:** ${endDate}\n**Format:** ${format}\n**Description:** ${description}\n**URL:** ${eventUrl}`;
        await interaction.reply(message);

    } catch (error) {
        console.error("Error fetching event information:", error);
        await interaction.reply(
            "Failed to fetch event information. Please try again later."
        );
    }
}