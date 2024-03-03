import React from "react";
import { useParams } from "react-router-dom";
import { BarChart4 } from "lucide-react";
import Nothing from "../../../components/nothing";
import { Skeleton } from "../../../components/ui/skeleton";
import { useConfirmationDialog } from "../../../zustand-stores";
import ProjectHeader from "../../components/project-header";
import ChartCard from "../components/chart-card";
import CreateChartDialog from "../components/create-chart-dialog";
import EditChartPanel from "../components/edit-chart-panel";
import { useFetchCharts } from "../queries";

export default function ChartPage() {
  const [editChartPanelOpen, setEditChartPanelOpen] = React.useState(false);

  const { projectId = "" } = useParams();
  const fetchChartsQuery = useFetchCharts(projectId);

  const { openConfirmationDialog, closeConfirmationDialog } =
    useConfirmationDialog((store) => ({
      openConfirmationDialog: store.openConfirmationDialog,
      closeConfirmationDialog: store.closeConfirmationDialog,
    }));

  const handleChartDelete = (id: number) => {
    openConfirmationDialog({
      title: "Delete chart",
      confirmButtonVariant: "destructive",
      content: <p>Chart will be deleted permanently</p>,
      onConfirm: () => {
        // logout();
        // navigate("/auth/login", { replace: true });
        closeConfirmationDialog();
      },
      onCancel: () => {
        closeConfirmationDialog();
      },
      confirmButtonText: "Delete",
    });
  };

  const handleChartEdit = (id: number) => {
    setEditChartPanelOpen(true);
  };

  return (
    <>
      <ProjectHeader>
        <CreateChartDialog />
      </ProjectHeader>
      <div className="flex flex-col items-center gap-6 py-6">
        {fetchChartsQuery.isPending ? (
          <>
            <Skeleton className="h-[366px] w-[780px] rounded-lg" />
            <Skeleton className="h-[366px] w-[780px] rounded-lg" />
            <Skeleton className="h-[366px] w-[780px] rounded-lg" />
            <Skeleton className="h-[366px] w-[780px] rounded-lg" />
          </>
        ) : null}

        {fetchChartsQuery.data
          ? fetchChartsQuery.data.map((chart) => (
              <ChartCard
                {...chart}
                projectId={projectId}
                key={chart.id}
                handleChartDelete={handleChartDelete}
                handleChartEdit={handleChartEdit}
              />
            ))
          : null}

        {fetchChartsQuery.data ? (
          fetchChartsQuery.data.length === 0 ? (
            <Nothing
              title="No charts found"
              subText="All charts will show up here"
              icon={<BarChart4 />}
            />
          ) : null
        ) : null}
      </div>
      <EditChartPanel
        projectId={projectId}
        chartId={12}
        open={editChartPanelOpen}
        onOpenChange={setEditChartPanelOpen}
      />
    </>
  );
}
