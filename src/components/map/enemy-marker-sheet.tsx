"use client";

import { useState, useEffect, useCallback } from "react";
import { BottomSheet } from "@/components/ui/bottom-sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface EnemyProfile {
  id: string;
  name: string;
  clanTag?: string | null;
  notes?: string | null;
  threatLevel: number;
}

interface Resident {
  id: string;
  addedAt: string;
  enemy: EnemyProfile;
}

interface MarkerData {
  id: string;
  title: string;
  type: string;
  x: number;
  y: number;
  color?: string;
  description?: string;
  createdBy?: {
    id: string;
    displayName: string;
  };
}

interface EnemyMarkerSheetProps {
  marker: MarkerData | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenSettings: () => void;
  currentUserId?: string;
}

// Threat level display with skulls
function ThreatBadge({ level }: { level: number }) {
  return (
    <div className="flex items-center gap-0.5" title={`Threat level ${level}/5`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <span
          key={i}
          className={`text-sm ${i < level ? "text-rust-danger" : "text-rust-text-muted"}`}
        >
          💀
        </span>
      ))}
    </div>
  );
}

export function EnemyMarkerSheet({
  marker,
  isOpen,
  onClose,
  onOpenSettings,
  currentUserId,
}: EnemyMarkerSheetProps) {
  const [residents, setResidents] = useState<Resident[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Add player form state
  const [isAdding, setIsAdding] = useState(false);
  const [newName, setNewName] = useState("");
  const [newClanTag, setNewClanTag] = useState("");
  const [newThreatLevel, setNewThreatLevel] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isOwner = currentUserId === marker?.createdBy?.id;

  // Fetch residents
  const fetchResidents = useCallback(async () => {
    if (!marker?.id) return;

    setIsLoading(true);
    setError("");

    try {
      const res = await fetch(`/api/markers/${marker.id}/residents`);
      if (!res.ok) {
        throw new Error("Could not fetch residents");
      }
      const data = await res.json();
      setResidents(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setIsLoading(false);
    }
  }, [marker?.id]);

  // Fetch on open
  useEffect(() => {
    if (isOpen && marker?.id) {
      fetchResidents();
    }
  }, [isOpen, marker?.id, fetchResidents]);

  // Reset form on close
  const handleClose = () => {
    setIsAdding(false);
    setNewName("");
    setNewClanTag("");
    setNewThreatLevel(1);
    setError("");
    onClose();
  };

  // Add new player
  const handleAddPlayer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!marker?.id || !newName.trim()) return;

    setIsSubmitting(true);
    setError("");

    try {
      const res = await fetch(`/api/markers/${marker.id}/residents`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newName.trim(),
          clanTag: newClanTag.trim() || undefined,
          threatLevel: newThreatLevel,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Could not add player");
      }

      // Reset form and refresh
      setNewName("");
      setNewClanTag("");
      setNewThreatLevel(1);
      setIsAdding(false);
      await fetchResidents();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Remove player
  const handleRemovePlayer = async (residentId: string) => {
    if (!marker?.id) return;

    try {
      const res = await fetch(
        `/api/markers/${marker.id}/residents?residentId=${residentId}`,
        { method: "DELETE" }
      );

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Could not remove player");
      }

      await fetchResidents();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    }
  };

  if (!marker) return null;

  return (
    <BottomSheet isOpen={isOpen} onClose={handleClose} title="Enemy Base">
      <div className="space-y-4">
        {/* Header with marker info */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-white">{marker.title}</h3>
            <p className="font-mono text-sm text-rust-text-secondary">
              {Math.round(marker.x)}, {Math.round(marker.y)}
            </p>
          </div>
          <div
            className="flex h-12 w-12 items-center justify-center rounded-lg text-xl"
            style={{ backgroundColor: marker.color || "#FF3B30" }}
          >
            👤
          </div>
        </div>

        {/* Residents list */}
        <div className="rounded-lg bg-rust-surface/50 p-3">
          <div className="mb-3 flex items-center justify-between">
            <h4 className="text-sm font-semibold uppercase tracking-wide text-rust-text-secondary">
              Residents ({residents.length})
            </h4>
            {isOwner && !isAdding && (
              <button
                onClick={() => setIsAdding(true)}
                className="text-sm text-rust-primary hover:text-rust-primary-hover"
              >
                + Add Player
              </button>
            )}
          </div>

          {isLoading ? (
            <div className="py-4 text-center text-rust-text-muted">Loading...</div>
          ) : residents.length === 0 ? (
            <div className="py-4 text-center text-rust-text-muted">
              No players added yet
            </div>
          ) : (
            <div className="space-y-2">
              {residents.map((resident) => (
                <div
                  key={resident.id}
                  className="flex items-center justify-between rounded-lg bg-rust-surface-elevated/50 p-3"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-white">
                        {resident.enemy.clanTag && (
                          <span className="text-rust-text-secondary">
                            [{resident.enemy.clanTag}]{" "}
                          </span>
                        )}
                        {resident.enemy.name}
                      </span>
                    </div>
                    <ThreatBadge level={resident.enemy.threatLevel} />
                  </div>
                  {isOwner && (
                    <button
                      onClick={() => handleRemovePlayer(resident.id)}
                      className="ml-2 rounded-lg p-2 text-rust-text-secondary hover:bg-rust-surface-elevated hover:text-rust-danger"
                      title="Remove player"
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Add player form */}
          {isAdding && (
            <form onSubmit={handleAddPlayer} className="mt-3 space-y-3 border-t border-rust-border pt-3">
              <Input
                id="player-name"
                label="Player Name"
                placeholder="Enter player name"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                required
                autoFocus
              />
              <Input
                id="clan-tag"
                label="Clan Tag (optional)"
                placeholder="e.g. ABC"
                value={newClanTag}
                onChange={(e) => setNewClanTag(e.target.value)}
                maxLength={10}
              />
              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-rust-text-secondary">
                  Threat Level
                </label>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((level) => (
                    <button
                      key={level}
                      type="button"
                      onClick={() => setNewThreatLevel(level)}
                      className={`rounded-lg p-2 text-xl transition-colors ${
                        level <= newThreatLevel
                          ? "text-rust-danger"
                          : "text-rust-text-muted hover:text-rust-text-secondary"
                      }`}
                    >
                      💀
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setIsAdding(false)}
                  className="flex-1"
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  className="flex-1"
                  disabled={isSubmitting || !newName.trim()}
                >
                  {isSubmitting ? "Adding..." : "Add Player"}
                </Button>
              </div>
            </form>
          )}
        </div>

        {/* Error message */}
        {error && (
          <div className="rounded-lg bg-rust-danger/10 p-3 text-center text-sm text-rust-danger">
            {error}
          </div>
        )}

        {/* Settings button */}
        <Button
          type="button"
          variant="secondary"
          onClick={onOpenSettings}
          className="w-full"
        >
          ⚙️ Marker Settings
        </Button>
      </div>
    </BottomSheet>
  );
}
