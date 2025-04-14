import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
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
        const logo = team.logo ? `[Logo](${team.logo})` : "No logo available";

        const aliases = team.aliases?.length
            ? team.aliases.map((alias: string) => `\`${alias}\``).join(", ")
            : "None";

        const ratings = team.rating || {};
        const years = Object.keys(ratings).map(Number);
        const sortedYears = years.sort((a, b) => b - a);
        let ratingSummary = "No recent rating data available.";

        for (const year of sortedYears) {
            const stats = ratings[year];
            if (stats.rating_points !== undefined) {
                ratingSummary = `**Year:** ${year}\n` +
                    `**Global Rank:** ${stats.rating_place ?? "N/A"}\n` +
                    `**Country Rank:** ${stats.country_place ?? "N/A"}\n` +
                    `**Rating Points:** ${stats.rating_points.toFixed(2)}`;
                break;
            }
        }

        const message = `**Team:** ${safeName}\n` +
            `**Country:** ${country}\n` +
            `**Logo:** ${logo}\n` +
            `**Aliases:** ${aliases}\n\n` +
            `__**Latest Rating Summary**__\n${ratingSummary}`;

        await interaction.reply(message);
    } catch (error) {
        console.error("Error fetching team information:", error);
        await interaction.reply(
            "Failed to fetch team information. Please try again later."
        );
    }
}
