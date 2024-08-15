import React from "react";
import { useSearchParams } from "react-router-dom";
import { PopoverClose } from "@radix-ui/react-popover";
import { Filter, Plus, X } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../components/ui/popover";
import { cn } from "../../lib/utils";

type Filter = {
  userId: string;
  tags: Array<{ id: string; label: string; value: string }>;
};

export default function EventLogFilter() {
  const [searchParams, setSearchParams] = useSearchParams();

  const initFilter = () => {
    const allFilters = searchParams.getAll("filter");
    if (allFilters.length === 0) return { userId: "", tags: [] };

    const filter: {
      userId: string;
      tags: Array<{ label: string; value: string; id: string }>;
    } = {
      userId: "",
      tags: [],
    };

    allFilters.forEach((f) => {
      const [key, value] = f.split(":eq:");
      if (key === "userId") {
        filter.userId = value;
      } else {
        filter.tags.push({
          label: key.trim(),
          value: value.trim(),
          id: Date.now().toString(),
        });
      }
    });
    return filter;
  };

  const [filter, setFilter] = React.useState<Filter>(initFilter);

  const handleUserIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilter((prev) => ({ ...prev, userId: e.target.value }));
  };

  const handleTagLabelChange = (label: string, index: number) => {
    setFilter((prev) => {
      const tags = [...prev.tags];
      tags[index].label = label;
      return { ...prev, tags };
    });
  };

  const handleTagValueChange = (value: string, index: number) => {
    setFilter((prev) => {
      const tags = [...prev.tags];
      tags[index].value = value;
      return { ...prev, tags };
    });
  };

  const handleAddTagClick = () => {
    setFilter((prev) => ({
      ...prev,
      tags: [...prev.tags, { label: "", value: "", id: Date.now().toString() }],
    }));
  };

  const handleTagRemove = (index: number) => {
    setFilter((prev) => {
      const tags = prev.tags.filter((_, i) => i !== index);
      return { ...prev, tags };
    });
  };

  const handleResetFilterClick = () => {
    setFilter({ userId: "", tags: [] });

    // remove filter query params
    searchParams.delete("filter");
    setSearchParams(searchParams);
  };

  const handleApplyFilterClick = () => {
    const searchParams = new URLSearchParams();
    if (filter.userId !== "")
      searchParams.append("filter", `userId:eq:${filter.userId.trim()}`);
    filter.tags.forEach((tag) => {
      if (tag.label !== "" && tag.value !== "") {
        searchParams.append(
          "filter",
          `${tag.label.trim()}:eq:${tag.value.trim()}`,
        );
      }
    });
    setSearchParams(searchParams);
  };

  const appliedFilterCount =
    filter.tags.filter((tag) => tag.label !== "" && tag.value !== "").length +
    (filter.userId !== "" ? 1 : 0);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button size="icon" variant="ghost" className="mr-1">
          <Filter
            className={cn(
              "h-5 w-5",
              appliedFilterCount > 0 ? "text-primary" : "text-zinc-500",
            )}
          />
          {appliedFilterCount > 0 ? (
            <sub className="text-white w-4 h-4 flex items-center justify-center p-1 rounded-full bg-primary">
              {appliedFilterCount}
            </sub>
          ) : null}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[500px] mr-32 overflow-y-auto flex flex-col">
        <Label htmlFor="user-id" className="mb-2 text-xs text-zinc-700">
          User Id
        </Label>
        <Input
          id="user-id"
          placeholder=""
          className="mb-4"
          value={filter.userId}
          onChange={handleUserIdChange}
        />

        <span className="text-xs text-zinc-700 mb-2">Tags</span>
        <div className="flex flex-col mb-4 gap-3">
          {filter.tags.map((tag, index) => (
            <div
              className="flex items-center justify-between w-full animate-in slide-in-from-bottom-2"
              key={tag.id}
            >
              <Input
                placeholder="label"
                className="w-[45%] mr-2"
                value={tag.label}
                onChange={(e) => handleTagLabelChange(e.target.value, index)}
              />
              <Input
                placeholder="value"
                className="w-[45%] mr-2"
                value={tag.value}
                onChange={(e) => handleTagValueChange(e.target.value, index)}
              />
              <Button
                size="icon"
                variant="ghost"
                onClick={() => handleTagRemove(index)}
              >
                <X className="h-4 w-4 text-zinc-500" />
              </Button>
            </div>
          ))}

          <Button
            variant="outline"
            size="sm"
            className="w-fit text-zinc-600"
            onClick={handleAddTagClick}
          >
            <Plus className="h-4 w-4 text-zinc-500 mr-2" />
            Add tag
          </Button>
        </div>
        <div className="flex items-center w-full gap-4 *:w-full">
          <Button
            variant="secondary"
            size="sm"
            onClick={handleResetFilterClick}
          >
            Reset
          </Button>
          <PopoverClose asChild>
            <Button
              size="sm"
              variant="default"
              onClick={handleApplyFilterClick}
            >
              Apply filter
            </Button>
          </PopoverClose>
        </div>
      </PopoverContent>
    </Popover>
  );
}
