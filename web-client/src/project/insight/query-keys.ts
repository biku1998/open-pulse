import { projectKeys } from "../../home/query-keys";

export const insightKeys = {
  all: (projectId: string) =>
    [...projectKeys.detail(projectId), "insights"] as const,

  lists: (projectId: string) =>
    [...insightKeys.all(projectId), "list"] as const,

  list: (projectId: string) => [...insightKeys.lists(projectId)] as const,
};
