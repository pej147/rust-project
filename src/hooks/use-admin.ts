"use client";

import { useState, useEffect, useCallback } from "react";

// Types
interface UserStats {
  markers: number;
  mapSessions: number;
  teamMembers: number;
}

export interface AdminUser {
  id: string;
  email: string;
  displayName: string;
  role: "ADMIN" | "USER";
  createdAt: string;
  _count: UserStats;
}

export interface AdminMap {
  id: string;
  seed: string;
  serverName: string | null;
  mapSize: number;
  wipeDate: string | null;
  isActive: boolean;
  createdAt: string;
  createdBy: {
    id: string;
    displayName: string;
    email: string;
  };
  team: {
    id: string;
    name: string;
  } | null;
  _count: {
    markers: number;
  };
}

export interface AuditLogEntry {
  id: string;
  action: string;
  entityType: string;
  entityId: string;
  userId: string;
  details: Record<string, unknown> | null;
  createdAt: string;
  user: {
    displayName: string;
    email: string;
  };
}

export interface AdminStats {
  totals: {
    users: number;
    maps: number;
    markers: number;
    teams: number;
  };
  recent: {
    users: number;
    maps: number;
  };
  usersByRole: Record<string, number>;
  markersByType: Record<string, number>;
}

// Hook for admin stats
export function useAdminStats() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/stats");
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to fetch stats");
      }
      const data = await res.json();
      setStats(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return { stats, loading, error, refetch: fetchStats };
}

// Hook for admin users
export function useAdminUsers() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/users");
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to fetch users");
      }
      const data = await res.json();
      setUsers(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const updateUserRole = async (userId: string, role: "ADMIN" | "USER") => {
    const res = await fetch(`/api/admin/users/${userId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role }),
    });

    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error || "Failed to update user");
    }

    await fetchUsers();
  };

  const deleteUser = async (userId: string) => {
    const res = await fetch(`/api/admin/users/${userId}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error || "Failed to delete user");
    }

    await fetchUsers();
  };

  const createUser = async (data: {
    email: string;
    password: string;
    displayName: string;
    role: "ADMIN" | "USER";
  }) => {
    const res = await fetch("/api/admin/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const responseData = await res.json();
      throw new Error(responseData.error || "Failed to create user");
    }

    await fetchUsers();
  };

  return {
    users,
    loading,
    error,
    refetch: fetchUsers,
    updateUserRole,
    deleteUser,
    createUser,
  };
}

// Hook for admin maps
export function useAdminMaps() {
  const [maps, setMaps] = useState<AdminMap[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMaps = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/maps");
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to fetch maps");
      }
      const data = await res.json();
      setMaps(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMaps();
  }, [fetchMaps]);

  const deleteMap = async (mapId: string) => {
    const res = await fetch(`/api/admin/maps/${mapId}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error || "Failed to delete map");
    }

    await fetchMaps();
  };

  return { maps, loading, error, refetch: fetchMaps, deleteMap };
}

// Hook for audit logs
export function useAuditLogs(options?: { limit?: number; offset?: number }) {
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (options?.limit) params.set("limit", options.limit.toString());
    if (options?.offset) params.set("offset", options.offset.toString());

    try {
      const res = await fetch(`/api/admin/audit?${params.toString()}`);
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to fetch audit logs");
      }
      const data = await res.json();
      setLogs(data.logs);
      setTotal(data.total);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }, [options?.limit, options?.offset]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  return { logs, total, loading, error, refetch: fetchLogs };
}
