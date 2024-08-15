import Header from "../../components/header";
import CreateProjectDialog from "../components/create-project-dialog";
import ProjectsList from "../components/projects-list";

export default function HomePage() {
  return (
    <>
      <Header />
      <main className="flex flex-col px-10 py-6">
        <section className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Projects</h1>
            <CreateProjectDialog />
          </div>
          <ProjectsList />
        </section>
      </main>
    </>
  );
}
