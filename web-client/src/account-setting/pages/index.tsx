import { Mail } from "lucide-react";
import { useGetUser } from "../../auth/user-store";
import Header from "../../components/header";
import TokenManagement from "../components/token-management";

export default function AccountSettingPage() {
  const user = useGetUser();
  return (
    <main className="flex flex-col">
      <Header />
      <div className="py-6 max-w-[684px] mx-auto flex flex-col w-full gap-[22px]">
        <h1 className="font-bold text-2xl">Account setting</h1>

        <section className="p-6 border border-zinc-200 rounded-[8px] w-full animate-in slide-in-from-bottom-2 flex flex-col gap-6">
          <h2 className="font-semibold">Account info</h2>
          <div className="flex flex-col gap-4">
            <div className="flex items-center">
              <Mail className="w-4 h-4 text-zinc-400 mr-2" />{" "}
              <span className="text-sm text-zinc-900">{user?.email}</span>
            </div>
          </div>
        </section>
        <TokenManagement />
      </div>
    </main>
  );
}
