import React from "react";
import { cn } from "../lib/utils";

type TagProps = {
  label: string;
  value: string;
  icon?: React.ReactNode;
  className?: string;
};

export default function Tag(props: TagProps) {
  const { label, value, icon = null, className = "" } = props;

  return (
    <div
      className={cn(className, "rounded-lg border border-zinc-200 flex w-fit")}
    >
      <div className="pl-2 pr-1 py-[6px] mr-1 flex items-center">
        {icon}
        <span
          className={cn("text-xs text-zinc-600 font-mono", icon ? "ml-1" : "")}
        >
          {label}
        </span>
      </div>

      <span className="text-xs text-zinc-700 font-medium pl-1 pr-2 py-[6px] bg-zinc-50 rounded-tr-lg rounded-br-lg">
        {value}
      </span>
    </div>
  );
}
