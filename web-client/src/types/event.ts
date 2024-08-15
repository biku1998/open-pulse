import { z } from "zod";
import { Channel } from "./channel";
import { EventTag } from "./event-tag";

const EventSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string().nullable(),
  icon: z.string().nullable(),
  userId: z.string().uuid().nullable(),
  channelId: z.string().uuid(),
  createdBy: z.string().uuid(),
  createdAt: z.string(),
});

export type Event = z.infer<typeof EventSchema>;

export type EventPayload = Omit<Event, "createdBy" | "channelId"> & {
  channel: Pick<Channel, "id" | "name">;
  tags: Array<Pick<EventTag, "id" | "key" | "value">>;
};
