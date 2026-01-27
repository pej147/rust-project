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
      <div className="flex min-h-screen items-center justify-center bg-zinc-950">
        <div className="text-zinc-400">Loading...</div>
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
    <div className="min-h-screen bg-zinc-950 px-4 py-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <Link
            href="/admin"
            className="text-sm text-zinc-400 hover:text-white"
          >
            &larr; Back to Dashboard
          </Link>
          <h1 className="mt-2 text-3xl font-bold text-white">Users</h1>
          <p className="text-zinc-400">{users.length} total users</p>
        </div>
        <button
          onClick={() => setShowCreateForm(true)}
          className="rounded-xl bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700"
        >
          + Add User
        </button>
      </div>

      {/* Error display */}
      {(error || actionError) && (
        <div className="mb-4 rounded-xl bg-red-500/10 p-4 text-red-400">
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
      <div className="overflow-hidden rounded-2xl bg-zinc-900">
        <table className="w-full">
          <thead>
            <tr className="border-b border-zinc-800">
              <th className="px-4 py-3 text-left text-sm font-medium text-zinc-400">
                User
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-zinc-400">
                Role
              </th>
              <th className="hidden px-4 py-3 text-left text-sm font-medium text-zinc-400 sm:table-cell">
                Stats
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-zinc-400">
                Joined
              </th>
              <th className="px-4 py-3 text-right text-sm font-medium text-zinc-400">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr
                key={user.id}
                className="border-b border-zinc-800 last:border-0"
              >
                <td className="px-4 py-3">
                  <div>
                    <p className="font-medium text-white">{user.displayName}</p>
                    <p className="text-sm text-zinc-400">{user.email}</p>
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
                    className="rounded-lg bg-zinc-800 px-2 py-1 text-sm text-white disabled:opacity-50"
                  >
                    <option value="USER">USER</option>
                    <option value="ADMIN">ADMIN</option>
                  </select>
                </td>
                <td className="hidden px-4 py-3 sm:table-cell">
                  <div className="flex gap-3 text-sm text-zinc-400">
                    <span>{user._count.markers} markers</span>
                    <span>{user._count.mapSessions} maps</span>
                    <span>{user._count.teamMembers} teams</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-zinc-400">
                  {new Date(user.createdAt).toLocaleDateString()}
                </td>
                <td className="px-4 py-3 text-right">
                  {user.id !== session.user.id && (
                    <button
                      onClick={() => handleDelete(user)}
                      className="text-sm text-red-400 hover:text-red-300"
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
      <div className="w-full max-w-md rounded-2xl bg-zinc-900 p-6">
        <h2 className="mb-4 text-xl font-bold text-white">Create New User</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm text-zinc-400">
              Display Name
            </label>
            <input
              type="text"
              value={formData.displayName}
              onChange={(e) =>
                setFormData({ ...formData, displayName: e.target.value })
              }
              className="w-full rounded-xl bg-zinc-800 px-4 py-2 text-white"
              required
              minLength={2}
            />
          </div>

          <div>
            <label className="mb-1 block text-sm text-zinc-400">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="w-full rounded-xl bg-zinc-800 px-4 py-2 text-white"
              required
            />
          </div>

          <div>
            <label className="mb-1 block text-sm text-zinc-400">Password</label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              className="w-full rounded-xl bg-zinc-800 px-4 py-2 text-white"
              required
              minLength={6}
            />
          </div>

          <div>
            <label className="mb-1 block text-sm text-zinc-400">Role</label>
            <select
              value={formData.role}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  role: e.target.value as "ADMIN" | "USER",
                })
              }
              className="w-full rounded-xl bg-zinc-800 px-4 py-2 text-white"
            >
              <option value="USER">USER</option>
              <option value="ADMIN">ADMIN</option>
            </select>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl bg-zinc-800 px-4 py-2 text-white hover:bg-zinc-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 rounded-xl bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {submitting ? "Creating..." : "Create User"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
