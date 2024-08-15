export const chartKeys = {
  all: (projectId: string) => ["projects", projectId, "charts"] as const,

  lists: (projectId: string) => [...chartKeys.all(projectId), "list"] as const,
  list: (projectId: string) => [...chartKeys.lists(projectId)] as const,

  detail: ({ projectId, id }: { projectId: string; id: number }) =>
    [...chartKeys.all(projectId), id] as const,

  conditions: ({ projectId, id }: { projectId: string; id: number }) =>
    [...chartKeys.detail({ projectId, id }), "conditions"] as const,

  data: ({ projectId, id }: { projectId: string; id: number }) =>
    [...chartKeys.detail({ projectId, id }), "data"] as const,
};
