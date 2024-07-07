import {
  ApplicationCommandStructure,
  AutocompleteInteraction,
  Client,
  CommandInteraction,
  Constants
} from "@projectdysnomia/dysnomia";
import { getCharacterFromCID, getCharacters, getLatestProgression } from "./db";
import { getQuest, getTodo } from "./xivapi";

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

        const todoData = await getTodo(quest);
        let todo = "Unknown";
        if (todoData != null) {
          const todoIdx = progression.sequence - 1;
          todo = todoData[todoIdx] ?? "Unknown";
        }

        const icon = quest.Icon?.path_hr1;

        await interaction.createMessage({
          embeds: [
            {
              title: quest.Name,
              description: `${char.name} @ ${char.world}`,
              fields: [
                {
                  name: "Objective",
                  value: todo,
                  inline: true
                },
                {
                  name: "Completed",
                  value: progression.complete ? "Yes" : "No",
                  inline: true
                },
                {
                  name: "Level",
                  value: quest.ClassJobLevel[0].toString(),
                  inline: true
                },
                {
                  name: "Expansion",
                  value: quest.Expansion.fields.Name,
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
                icon != null && icon !== ""
                  ? {
                      url:
                        "https://beta.xivapi.com/api/1/asset/" +
                        icon +
                        "?format=png"
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
