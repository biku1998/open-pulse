import { AlertCircle, Copy, Hash, Trash } from "lucide-react";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "../../../components/ui/alert";
import { Button } from "../../../components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../../../components/ui/tooltip";
import { toast } from "../../../lib/utils";
import { useConfirmationDialog } from "../../../zustand-stores";
import { useFetchChannels } from "../../channel/queries";
import { useDeleteChannel } from "../mutations";
import { useFetchChannelFeedCounts } from "../queries";
import EditChannelDialog from "./edit-channel-dialog";

type ManageChannelsProps = {
  projectId: string;
};

export default function ManageChannels(props: ManageChannelsProps) {
  const { projectId } = props;

  const { openConfirmationDialog, closeConfirmationDialog } =
    useConfirmationDialog((store) => ({
      openConfirmationDialog: store.openConfirmationDialog,
      closeConfirmationDialog: store.closeConfirmationDialog,
    }));

  const fetchChannelsQuery = useFetchChannels(projectId);

  const fetchChannelFeedCounts = useFetchChannelFeedCounts(
    fetchChannelsQuery.data
      ? fetchChannelsQuery.data.map((channel) => channel.id)
      : [],
  );

  const deleteChannelMutation = useDeleteChannel({
    onSuccess: () => toast.success("Channel deleted successfully"),
  });

  const handleDeleteChannel = ({ id, name }: { id: string; name: string }) => {
    openConfirmationDialog({
      title: "Delete channel",
      content: (
        <div className="flex flex-col gap-6">
          <p>
            Channel <b>{name}</b> will be deleted with all its events.
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
        deleteChannelMutation.mutate({
          projectId,
          id,
        });
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

  return fetchChannelsQuery.data && fetchChannelFeedCounts.data ? (
    <section className="p-6 border border-zinc-200 rounded-[8px] w-full animate-in slide-in-from-bottom-2">
      <div className="flex flex-col gap-1 mb-9">
        <h2 className="font-semibold">Channels</h2>
        <p className="text-sm text-zinc-400">
          You have {fetchChannelsQuery.data.length} channels in the project
        </p>
      </div>

      <div className="flex flex-col divide-y divide-zinc-100 *:py-5 first:*:pt-0 last:*:pb-0">
        {fetchChannelsQuery.data.map((channel) => (
          <div className="flex items-center justify-between">
            <div className="flex gap-3">
              <div className="w-9 h-9 rounded-full p-2 bg-zinc-50 border border-zinc-200 flex items-center justify-center">
                <Hash className="w-[18px] h-[18px] text-zinc-400" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm mb-1">{channel.name}</span>
                <span className="text-xs text-zinc-400 mb-2">{channel.id}</span>
                <span className="text-sm text-zinc-500">
                  {fetchChannelFeedCounts.data.find(
                    (feedCount) => feedCount.channelId === channel.id,
                  )?.count ?? 0}{" "}
                  feeds
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="text-zinc-400 hover:text-zinc-500"
                      onClick={() => {
                        navigator.clipboard.writeText(channel.id);
                        toast("Channel ID copied to clipboard");
                      }}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-sm text-zinc-600">Copy channel ID</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <EditChannelDialog
                channelId={channel.id}
                channelName={channel.name}
                projectId={projectId}
              />
              <Button
                size="icon"
                variant="ghost"
                className="hover:bg-red-50 hover:text-red-500 text-zinc-400"
                onClick={() => handleDeleteChannel(channel)}
              >
                <Trash className="w-4 h-4 " />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </section>
  ) : null;
}
