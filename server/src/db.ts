import { Character, PrismaClient, User } from "@prisma/client";
import { z } from "zod";
import { CharacterSchema, ProgressSubmitSchema } from "./schema";
import { getBearerToken } from "./util";

const prisma = new PrismaClient();

export async function getUserFromToken(header: string | undefined) {
  const token = getBearerToken(header);
  if (token == null) return null;

  const user = await prisma.user.findFirst({
    where: {
      key: {
        equals: token
      }
    },
    include: {
      characters: true
    }
  });

  return user;
}

export async function getCharacter(
  user: User,
  character: z.infer<typeof CharacterSchema>
) {
  return await prisma.character.upsert({
    where: {
      contentId: character.contentId
    },
    update: {
      name: character.name,
      world: character.world
    },
    create: {
      contentId: character.contentId,
      name: character.name,
      world: character.world,

      user: {
        connect: {
          username: user.username
        }
      }
    }
  });
}

export async function submitProgress(
  character: Character,
  progress: z.infer<typeof ProgressSubmitSchema>
) {
  await prisma.questProgression.create({
    data: {
      character: {
        connect: {
          contentId: character.contentId
        }
      },

      quest: progress.quest,
      sequence: progress.sequence,
      complete: progress.complete
    }
  });
}

export async function createUser(username: string) {
  return await prisma.user.create({
    data: {
      username
    }
  });
}

export async function getCharacters(): Promise<
  {
    name: string;
    world: string;
    full: string;
    contentId: string;
  }[]
> {
  const chars = await prisma.character.findMany({
    select: {
      name: true,
      world: true,
      contentId: true
    }
  });

  return chars.map((char) => ({
    ...char,
    contentId: char.contentId.toString(16),
    full: `${char.name} @ ${char.world}`
  }));
}

export async function getCharacterFromCID(cid: string) {
  const chars = await prisma.character.findMany({
    select: {
      name: true,
      world: true,
      contentId: true
    }
  });

  return chars.find((x) => x.contentId.toString(16) == cid);
}

export async function getLatestProgression(cid: bigint) {
  const progress = await prisma.questProgression.findMany({
    where: {
      character: {
        contentId: cid
      }
    },
    orderBy: {
      time: "desc"
    },
    take: 1
  });

  return progress.length > 0 ? progress[0] : null;
}

export default prisma;
