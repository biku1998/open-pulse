import { useQuery } from "@tanstack/react-query";
import { supabase } from "../../api/supabase";

const fetchChannelFeedCounts = async (channelIds: string[]) => {
  const { data, error } = await supabase
    .from("events")
    .select("id, channel_id")
    .in("channel_id", channelIds);

  if (error) throw new Error("Failed to fetch channel feed counts");

  return channelIds.map((channelId) => ({
    channelId,
    count: data.filter((event) => event.channel_id === channelId).length,
  }));
};

export const useFetchChannelFeedCounts = (channelIds: string[]) =>
  useQuery({
    queryFn: () => fetchChannelFeedCounts(channelIds),
    queryKey: [channelIds, "feed-counts"],
    enabled: channelIds.length > 0,
  });
