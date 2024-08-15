import { MoreHorizontal, Pencil, Trash } from "lucide-react";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { useGetUser } from "../../../auth/user-store";
import { Button } from "../../../components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../../components/ui/dropdown-menu";
import { Chart } from "../../../types/chart";
import { useFetchChartData } from "../queries";

type ChartCardProps = Pick<
  Chart,
  "id" | "name" | "chartType" | "description"
> & {
  projectId: string;
  handleChartDelete: (id: number) => void;
  handleChartEdit: (id: number) => void;
};

export default function ChartCard(props: ChartCardProps) {
  const {
    name,
    id,
    description,
    projectId,
    handleChartDelete,
    handleChartEdit,
  } = props;

  const user = useGetUser();

  const fetchChartDataQuery = useFetchChartData({
    projectId,
    id,
    userId: user?.id ?? "",
  });

  return (
    <div className="relative group p-5 flex flex-col gap-5 border border-zinc-100 rounded-lg hover:border-zinc-200 w-[780px] animate-in slide-in-from-bottom-2 h-[366px]">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-[6px]">
          <h2 className="font-bold text-zinc-700">{name}</h2>
          <p className="text-sm text-zinc-500">{description}</p>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger>
            <Button variant="ghost" size="icon" className="text-zinc-500">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-auto">
            <DropdownMenuItem
              className="flex items-center cursor-pointer"
              onClick={() => handleChartEdit(id)}
            >
              <Pencil className="w-4 h-4 mr-2 text-zinc-500" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              className="flex items-center cursor-pointer"
              onClick={() => handleChartDelete(id)}
            >
              <Trash className="w-4 h-4 mr-2 text-zinc-500" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {fetchChartDataQuery.data ? (
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={fetchChartDataQuery.data} className="text-xs -ml-2">
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="count"
              stroke="#7c3aed"
              activeDot={{ r: 8 }}
            />
          </LineChart>
        </ResponsiveContainer>
      ) : null}
    </div>
  );
}
