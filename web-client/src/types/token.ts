import { z } from "zod";

const TokenSchema = z.object({
  id: z.string().uuid(),
  isActive: z.boolean(),
  value: z.string(),
  name: z.string(),
  createdBy: z.string().uuid(),
  createdAt: z.string(),
  updatedAt: z.string().nullable(),
  updatedBy: z.string().uuid().nullable(),
});

export type Token = z.infer<typeof TokenSchema>;
