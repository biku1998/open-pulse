import { z } from "zod";

const EventTag = z.object({
  id: z.number(),
  key: z.string(),
  value: z.string(),
  eventId: z.number(),
  createdBy: z.string().uuid(),
  createdAt: z.string(),
});

export type EventTag = z.infer<typeof EventTag>;
