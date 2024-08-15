export const tokenKeys = {
  all: ["tokens"] as const,
  lists: () => [...tokenKeys.all, "list"] as const,
  list: () => [...tokenKeys.lists()] as const,
};
