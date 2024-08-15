import { useQuery } from "@tanstack/react-query";
import { supabase } from "../../api/supabase";
import { convertToCamelCase } from "../../lib/utils";
import { Insight } from "../../types/insight";
import { insightKeys } from "./query-keys";

const fetchInsights = async (projectId: string): Promise<Insight[]> => {
  const { data, error } = await supabase
    .from("insights")
    .select("*")
    .eq("project_id", projectId)
    .order("position");

  if (error) throw new Error("Failed to fetch insights");

  return convertToCamelCase<Insight[]>(data);
};

export const useFetchInsights = (projectId: string) =>
  useQuery({
    queryFn: () => fetchInsights(projectId),
    queryKey: insightKeys.list(projectId),
  });
