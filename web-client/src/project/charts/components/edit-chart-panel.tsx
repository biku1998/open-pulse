import { useGetUser } from "../../../auth/user-store";
import { Button } from "../../../components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "../../../components/ui/sheet";
import { useCreateChartCondition } from "../mutations";
import { useFetchChartConditions } from "../queries";
import ChartConditionCard from "./chart-condition-card";

type EditChartPanelProps = {
  projectId: string;
  chartId: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export default function EditChartPanel(props: EditChartPanelProps) {
  const { projectId, chartId, open, onOpenChange } = props;
  const user = useGetUser();

  const fetchChartConditionsQuery = useFetchChartConditions({
    projectId,
    id: chartId,
    enabled: open,
  });

  const createChartConditionMutation = useCreateChartCondition();

  const addChartCondition = () => {
    if (!user) return;
    createChartConditionMutation.mutate({
      projectId,
      payload: {
        chartId,
        createdBy: user.id,
        field: "EVENT_NAME",
        operator: "EQUALS",
        value: "",
        logicalOperator: "OR",
        parentId: null,
      },
    });
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-[1000px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Edit chart</SheetTitle>
          <SheetDescription>
            Add or remove conditions to populate the chart
          </SheetDescription>
        </SheetHeader>

        <div className="flex flex-col gap-5 mt-6">
          {fetchChartConditionsQuery.isPending ? (
            <span className="text-xs text-zinc-600">
              Loading chart conditions
            </span>
          ) : null}

          {fetchChartConditionsQuery.data
            ? fetchChartConditionsQuery.data
                .filter(
                  (chartCondition) =>
                    chartCondition.logicalOperator === "OR" ||
                    chartCondition.logicalOperator === null,
                )
                .map((parentChartCondition, idx) => (
                  <ChartConditionCard
                    chartConditions={fetchChartConditionsQuery.data.filter(
                      (chartCondition) => {
                        if (
                          chartCondition.field === "TAG_VALUE" &&
                          chartCondition.logicalOperator === "AND"
                        ) {
                          const parentTagKKeyCondition =
                            fetchChartConditionsQuery.data.find(
                              (chartCond) =>
                                chartCond.field === "TAG_KEY" &&
                                chartCond.id === chartCondition.parentId,
                            );

                          if (parentTagKKeyCondition) {
                            if (
                              parentTagKKeyCondition.id ===
                              parentChartCondition.id
                            )
                              return true;
                            return (
                              parentChartCondition.id ===
                              parentTagKKeyCondition.parentId
                            );
                          }
                          return false;
                        }
                        return (
                          chartCondition.parentId === parentChartCondition.id
                        );
                      },
                    )}
                    key={parentChartCondition.id}
                    parentChartCondition={parentChartCondition}
                    projectId={projectId}
                    isLast={
                      fetchChartConditionsQuery.data.filter(
                        (chartCondition) =>
                          chartCondition.logicalOperator === "OR" ||
                          chartCondition.logicalOperator === null,
                      ).length ===
                      idx + 1
                    }
                  />
                ))
            : null}

          <Button
            variant="outline"
            className="w-fit mx-auto"
            size="sm"
            onClick={addChartCondition}
          >
            Add condition
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
