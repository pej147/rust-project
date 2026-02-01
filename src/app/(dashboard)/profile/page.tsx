"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/layout/header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === "loading") {
    return (
      <>
        <Header title="Profile" />
        <div className="flex items-center justify-center p-8">
          <div className="text-rust-text-secondary">Loading...</div>
        </div>
      </>
    );
  }

  if (!session) {
    router.push("/login");
    return null;
  }

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push("/login");
  };

  return (
    <>
      <Header title="Profile" />
      <div className="p-4">
        <Card variant="elevated">
          <CardContent>
            <div className="flex flex-col items-center py-4">
              <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-rust-primary text-3xl font-bold text-white">
                {session.user.name?.charAt(0).toUpperCase() || "?"}
              </div>
              <h2 className="text-xl font-semibold text-white">
                {session.user.name}
              </h2>
              <p className="text-rust-text-secondary">{session.user.email}</p>
              <span className="mt-2 rounded-full bg-rust-surface px-3 py-1 text-xs text-rust-text-secondary">
                {session.user.role}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="mt-4">
          <CardContent className="space-y-3 py-2">
            <div className="rounded-lg bg-rust-surface p-4">
              <div className="text-xs uppercase tracking-wide text-rust-text-secondary">User ID</div>
              <div className="font-mono text-sm text-rust-text">
                {session.user.id}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="mt-6">
          <Button
            variant="danger"
            className="w-full"
            onClick={handleLogout}
          >
            Log out
          </Button>
        </div>
      </div>
    </>
  );
}
