import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Plus } from "lucide-react";
import * as z from "zod";
import { useGetUser } from "../../auth/user-store";
import { Button } from "../../components/ui/button";
import {
  Dialog,
  DialogHeader,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "../../components/ui/dialog";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  Form,
} from "../../components/ui/form";
import { Input } from "../../components/ui/input";
import { toast } from "../../lib/utils";
import { useCreateProject } from "../mutations";

const FormSchema = z.object({
  name: z
    .string()
    .min(4, {
      message: "Project name must be at least 4 characters.",
    })
    .trim(),
});

export default function CreateProjectDialog() {
  const [open, setOpen] = React.useState(false);

  const user = useGetUser();

  const createProjectMutation = useCreateProject({
    onSuccess: (project) => {
      setOpen(false);
      toast.success(`Project ${project.name} created!`);
      form.reset();
    },
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    if (!user) return;
    createProjectMutation.mutate({
      name: data.name,
      createdBy: user.id,
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-5 w-5" /> New project
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New project</DialogTitle>
          <DialogDescription>
            Add a new project to your account
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            className="flex flex-col"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="w-full">
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
            <DialogFooter className="mt-8">
              <DialogClose asChild>
                <Button
                  variant="outline"
                  className="w-full"
                  disabled={createProjectMutation.isPending}
                >
                  Cancel
                </Button>
              </DialogClose>
              <Button
                type="submit"
                className="w-full"
                disabled={createProjectMutation.isPending}
              >
                {createProjectMutation.isPending ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : null}
                {createProjectMutation.isPending
                  ? "Please wait..."
                  : "Create project"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
