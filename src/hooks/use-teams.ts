"use client";

import { useState, useEffect, useCallback } from "react";

export interface TeamMember {
  id: string;
  role: "OWNER" | "ADMIN" | "MEMBER";
  userId: string;
  joinedAt: string;
  user: {
    id: string;
    displayName: string;
    email?: string;
  };
}

export interface Team {
  id: string;
  name: string;
  code: string;
  createdAt: string;
  userRole: "OWNER" | "ADMIN" | "MEMBER" | null;
  members: TeamMember[];
  _count: {
    members: number;
    markers: number;
    mapSessions: number;
  };
}

export function useTeams() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch teams
  const fetchTeams = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await fetch("/api/teams");
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Could not fetch teams");
      }
      const data = await res.json();
      setTeams(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchTeams();
  }, [fetchTeams]);

  // Create team
  const createTeam = useCallback(async (name: string): Promise<Team | null> => {
    try {
      setError(null);
      const res = await fetch("/api/teams", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Could not create team");
      }

      const newTeam = await res.json();
      await fetchTeams(); // Refresh list
      return newTeam;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
      return null;
    }
  }, [fetchTeams]);

  // Join team by code
  const joinTeam = useCallback(async (code: string): Promise<Team | null> => {
    try {
      setError(null);
      const res = await fetch("/api/teams/join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Could not join");
      }

      const team = await res.json();
      await fetchTeams(); // Refresh list
      return team;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
      return null;
    }
  }, [fetchTeams]);

  // Leave team
  const leaveTeam = useCallback(async (teamId: string, memberId: string): Promise<boolean> => {
    try {
      setError(null);
      const res = await fetch(`/api/teams/${teamId}/members`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ memberId, action: "leave" }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Could not leave team");
      }

      await fetchTeams(); // Refresh list
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
      return false;
    }
  }, [fetchTeams]);

  // Delete team (owner only)
  const deleteTeam = useCallback(async (teamId: string): Promise<boolean> => {
    try {
      setError(null);
      const res = await fetch(`/api/teams/${teamId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Could not delete team");
      }

      await fetchTeams(); // Refresh list
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
      return false;
    }
  }, [fetchTeams]);

  // Remove member (admin/owner)
  const removeMember = useCallback(async (teamId: string, memberId: string): Promise<boolean> => {
    try {
      setError(null);
      const res = await fetch(`/api/teams/${teamId}/members`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ memberId, action: "remove" }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Could not remove member");
      }

      await fetchTeams(); // Refresh list
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
      return false;
    }
  }, [fetchTeams]);

  // Update member role (owner only)
  const updateMemberRole = useCallback(async (
    teamId: string,
    memberId: string,
    role: "ADMIN" | "MEMBER"
  ): Promise<boolean> => {
    try {
      setError(null);
      const res = await fetch(`/api/teams/${teamId}/members`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ memberId, role, action: "update" }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Could not change role");
      }

      await fetchTeams(); // Refresh list
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
      return false;
    }
  }, [fetchTeams]);

  return {
    teams,
    isLoading,
    error,
    fetchTeams,
    createTeam,
    joinTeam,
    leaveTeam,
    deleteTeam,
    removeMember,
    updateMemberRole,
  };
}
