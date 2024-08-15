import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../api/supabase";
import { convertToCamelCase } from "../lib/utils";
import { Project } from "../types";
import { projectKeys } from "./query-keys";

const createProject = async (
  payload: Pick<Project, "name" | "createdBy">,
): Promise<Project> => {
  const { data, error } = await supabase
    .from("projects")
    .insert({
      name: payload.name,
      created_by: payload.createdBy,
    })
    .select()
    .single();

  if (error) throw new Error("Failed to create project");
  return convertToCamelCase<Project>(data);
};

export const useCreateProject = ({
  onSuccess,
}: {
  onSuccess?: (project: Project) => void;
} = {}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createProject,
    onSuccess: (project) => {
      queryClient.invalidateQueries({
        queryKey: projectKeys.list(),
      });

      if (onSuccess) onSuccess(project);
    },
  });
};
