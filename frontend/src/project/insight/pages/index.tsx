import * as React from "react";
import { useParams } from "react-router-dom";
import { AlertCircle, Edit, Lightbulb } from "lucide-react";
import Nothing from "../../../components/nothing";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "../../../components/ui/alert";
import { Button } from "../../../components/ui/button";
import { Skeleton } from "../../../components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../../../components/ui/tooltip";
import { cn } from "../../../lib/utils";
import { useConfirmationDialog } from "../../../zustand-stores";
import ProjectHeader from "../../components/project-header";
import InsightCard from "../components/insight-card";
import { useDeleteInsight } from "../mutations";
import { useFetchInsights } from "../queries";

export default function InsightPage() {
  const { projectId = "" } = useParams();

  const [editModeEnabled, setEditModeEnabled] = React.useState(false);

  const { openConfirmationDialog, closeConfirmationDialog } =
    useConfirmationDialog((store) => ({
      openConfirmationDialog: store.openConfirmationDialog,
      closeConfirmationDialog: store.closeConfirmationDialog,
    }));

  const fetchInsightsQuery = useFetchInsights(projectId);
  const deleteInsightMutation = useDeleteInsight();

  const toggleEditMode = () => {
    setEditModeEnabled((prev) => !prev);
  };

  const handleInsightDelete = ({ id, name }: { id: number; name: string }) => {
    openConfirmationDialog({
      title: "Delete insight",
      content: (
        <div className="flex flex-col gap-6">
          <p>
            Insight <b>{name}</b> will be deleted.
          </p>

          <Alert
            variant="destructive"
            className="animate-in slide-in-from-bottom-2"
          >
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Warning</AlertTitle>
            <AlertDescription>
              This action is not reversible. Please be certain.
            </AlertDescription>
          </Alert>
        </div>
      ),
      onConfirm: () => {
        deleteInsightMutation.mutate({ id, projectId });
        closeConfirmationDialog();
      },
      onCancel: () => {
        closeConfirmationDialog();
      },
      confirmButtonVariant: "destructive",
      confirmButtonText: "Delete",
    });
  };

  return (
    <>
      <ProjectHeader>
        {fetchInsightsQuery.data ? (
          fetchInsightsQuery.data.length !== 0 ? (
            <TooltipProvider delayDuration={0}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="icon"
                    variant={editModeEnabled ? "default" : "ghost"}
                    className={cn(
                      "mr-4",
                      editModeEnabled
                        ? ""
                        : "text-zinc-500 hover:text-zinc-600",
                    )}
                    onClick={toggleEditMode}
                  >
                    <Edit className="h-4 w-4 animate-in slide-in-from-bottom-2" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-sm text-zinc-600">
                    {editModeEnabled ? "Disable" : "Enable"} edit mode
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ) : null
        ) : null}
      </ProjectHeader>
      <div
        className="flex flex-col items-center mx-auto gap-6 py-6 max-w-[780px]"
        key={projectId}
      >
        <div className="flex gap-5 flex-wrap">
          {fetchInsightsQuery.isPending ? (
            <>
              <Skeleton className="h-[102px] w-[380px] rounded-xl" />
              <Skeleton className="h-[102px] w-[380px] rounded-xl" />
              <Skeleton className="h-[130px] w-full rounded-xl" />
            </>
          ) : null}

          {fetchInsightsQuery.data
            ? fetchInsightsQuery.data.map((insight) => (
                <InsightCard
                  key={insight.id}
                  insight={insight}
                  fullWidth={
                    fetchInsightsQuery.data.length % 2 !== 0 &&
                    fetchInsightsQuery.data.indexOf(insight) ===
                      fetchInsightsQuery.data.length - 1
                  }
                  handleInsightDelete={handleInsightDelete}
                  editModeEnabled={editModeEnabled}
                />
              ))
            : null}

          {fetchInsightsQuery.data ? (
            fetchInsightsQuery.data.length === 0 ? (
              <Nothing
                title="No insights found"
                subText="All insights will show up here"
                icon={<Lightbulb />}
              />
            ) : null
          ) : null}
        </div>
      </div>
    </>
  );
}
