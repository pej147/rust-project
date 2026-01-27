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
          <div className="text-zinc-400">Loading...</div>
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
              <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-blue-600 text-3xl font-bold text-white">
                {session.user.name?.charAt(0).toUpperCase() || "?"}
              </div>
              <h2 className="text-xl font-semibold text-white">
                {session.user.name}
              </h2>
              <p className="text-zinc-400">{session.user.email}</p>
              <span className="mt-2 rounded-full bg-zinc-800 px-3 py-1 text-xs text-zinc-400">
                {session.user.role}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="mt-4">
          <CardContent className="space-y-3 py-2">
            <div className="rounded-xl bg-zinc-800 p-4">
              <div className="text-sm text-zinc-400">User ID</div>
              <div className="font-mono text-sm text-zinc-300">
                {session.user.id}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="mt-6">
          <Button
            variant="danger"
            className="w-full bg-red-600/20 text-red-400 hover:bg-red-600/30"
            onClick={handleLogout}
          >
            Log out
          </Button>
        </div>
      </div>
    </>
  );
}
