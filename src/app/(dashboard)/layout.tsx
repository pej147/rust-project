import { ReactNode } from "react";
import { BottomNav } from "@/components/layout/bottom-nav";

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col bg-zinc-950">
      <main className="flex-1 pb-24">{children}</main>
      <BottomNav />
    </div>
  );
}
