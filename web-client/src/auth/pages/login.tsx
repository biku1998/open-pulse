import { useNavigate } from "react-router-dom";
import BgPattern from "../../assets/bg-pattern.svg";
import Logo from "../../components/logo";
import { AuthSuccessResponse } from "../api";
import LoginForm from "../components/login-form";
import { useUserStore } from "../user-store";

export default function LoginPage() {
  const { setUser } = useUserStore();
  const navigate = useNavigate();

  const onLogin = (resp: AuthSuccessResponse) => {
    setUser({
      email: resp.user.email ?? "",
      id: resp.user.id,
    });
    navigate("/", { replace: true });
  };

  return (
    <main className="flex flex-col items-center relative pt-24">
      <img
        src={BgPattern}
        alt="background patter img"
        className="absolute top-0 -z-10"
        loading="eager"
      />

      <Logo className="mb-6" />

      <LoginForm onLogin={onLogin} />
    </main>
  );
}
