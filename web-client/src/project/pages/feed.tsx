import React from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { Rss } from "lucide-react";
import CollapseIcon from "../../assets/collapse-icon.svg";
import ExpandIcon from "../../assets/expand-icon.svg";
import Nothing from "../../components/nothing";
import Tag from "../../components/tag";
import { Button } from "../../components/ui/button";
import { Skeleton } from "../../components/ui/skeleton";
import { useConfirmationDialog } from "../../zustand-stores";
import EventLogCard from "../components/event-log-card";
import EventLogFilter from "../components/event-log-filter";
import ProjectHeader from "../components/project-header";
import { useDeleteEvent } from "../mutations";
import { useFetchEvents } from "../queries";

export default function FeedPage() {
  const [isEventLogCardExpanded, setIsEventLogCardExpanded] =
    React.useState(false);

  const { projectId = "" } = useParams();
  const [searchParams] = useSearchParams();

  const { openConfirmationDialog, closeConfirmationDialog } =
    useConfirmationDialog((store) => ({
      openConfirmationDialog: store.openConfirmationDialog,
      closeConfirmationDialog: store.closeConfirmationDialog,
    }));

  const filters = searchParams.getAll("filter");

  const fetchEventsQuery = useFetchEvents({
    projectId,
    userId: filters.filter((f) => f.includes("userId"))[0]?.split(":eq:")[1],
    tags: filters
      .filter((f) => !f.includes("userId"))
      .map((f) => {
        const [key, value] = f.split(":eq:");
        return { key, value };
      }),
  });
  const deleteEventMutation = useDeleteEvent();

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

  const handleEventLogCardCollapseToggle = () => {
    setIsEventLogCardExpanded((prev) => !prev);
  };

  return (
    <>
      <ProjectHeader>
        {fetchEventsQuery.data ? (
          fetchEventsQuery.data.length > 0 ? (
            <Tag
              label="Total events"
              value={fetchEventsQuery.data.length.toString()}
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
      <div className="flex flex-col items-center gap-5 py-6">
        {fetchEventsQuery.isPending ? (
          <>
            <Skeleton className="h-[130px] w-[560px] rounded-[8px]" />
            <Skeleton className="h-[130px] w-[560px] rounded-[8px]" />
            <Skeleton className="h-[130px] w-[560px] rounded-[8px]" />
            <Skeleton className="h-[130px] w-[560px] rounded-[8px]" />
          </>
        ) : null}

        {fetchEventsQuery.data
          ? fetchEventsQuery.data.map(({ channel, tags, ...event }) => (
              <EventLogCard
                key={event.id}
                event={event}
                channel={channel}
                projectId={projectId}
                handleDeleteEvent={() => handleDeleteEvent(event.id)}
                tags={tags}
                isExpanded={isEventLogCardExpanded}
              />
            ))
          : null}
        {fetchEventsQuery.data ? (
          fetchEventsQuery.data.length === 0 ? (
            <Nothing
              title="No feed found"
              subText="All channel events will show up here"
              icon={<Rss />}
            />
          ) : null
        ) : null}
      </div>
    </>
  );
}
