"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useAdminUsers, AdminUser } from "@/hooks/use-admin";
import { isAdmin } from "@/lib/is-admin";

export default function AdminUsersPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { users, loading, error, updateUserRole, deleteUser, createUser } =
    useAdminUsers();
  const [showCreateForm, setShowCreateForm] = useState(false);
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
      <div className="flex min-h-screen items-center justify-center bg-rust-bg">
        <div className="text-rust-text-secondary">Loading...</div>
      </div>
    );
  }

  if (!session?.user || !isAdmin(session.user.role)) {
    return null;
  }

  const handleRoleChange = async (userId: string, role: "ADMIN" | "USER") => {
    try {
      setActionError(null);
      await updateUserRole(userId, role);
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "Failed to update");
    }
  };

  const handleDelete = async (user: AdminUser) => {
    if (
      !confirm(
        `Are you sure you want to delete ${user.displayName}? This cannot be undone.`
      )
    ) {
      return;
    }

    try {
      setActionError(null);
      await deleteUser(user.id);
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "Failed to delete");
    }
  };

  return (
    <div className="min-h-screen bg-rust-bg px-4 py-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <Link
            href="/admin"
            className="text-sm text-rust-text-secondary hover:text-white"
          >
            &larr; Back to Dashboard
          </Link>
          <h1 className="mt-2 text-3xl font-bold text-white">Users</h1>
          <p className="text-rust-text-secondary">{users.length} total users</p>
        </div>
        <button
          onClick={() => setShowCreateForm(true)}
          className="rounded-lg bg-rust-primary px-4 py-2 font-medium text-white hover:bg-rust-primary-hover"
        >
          + Add User
        </button>
      </div>

      {/* Error display */}
      {(error || actionError) && (
        <div className="mb-4 rounded-lg bg-rust-danger/10 p-4 text-rust-danger">
          {error || actionError}
        </div>
      )}

      {/* Create User Form */}
      {showCreateForm && (
        <CreateUserForm
          onClose={() => setShowCreateForm(false)}
          onCreate={createUser}
          setError={setActionError}
        />
      )}

      {/* Users Table */}
      <div className="overflow-hidden rounded-lg bg-rust-surface">
        <table className="w-full">
          <thead>
            <tr className="border-b border-rust-border">
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-rust-text-secondary">
                User
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-rust-text-secondary">
                Role
              </th>
              <th className="hidden px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-rust-text-secondary sm:table-cell">
                Stats
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-rust-text-secondary">
                Joined
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-rust-text-secondary">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr
                key={user.id}
                className="border-b border-rust-border last:border-0"
              >
                <td className="px-4 py-3">
                  <div>
                    <p className="font-medium text-white">{user.displayName}</p>
                    <p className="text-sm text-rust-text-secondary">{user.email}</p>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <select
                    value={user.role}
                    onChange={(e) =>
                      handleRoleChange(
                        user.id,
                        e.target.value as "ADMIN" | "USER"
                      )
                    }
                    disabled={user.id === session.user.id}
                    className="rounded-lg bg-rust-surface-elevated px-2 py-1 text-sm text-white disabled:opacity-50"
                  >
                    <option value="USER">USER</option>
                    <option value="ADMIN">ADMIN</option>
                  </select>
                </td>
                <td className="hidden px-4 py-3 sm:table-cell">
                  <div className="flex gap-3 text-sm text-rust-text-secondary">
                    <span>{user._count.markers} markers</span>
                    <span>{user._count.mapSessions} maps</span>
                    <span>{user._count.teamMembers} teams</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-rust-text-secondary">
                  {new Date(user.createdAt).toLocaleDateString()}
                </td>
                <td className="px-4 py-3 text-right">
                  {user.id !== session.user.id && (
                    <button
                      onClick={() => handleDelete(user)}
                      className="text-sm text-rust-danger hover:text-rust-danger"
                    >
                      Delete
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Create User Form Component
function CreateUserForm({
  onClose,
  onCreate,
  setError,
}: {
  onClose: () => void;
  onCreate: (data: {
    email: string;
    password: string;
    displayName: string;
    role: "ADMIN" | "USER";
  }) => Promise<void>;
  setError: (error: string | null) => void;
}) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    displayName: "",
    role: "USER" as "ADMIN" | "USER",
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      await onCreate(formData);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create user");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-lg bg-rust-surface p-6">
        <h2 className="mb-4 text-xl font-bold text-white">Create New User</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-rust-text-secondary">
              Display Name
            </label>
            <input
              type="text"
              value={formData.displayName}
              onChange={(e) =>
                setFormData({ ...formData, displayName: e.target.value })
              }
              className="w-full rounded-lg bg-rust-surface-elevated px-4 py-2 text-white placeholder-rust-text-muted focus:border-rust-primary focus:ring-rust-primary"
              required
              minLength={2}
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-rust-text-secondary">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="w-full rounded-lg bg-rust-surface-elevated px-4 py-2 text-white placeholder-rust-text-muted focus:border-rust-primary focus:ring-rust-primary"
              required
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-rust-text-secondary">Password</label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              className="w-full rounded-lg bg-rust-surface-elevated px-4 py-2 text-white placeholder-rust-text-muted focus:border-rust-primary focus:ring-rust-primary"
              required
              minLength={6}
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-rust-text-secondary">Role</label>
            <select
              value={formData.role}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  role: e.target.value as "ADMIN" | "USER",
                })
              }
              className="w-full rounded-lg bg-rust-surface-elevated px-4 py-2 text-white"
            >
              <option value="USER">USER</option>
              <option value="ADMIN">ADMIN</option>
            </select>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-lg bg-rust-surface-elevated px-4 py-2 text-white hover:bg-rust-surface-elevated"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 rounded-lg bg-rust-primary px-4 py-2 font-medium text-white hover:bg-rust-primary-hover disabled:opacity-50"
            >
              {submitting ? "Creating..." : "Create User"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
