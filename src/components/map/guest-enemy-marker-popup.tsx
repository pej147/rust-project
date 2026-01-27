"use client";

import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { type GuestMarker } from "@/hooks/use-guest-markers";

interface Resident {
  id: string;
  name: string;
  clanTag?: string;
  threatLevel: number;
}

interface GuestEnemyMarkerPopupProps {
  marker: GuestMarker | null;
  isOpen: boolean;
  position: { x: number; y: number } | null; // Screen coordinates
  onClose: () => void;
  onOpenSettings: () => void;
  onUpdateResidents: (markerId: string, residents: Resident[]) => void;
}

// Threat level display with skulls
function ThreatBadge({ level }: { level: number }) {
  return (
    <div className="flex items-center gap-0.5" title={`Threat level ${level}/5`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <span
          key={i}
          className={`text-xs ${i < level ? "text-red-500" : "text-zinc-600"}`}
        >
          💀
        </span>
      ))}
    </div>
  );
}

export function GuestEnemyMarkerPopup({
  marker,
  isOpen,
  position,
  onClose,
  onOpenSettings,
  onUpdateResidents,
}: GuestEnemyMarkerPopupProps) {
  const popupRef = useRef<HTMLDivElement>(null);

  // Get residents from marker (stored locally)
  const residents: Resident[] = marker?.residents || [];

  // Add player form state
  const [isAdding, setIsAdding] = useState(false);
  const [newName, setNewName] = useState("");
  const [newClanTag, setNewClanTag] = useState("");
  const [newThreatLevel, setNewThreatLevel] = useState(1);

  // Handle click outside
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
        handleClose();
      }
    };

    // Add slight delay so the popup doesn't close immediately
    const timer = setTimeout(() => {
      document.addEventListener("mousedown", handleClickOutside);
    }, 100);

    return () => {
      clearTimeout(timer);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Reset form on close
  const handleClose = () => {
    setIsAdding(false);
    setNewName("");
    setNewClanTag("");
    setNewThreatLevel(1);
    onClose();
  };

  // Add new player
  const handleAddPlayer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!marker?.id || !newName.trim()) return;

    const newResident: Resident = {
      id: crypto.randomUUID(),
      name: newName.trim(),
      clanTag: newClanTag.trim() || undefined,
      threatLevel: newThreatLevel,
    };

    onUpdateResidents(marker.id, [...residents, newResident]);

    // Reset form
    setNewName("");
    setNewClanTag("");
    setNewThreatLevel(1);
    setIsAdding(false);
  };

  // Remove player
  const handleRemovePlayer = (residentId: string) => {
    if (!marker?.id) return;
    const updatedResidents = residents.filter((r) => r.id !== residentId);
    onUpdateResidents(marker.id, updatedResidents);
  };

  if (!isOpen || !marker || !position) return null;

  // Calculate popup position - position it to the right of the marker, or left if too close to edge
  const popupWidth = 280;
  const popupOffset = 20;
  const screenWidth = typeof window !== "undefined" ? window.innerWidth : 1000;

  const positionRight = position.x + popupOffset + popupWidth < screenWidth;
  const left = positionRight
    ? position.x + popupOffset
    : position.x - popupOffset - popupWidth;

  // Keep popup within vertical bounds
  const top = Math.max(60, Math.min(position.y - 100, window.innerHeight - 400));

  return (
    <div
      ref={popupRef}
      className="fixed z-[2000] animate-in fade-in slide-in-from-left-2 duration-200"
      style={{
        left: `${left}px`,
        top: `${top}px`,
        width: `${popupWidth}px`,
      }}
    >
      <div className="rounded-2xl border border-zinc-700 bg-zinc-900 shadow-2xl shadow-black/50">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-800 px-4 py-3">
          <div className="flex items-center gap-3">
            <div
              className="flex h-10 w-10 items-center justify-center rounded-xl text-lg"
              style={{ backgroundColor: marker.color || "#FF3B30" }}
            >
              👤
            </div>
            <div>
              <h3 className="font-semibold text-white">{marker.title}</h3>
              <p className="font-mono text-xs text-zinc-500">
                {Math.round(marker.x)}, {Math.round(marker.y)}
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="rounded-lg p-1.5 text-zinc-500 hover:bg-zinc-800 hover:text-zinc-300"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="max-h-[300px] overflow-y-auto p-3">
          {/* Residents list */}
          <div className="mb-3 flex items-center justify-between">
            <h4 className="text-sm font-medium text-zinc-400">
              Residents ({residents.length})
            </h4>
            {!isAdding && (
              <button
                onClick={() => setIsAdding(true)}
                className="text-xs text-blue-400 hover:text-blue-300"
              >
                + Add
              </button>
            )}
          </div>

          {residents.length === 0 && !isAdding ? (
            <div className="py-4 text-center text-sm text-zinc-500">
              No players added yet
            </div>
          ) : (
            <div className="space-y-2">
              {residents.map((resident) => (
                <div
                  key={resident.id}
                  className="flex items-center justify-between rounded-lg bg-zinc-800/70 p-2.5"
                >
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm text-white">
                      {resident.clanTag && (
                        <span className="text-zinc-400">
                          [{resident.clanTag}]{" "}
                        </span>
                      )}
                      {resident.name}
                    </div>
                    <ThreatBadge level={resident.threatLevel} />
                  </div>
                  <button
                    onClick={() => handleRemovePlayer(resident.id)}
                    className="ml-2 rounded p-1.5 text-zinc-500 hover:bg-zinc-700 hover:text-red-400"
                    title="Remove player"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Add player form */}
          {isAdding && (
            <form onSubmit={handleAddPlayer} className="mt-3 space-y-2 border-t border-zinc-800 pt-3">
              <Input
                id="player-name"
                label="Player Name"
                placeholder="Enter name"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                required
                autoFocus
              />
              <Input
                id="clan-tag"
                label="Clan Tag"
                placeholder="Optional"
                value={newClanTag}
                onChange={(e) => setNewClanTag(e.target.value)}
                maxLength={10}
              />
              <div>
                <label className="mb-1 block text-xs font-medium text-zinc-400">
                  Threat Level
                </label>
                <div className="flex items-center gap-0.5">
                  {[1, 2, 3, 4, 5].map((level) => (
                    <button
                      key={level}
                      type="button"
                      onClick={() => setNewThreatLevel(level)}
                      className={`rounded p-1 text-base transition-colors ${
                        level <= newThreatLevel
                          ? "text-red-500"
                          : "text-zinc-600 hover:text-zinc-400"
                      }`}
                    >
                      💀
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex gap-2 pt-1">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setIsAdding(false)}
                  className="flex-1 py-2 text-sm"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  className="flex-1 py-2 text-sm"
                  disabled={!newName.trim()}
                >
                  Add
                </Button>
              </div>
            </form>
          )}
        </div>

        {/* Footer - Settings button */}
        <div className="border-t border-zinc-800 p-3">
          <button
            onClick={onOpenSettings}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-zinc-800 py-2.5 text-sm font-medium text-zinc-300 transition-colors hover:bg-zinc-700"
          >
            <span>⚙️</span>
            <span>Marker Settings</span>
          </button>
        </div>
      </div>

      {/* Arrow pointer to marker */}
      <div
        className="absolute top-1/2 h-3 w-3 -translate-y-1/2 rotate-45 border-zinc-700 bg-zinc-900"
        style={{
          [positionRight ? "left" : "right"]: "-6px",
          borderLeft: positionRight ? "1px solid" : "none",
          borderBottom: positionRight ? "1px solid" : "none",
          borderRight: positionRight ? "none" : "1px solid",
          borderTop: positionRight ? "none" : "1px solid",
        }}
      />
    </div>
  );
}
