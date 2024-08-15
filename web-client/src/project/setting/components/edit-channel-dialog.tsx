import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Edit, Loader2 } from "lucide-react";
import * as z from "zod";
import { useGetUser } from "../../../auth/user-store";
import { Button } from "../../../components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../../components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "../../../components/ui/form";
import { Input } from "../../../components/ui/input";
import { toast } from "../../../lib/utils";
import { useUpdateChannel } from "../mutations";

const FormSchema = z.object({
  name: z
    .string()
    .min(4, {
      message: "Channel name must be at least 4 characters.",
    })
    .trim(),
});

type EditChannelDialogProps = {
  channelId: string;
  channelName: string;
  projectId: string;
};

export default function EditChannelDialog(props: EditChannelDialogProps) {
  const { channelId, channelName, projectId } = props;

  const [open, setOpen] = React.useState(false);

  const user = useGetUser();

  const updateChannelMutation = useUpdateChannel({
    onSuccess: () => {
      setOpen(false);
      toast.success(`Channel updated`);
      form.reset();
    },
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: channelName,
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    if (!user) return;
    console.log(data);
    updateChannelMutation.mutate({
      id: channelId,
      name: data.name,
      updatedBy: user.id,
      projectId,
    });
  }

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    form.setValue("name", e.target.value.toLowerCase().replace(/\s+/g, "-"));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          size="icon"
          variant="ghost"
          className="text-zinc-400 hover:text-zinc-500"
        >
          <Edit className="w-4 h-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update channel</DialogTitle>
          <DialogDescription>
            Rename channel to make it more informative about the use-case
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
                      placeholder="channel-name"
                      {...field}
                      onChange={handleNameChange}
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
                  disabled={updateChannelMutation.isPending}
                >
                  Cancel
                </Button>
              </DialogClose>
              <Button
                type="submit"
                className="w-full"
                disabled={updateChannelMutation.isPending}
              >
                {updateChannelMutation.isPending ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : null}
                {updateChannelMutation.isPending
                  ? "Please wait..."
                  : "Update channel"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
