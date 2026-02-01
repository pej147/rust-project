"use client";

import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface HeaderProps {
  title: string;
  subtitle?: string;
  leftAction?: ReactNode;
  rightAction?: ReactNode;
  transparent?: boolean;
}

export function Header({
  title,
  subtitle,
  leftAction,
  rightAction,
  transparent = false,
}: HeaderProps) {
  return (
    <header
      className={cn(
        "sticky top-0 z-40 px-4 pb-2 pt-4",
        transparent
          ? "bg-transparent"
          : "border-b border-rust-border bg-rust-bg/80 backdrop-blur-xl"
      )}
    >
      <div className="flex items-center justify-between">
        <div className="w-16">{leftAction}</div>
        <div className="flex-1 text-center">
          <h1 className="text-lg font-semibold uppercase tracking-wide text-rust-text">{title}</h1>
          {subtitle && (
            <p className="text-xs text-rust-text-secondary">{subtitle}</p>
          )}
        </div>
        <div className="flex w-16 justify-end">{rightAction}</div>
      </div>
    </header>
  );
}
