import React from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { Hash, Rss } from "lucide-react";
import CollapseIcon from "../../../assets/collapse-icon.svg";
import ExpandIcon from "../../../assets/expand-icon.svg";
import Nothing from "../../../components/nothing";
import Tag from "../../../components/tag";
import { Button } from "../../../components/ui/button";
import { Skeleton } from "../../../components/ui/skeleton";
import {
  CHANNEL_NAVBAR_WIDTH,
  HEADER_HEIGHT,
  NAVBAR_WIDTH,
} from "../../../constants";
import { cn } from "../../../lib/utils";
import { useConfirmationDialog } from "../../../zustand-stores";
import EventLogCard from "../../components/event-log-card";
import EventLogFilter from "../../components/event-log-filter";
import ProjectHeader from "../../components/project-header";
import { useDeleteEvent } from "../../mutations";
import CreateChannelDialog from "../components/create-channel-dialog";
import { useFetchChannelEvents, useFetchChannels } from "../queries";
import { channelKeys } from "../query-keys";

export default function ChannelPage() {
  const { projectId = "", channelId } = useParams();
  const [searchParams] = useSearchParams();

  const [isEventLogCardExpanded, setIsEventLogCardExpanded] =
    React.useState(false);

  const fetchChannelsQuery = useFetchChannels(projectId);

  const handleEventLogCardCollapseToggle = () => {
    setIsEventLogCardExpanded((prev) => !prev);
  };

  const queryClient = useQueryClient();

  const filters = searchParams.getAll("filter");

  const { openConfirmationDialog, closeConfirmationDialog } =
    useConfirmationDialog((store) => ({
      openConfirmationDialog: store.openConfirmationDialog,
      closeConfirmationDialog: store.closeConfirmationDialog,
    }));

  const fetchChannelEventsQuery = useFetchChannelEvents({
    projectId,
    channelId,
    userId: filters.filter((f) => f.includes("userId"))[0]?.split(":eq:")[1],
    tags: filters
      .filter((f) => !f.includes("userId"))
      .map((f) => {
        const [key, value] = f.split(":eq:");
        return { key, value };
      }),
  });

  const deleteEventMutation = useDeleteEvent({
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: channelKeys.detail({ projectId, id: channelId ?? "" }),
      });
    },
  });

  const isLoading =
    (fetchChannelEventsQuery.isPending || fetchChannelsQuery.isPending) &&
    Boolean(channelId);

  const handleDeleteEvent = (id: number) => {
    openConfirmationDialog({
      title: "Delete event",
      content: <p>Are you sure you want to delete event?</p>,
      onConfirm: () => {
        deleteEventMutation.mutate({
          projectId,
          eventId: id,
        });
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
        {fetchChannelEventsQuery.data ? (
          fetchChannelEventsQuery.data.length > 0 ? (
            <Tag
              label="Total events"
              value={fetchChannelEventsQuery.data.length.toString()}
              className="mr-4 animate-in slide-in-from-bottom-2"
            />
          ) : null
        ) : null}
        <EventLogFilter />
        <Button
          size="icon"
          className="mr-4"
          variant="ghost"
          onClick={handleEventLogCardCollapseToggle}
        >
          {isEventLogCardExpanded ? (
            <img src={ExpandIcon} alt="expand-icon" />
          ) : (
            <img src={CollapseIcon} alt="collapse-icon" />
          )}
        </Button>
      </ProjectHeader>
      <div className="flex flex-col gap-4 relative">
        <nav
          className="fixed left-0 h-screen top-0"
          style={{
            width: `${CHANNEL_NAVBAR_WIDTH + NAVBAR_WIDTH}px`,
            paddingTop: `${HEADER_HEIGHT}px`,
            paddingLeft: `${NAVBAR_WIDTH}px`,
          }}
        >
          <div className="border-r border-solid border-zinc-200 flex flex-col gap-4 h-full py-6 px-4">
            <CreateChannelDialog
              projectId={projectId}
              disabled={fetchChannelsQuery.isPending}
              channelCount={
                fetchChannelsQuery.data ? fetchChannelsQuery.data.length : 0
              }
            />

            <span className="flex items-center mt-2">
              <Hash className="w-4 h-4 text-zinc-400 mr-1" />
              <span className="text-sm text-zinc-500">Channels</span>
            </span>
            <div className="flex flex-col gap-1">
              {fetchChannelsQuery.isPending ? (
                <>
                  <Skeleton className="w-[227px] h-[40px] mb-2" />
                  <Skeleton className="w-[227px] h-[40px] mb-2" />
                  <Skeleton className="w-[227px] h-[40px]" />
                </>
              ) : null}

              {fetchChannelsQuery.data
                ? fetchChannelsQuery.data.map((channel) => (
                    <Link
                      key={channel.id}
                      to={`/project/${projectId}/channel/${channel.id}`}
                    >
                      <Button
                        variant={
                          channelId === channel.id ? "secondary" : "ghost"
                        }
                        className={cn(
                          "justify-start w-full animate-in slide-in-from-bottom-2",
                          channelId === channel.id
                            ? "text-zinc-950"
                            : "text-zinc-700",
                          channelId === channel.id
                            ? "font-semibold"
                            : "font-normal",
                        )}
                      >
                        {channel.name}
                      </Button>
                    </Link>
                  ))
                : null}
            </div>
          </div>
        </nav>
        <div
          style={{
            marginLeft: `${CHANNEL_NAVBAR_WIDTH}px`,
          }}
        >
          <div className="flex flex-col items-center gap-5 py-6">
            {isLoading ? (
              <>
                <Skeleton className="h-[130px] w-[560px] rounded-[8px]" />
                <Skeleton className="h-[130px] w-[560px] rounded-[8px]" />
                <Skeleton className="h-[130px] w-[560px] rounded-[8px]" />
                <Skeleton className="h-[130px] w-[560px] rounded-[8px]" />
              </>
            ) : null}

            {fetchChannelEventsQuery.data && fetchChannelsQuery.data
              ? fetchChannelEventsQuery.data.map(
                  ({ tags, channel, ...event }) => (
                    <EventLogCard
                      key={event.id}
                      event={event}
                      channel={channel}
                      projectId={projectId}
                      handleDeleteEvent={() => handleDeleteEvent(event.id)}
                      tags={tags}
                      isExpanded={isEventLogCardExpanded}
                    />
                  ),
                )
              : null}

            {fetchChannelEventsQuery.data ? (
              fetchChannelEventsQuery.data.length === 0 ? (
                <Nothing
                  title="No feed found"
                  subText="Channel events will show up here"
                  icon={<Rss />}
                />
              ) : null
            ) : null}

            {channelId ? null : (
              <Nothing
                title="Please select a channel"
                subText="Channel events will show up here"
                icon={<Hash />}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
}
