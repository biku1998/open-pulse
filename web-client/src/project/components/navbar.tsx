import React from "react";
import { Link, Navigate, useLocation, useParams } from "react-router-dom";
import { Rss, BarChart4, Settings, Hash, Lightbulb } from "lucide-react";
import Logo from "../../components/logo";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../../components/ui/tooltip";
import { NAVBAR_WIDTH } from "../../constants";
import { cn } from "../../lib/utils";

const navItems: {
  path: string;
  label: string;
  index: boolean;
  icon: React.ReactNode;
}[] = [
  {
    path: "",
    index: true,
    label: "Feed",
    icon: <Rss className=" group-hover:text-primary" />,
  },
  {
    path: "/chart",
    index: false,
    label: "Charts",
    icon: <BarChart4 className=" group-hover:text-primary" />,
  },
  {
    path: "/insight",
    index: false,
    label: "Insights",
    icon: <Lightbulb className=" group-hover:text-primary" />,
  },
  {
    path: "/channel",
    index: false,
    label: "Channels",
    icon: <Hash className=" group-hover:text-primary" />,
  },
  {
    path: "/setting",
    index: false,
    label: "Settings",
    icon: <Settings className=" group-hover:text-primary" />,
  },
];

export default function Navbar() {
  const { projectId } = useParams();
  const location = useLocation();

  const currentPath = location.pathname;

  if (!projectId) return <Navigate to="/auth/login" replace={true} />;

  const isPathActive = (path: string) => {
    if (path === "") return currentPath === `/project/${projectId}`;
    return currentPath.split("/").includes(path.split("/")[1]);
  };

  return (
    <nav
      className="fixed left-0 h-screen top-0 border-r border-solid border-zinc-200 flex flex-col py-4 items-center gap-8 z-20"
      style={{
        width: `${NAVBAR_WIDTH}px`,
      }}
    >
      <Logo />
      <div className="flex flex-col gap-2 px-4">
        {navItems.map((item) => (
          <TooltipProvider key={`${item.path}-nav-link`}>
            <Tooltip delayDuration={1000}>
              <TooltipTrigger asChild>
                <Link
                  key={item.path}
                  to={`/project/${projectId}${item.path}`}
                  className={cn(
                    "h-[48px] w-[48px] rounded-[6px] flex flex-col items-center justify-center hover:bg-zinc-50 hover:cursor-pointer group transition-colors duration-200",
                    isPathActive(item.path)
                      ? "bg-violet-50 text-primary"
                      : "bg-white text-zinc-500",
                  )}
                >
                  {item.icon}
                </Link>
              </TooltipTrigger>
              <TooltipContent>
                <span>{item.label}</span>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ))}
      </div>
    </nav>
  );
}
