import { Client } from "discord.js";
import { config } from "./config";
import { commands } from "./commands";
import { deployGuildCommands } from "./deploy-guild-commands";
import { deployGlobalCommands } from "./deploy-global-commands";

const client = new Client({
  intents: ["Guilds", "GuildMessages", "DirectMessages"],
});

client.once("ready", async () => {
  console.log("Deploying commands...");
  if (config.ENV !== "production") {
    const guilds = await client.guilds.fetch();
    for (const guild of guilds.values()) {
      await deployGuildCommands({ guildId: guild.id });
    }
  } else {
    await deployGlobalCommands();
  }

  console.log("Commands deployed.");
  console.log("Bot is ready!");
});

client.on("guildCreate", async (guild) => {
  if (config.ENV === "production") {
    await deployGuildCommands({ guildId: guild.id });
  }
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) {
    return;
  }
  const { commandName } = interaction;
  if (
    commands[commandName as keyof typeof commands] &&
    interaction.isChatInputCommand()
  ) {
    commands[commandName as keyof typeof commands].execute(interaction);
  }
});

client.login(config.DISCORD_TOKEN);
