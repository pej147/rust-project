"use client";

import { useState } from "react";
import { Header } from "@/components/layout/header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BottomSheet } from "@/components/ui/bottom-sheet";
import { useTeams, Team } from "@/hooks/use-teams";
import { useSession } from "next-auth/react";

// Role badge component
function RoleBadge({ role }: { role: string }) {
  const colors = {
    OWNER: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    ADMIN: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    MEMBER: "bg-zinc-500/20 text-zinc-400 border-zinc-500/30",
  };

  const labels = {
    OWNER: "Owner",
    ADMIN: "Admin",
    MEMBER: "Member",
  };

  return (
    <span
      className={`rounded-full border px-2 py-0.5 text-xs font-medium ${colors[role as keyof typeof colors] || colors.MEMBER}`}
    >
      {labels[role as keyof typeof labels] || role}
    </span>
  );
}

// Team card component
function TeamCard({
  team,
  onSelect,
}: {
  team: Team;
  onSelect: (team: Team) => void;
}) {
  return (
    <Card
      variant="elevated"
      className="cursor-pointer transition-transform hover:scale-[1.02] active:scale-[0.98]"
      onClick={() => onSelect(team)}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-semibold text-white">{team.name}</h3>
            <p className="mt-1 text-sm text-zinc-400">
              Code: <span className="font-mono text-zinc-300">{team.code}</span>
            </p>
          </div>
          <RoleBadge role={team.userRole || "MEMBER"} />
        </div>

        <div className="mt-4 flex gap-4 text-sm text-zinc-400">
          <span className="flex items-center gap-1">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            {team._count.members} members
          </span>
          <span className="flex items-center gap-1">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {team._count.markers} markers
          </span>
          <span className="flex items-center gap-1">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
            {team._count.mapSessions} maps
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

// Create team sheet
function CreateTeamSheet({
  isOpen,
  onClose,
  onCreate,
  isLoading,
}: {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (name: string) => Promise<void>;
  isLoading: boolean;
}) {
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (name.length < 2) {
      setError("Team name must be at least 2 characters");
      return;
    }

    await onCreate(name);
    setName("");
    onClose();
  };

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} title="Create Team">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Team Name"
          placeholder="e.g. The Roamers"
          value={name}
          onChange={(e) => setName(e.target.value)}
          error={error}
          maxLength={30}
          autoFocus
        />

        <p className="text-sm text-zinc-400">
          After creating, you&apos;ll get a unique code for others to join.
        </p>

        <div className="flex gap-3 pt-2">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            className="flex-1"
            disabled={isLoading || name.length < 2}
          >
            {isLoading ? "Creating..." : "Create"}
          </Button>
        </div>
      </form>
    </BottomSheet>
  );
}

// Join team sheet
function JoinTeamSheet({
  isOpen,
  onClose,
  onJoin,
  isLoading,
  error,
}: {
  isOpen: boolean;
  onClose: () => void;
  onJoin: (code: string) => Promise<void>;
  isLoading: boolean;
  error: string | null;
}) {
  const [code, setCode] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (code.length !== 6) return;
    await onJoin(code.toUpperCase());
  };

  const handleClose = () => {
    setCode("");
    onClose();
  };

  return (
    <BottomSheet isOpen={isOpen} onClose={handleClose} title="Join Team">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Team Code"
          placeholder="XXXXXX"
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase().slice(0, 6))}
          error={error || undefined}
          maxLength={6}
          autoFocus
          className="font-mono text-center text-xl tracking-widest"
        />

        <p className="text-sm text-zinc-400">
          Ask the team owner for the 6-character code.
        </p>

        <div className="flex gap-3 pt-2">
          <Button
            type="button"
            variant="secondary"
            onClick={handleClose}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            className="flex-1"
            disabled={isLoading || code.length !== 6}
          >
            {isLoading ? "Joining..." : "Join"}
          </Button>
        </div>
      </form>
    </BottomSheet>
  );
}

// Team detail sheet
function TeamDetailSheet({
  team,
  onClose,
  onLeave,
  onDelete,
  onRemoveMember,
  onUpdateRole,
  currentUserId,
}: {
  team: Team | null;
  onClose: () => void;
  onLeave: (teamId: string, memberId: string) => Promise<void>;
  onDelete: (teamId: string) => Promise<void>;
  onRemoveMember: (teamId: string, memberId: string) => Promise<void>;
  onUpdateRole: (teamId: string, memberId: string, role: "ADMIN" | "MEMBER") => Promise<void>;
  currentUserId: string | undefined;
}) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!team) return null;

  const isOwner = team.userRole === "OWNER";
  const isAdmin = team.userRole === "ADMIN" || isOwner;
  const myMembership = team.members.find((m) => m.userId === currentUserId);

  const copyCode = async () => {
    await navigator.clipboard.writeText(team.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleLeave = async () => {
    if (!myMembership) return;
    await onLeave(team.id, myMembership.id);
    onClose();
  };

  const handleDelete = async () => {
    await onDelete(team.id);
    onClose();
  };

  return (
    <BottomSheet isOpen={!!team} onClose={onClose} title={team.name}>
      <div className="space-y-6">
        {/* Team code */}
        <div className="rounded-xl bg-zinc-800 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-zinc-400">Team Code</p>
              <p className="mt-1 font-mono text-2xl font-bold tracking-widest text-white">
                {team.code}
              </p>
            </div>
            <Button variant="secondary" size="sm" onClick={copyCode}>
              {copied ? "Copied!" : "Copy"}
            </Button>
          </div>
          <p className="mt-2 text-xs text-zinc-500">
            Share this code with friends to let them join
          </p>
        </div>

        {/* Members */}
        <div>
          <h3 className="mb-3 font-semibold text-white">
            Members ({team.members.length})
          </h3>
          <div className="space-y-2">
            {team.members.map((member) => (
              <div
                key={member.id}
                className="flex items-center justify-between rounded-xl bg-zinc-800 p-3"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-700 text-lg font-bold text-white">
                    {member.user.displayName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-medium text-white">
                      {member.user.displayName}
                      {member.userId === currentUserId && (
                        <span className="ml-2 text-xs text-zinc-400">(you)</span>
                      )}
                    </p>
                    <RoleBadge role={member.role} />
                  </div>
                </div>

                {/* Actions for owner */}
                {isOwner && member.userId !== currentUserId && member.role !== "OWNER" && (
                  <div className="flex gap-2">
                    <button
                      onClick={() =>
                        onUpdateRole(
                          team.id,
                          member.id,
                          member.role === "ADMIN" ? "MEMBER" : "ADMIN"
                        )
                      }
                      className="rounded-lg bg-zinc-700 px-2 py-1 text-xs text-zinc-300 hover:bg-zinc-600"
                    >
                      {member.role === "ADMIN" ? "Demote" : "Promote"}
                    </button>
                    <button
                      onClick={() => onRemoveMember(team.id, member.id)}
                      className="rounded-lg bg-red-500/20 px-2 py-1 text-xs text-red-400 hover:bg-red-500/30"
                    >
                      Kick
                    </button>
                  </div>
                )}

                {/* Actions for admin (can only kick members) */}
                {!isOwner && isAdmin && member.role === "MEMBER" && member.userId !== currentUserId && (
                  <button
                    onClick={() => onRemoveMember(team.id, member.id)}
                    className="rounded-lg bg-red-500/20 px-2 py-1 text-xs text-red-400 hover:bg-red-500/30"
                  >
                    Kick
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-2 border-t border-zinc-800 pt-4">
          {!isOwner && (
            <Button
              variant="secondary"
              className="w-full"
              onClick={handleLeave}
            >
              Leave Team
            </Button>
          )}

          {isOwner && !showDeleteConfirm && (
            <Button
              variant="secondary"
              className="w-full text-red-400 hover:bg-red-500/20"
              onClick={() => setShowDeleteConfirm(true)}
            >
              Delete Team
            </Button>
          )}

          {isOwner && showDeleteConfirm && (
            <div className="rounded-xl bg-red-500/10 p-4">
              <p className="mb-3 text-sm text-red-400">
                Are you sure you want to delete this team? This cannot be undone.
              </p>
              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleDelete}
                  className="flex-1 bg-red-500 hover:bg-red-600"
                >
                  Delete
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </BottomSheet>
  );
}

// Empty state component
function EmptyState({
  onCreateClick,
  onJoinClick,
}: {
  onCreateClick: () => void;
  onJoinClick: () => void;
}) {
  return (
    <Card variant="elevated">
      <CardContent className="flex flex-col items-center justify-center py-16">
        <div className="mb-4 rounded-full bg-zinc-800 p-4">
          <svg
            className="h-12 w-12 text-zinc-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z"
            />
          </svg>
        </div>
        <h2 className="mb-2 text-xl font-semibold text-white">No teams yet</h2>
        <p className="mb-6 text-center text-zinc-400">
          Create a team or join an existing one
        </p>
        <div className="flex gap-3">
          <Button variant="primary" onClick={onCreateClick}>
            Create Team
          </Button>
          <Button variant="secondary" onClick={onJoinClick}>
            Join Team
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// Main page component
export default function TeamsPage() {
  const { data: session } = useSession();
  const {
    teams,
    isLoading,
    error,
    createTeam,
    joinTeam,
    leaveTeam,
    deleteTeam,
    removeMember,
    updateMemberRole,
  } = useTeams();

  const [showCreateSheet, setShowCreateSheet] = useState(false);
  const [showJoinSheet, setShowJoinSheet] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [joinError, setJoinError] = useState<string | null>(null);

  const handleCreate = async (name: string) => {
    setActionLoading(true);
    await createTeam(name);
    setActionLoading(false);
  };

  const handleJoin = async (code: string) => {
    setActionLoading(true);
    setJoinError(null);
    const result = await joinTeam(code);
    if (!result) {
      setJoinError(error || "Could not join");
    } else {
      setShowJoinSheet(false);
    }
    setActionLoading(false);
  };

  const handleLeave = async (teamId: string, memberId: string) => {
    setActionLoading(true);
    await leaveTeam(teamId, memberId);
    setActionLoading(false);
  };

  const handleDelete = async (teamId: string) => {
    setActionLoading(true);
    await deleteTeam(teamId);
    setActionLoading(false);
  };

  const handleRemoveMember = async (teamId: string, memberId: string) => {
    await removeMember(teamId, memberId);
    // Refresh selected team
    const updated = teams.find((t) => t.id === teamId);
    if (updated) setSelectedTeam(updated);
  };

  const handleUpdateRole = async (
    teamId: string,
    memberId: string,
    role: "ADMIN" | "MEMBER"
  ) => {
    await updateMemberRole(teamId, memberId, role);
    // Refresh selected team
    const updated = teams.find((t) => t.id === teamId);
    if (updated) setSelectedTeam(updated);
  };

  // Update selected team when teams change
  const handleSelectTeam = (team: Team) => {
    const freshTeam = teams.find((t) => t.id === team.id);
    setSelectedTeam(freshTeam || team);
  };

  return (
    <>
      <Header
        title="Teams"
        subtitle="Collaborate with your squad"
        rightAction={
          teams.length > 0 ? (
            <div className="flex gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setShowJoinSheet(true)}
              >
                Join
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => setShowCreateSheet(true)}
              >
                New
              </Button>
            </div>
          ) : undefined
        }
      />

      <div className="p-4">
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-zinc-600 border-t-white" />
          </div>
        ) : teams.length === 0 ? (
          <EmptyState
            onCreateClick={() => setShowCreateSheet(true)}
            onJoinClick={() => setShowJoinSheet(true)}
          />
        ) : (
          <div className="space-y-3">
            {teams.map((team) => (
              <TeamCard key={team.id} team={team} onSelect={handleSelectTeam} />
            ))}
          </div>
        )}
      </div>

      {/* Sheets */}
      <CreateTeamSheet
        isOpen={showCreateSheet}
        onClose={() => setShowCreateSheet(false)}
        onCreate={handleCreate}
        isLoading={actionLoading}
      />

      <JoinTeamSheet
        isOpen={showJoinSheet}
        onClose={() => {
          setShowJoinSheet(false);
          setJoinError(null);
        }}
        onJoin={handleJoin}
        isLoading={actionLoading}
        error={joinError}
      />

      <TeamDetailSheet
        team={selectedTeam}
        onClose={() => setSelectedTeam(null)}
        onLeave={handleLeave}
        onDelete={handleDelete}
        onRemoveMember={handleRemoveMember}
        onUpdateRole={handleUpdateRole}
        currentUserId={session?.user?.id}
      />
    </>
  );
}
