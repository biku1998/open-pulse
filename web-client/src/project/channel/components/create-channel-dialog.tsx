import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Plus } from "lucide-react";
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
import { useCreateChannel } from "../mutations";

const FormSchema = z.object({
  name: z
    .string()
    .min(4, {
      message: "Channel name must be at least 4 characters.",
    })
    .trim(),
});

type CreateChannelDialogProps = {
  disabled: boolean;
  projectId: string;
  channelCount: number;
};
export default function CreateChannelDialog(props: CreateChannelDialogProps) {
  const { disabled, projectId, channelCount } = props;

  const [open, setOpen] = React.useState(false);

  const user = useGetUser();

  const createChannelMutation = useCreateChannel({
    onSuccess: (channel) => {
      setOpen(false);
      toast.success(`Channel ${channel.name} created`);
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
    createChannelMutation.mutate({
      name: data.name,
      createdBy: user.id,
      projectId,
      position: channelCount + 1,
    });
  }

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    form.setValue("name", e.target.value.toLowerCase().replace(/\s+/g, "-"));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" disabled={disabled}>
          Channel
          <Plus className="ml-auto h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New channel</DialogTitle>
          <DialogDescription>Add a new channel to project</DialogDescription>
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
                  disabled={createChannelMutation.isPending}
                >
                  Cancel
                </Button>
              </DialogClose>
              <Button
                type="submit"
                className="w-full"
                disabled={createChannelMutation.isPending}
              >
                {createChannelMutation.isPending ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : null}
                {createChannelMutation.isPending
                  ? "Please wait..."
                  : "Create channel"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
