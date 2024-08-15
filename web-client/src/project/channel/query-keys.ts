export const channelKeys = {
  all: (projectId: string) => ["projects", projectId, "channels"] as const,

  lists: (projectId: string) =>
    [...channelKeys.all(projectId), "list"] as const,
  list: (projectId: string) => [...channelKeys.lists(projectId)] as const,
  detail: ({ projectId, id }: { projectId: string; id: string }) =>
    [...channelKeys.all(projectId), id] as const,

  events: ({ projectId, id }: { projectId: string; id: string }) =>
    [...channelKeys.detail({ projectId, id }), "events"] as const,

  eventLists: ({ projectId, id }: { projectId: string; id: string }) =>
    [...channelKeys.events({ projectId, id }), "list"] as const,

  eventList: ({
    projectId,
    id,
    filters,
  }: {
    projectId: string;
    id: string;
    filters?: string;
  }) => [...channelKeys.eventLists({ projectId, id }), { filters }] as const,
};
