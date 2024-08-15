import { Link } from "react-router-dom";
import LogoImg from "../assets/logo.svg";
import { cn } from "../lib/utils";

export default function Logo({ className = "" }: { className?: string }) {
  return (
    <Link to="/">
      <img
        src={LogoImg}
        alt="Open pulse logo"
        loading="eager"
        className={cn(className, "h-[40px] w-[40px]")}
      />
    </Link>
  );
}
