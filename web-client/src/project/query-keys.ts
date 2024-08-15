import { projectKeys } from "../home/query-keys";

export const eventKeys = {
  all: (projectId: string) =>
    [...projectKeys.detail(projectId), "events"] as const,

  lists: (projectId: string) => [...eventKeys.all(projectId), "list"] as const,
  list: (projectId: string, filters?: string) =>
    [...eventKeys.lists(projectId), { filters }] as const,
  detail: (projectId: string, id: number) =>
    [...eventKeys.all(projectId), id] as const,
};
