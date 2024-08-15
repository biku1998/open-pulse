import Nothing from "../../components/nothing";
import { Skeleton } from "../../components/ui/skeleton";
import { useFetchProjects } from "../queries";
import ProjectCard from "./project-card";

export default function ProjectsList() {
  const fetchProjectsQuery = useFetchProjects();

  if (fetchProjectsQuery.error) return null;

  return (
    <>
      <div className="grid grid-cols-4 gap-6">
        {fetchProjectsQuery.isPending ? (
          <>
            <Skeleton className="w-[320px] h-[226px] rounded-lg" />
            <Skeleton className="w-[320px] h-[226px] rounded-lg" />
            <Skeleton className="w-[320px] h-[226px] rounded-lg" />
            <Skeleton className="w-[320px] h-[226px] rounded-lg" />
          </>
        ) : null}
        {fetchProjectsQuery.data
          ? fetchProjectsQuery.data.map(
              ({ project, channelCount, insightCount }) => (
                <ProjectCard
                  key={project.id}
                  name={project.name}
                  id={project.id}
                  channelsCount={channelCount}
                  insightsCount={insightCount}
                />
              ),
            )
          : null}
      </div>
      {fetchProjectsQuery.data ? (
        fetchProjectsQuery.data.length === 0 ? (
          <Nothing
            title="No project found"
            subText="Get start by creating a new one"
          />
        ) : null
      ) : null}
    </>
  );
}
