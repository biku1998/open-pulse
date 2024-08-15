import { z } from "zod";

const ChannelSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  projectId: z.string().uuid(),
  position: z.number(),
  createdBy: z.string().uuid(),
  updatedBy: z.string().uuid().nullable(),
  createdAt: z.string(),
  updatedAt: z.string().nullable(),
});

export type Channel = z.infer<typeof ChannelSchema>;
