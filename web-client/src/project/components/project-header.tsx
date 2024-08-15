import React from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { Check, ChevronRight, ChevronsUpDown } from "lucide-react";
import { Button } from "../../components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "../../components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../components/ui/popover";
import { Skeleton } from "../../components/ui/skeleton";
import UserMenu from "../../components/user-menu";
import { HEADER_HEIGHT, NAVBAR_WIDTH } from "../../constants";
import { useFetchProjects } from "../../home/queries";
import { cn } from "../../lib/utils";

type ProjectHeaderProps = {
  children?: React.ReactNode;
};

export default function ProjectHeader(props: ProjectHeaderProps) {
  const { children } = props;

  const { projectId = "" } = useParams();
  const location = useLocation();

  const fetchProjectsQuery = useFetchProjects();

  const [selectProjectPopoverOpen, setSelectProjectPopoverOpen] =
    React.useState(false);

  const closeSelectProjectPopover = () => setSelectProjectPopoverOpen(false);

  return (
    <header
      className="fixed top-0 flex items-center bg-white w-full z-10"
      style={{
        height: `${HEADER_HEIGHT}px`,
        paddingLeft: `${NAVBAR_WIDTH}px`,
      }}
    >
      <div className="flex items-center gap-2 border-b border-solid border-slate-200 w-full h-full pl-4 pr-10">
        <Link to="/">
          <Button variant="ghost" size="sm" className="text-zinc-600">
            Projects
          </Button>
        </Link>
        <ChevronRight className="w-5 h-5 text-zinc-300" />
        {fetchProjectsQuery.isPending ? (
          <Skeleton className="h-[35px] w-[200px]" />
        ) : null}

        {fetchProjectsQuery.data ? (
          <Popover
            open={selectProjectPopoverOpen}
            onOpenChange={setSelectProjectPopoverOpen}
          >
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                role="combobox"
                aria-expanded={selectProjectPopoverOpen}
                className="min-w-[200px] justify-between text-zinc-600 animate-in fade-in"
              >
                {projectId
                  ? fetchProjectsQuery.data.find(
                      ({ project }) => project.id === projectId,
                    )?.project.name
                  : "Select project..."}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[300px] max-h-[350px] overflow-y-auto p-0">
              <Command>
                <CommandInput placeholder="Search project..." />
                <CommandEmpty>No project found.</CommandEmpty>
                <CommandGroup>
                  {fetchProjectsQuery.data.map(({ project }) => (
                    <Link
                      key={project.id}
                      to={location.pathname.replace(projectId, project.id)}
                    >
                      <CommandItem
                        key={project.id}
                        value={project.id}
                        onSelect={closeSelectProjectPopover}
                        className="cursor-pointer"
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            projectId === project.id
                              ? "opacity-100"
                              : "opacity-0",
                          )}
                        />
                        {project.name}
                      </CommandItem>
                    </Link>
                  ))}
                </CommandGroup>
              </Command>
            </PopoverContent>
          </Popover>
        ) : null}

        <div className="ml-auto flex items-center">
          {children}
          <UserMenu />
        </div>
      </div>
    </header>
  );
}
