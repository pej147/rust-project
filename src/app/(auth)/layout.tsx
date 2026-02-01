import { ReactNode } from "react";

interface AuthLayoutProps {
  children: ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-rust-bg p-4">
      <div className="w-full max-w-md">{children}</div>
    </div>
  );
}
