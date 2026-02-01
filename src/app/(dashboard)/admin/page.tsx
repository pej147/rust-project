"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import { useAdminStats } from "@/hooks/use-admin";
import { isAdmin } from "@/lib/is-admin";

export default function AdminDashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { stats, loading, error } = useAdminStats();

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

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-rust-bg">
        <div className="text-rust-danger">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-rust-bg px-4 py-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
        <p className="mt-1 text-rust-text-secondary">
          Manage users, maps, and view activity logs
        </p>
      </div>

      {/* Stats Grid */}
      {stats && (
        <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
          <StatCard
            label="Total Users"
            value={stats.totals.users}
            detail={`+${stats.recent.users} this week`}
            color="blue"
          />
          <StatCard
            label="Total Maps"
            value={stats.totals.maps}
            detail={`+${stats.recent.maps} this week`}
            color="green"
          />
          <StatCard
            label="Total Markers"
            value={stats.totals.markers}
            color="yellow"
          />
          <StatCard
            label="Total Teams"
            value={stats.totals.teams}
            color="purple"
          />
        </div>
      )}

      {/* Quick Links */}
      <div className="mb-8">
        <h2 className="mb-4 text-xl font-semibold text-white">Quick Actions</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <QuickLink
            href="/admin/users"
            icon="👥"
            title="Users"
            description="Manage user accounts and roles"
          />
          <QuickLink
            href="/admin/maps"
            icon="🗺️"
            title="Map Sessions"
            description="View and manage all maps"
          />
          <QuickLink
            href="/admin/audit"
            icon="📋"
            title="Audit Logs"
            description="View activity history"
          />
        </div>
      </div>

      {/* Role Distribution */}
      {stats && (
        <div className="mb-8">
          <h2 className="mb-4 text-xl font-semibold text-white">
            User Roles Distribution
          </h2>
          <div className="rounded-lg bg-rust-surface p-4">
            <div className="flex gap-8">
              {Object.entries(stats.usersByRole).map(([role, count]) => (
                <div key={role}>
                  <span className="text-2xl font-bold text-white">{count}</span>
                  <span className="ml-2 text-rust-text-secondary">{role}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Marker Types */}
      {stats && Object.keys(stats.markersByType).length > 0 && (
        <div>
          <h2 className="mb-4 text-xl font-semibold text-white">
            Markers by Type
          </h2>
          <div className="rounded-lg bg-rust-surface p-4">
            <div className="flex flex-wrap gap-4">
              {Object.entries(stats.markersByType).map(([type, count]) => (
                <div
                  key={type}
                  className="rounded-lg bg-rust-surface-elevated px-3 py-2"
                >
                  <span className="text-white">{count}</span>
                  <span className="ml-2 text-rust-text-secondary">{type}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Stat Card Component
function StatCard({
  label,
  value,
  detail,
  color,
}: {
  label: string;
  value: number;
  detail?: string;
  color: "blue" | "green" | "yellow" | "purple";
}) {
  const colorClasses = {
    blue: "bg-rust-primary/10 border-rust-primary/20",
    green: "bg-rust-primary/10 border-rust-primary/20",
    yellow: "bg-rust-primary/10 border-rust-primary/20",
    purple: "bg-rust-primary/10 border-rust-primary/20",
  };

  return (
    <div
      className={`rounded-lg border p-4 ${colorClasses[color]}`}
    >
      <p className="text-sm text-rust-text-secondary">{label}</p>
      <p className="mt-1 text-3xl font-bold text-white">{value}</p>
      {detail && <p className="mt-1 text-xs text-rust-text-muted">{detail}</p>}
    </div>
  );
}

// Quick Link Component
function QuickLink({
  href,
  icon,
  title,
  description,
}: {
  href: string;
  icon: string;
  title: string;
  description: string;
}) {
  return (
    <Link
      href={href}
      className="flex items-start gap-4 rounded-lg border border-rust-border bg-rust-surface p-4 transition-colors hover:bg-rust-surface-elevated"
    >
      <span className="text-3xl">{icon}</span>
      <div>
        <h3 className="font-semibold text-white">{title}</h3>
        <p className="text-sm text-rust-text-secondary">{description}</p>
      </div>
    </Link>
  );
}
