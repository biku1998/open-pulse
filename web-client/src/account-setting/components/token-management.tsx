import React from "react";
import _omit from "lodash/omit";
import { Settings, Eye, EyeOff, Copy } from "lucide-react";
import { useGetUser } from "../../auth/user-store";
import { Button } from "../../components/ui/button";
import { Switch } from "../../components/ui/switch";
import { cn, toast } from "../../lib/utils";
import { useToggleToken } from "../mutations";
import { useFetchTokens } from "../queries";
import CreateTokenDialog from "./create-token-dialog";

export default function TokenManagement() {
  const user = useGetUser();

  const fetchTokensQuery = useFetchTokens();

  const toggleTokenMutation = useToggleToken({
    onSuccess: ({ id, isActive }) => {
      if (!fetchTokensQuery.data) return;
      const tokenName =
        fetchTokensQuery.data.find((token) => token.id === id)?.name ?? "";
      if (isActive) {
        toast.success(`Token ${tokenName} is now active`);
        return;
      }
      toast(
        `Token ${tokenName} is now in-active. It can no longer be used to publish events.`,
      );
    },
    onError: (error) => toast.error(error.message),
  });

  const [visibleKeyIds, setVisibleKeyIds] = React.useState<{
    [k: string]: "0";
  }>({});

  const toggleVisibility = (keyId: string) => {
    if (visibleKeyIds[keyId]) {
      setVisibleKeyIds((prev) => _omit(prev, keyId));
    } else {
      setVisibleKeyIds((prev) => ({ ...prev, [keyId]: "0" }));
    }
  };

  const handleCopy = (name: string, value: string) => {
    navigator.clipboard.writeText(value);
    toast(`Token ${name} copied to clipboard`);
  };

  const handleCheckedChange = (checked: boolean, id: string) => {
    if (!user) return;
    toggleTokenMutation.mutate({ id, isActive: checked, updatedBy: user.id });
  };

  return (
    <section className="p-6 border border-zinc-200 rounded-[8px] w-full animate-in slide-in-from-bottom-2 flex flex-col gap-6">
      <div className="flex justify-between">
        <div className="flex flex-col gap-1 mb-5">
          <h2 className="font-semibold">My tokens</h2>
          <p className="text-sm text-zinc-400">
            Tokens are required for publishing your events to Open pulse
          </p>
        </div>
        <CreateTokenDialog />
      </div>
      <div className="flex flex-col gap-4">
        {fetchTokensQuery.data
          ? fetchTokensQuery.data.map((token) => (
              <div className="flex flex-col gap-[6px]" key={token.id}>
                <span className="text-sm text-zinc-500">{token.name}</span>

                <div className="flex items-center gap-5">
                  <div className="py-2 px-4 flex items-center justify-between rounded-lg border border-zinc-200 w-full">
                    <span
                      className={cn(
                        "text-sm text-zinc-600 max-w-[290px] truncate",
                        visibleKeyIds[token.id] ? "" : "blur-sm",
                      )}
                    >
                      {token.value}
                    </span>
                    <div className="flex items-center gap-2">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="text-zinc-400 hover:text-zinc-500"
                      >
                        <Settings className="w-4 h-4 " />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="text-zinc-400 hover:text-zinc-500"
                        onClick={() => toggleVisibility(token.id)}
                      >
                        {visibleKeyIds[token.id] ? (
                          <Eye className="w-4 h-4 " />
                        ) : (
                          <EyeOff className="w-4 h-4 " />
                        )}
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="text-zinc-400 hover:text-zinc-500"
                        onClick={() => handleCopy(token.name, token.value)}
                      >
                        <Copy className="w-4 h-4 " />
                      </Button>
                    </div>
                  </div>

                  <Switch
                    checked={token.isActive}
                    onCheckedChange={(checked) =>
                      handleCheckedChange(checked, token.id)
                    }
                  />
                </div>
              </div>
            ))
          : null}
      </div>
    </section>
  );
}
