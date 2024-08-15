import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../../api/supabase";
import { convertToCamelCase } from "../../lib/utils";
import { Channel } from "../../types/channel";
import { channelKeys } from "./query-keys";

const createChannel = async ({
  projectId,
  name,
  position,
  createdBy,
}: {
  projectId: string;
  name: string;
  position: number;
  createdBy: string;
}): Promise<Pick<Channel, "id" | "name" | "projectId" | "position">> => {
  const { data, error } = await supabase
    .from("channels")
    .insert({
      project_id: projectId,
      name,
      position,
      created_by: createdBy,
    })
    .select("id, name, position, project_id")
    .single();

  if (error) throw new Error("Failed to create channel");

  return convertToCamelCase<
    Pick<Channel, "id" | "name" | "projectId" | "position">
  >(data);
};

export const useCreateChannel = ({
  onSuccess,
}: {
  onSuccess?: (
    data: Pick<Channel, "id" | "name" | "projectId" | "position">,
  ) => void;
} = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createChannel,
    onSuccess: (channel) => {
      queryClient.invalidateQueries({
        queryKey: channelKeys.list(channel.projectId),
      });
      if (onSuccess) onSuccess(channel);
    },
  });
};
