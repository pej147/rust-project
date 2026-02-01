import { ReactNode } from "react";
import { TopNav } from "@/components/layout/top-nav";

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col bg-rust-bg">
      <TopNav />
      <main className="flex-1">{children}</main>
    </div>
  );
}
