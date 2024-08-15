import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../api/supabase";
import { eventKeys } from "./query-keys";

const deleteEvent = async (id: number) => {
  const { error } = await supabase.from("events").delete().eq("id", id);
  if (error) throw new Error("Failed to delete event");
};

export const useDeleteEvent = ({
  onSuccess,
}: { onSuccess?: () => void } = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      projectId,
      eventId,
    }: {
      projectId: string;
      eventId: number;
    }) => {
      await deleteEvent(eventId);

      // for onSuccess to invalidate the correct query
      return projectId;
    },
    onSuccess: (projectId) => {
      queryClient.invalidateQueries({
        queryKey: eventKeys.all(projectId),
      });
      if (onSuccess) onSuccess();
    },
  });
};
