import React from "react";
import { HEADER_HEIGHT } from "../constants";
import { cn } from "../lib/utils";
import Logo from "./logo";
import UserMenu from "./user-menu";

type HeaderProps = {
  children?: React.ReactNode;
  className?: string;
};

export default function Header(props: HeaderProps) {
  const { children, className = "" } = props;
  return (
    <header
      className="sticky top-0 z-40 flex w-full items-center justify-between border-0 border-b border-solid border-slate-200 bg-white px-10 py-2"
      style={{
        height: `${HEADER_HEIGHT}px`,
      }}
    >
      <Logo />
      <div className={cn(className, "w-full")}>{children}</div>
      <UserMenu />
    </header>
  );
}
