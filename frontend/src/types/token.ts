import { z } from "zod";

const TokenSchema = z.object({
  id: z.string().uuid(),
  isActive: z.boolean(),
  value: z.string(),
  name: z.string(),
  createdBy: z.string().uuid(),
  createdAt: z.string(),
});

export type Token = z.infer<typeof TokenSchema>;
