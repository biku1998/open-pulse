import { z } from "zod";

export const CHART_TYPES = [
  "LINE",
  "BAR",
  "PIE",
  "MULTI_LINE",
  "STACKED_BAR",
  "FUNNEL",
] as const;

const ChartType = z.enum(CHART_TYPES);

export const ChartSchema = z.object({
  id: z.number(),
  name: z
    .string()
    .min(4, {
      message: "Chart name must be at least 4 characters.",
    })
    .trim(),
  description: z.string().nullable(),
  chartType: ChartType,
  projectId: z.string().uuid(),
  createdBy: z.string().uuid(),
  updatedBy: z.string().uuid().nullable(),
  createdAt: z.string(),
  updatedAt: z.string().nullable(),
});

export type Chart = z.infer<typeof ChartSchema>;

export const CHART_CONDITION_FIELD_TYPES = [
  "EVENT_NAME",
  "TAG_KEY",
  "TAG_VALUE",
  "USER_ID",
] as const;

export const ChartConditionFieldType = z.enum(CHART_CONDITION_FIELD_TYPES);

export const CHART_CONDITION_OPERATOR = ["EQUALS", "NOT_EQUALS"] as const;

const ChartConditionOperator = z.enum(CHART_CONDITION_OPERATOR);

export const CHART_CONDITION_LOGICAL_OPERATOR = ["AND", "OR"] as const;

const ChartConditionLogicalOperator = z.enum(CHART_CONDITION_LOGICAL_OPERATOR);

const ChartConditionSchema = z.object({
  id: z.number(),
  chartId: z.number(),
  parentId: z.number().nullable(),
  field: ChartConditionFieldType,
  operator: ChartConditionOperator,
  logicalOperator: ChartConditionLogicalOperator.nullable(),
  value: z.string(),
  createdBy: z.string().uuid(),
  updatedBy: z.string().uuid().nullable(),
  createdAt: z.string(),
  updatedAt: z.string().nullable(),
});

export type ChartCondition = z.infer<typeof ChartConditionSchema>;

export const CHART_AGGREGATION_TYPE = [
  "SUM",
  "AVG",
  "COUNT",
  "MIN",
  "MAX",
  "COUNT_DISTINCT",
  "MEDIAN",
] as const;

const ChartAggregationType = z.enum(CHART_AGGREGATION_TYPE);

const ChartAggregationSchema = z.object({
  id: z.number(),
  name: z.string(),
  chartId: z.number(),
  aggregationType: ChartAggregationType,
  field: z.string().nullable(),
  createdBy: z.string().uuid(),
  updatedBy: z.string().uuid().nullable(),
  createdAt: z.string(),
  updatedAt: z.string().nullable(),
});

export type ChartAggregation = z.infer<typeof ChartAggregationSchema>;
export type ChartFieldType = z.infer<typeof ChartConditionFieldType>;
