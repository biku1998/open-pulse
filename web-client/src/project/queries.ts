import { useQuery } from "@tanstack/react-query";
import { supabase } from "../api/supabase";
import { convertToCamelCase } from "../lib/utils";
import { EventPayload } from "../types/event";
import { EventTag } from "../types/event-tag";
import { eventKeys } from "./query-keys";

export const fetchEvents = async ({
  projectId,
  channelId,
  userId,
  tags = [],
}: {
  projectId: string;
  channelId?: string;
  userId?: string;
  tags?: Array<{
    key: string;
    value: string;
  }>;
}): Promise<Array<EventPayload>> => {
  const query = supabase
    .from("events")
    .select(
      `*,
    channel:channels!inner (
      id,
      name
    ),
    tags: event_tags!inner (
      id,
      key,
      value
    )
    `,
    )
    .eq("project_id", projectId)
    .order("created_at", { ascending: false });

  if (tags.length !== 0) {
    query.in(
      "tags.key",
      tags.map((tag) => tag.key),
    );
    query.in(
      "tags.value",
      tags.map((tag) => tag.value),
    );
  }

  if (channelId) {
    query.eq("channel.id", channelId);
  }

  if (userId) {
    query.eq("user_id", userId);
  }

  const { data, error } = await query;

  if (error) throw new Error("Failed to fetch events");

  return convertToCamelCase<Array<EventPayload>>(data);
};

export const fetchTagsByEventIds = async ({
  eventIds,
  tags = [],
}: {
  eventIds: number[];
  tags?: Array<{
    key: string;
    value: string;
  }>;
}): Promise<Pick<EventTag, "id" | "key" | "value" | "eventId">[]> => {
  const query = supabase
    .from("event_tags")
    .select("id, key, value, event_id")
    .in("event_id", eventIds);

  if (tags.length !== 0) {
    query.in(
      "key",
      tags.map((tag) => tag.key),
    );
    query.in(
      "value",
      tags.map((tag) => tag.value),
    );
  }

  const { data, error } = await query;

  if (error) throw new Error("Failed to fetch tags");

  return convertToCamelCase<
    Pick<EventTag, "id" | "key" | "value" | "eventId">[]
  >(data);
};

export const useFetchEvents = ({
  tags,
  projectId,
  userId,
}: {
  projectId: string;
  userId: string;
  tags?: Array<{
    key: string;
    value: string;
  }>;
}) =>
  useQuery({
    queryKey: eventKeys.list(
      projectId,
      JSON.stringify({
        userId,
        tags,
      }),
    ),
    queryFn: () => fetchEvents({ projectId, userId, tags }),
  });
