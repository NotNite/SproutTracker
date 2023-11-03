import { z } from "zod";

export const CharacterSchema = z.object({
  contentId: z.number(),
  name: z.string(),
  world: z.string()
});

export const ProgressSubmitSchema = z.object({
  character: CharacterSchema,
  quest: z.number(),
  sequence: z.number(),
  complete: z.boolean()
});

export const AdminCreateSchema = z.object({
  username: z.string()
});
