import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Plus } from "lucide-react";
import * as z from "zod";
import { useGetUser } from "../../auth/user-store";
import { Button } from "../../components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "../../components/ui/form";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";
import { generateAlphanumericKey, toast } from "../../lib/utils";
import { useCreateToken } from "../mutations";

const FormSchema = z.object({
  name: z
    .string()
    .min(4, {
      message: "Token name must be at least 4 characters.",
    })
    .trim(),
  value: z
    .string()
    .min(30, {
      message: "Token must be at least 30 characters.",
    })
    .trim(),
});

export default function CreateTokenDialog() {
  const [open, setOpen] = React.useState(false);

  const user = useGetUser();

  const CreateTokenMutation = useCreateToken({
    onSuccess: () => {
      setOpen(false);
      toast.success("Token created");
      form.reset();
    },
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
      value: "",
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    if (!user) return;
    CreateTokenMutation.mutate({
      name: data.name,
      createdBy: user.id,
      value: data.value,
    });
  }

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    form.setValue("name", e.target.value.toLowerCase().replace(/\s+/g, "-"));
  };

  const handleGenerateTokenClick = () => {
    form.setValue("value", generateAlphanumericKey(30));
  };

  const handleOnOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      form.reset({
        name: "",
        value: "",
      });
    }
    setOpen(isOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOnOpenChange}>
      <DialogTrigger asChild>
        <Button variant="secondary" size="sm">
          <Plus className="mr-2 w-4 h-4" /> Token
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New token</DialogTitle>
          <DialogDescription>Add a new token to your account</DialogDescription>
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
                      placeholder="token-name"
                      {...field}
                      onChange={handleNameChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="value"
              render={({ field }) => (
                <FormItem className="w-full mt-6">
                  <FormControl>
                    <Textarea
                      required
                      placeholder="token"
                      {...field}
                      minLength={30}
                      className="mb-2"
                    />
                  </FormControl>
                  <FormMessage />
                  <p className="text-sm text-zinc-500">
                    This token will be used to push events to your projects, so
                    it must be strong and hard.{" "}
                    <Button
                      variant="link"
                      type="button"
                      className="p-0 h-fit text-violet-500 hover:text-violet-700"
                      onClick={handleGenerateTokenClick}
                    >
                      Generate a token
                    </Button>
                  </p>
                </FormItem>
              )}
            />
            <DialogFooter className="mt-8">
              <DialogClose asChild>
                <Button
                  variant="outline"
                  className="w-full"
                  disabled={CreateTokenMutation.isPending}
                >
                  Cancel
                </Button>
              </DialogClose>
              <Button
                type="submit"
                className="w-full"
                disabled={CreateTokenMutation.isPending}
              >
                {CreateTokenMutation.isPending ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : null}
                {CreateTokenMutation.isPending
                  ? "Please wait..."
                  : "Create token"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
