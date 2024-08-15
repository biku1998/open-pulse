import React from "react";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Plus } from "lucide-react";
import { useGetUser } from "../../../auth/user-store";
import { Button } from "../../../components/ui/button";
import {
  Dialog,
  DialogHeader,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "../../../components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../../components/ui/form";
import { Input } from "../../../components/ui/input";
import { RadioGroup, RadioGroupItem } from "../../../components/ui/radio-group";
import { Textarea } from "../../../components/ui/textarea";
import { toast } from "../../../lib/utils";
import { CHART_TYPES, Chart, ChartSchema } from "../../../types/chart";
import { useCreateChart } from "../mutations";

export default function CreateChartDialog() {
  const [open, setOpen] = React.useState(false);
  const user = useGetUser();

  const { projectId = "" } = useParams();

  const form = useForm<
    Pick<
      Chart,
      "name" | "description" | "chartType" | "createdBy" | "projectId"
    >
  >({
    resolver: zodResolver(
      ChartSchema.pick({
        name: true,
        description: true,
        chartType: true,
        createdBy: true,
        projectId: true,
      }),
    ),
    defaultValues: {
      name: "",
      chartType: "LINE",
      createdBy: user?.id,
      projectId,
      description: null,
    },
  });

  const createChartMutation = useCreateChart({
    onSuccess: () => {
      setOpen(false);
      toast.success("Chart created!");
      form.reset();
    },
  });

  function onSubmit(
    data: Pick<
      Chart,
      "name" | "description" | "chartType" | "createdBy" | "projectId"
    >,
  ) {
    createChartMutation.mutate(data);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="mr-4">
          <Plus size={16} className="mr-2" />
          Create
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New chart</DialogTitle>
          <DialogDescription>Add a new chart to your project</DialogDescription>
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
                      placeholder="chart name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem className="w-full mt-4">
                  <FormControl>
                    <Textarea
                      placeholder="description"
                      {...field}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="chartType"
              render={({ field }) => (
                <FormItem className="space-y-3 mt-6">
                  <FormLabel>Chart type</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="grid grid-cols-2 gap-3"
                    >
                      {CHART_TYPES.map((chartType) => (
                        <FormItem
                          className="flex items-center space-x-3 space-y-0"
                          key={chartType}
                        >
                          <FormControl>
                            <RadioGroupItem value={chartType} />
                          </FormControl>
                          <FormLabel className="font-normal hover:cursor-pointer">
                            {chartType
                              .toLowerCase()
                              .replace(/_/g, " ")
                              .replace(/^\w/, (c) => c.toUpperCase())}
                          </FormLabel>
                        </FormItem>
                      ))}
                    </RadioGroup>
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
                  disabled={createChartMutation.isPending}
                >
                  Cancel
                </Button>
              </DialogClose>
              <Button
                type="submit"
                className="w-full"
                disabled={createChartMutation.isPending}
              >
                {createChartMutation.isPending ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : null}
                {createChartMutation.isPending
                  ? "Please wait..."
                  : "Create chart"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
