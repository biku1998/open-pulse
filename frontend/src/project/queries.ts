import { useQuery } from "@tanstack/react-query";
import _keyBy from "lodash/keyBy";
import { supabase } from "../api/supabase";
import { convertToCamelCase } from "../lib/utils";
import { Channel } from "../types/channel";
import { Event } from "../types/event";
import { eventKeys } from "./query-keys";

const fetchEvents = async (projectId: string): Promise<Event[]> => {
  const { data, error } = await supabase
    .from("events")
    .select("*")
    .eq("project_id", projectId)
    .order("created_at", { ascending: false });

  if (error) throw new Error("Failed to fetch events");

  return convertToCamelCase<Event[]>(data);
};

const fetchChannelNamesById = async (
  channelIds: string[],
): Promise<Pick<Channel, "id" | "name">[]> => {
  const { data, error } = await supabase
    .from("channels")
    .select("id, name")
    .in("id", channelIds);

  if (error) throw new Error("Failed to fetch channels");

  return data;
};

export const useFetchEvents = (projectId: string) =>
  useQuery({
    queryKey: eventKeys.list(projectId),
    queryFn: async () => {
      const events = await fetchEvents(projectId);
      const channelsInfo = await fetchChannelNamesById(
        events.map((event) => event.channelId),
      );
      const channelsInfoById = _keyBy(channelsInfo, "id");
      return events.map((event) => ({
        event,
        channel: {
          id: event.channelId,
          name: channelsInfoById[event.channelId].name,
        },
      }));
    },
  });
