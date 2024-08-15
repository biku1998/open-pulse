import { useNavigate, useParams } from "react-router-dom";
import { AlertCircle, Trash } from "lucide-react";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "../../../components/ui/alert";
import { Button } from "../../../components/ui/button";
import { useFetchProjects } from "../../../home/queries";
import { toast } from "../../../lib/utils";
import { useConfirmationDialog } from "../../../zustand-stores";
import ProjectHeader from "../../components/project-header";
import EditProjectForm from "../components/edit-project-form";
import ManageChannels from "../components/manage-channels";
import { useDeleteProject } from "../mutations";

export default function SettingPage() {
  const { projectId = "" } = useParams();

  const navigate = useNavigate();

  const fetchProjectsQuery = useFetchProjects();

  const { openConfirmationDialog, closeConfirmationDialog } =
    useConfirmationDialog((store) => ({
      openConfirmationDialog: store.openConfirmationDialog,
      closeConfirmationDialog: store.closeConfirmationDialog,
    }));

  const deleteProjectMutation = useDeleteProject({
    onSuccess: () => {
      toast.success("Project deleted successfully");
      navigate("/", { replace: true });
    },
  });

  const handleDeleteProject = () => {
    if (!fetchProjectsQuery.data) return;

    const project = fetchProjectsQuery.data.find(
      ({ project }) => project.id === projectId,
    );

    if (!project) return;

    const {
      project: { name, id },
    } = project;

    openConfirmationDialog({
      title: "Delete project",
      content: (
        <div className="flex flex-col gap-6">
          <p>
            Project <b>{name}</b> project will be deleted with all of its
            channels, insights and events.
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
        deleteProjectMutation.mutate(id);
        closeConfirmationDialog();
      },
      onCancel: () => {
        closeConfirmationDialog();
      },
      confirmButtonVariant: "destructive",
      confirmButtonText: "Delete",
      twoFactorConfirm: true,
      twoFactorConfirmText: name,
    });
  };

  return (
    <>
      <ProjectHeader />
      <div
        className="flex flex-col items-center mx-auto gap-6 py-6 max-w-[828px]"
        key={projectId}
      >
        {fetchProjectsQuery.data ? (
          <EditProjectForm
            projectId={projectId}
            projectName={
              fetchProjectsQuery.data.find(
                ({ project }) => project.id === projectId,
              )?.project?.name ?? ""
            }
          />
        ) : null}
        <ManageChannels projectId={projectId} />
        <section className="p-6 border border-zinc-200 rounded-[8px] w-full animate-in slide-in-from-bottom-2 flex flex-col gap-6">
          <h2 className="font-semibold">Danger zone</h2>
          <div className="p-5 rounded-[8px] w-full border border-red-200 bg-red-50 flex flex-col gap-4">
            <p className="text-red-600 font-medium text-sm">
              This project will be deleted with all it&apos;s data
            </p>
            <Button
              variant="destructive"
              className="w-fit"
              onClick={handleDeleteProject}
            >
              <Trash className="h-4 w-4 mr-2" /> Delete project
            </Button>
          </div>
        </section>
      </div>
    </>
  );
}
