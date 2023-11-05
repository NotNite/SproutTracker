import {
  ApplicationCommandStructure,
  AutocompleteInteraction,
  Client,
  CommandInteraction,
  Constants
} from "@projectdysnomia/dysnomia";
import { getCharacterFromCID, getCharacters, getLatestProgression } from "./db";
import { getQuest } from "./xivapi";

const bot = new Client(`Bot ${process.env.DISCORD_TOKEN}`);

const commands: ApplicationCommandStructure[] = [
  {
    name: "quest",
    description: "Find the quest a character is on",
    type: Constants.ApplicationCommandTypes.CHAT_INPUT,
    options: [
      {
        name: "character",
        description: "The character to search for",
        type: Constants.ApplicationCommandOptionTypes.STRING,
        autocomplete: true,
        required: true
      }
    ]
  }
];

bot.on("ready", async () => {
  if (process.env.NODE_ENV === "production") {
    await bot.bulkEditCommands(commands);
  } else {
    await bot.bulkEditGuildCommands(process.env.DISCORD_GUILD, commands);
  }
});

bot.on("interactionCreate", async (interaction) => {
  if (interaction instanceof AutocompleteInteraction) {
    switch (interaction.data.name) {
      case "quest": {
        const query = interaction.data.options[0].value as string;
        const chars = await getCharacters();

        await interaction.acknowledge(
          chars
            .filter((x) => x.full.toLowerCase().includes(query.toLowerCase()))
            .map((x) => ({
              name: x.full,
              value: x.contentId
            }))
        );

        break;
      }
    }
  } else if (interaction instanceof CommandInteraction) {
    switch (interaction.data.name) {
      case "quest": {
        const query = interaction.data.options![0].value as string;
        const char = await getCharacterFromCID(query);
        if (char == null) {
          await interaction.createMessage("Character not found.");
          break;
        }

        const progression = await getLatestProgression(char.contentId);
        if (progression == null) {
          await interaction.createMessage("No progression found.");
          break;
        }

        const quest = await getQuest(progression.quest);
        if (quest == null) {
          await interaction.createMessage("Quest not found.");
          break;
        }

        const todoIdx =
          progression.sequence === 255
            ? quest.TextData.ToDo.length - 1
            : progression.sequence - 1;
        const todo = quest.TextData.ToDo.find((x) => x.Order === todoIdx);

        await interaction.createMessage({
          embeds: [
            {
              title: quest.Name,
              description: `${char.name} @ ${char.world}`,
              fields: [
                {
                  name: "Objective",
                  value: todo?.Text ?? "Unknown",
                  inline: true
                },
                {
                  name: "Completed",
                  value: progression.complete ? "Yes" : "No",
                  inline: true
                },
                {
                  name: "Level",
                  value: quest.ClassJobLevel0.toString(),
                  inline: true
                },
                {
                  name: "Expansion",
                  value: quest.Expansion.Name,
                  inline: true
                },
                {
                  name: "ID",
                  value: progression.quest.toString(),
                  inline: true
                }
              ],
              timestamp: progression.time.toISOString(),
              image:
                quest.IconHD !== ""
                  ? {
                      url: "https://xivapi.com" + quest.IconHD
                    }
                  : undefined
            }
          ]
        });

        break;
      }
    }
  }
});

export default bot;
