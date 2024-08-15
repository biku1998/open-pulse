import { Link } from "react-router-dom";
import { Dot, Hash, Trash, User } from "lucide-react";
import Tag from "../../components/tag";
import { Button } from "../../components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../../components/ui/tooltip";
import dayjs from "../../lib/dayjs";
import { Channel } from "../../types/channel";
import { Event } from "../../types/event";
import { EventTag } from "../../types/event-tag";

type EventLogCardProps = {
  event: Pick<
    Event,
    "id" | "name" | "description" | "createdAt" | "icon" | "userId"
  >;
  channel: Pick<Channel, "name" | "id">;
  tags: Pick<EventTag, "id" | "key" | "value">[];
  projectId: string;
  handleDeleteEvent: () => void;
  isExpanded: boolean;
};

export default function EventLogCard(props: EventLogCardProps) {
  const { event, channel, projectId, handleDeleteEvent, tags, isExpanded } =
    props;

  return (
    <div className="relative group p-5 flex gap-5 border border-zinc-200 rounded-[8px] hover:border-zinc-300 w-[560px] animate-in slide-in-from-bottom-2">
      <div className="w-12 h-12 px-2 py-[10px] bg-green-50 flex items-center justify-center rounded-[8px]">
        <span className="text-lg">{event.icon}</span>
      </div>

      <div className="flex flex-col w-full">
        <h3 className="font-semibold text-zinc-950">{event.name}</h3>
        <div className="items-center hidden group-hover:flex absolute top-5 right-5 animate-in slide-in-from-bottom-2 duration-300">
          <Button
            variant="ghost"
            size="icon"
            className="hover:bg-red-50 text-zinc-500 hover:text-red-500"
            onClick={handleDeleteEvent}
          >
            <Trash className="h-4 w-4" />
          </Button>
        </div>

        {event.description ? (
          event.description.split("").length > 37 ? (
            <TooltipProvider>
              <Tooltip delayDuration={500}>
                <TooltipTrigger asChild>
                  <p className="text-sm text-zinc-600 mt-2 max-w-[280px] truncate">
                    {event.description}
                  </p>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-sm text-zinc-600 max-w-[280px]">
                    {event.description}
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ) : (
            <p className="text-sm text-zinc-600 mt-2 max-w-[280px] truncate">
              {event.description}
            </p>
          )
        ) : null}

        <div className="flex items-center gap-2 mt-2 mb-3">
          <Link
            to={`/project/${projectId}/channel/${channel.id}`}
            className="text-zinc-500 flex items-center text-sm  group-hover:text-primary"
          >
            <Hash className="mr-1 h-4 w-4" />
            {channel.name}
          </Link>

          <div className="flex items-center text-sm text-zinc-500">
            <Dot className="text-zinc-400" />
            <span>
              {dayjs(event.createdAt).format("DD/MM/YYYY, hh:mm:ss A")}
            </span>
          </div>
        </div>
        {event.userId && isExpanded ? (
          <Tag
            label="user-id"
            value={event.userId}
            className="mb-4 animate-in slide-in-from-bottom-2"
            icon={<User className="w-4 h-4 text-zinc-400" />}
          />
        ) : null}
        {tags.length > 0 && isExpanded ? (
          <div className="flex flex-col gap-1.5 animate-in slide-in-from-bottom-2">
            <h4 className="text-xs text-zinc-500 font-medium">Tags</h4>
            <div className="flex items-center gap-2 flex-wrap">
              {tags.map((tag) => (
                <Tag key={tag.id} label={tag.key} value={tag.value} />
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
