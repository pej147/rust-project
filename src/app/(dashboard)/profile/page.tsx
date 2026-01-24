"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-950">
        <div className="text-zinc-400">Laden...</div>
      </div>
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
    <div className="min-h-screen bg-zinc-950 p-4">
      <div className="mx-auto max-w-md">
        <div className="rounded-3xl bg-zinc-900 p-8">
          <h1 className="mb-6 text-center text-3xl font-bold text-white">
            Profiel
          </h1>

          <div className="mb-8 flex flex-col items-center">
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

          <div className="space-y-3">
            <div className="rounded-xl bg-zinc-800 p-4">
              <div className="text-sm text-zinc-400">User ID</div>
              <div className="font-mono text-sm text-zinc-300">
                {session.user.id}
              </div>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="mt-8 w-full rounded-xl bg-red-600/20 py-3 font-semibold text-red-400 transition-colors hover:bg-red-600/30"
          >
            Uitloggen
          </button>
        </div>
      </div>
    </div>
  );
}
