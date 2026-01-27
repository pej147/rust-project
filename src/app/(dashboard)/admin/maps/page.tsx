"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useAdminMaps, AdminMap } from "@/hooks/use-admin";
import { isAdmin } from "@/lib/is-admin";

export default function AdminMapsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { maps, loading, error, deleteMap } = useAdminMaps();
  const [actionError, setActionError] = useState<string | null>(null);

  // Redirect non-admins
  useEffect(() => {
    if (status === "loading") return;
    if (!session?.user || !isAdmin(session.user.role)) {
      router.push("/map");
    }
  }, [session, status, router]);

  if (status === "loading" || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-950">
        <div className="text-zinc-400">Loading...</div>
      </div>
    );
  }

  if (!session?.user || !isAdmin(session.user.role)) {
    return null;
  }

  const handleDelete = async (map: AdminMap) => {
    if (
      !confirm(
        `Are you sure you want to delete map "${map.seed}"? This will also delete all ${map._count.markers} markers.`
      )
    ) {
      return;
    }

    try {
      setActionError(null);
      await deleteMap(map.id);
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "Failed to delete");
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 px-4 py-6">
      {/* Header */}
      <div className="mb-6">
        <Link href="/admin" className="text-sm text-zinc-400 hover:text-white">
          &larr; Back to Dashboard
        </Link>
        <h1 className="mt-2 text-3xl font-bold text-white">Map Sessions</h1>
        <p className="text-zinc-400">{maps.length} total maps</p>
      </div>

      {/* Error display */}
      {(error || actionError) && (
        <div className="mb-4 rounded-xl bg-red-500/10 p-4 text-red-400">
          {error || actionError}
        </div>
      )}

      {/* Maps Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {maps.map((map) => (
          <MapCard key={map.id} map={map} onDelete={() => handleDelete(map)} />
        ))}
      </div>

      {maps.length === 0 && (
        <div className="rounded-2xl bg-zinc-900 p-8 text-center">
          <p className="text-zinc-400">No map sessions found.</p>
        </div>
      )}
    </div>
  );
}

// Map Card Component
function MapCard({ map, onDelete }: { map: AdminMap; onDelete: () => void }) {
  return (
    <div className="rounded-2xl bg-zinc-900 p-4">
      {/* Header */}
      <div className="mb-3 flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold text-white">Seed: {map.seed}</h3>
          {map.serverName && (
            <p className="text-sm text-zinc-400">{map.serverName}</p>
          )}
        </div>
        <span
          className={`rounded-full px-2 py-0.5 text-xs ${
            map.isActive
              ? "bg-green-500/20 text-green-400"
              : "bg-zinc-700 text-zinc-400"
          }`}
        >
          {map.isActive ? "Active" : "Inactive"}
        </span>
      </div>

      {/* Stats */}
      <div className="mb-3 grid grid-cols-2 gap-2 text-sm">
        <div className="rounded-lg bg-zinc-800 p-2">
          <p className="text-zinc-400">Size</p>
          <p className="font-medium text-white">{map.mapSize}m</p>
        </div>
        <div className="rounded-lg bg-zinc-800 p-2">
          <p className="text-zinc-400">Markers</p>
          <p className="font-medium text-white">{map._count.markers}</p>
        </div>
      </div>

      {/* Creator */}
      <div className="mb-3 text-sm">
        <p className="text-zinc-400">
          Created by:{" "}
          <span className="text-white">{map.createdBy.displayName}</span>
        </p>
        {map.team && (
          <p className="text-zinc-400">
            Team: <span className="text-white">{map.team.name}</span>
          </p>
        )}
        {map.wipeDate && (
          <p className="text-zinc-400">
            Wipe:{" "}
            <span className="text-white">
              {new Date(map.wipeDate).toLocaleDateString()}
            </span>
          </p>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between border-t border-zinc-800 pt-3">
        <span className="text-xs text-zinc-500">
          {new Date(map.createdAt).toLocaleDateString()}
        </span>
        <div className="flex gap-2">
          <Link
            href={`/map/${map.id}`}
            className="rounded-lg bg-zinc-800 px-3 py-1 text-sm text-white hover:bg-zinc-700"
          >
            View
          </Link>
          <button
            onClick={onDelete}
            className="rounded-lg bg-red-500/10 px-3 py-1 text-sm text-red-400 hover:bg-red-500/20"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
