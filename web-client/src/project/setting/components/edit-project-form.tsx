import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Copy, Loader2 } from "lucide-react";
import * as z from "zod";
import { useGetUser } from "../../../auth/user-store";
import { Button } from "../../../components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "../../../components/ui/form";
import { Input } from "../../../components/ui/input";
import { toast } from "../../../lib/utils";
import { useUpdateProject } from "../mutations";

const FormSchema = z.object({
  name: z
    .string()
    .min(4, {
      message: "Project name must be at least 4 characters.",
    })
    .trim(),
});

type EditProjectFormProps = {
  projectId: string;
  projectName: string;
};

export default function EditProjectForm(props: EditProjectFormProps) {
  const { projectId, projectName } = props;

  const user = useGetUser();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: projectName,
    },
  });

  const updateProjectMutation = useUpdateProject({
    onSuccess: () => toast.success("Project name updated"),
  });

  const nameWatcher = form.watch("name");

  function onSubmit(data: z.infer<typeof FormSchema>) {
    if (!user) return;
    updateProjectMutation.mutate({
      id: projectId,
      payload: data,
      updatedBy: user.id,
    });
  }

  const handleCopyProjectIdClick = () => {
    navigator.clipboard.writeText(projectId);
    toast("Project ID copied to clipboard");
  };

  return (
    <section className="p-6 border border-zinc-200 rounded-[8px] w-full animate-in slide-in-from-bottom-2">
      <Form {...form}>
        <form
          className="flex flex-col gap-6"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <h2 className="font-semibold">Project name</h2>
          <div className="flex items-center gap-5">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="w-[50%]">
                  <FormControl>
                    <Input
                      required
                      type="text"
                      placeholder="project name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              variant="secondary"
              disabled={
                updateProjectMutation.isPending || nameWatcher === projectName
              }
            >
              {updateProjectMutation.isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              {updateProjectMutation.isPending ? "Please wait..." : "Save"}
            </Button>
          </div>
          <div className="flex items-center">
            <span className="text-sm text-zinc-500 mr-3">Project ID</span>
            <Input
              type="text"
              value={projectId}
              disabled
              className="w-[50%] mr-4"
            />
            <Button
              size="icon"
              variant="ghost"
              type="button"
              className="text-zinc-400 hover:text-zinc-600"
              onClick={handleCopyProjectIdClick}
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </form>
      </Form>
    </section>
  );
}
