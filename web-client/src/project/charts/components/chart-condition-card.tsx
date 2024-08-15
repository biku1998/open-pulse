import React from "react";
import { Check, ChevronsUpDown, Plus, Trash2 } from "lucide-react";
import { useGetUser } from "../../../auth/user-store";
import { Button } from "../../../components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "../../../components/ui/command";
import { Input } from "../../../components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../../components/ui/popover";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
import { useFetchProjectTags } from "../../../home/queries";
import { cn } from "../../../lib/utils";
import { ChartCondition, ChartFieldType } from "../../../types/chart";
import {
  useCreateChartCondition,
  useDeleteChartCondition,
  useUpdateChartCondition,
} from "../mutations";

type ChartConditionCardProps = {
  chartConditions: ChartCondition[];
  isLast: boolean;
  parentChartCondition: ChartCondition;
  projectId: string;
};

export default function ChartConditionCard(props: ChartConditionCardProps) {
  const { chartConditions, isLast, parentChartCondition, projectId } = props;

  const [tagKeyComboboxConditionId, setTagKeyComboboxConditionId] =
    React.useState<number | null>(null);

  const openCombobox = (conditionId: number) =>
    setTagKeyComboboxConditionId(conditionId);

  const closeCombobox = () => {
    setTagKeyComboboxConditionId(null);
  };

  const user = useGetUser();

  const createChartConditionMutation = useCreateChartCondition();
  const updateChartConditionMutation = useUpdateChartCondition();
  const deleteChartConditionMutation = useDeleteChartCondition();
  const fetchProjectTagsQuery = useFetchProjectTags(projectId);

  const addCondition = () => {
    if (!user) return;
    createChartConditionMutation.mutate({
      projectId,
      payload: {
        chartId: parentChartCondition.chartId,
        parentId: parentChartCondition.id,
        createdBy: user.id,
        field: "EVENT_NAME",
        operator: "EQUALS",
        value: "",
        logicalOperator: "AND",
      },
    });
  };

  const deleteCondition = (id: number) => {
    deleteChartConditionMutation.mutate({
      chartId: parentChartCondition.chartId,
      id,
      projectId,
    });
  };

  const handleConditionFieldTypeChange = (
    id: number,
    fieldType: ChartFieldType,
  ) => {
    if (fieldType === "EVENT_NAME") {
      updateChartConditionMutation.mutate({
        chartId: parentChartCondition.chartId,
        projectId,
        id,
        payload: {
          field: fieldType,
        },
      });

      const childTagValueConditionId = chartConditions.find(
        (cond) => cond.parentId === id && cond.field === "TAG_VALUE",
      )?.id;

      if (childTagValueConditionId) {
        deleteCondition(childTagValueConditionId);
      }

      return;
    }

    updateChartConditionMutation.mutate(
      {
        chartId: parentChartCondition.chartId,
        projectId,
        id,
        payload: {
          field: fieldType,
          operator: "EQUALS",
          value: "",
        },
      },
      {
        onSuccess: () => {
          if (!user) return;

          createChartConditionMutation.mutate({
            projectId,
            payload: {
              chartId: parentChartCondition.chartId,
              parentId: id,
              createdBy: user.id,
              field: "TAG_VALUE",
              operator: "EQUALS",
              value: "",
              logicalOperator: "AND",
            },
          });
        },
      },
    );
  };

  const tagKeys = Array.from(
    new Set(
      fetchProjectTagsQuery.data
        ? fetchProjectTagsQuery.data.map((tag) => tag.key)
        : [],
    ),
  );

  return (
    <div
      className={cn(
        "flex flex-col border py-5 border-zinc-100 rounded-lg space-y-5 divide-y divide-zinc-100",
        isLast ? "" : "relative",
      )}
    >
      <div className="flex items-center space-x-3 px-4">
        <Select
          value={parentChartCondition.field}
          onValueChange={(value) =>
            handleConditionFieldTypeChange(
              parentChartCondition.id,
              value as ChartFieldType,
            )
          }
        >
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="Select condition criteria" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="EVENT_NAME">Event</SelectItem>
              <SelectItem value="TAG_KEY">Tag</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>

        {parentChartCondition.field === "TAG_KEY" ? (
          <Popover
            open={tagKeyComboboxConditionId === parentChartCondition.id}
            onOpenChange={(open) => {
              if (!open) {
                closeCombobox();
              }
            }}
          >
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={
                  tagKeyComboboxConditionId === parentChartCondition.id
                }
                className="w-[200px] justify-between font-normal"
                onClick={() => openCombobox(parentChartCondition.id)}
              >
                {parentChartCondition.value
                  ? tagKeys.find(
                      (tagKey) => tagKey === parentChartCondition.value,
                    )
                  : "Select tag"}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] max-h-[350px] overflow-y-auto p-0">
              <Command>
                <CommandInput placeholder="Search tag..." />
                <CommandEmpty>No tag key found.</CommandEmpty>
                <CommandGroup>
                  {tagKeys.map((tagKey) => (
                    <CommandItem
                      key={tagKey}
                      value={tagKey}
                      onSelect={(currentValue) => {
                        updateChartConditionMutation.mutate({
                          chartId: parentChartCondition.chartId,
                          projectId,
                          id: parentChartCondition.id,
                          payload: {
                            value: currentValue,
                          },
                        });
                        closeCombobox();
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          parentChartCondition.value === tagKey
                            ? "opacity-100"
                            : "opacity-0",
                        )}
                      />
                      {tagKey}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </Command>
            </PopoverContent>
          </Popover>
        ) : null}

        <Select
          value={
            parentChartCondition.field === "EVENT_NAME"
              ? parentChartCondition.operator === "EQUALS"
                ? "="
                : "!="
              : chartConditions.find(
                    (cond) =>
                      cond.parentId === parentChartCondition.id &&
                      cond.field === "TAG_VALUE",
                  )?.operator === "EQUALS"
                ? "="
                : "!="
          }
          onValueChange={(value) => {
            if (parentChartCondition.field === "EVENT_NAME") {
              updateChartConditionMutation.mutate({
                chartId: parentChartCondition.chartId,
                projectId,
                id: parentChartCondition.id,
                payload: {
                  operator: value === "=" ? "EQUALS" : "NOT_EQUALS",
                },
              });
              return;
            }
            if (parentChartCondition.field === "TAG_KEY") {
              const childTagValueConditionId = chartConditions.find(
                (cond) =>
                  cond.parentId === parentChartCondition.id &&
                  cond.field === "TAG_VALUE",
              )?.id;

              if (!childTagValueConditionId) return;
              updateChartConditionMutation.mutate({
                chartId: parentChartCondition.chartId,
                projectId,
                id: childTagValueConditionId,
                payload: {
                  operator: value === "=" ? "EQUALS" : "NOT_EQUALS",
                },
              });
              return;
            }
          }}
        >
          <SelectTrigger className="w-[70px]">
            <SelectValue placeholder="Select condition operator" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="=">=</SelectItem>
              <SelectItem value="!=">!=</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>

        <Input
          type="text"
          placeholder=""
          className="w-[75%]"
          value={
            parentChartCondition.field === "EVENT_NAME"
              ? parentChartCondition.value
              : chartConditions.find(
                  (cond) =>
                    cond.parentId === parentChartCondition.id &&
                    cond.field === "TAG_VALUE",
                )?.value
          }
          onChange={(e) => {
            if (parentChartCondition.field === "EVENT_NAME") {
              updateChartConditionMutation.mutate({
                chartId: parentChartCondition.chartId,
                projectId,
                id: parentChartCondition.id,
                payload: {
                  value: e.target.value,
                },
              });
              return;
            }
            if (parentChartCondition.field === "TAG_KEY") {
              const childTagValueConditionId = chartConditions.find(
                (cond) =>
                  cond.parentId === parentChartCondition.id &&
                  cond.field === "TAG_VALUE",
              )?.id;

              if (!childTagValueConditionId) return;
              updateChartConditionMutation.mutate({
                chartId: parentChartCondition.chartId,
                projectId,
                id: childTagValueConditionId,
                payload: {
                  value: e.target.value,
                },
              });
              return;
            }
          }}
        />

        {parentChartCondition.logicalOperator === null ? (
          chartConditions.length === 0 ? (
            <Button
              size="icon"
              variant="ghost"
              onClick={addCondition}
              className="animate-in slide-in-from-bottom-2"
            >
              <Plus size={18} className="text-zinc-500" />
            </Button>
          ) : null
        ) : chartConditions.length === 0 ? (
          <div className="flex items-center gap-2">
            <Button size="icon" variant="ghost" onClick={addCondition}>
              <Plus size={18} className="text-zinc-500" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              onClick={() => deleteCondition(parentChartCondition.id)}
              className="text-zinc-500 hover:text-red-500 hover:bg-red-100"
            >
              <Trash2 size={18} />
            </Button>
          </div>
        ) : (
          <Button
            size="icon"
            variant="ghost"
            onClick={() => deleteCondition(parentChartCondition.id)}
            className="text-zinc-500 hover:text-red-500 hover:bg-red-100"
          >
            <Trash2 size={18} />
          </Button>
        )}
      </div>

      {chartConditions
        .filter((chartCond) => chartCond.field !== "TAG_VALUE")
        .map((chartCondition, idx) => (
          <div
            className="flex items-center space-x-3 px-4 pt-4 animate-in slide-in-from-bottom-4 duration-300"
            key={chartCondition.id}
          >
            <Select
              value={chartCondition.field}
              onValueChange={(value) =>
                handleConditionFieldTypeChange(
                  chartCondition.id,
                  value as ChartFieldType,
                )
              }
            >
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Select condition criteria" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="EVENT_NAME">Event</SelectItem>
                  <SelectItem value="TAG_KEY">Tag</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>

            {chartCondition.field === "TAG_KEY" ? (
              <Popover
                open={tagKeyComboboxConditionId === chartCondition.id}
                onOpenChange={(open) => {
                  if (!open) {
                    closeCombobox();
                  }
                }}
              >
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={
                      tagKeyComboboxConditionId === chartCondition.id
                    }
                    className="w-[200px] justify-between font-normal"
                    onClick={() => openCombobox(chartCondition.id)}
                  >
                    {chartCondition.value
                      ? tagKeys.find(
                          (tagKey) => tagKey === chartCondition.value,
                        )
                      : "Select tag"}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] max-h-[350px] overflow-y-auto p-0">
                  <Command>
                    <CommandInput placeholder="Search tag..." />
                    <CommandEmpty>No tag key found.</CommandEmpty>
                    <CommandGroup>
                      {tagKeys.map((tagKey) => (
                        <CommandItem
                          key={tagKey}
                          value={tagKey}
                          onSelect={(currentValue) => {
                            updateChartConditionMutation.mutate({
                              chartId: chartCondition.chartId,
                              projectId,
                              id: chartCondition.id,
                              payload: {
                                value: currentValue,
                              },
                            });
                            closeCombobox();
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              chartCondition.value === tagKey
                                ? "opacity-100"
                                : "opacity-0",
                            )}
                          />
                          {tagKey}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
            ) : null}

            <Select
              // value={chartCondition.operator === "EQUALS" ? "=" : "!="}
              value={
                chartCondition.field === "EVENT_NAME"
                  ? chartCondition.operator === "EQUALS"
                    ? "="
                    : "!="
                  : chartConditions.find(
                        (cond) =>
                          cond.parentId === chartCondition.id &&
                          cond.field === "TAG_VALUE",
                      )?.operator === "EQUALS"
                    ? "="
                    : "!="
              }
              onValueChange={(value) => {
                if (chartCondition.field === "EVENT_NAME") {
                  updateChartConditionMutation.mutate({
                    chartId: parentChartCondition.chartId,
                    projectId,
                    id: chartCondition.id,
                    payload: {
                      operator: value === "=" ? "EQUALS" : "NOT_EQUALS",
                    },
                  });
                  return;
                }
                if (chartCondition.field === "TAG_KEY") {
                  const childTagValueConditionId = chartConditions.find(
                    (cond) =>
                      cond.parentId === chartCondition.id &&
                      cond.field === "TAG_VALUE",
                  )?.id;

                  if (!childTagValueConditionId) return;
                  updateChartConditionMutation.mutate({
                    chartId: parentChartCondition.chartId,
                    projectId,
                    id: childTagValueConditionId,
                    payload: {
                      operator: value === "=" ? "EQUALS" : "NOT_EQUALS",
                    },
                  });
                  return;
                }
              }}
            >
              <SelectTrigger className="w-[70px]">
                <SelectValue placeholder="Select condition operator" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="=">=</SelectItem>
                  <SelectItem value="!=">!=</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            <Input
              type="text"
              placeholder=""
              className="w-[75%]"
              // value={chartCondition.value}
              value={
                chartCondition.field === "EVENT_NAME"
                  ? chartCondition.value
                  : chartConditions.find(
                      (cond) =>
                        cond.parentId === chartCondition.id &&
                        cond.field === "TAG_VALUE",
                    )?.value
              }
              onChange={(e) => {
                if (chartCondition.field === "EVENT_NAME") {
                  updateChartConditionMutation.mutate({
                    chartId: parentChartCondition.chartId,
                    projectId,
                    id: chartCondition.id,
                    payload: {
                      value: e.target.value,
                    },
                  });
                  return;
                }
                if (chartCondition.field === "TAG_KEY") {
                  const childTagValueConditionId = chartConditions.find(
                    (cond) =>
                      cond.parentId === chartCondition.id &&
                      cond.field === "TAG_VALUE",
                  )?.id;

                  if (!childTagValueConditionId) return;
                  updateChartConditionMutation.mutate({
                    chartId: parentChartCondition.chartId,
                    projectId,
                    id: childTagValueConditionId,
                    payload: {
                      value: e.target.value,
                    },
                  });
                  return;
                }
              }}
            />
            {idx ===
            chartConditions.filter(
              (chartCond) => chartCond.field !== "TAG_VALUE",
            ).length -
              1 ? (
              <div className="flex items-center gap-2">
                <Button size="icon" variant="ghost" onClick={addCondition}>
                  <Plus size={18} className="text-zinc-500" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => deleteCondition(chartCondition.id)}
                  className="text-zinc-500 hover:text-red-500 hover:bg-red-100"
                >
                  <Trash2 size={18} />
                </Button>
              </div>
            ) : (
              <Button
                size="icon"
                variant="ghost"
                onClick={() => deleteCondition(chartCondition.id)}
                className="text-zinc-500 hover:text-red-500 hover:bg-red-100"
              >
                <Trash2 size={18} />
              </Button>
            )}
          </div>
        ))}
      {isLast ? null : (
        <div className="absolute -bottom-[29px] left-0 right-0 ml-auto py-2 mr-auto px-3 bg-zinc-50 border border-zinc-300 rounded-lg w-fit flex items-center justify-center z-10">
          <span className="text-sm font-mono text-zinc-600">or when</span>
        </div>
      )}
    </div>
  );
}
