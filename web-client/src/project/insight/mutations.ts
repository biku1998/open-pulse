import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../../api/supabase";
import { Insight } from "../../types/insight";
import { insightKeys } from "./query-keys";

const deleteInsight = async ({ id }: { id: number; projectId: string }) => {
  const { error } = await supabase.from("insights").delete().eq("id", id);

  if (error) throw new Error("Failed to delete insight");
};

export const useDeleteInsight = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteInsight,
    onSuccess: (_, { projectId }) => {
      queryClient.invalidateQueries({
        queryKey: insightKeys.list(projectId),
      });
    },
  });
};

const updateInsight = async ({
  id,
  payload,
}: {
  id: number;
  projectId: string;
  payload: Partial<Pick<Insight, "name" | "icon" | "position" | "value">>;
}) => {
  const { error } = await supabase
    .from("insights")
    .update(payload)
    .eq("id", id);

  if (error) throw new Error("Failed to update insight");
};

export const useUpdateInsight = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateInsight,
    onMutate: async ({ projectId, payload, id }) => {
      await queryClient.cancelQueries({
        queryKey: insightKeys.list(projectId),
      });

      const previousInsights = queryClient.getQueryData<Insight[]>(
        insightKeys.list(projectId),
      );

      queryClient.setQueryData<Insight[]>(
        insightKeys.list(projectId),
        (old) => {
          if (!old) return [];

          return old.map((insight) => {
            if (insight.id === id) {
              return {
                ...insight,
                ...payload,
              };
            }

            return insight;
          });
        },
      );

      return { previousInsights };
    },
    onError: (_, __, context) => {
      if (!context) return;
      if (!context.previousInsights) return;

      queryClient.setQueryData(
        insightKeys.list(context.previousInsights[0].projectId),
        context.previousInsights,
      );
    },
    onSettled: (_, __, { projectId }) => {
      queryClient.invalidateQueries({
        queryKey: insightKeys.list(projectId),
      });
    },
  });
};
