import { X, GripHorizontal } from "lucide-react";
import { Button } from "../../../components/ui/button";
import dayjs from "../../../lib/dayjs";
import { cn } from "../../../lib/utils";
import { Insight } from "../../../types/insight";

type InsightCardProps = {
  insight: Insight;
  fullWidth: boolean;
  handleInsightDelete: (args: { id: number; name: string }) => void;
  editModeEnabled: boolean;
  [key: string]: unknown;
};

export default function InsightCard(props: InsightCardProps) {
  const {
    insight: { id, name, value, createdAt, updatedAt, icon },
    fullWidth,
    editModeEnabled,
    handleInsightDelete,
    ...rest
  } = props;

  const handleDeleteInsightClick = () => {
    handleInsightDelete({ id, name });
  };

  return (
    <div
      className={cn(
        "relative px-6 py-4 rounded-xl border border-zinc-100 flex flex-col min-w-[380px] animate-in slide-in-from-bottom-2 hover:border-zinc-200",
        fullWidth ? "w-full" : "",
      )}
      {...rest}
    >
      {editModeEnabled ? (
        <Button
          size="icon"
          variant="ghost"
          className="text-zinc-400 h-6 hover:cursor-grab absolute top-1 mx-auto left-0 right-0 animate-in slide-in-from-bottom-2"
        >
          <GripHorizontal className="h-4 w-4" />
        </Button>
      ) : null}

      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-bold text-zinc-700 group-hover:text-zinc-800">
          {value}
        </h3>
        {icon ? <span className="text-2xl">{icon}</span> : null}
      </div>

      <div className="flex items-center justify-between  mt-4">
        <p className="text-sm text-zinc-500 font-medium">{name}</p>
        <span className="text-xs text-zinc-400">
          {dayjs().to(updatedAt || createdAt)}
        </span>
      </div>

      {editModeEnabled ? (
        <Button
          size="icon"
          variant="destructive"
          className="w-5 h-5 rounded-full absolute -top-1 -right-1 animate-in slide-in-from-bottom-2"
          onClick={handleDeleteInsightClick}
        >
          <X className="h-3 w-3" />
        </Button>
      ) : null}
    </div>
  );
}
