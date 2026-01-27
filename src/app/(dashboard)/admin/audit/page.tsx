"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuditLogs } from "@/hooks/use-admin";
import { isAdmin } from "@/lib/is-admin";

export default function AdminAuditPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [offset, setOffset] = useState(0);
  const limit = 25;
  const { logs, total, loading, error } = useAuditLogs({ limit, offset });

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

  const totalPages = Math.ceil(total / limit);
  const currentPage = Math.floor(offset / limit) + 1;

  const actionColors: Record<string, string> = {
    CREATE_USER: "bg-green-500/20 text-green-400",
    UPDATE_USER: "bg-blue-500/20 text-blue-400",
    DELETE_USER: "bg-red-500/20 text-red-400",
    DELETE_MAP: "bg-red-500/20 text-red-400",
    CREATE_MARKER: "bg-green-500/20 text-green-400",
    UPDATE_MARKER: "bg-blue-500/20 text-blue-400",
    DELETE_MARKER: "bg-red-500/20 text-red-400",
  };

  return (
    <div className="min-h-screen bg-zinc-950 px-4 py-6">
      {/* Header */}
      <div className="mb-6">
        <Link href="/admin" className="text-sm text-zinc-400 hover:text-white">
          &larr; Back to Dashboard
        </Link>
        <h1 className="mt-2 text-3xl font-bold text-white">Audit Logs</h1>
        <p className="text-zinc-400">{total} total entries</p>
      </div>

      {/* Error display */}
      {error && (
        <div className="mb-4 rounded-xl bg-red-500/10 p-4 text-red-400">
          {error}
        </div>
      )}

      {/* Logs Table */}
      <div className="overflow-hidden rounded-2xl bg-zinc-900">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px]">
            <thead>
              <tr className="border-b border-zinc-800">
                <th className="px-4 py-3 text-left text-sm font-medium text-zinc-400">
                  Timestamp
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-zinc-400">
                  Action
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-zinc-400">
                  User
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-zinc-400">
                  Entity
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-zinc-400">
                  Details
                </th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr
                  key={log.id}
                  className="border-b border-zinc-800 last:border-0"
                >
                  <td className="whitespace-nowrap px-4 py-3 text-sm text-zinc-400">
                    {new Date(log.createdAt).toLocaleString()}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs ${
                        actionColors[log.action] ||
                        "bg-zinc-700 text-zinc-400"
                      }`}
                    >
                      {log.action}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-sm text-white">{log.user.displayName}</p>
                    <p className="text-xs text-zinc-500">{log.user.email}</p>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <span className="text-zinc-400">{log.entityType}</span>
                    <span className="ml-1 font-mono text-xs text-zinc-600">
                      {log.entityId.slice(0, 8)}...
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-zinc-400">
                    {log.details && (
                      <code className="rounded bg-zinc-800 px-1 text-xs">
                        {JSON.stringify(log.details).slice(0, 50)}
                        {JSON.stringify(log.details).length > 50 && "..."}
                      </code>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {logs.length === 0 && (
          <div className="p-8 text-center text-zinc-400">
            No audit logs found.
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-4 flex items-center justify-between">
          <button
            onClick={() => setOffset(Math.max(0, offset - limit))}
            disabled={offset === 0}
            className="rounded-lg bg-zinc-800 px-4 py-2 text-sm text-white disabled:opacity-50"
          >
            Previous
          </button>
          <span className="text-sm text-zinc-400">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setOffset(offset + limit)}
            disabled={offset + limit >= total}
            className="rounded-lg bg-zinc-800 px-4 py-2 text-sm text-white disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
