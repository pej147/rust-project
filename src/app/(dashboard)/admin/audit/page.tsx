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
      <div className="flex min-h-screen items-center justify-center bg-rust-bg">
        <div className="text-rust-text-secondary">Loading...</div>
      </div>
    );
  }

  if (!session?.user || !isAdmin(session.user.role)) {
    return null;
  }

  const totalPages = Math.ceil(total / limit);
  const currentPage = Math.floor(offset / limit) + 1;

  const actionColors: Record<string, string> = {
    CREATE_USER: "bg-rust-primary/20 text-rust-primary",
    UPDATE_USER: "bg-rust-surface-elevated text-rust-text-secondary",
    DELETE_USER: "bg-rust-danger/20 text-rust-danger",
    DELETE_MAP: "bg-rust-danger/20 text-rust-danger",
    CREATE_MARKER: "bg-rust-primary/20 text-rust-primary",
    UPDATE_MARKER: "bg-rust-surface-elevated text-rust-text-secondary",
    DELETE_MARKER: "bg-rust-danger/20 text-rust-danger",
  };

  return (
    <div className="min-h-screen bg-rust-bg px-4 py-6">
      {/* Header */}
      <div className="mb-6">
        <Link href="/admin" className="text-sm text-rust-text-secondary hover:text-white">
          &larr; Back to Dashboard
        </Link>
        <h1 className="mt-2 text-3xl font-bold text-white">Audit Logs</h1>
        <p className="text-rust-text-secondary">{total} total entries</p>
      </div>

      {/* Error display */}
      {error && (
        <div className="mb-4 rounded-lg bg-rust-danger/10 p-4 text-rust-danger">
          {error}
        </div>
      )}

      {/* Logs Table */}
      <div className="overflow-hidden rounded-lg bg-rust-surface">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px]">
            <thead>
              <tr className="border-b border-rust-border">
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-rust-text-secondary">
                  Timestamp
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-rust-text-secondary">
                  Action
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-rust-text-secondary">
                  User
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-rust-text-secondary">
                  Entity
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-rust-text-secondary">
                  Details
                </th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr
                  key={log.id}
                  className="border-b border-rust-border last:border-0"
                >
                  <td className="whitespace-nowrap px-4 py-3 text-sm text-rust-text-secondary">
                    {new Date(log.createdAt).toLocaleString()}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs ${
                        actionColors[log.action] ||
                        "bg-rust-surface text-rust-text-muted"
                      }`}
                    >
                      {log.action}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-sm text-white">{log.user.displayName}</p>
                    <p className="text-xs text-rust-text-muted">{log.user.email}</p>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <span className="text-rust-text-secondary">{log.entityType}</span>
                    <span className="ml-1 font-mono text-xs text-rust-text-muted">
                      {log.entityId.slice(0, 8)}...
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-rust-text-secondary">
                    {log.details && (
                      <code className="rounded bg-rust-surface-elevated px-1 text-xs">
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
          <div className="p-8 text-center text-rust-text-secondary">
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
            className="rounded-lg bg-rust-surface-elevated px-4 py-2 text-sm text-white disabled:opacity-50"
          >
            Previous
          </button>
          <span className="text-sm text-rust-text-secondary">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setOffset(offset + limit)}
            disabled={offset + limit >= total}
            className="rounded-lg bg-rust-surface-elevated px-4 py-2 text-sm text-white disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
