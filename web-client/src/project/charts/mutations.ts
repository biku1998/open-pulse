import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../../api/supabase";
import { convertToCamelCase } from "../../lib/utils";
import { Chart, ChartCondition } from "../../types/chart";
import { chartKeys } from "./query-keys";

const createChart = async (
  payload: Pick<
    Chart,
    "name" | "description" | "chartType" | "createdBy" | "projectId"
  >,
): Promise<Chart> => {
  const { name, description, chartType, createdBy, projectId } = payload;
  const { data, error } = await supabase
    .from("charts")
    .insert({
      name,
      description,
      chart_type: chartType,
      project_id: projectId,
      created_by: createdBy,
    })
    .select()
    .single();

  if (error) throw new Error("Failed to create chart");

  // we need to create one default chart condition based on what type of chart was created
  switch (data.chart_type) {
    case "LINE": {
      await supabase
        .from("chart_conditions")
        .insert({
          chart_id: data.id,
          created_by: createdBy,
          field: "EVENT_NAME",
          value: "",
          operator: "EQUALS",
        })
        .single();
      break;
    }
    default:
      throw new Error("Invalid chart type was created");
  }

  // NOTE: remove this later
  // with chart we are going to create a default aggregation
  await supabase.from("chart_aggregations").insert({
    chart_id: data.id,
    aggregation_type: "COUNT",
    created_by: payload.createdBy,
  });

  return convertToCamelCase<Chart>(data);
};

export const useCreateChart = ({
  onSuccess,
}: {
  onSuccess?: (data: Chart) => void;
} = {}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createChart,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: chartKeys.list(variables.projectId),
      });
      if (onSuccess) onSuccess(data);
    },
  });
};

const deleteChart = async ({ id }: { id: number; projectId: string }) => {
  const { error } = await supabase.from("charts").delete().eq("id", id);

  if (error) throw new Error("Failed to delete chart");
};

export const useDeleteChart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteChart,
    onSuccess: (_, { projectId }) =>
      queryClient.invalidateQueries({
        queryKey: chartKeys.list(projectId),
      }),
  });
};

const createChartCondition = async ({
  payload,
}: {
  projectId: string;
  payload: Omit<ChartCondition, "id" | "createdAt" | "updatedAt" | "updatedBy">;
}): Promise<ChartCondition> => {
  const { data, error } = await supabase
    .from("chart_conditions")
    .insert({
      chart_id: payload.chartId,
      parent_id: payload.parentId,
      field: payload.field,
      operator: payload.operator,
      value: payload.value,
      created_by: payload.createdBy,
      logical_operator: payload.logicalOperator,
    })
    .select()
    .single();

  if (error) throw new Error("Failed to create chart condition");

  return convertToCamelCase<ChartCondition>(data);
};

export const useCreateChartCondition = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createChartCondition,
    onSuccess: ({ chartId }, { projectId }) =>
      queryClient.invalidateQueries({
        queryKey: chartKeys.conditions({ projectId, id: chartId }),
      }),
  });
};

const updateChartCondition = async ({
  id,
  payload,
}: {
  id: number;
  chartId: number;
  projectId: string;
  payload: Partial<Pick<ChartCondition, "field" | "value" | "operator">>;
}) => {
  const { error } = await supabase
    .from("chart_conditions")
    .update(payload)
    .eq("id", id)
    .single();

  if (error) throw new Error("Failed to update chart condition");
};

export const useUpdateChartCondition = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateChartCondition,
    onSuccess: (_, { chartId, projectId }) =>
      queryClient.invalidateQueries({
        queryKey: chartKeys.conditions({ projectId, id: chartId }),
      }),
  });
};

const deleteChartCondition = async ({
  id,
}: {
  id: number;
  chartId: number;
  projectId: string;
}) => {
  const { error } = await supabase
    .from("chart_conditions")
    .delete()
    .eq("id", id);

  if (error) throw new Error("Failed to delete chart condition");
};

export const useDeleteChartCondition = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteChartCondition,
    onSuccess: (_, { chartId, projectId }) =>
      queryClient.invalidateQueries({
        queryKey: chartKeys.conditions({ projectId, id: chartId }),
      }),
  });
};
