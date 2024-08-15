import { useQuery } from "@tanstack/react-query";
import { supabase } from "../api/supabase";
import { convertToCamelCase } from "../lib/utils";
import { Project } from "../types";
import { EventTag } from "../types/event-tag";
import { projectKeys } from "./query-keys";

const fetchProjects = async (): Promise<Project[]> => {
  const { data, error } = await supabase.from("projects").select("*");

  if (error) throw new Error("Failed to fetch projects");

  return convertToCamelCase<Project[]>(data);
};

const fetchProjectChannelCount = async (projectId: string): Promise<number> => {
  const { data, error } = await supabase
    .from("channels")
    .select("id")
    .eq("project_id", projectId);

  if (error) throw new Error("Failed to fetch project channel count");

  return data.length;
};

const fetchProjectInsightCount = async (projectId: string): Promise<number> => {
  const { data, error } = await supabase
    .from("insights")
    .select("id")
    .eq("project_id", projectId);

  if (error) throw new Error("Failed to fetch project insight count");

  return data.length;
};

export const useFetchProjects = () =>
  useQuery({
    queryKey: projectKeys.list(),
    queryFn: async () => {
      const projects = await fetchProjects();
      const resp = await Promise.all(
        projects.map(async (project) => {
          const channelCount = await fetchProjectChannelCount(project.id);
          const insightCount = await fetchProjectInsightCount(project.id);
          return { project, channelCount, insightCount };
        }),
      );
      return resp;
    },
  });

const getProjectTags = async (
  projectId: string,
): Promise<Pick<EventTag, "id" | "key" | "value">[]> => {
  const { data, error } = await supabase
    .from("event_tags")
    .select("id, key, value")
    .eq("project_id", projectId);

  if (error) throw new Error("Failed to fetch project tags");

  return data;
};

export const useFetchProjectTags = (projectId: string) =>
  useQuery({
    queryKey: projectKeys.tags(projectId),
    queryFn: () => getProjectTags(projectId),
  });
