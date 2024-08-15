import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../../api/supabase";
import { projectKeys } from "../../home/query-keys";
import { Project } from "../../types";
import { channelKeys } from "../channel/query-keys";

const updateProject = async ({
  id,
  updatedBy,
  payload,
}: {
  id: string;
  updatedBy: string;
  payload: Pick<Project, "name">;
}) => {
  const { error } = await supabase
    .from("projects")
    .update({ ...payload, updated_by: updatedBy })
    .eq("id", id);

  if (error) throw new Error("Failed to update project");
};

export const useUpdateProject = ({
  onSuccess,
}: {
  onSuccess?: () => void;
} = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateProject,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: projectKeys.all,
      });
      if (onSuccess) onSuccess();
    },
  });
};

const deleteChannel = async (id: string) => {
  const { error } = await supabase.from("channels").delete().eq("id", id);

  if (error) throw new Error("Failed to delete channel");
};

export const useDeleteChannel = ({
  onSuccess,
}: {
  onSuccess?: () => void;
} = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      projectId,
    }: {
      id: string;
      projectId: string;
    }) => {
      await deleteChannel(id);
      return projectId;
    },
    onSuccess: (projectId: string) => {
      queryClient.invalidateQueries({
        queryKey: channelKeys.list(projectId),
      });
      if (onSuccess) onSuccess();
    },
  });
};

const deleteProject = async (id: string) => {
  const { error } = await supabase.from("projects").delete().eq("id", id);

  if (error) throw new Error("Failed to delete project");
};

export const useDeleteProject = ({
  onSuccess,
}: {
  onSuccess?: () => void;
} = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteProject,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: projectKeys.list(),
      });
      if (onSuccess) onSuccess();
    },
  });
};

const updateChannel = async ({
  id,
  updatedBy,
  name,
}: {
  id: string;
  updatedBy: string;
  name: string;
}) => {
  const { error } = await supabase
    .from("channels")
    .update({ name, updated_by: updatedBy })
    .eq("id", id);

  if (error) throw new Error("Failed to update channel");
};

export const useUpdateChannel = ({
  onSuccess,
}: {
  onSuccess?: () => void;
} = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      updatedBy,
      name,
      projectId,
    }: {
      id: string;
      updatedBy: string;
      name: string;
      projectId: string;
    }) => {
      await updateChannel({ id, name, updatedBy });
      return projectId;
    },
    onSuccess: (projectId) => {
      queryClient.invalidateQueries({
        queryKey: channelKeys.list(projectId),
      });
      if (onSuccess) onSuccess();
    },
  });
};
