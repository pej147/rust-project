"use client";

import { useState, useEffect, useRef } from "react";
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
          className={`text-xs ${i < level ? "text-rust-danger" : "text-rust-text-muted"}`}
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

  // Calculate popup position - position it directly next to the marker
  const popupWidth = 220;
  const popupOffset = 12;
  const screenWidth = typeof window !== "undefined" ? window.innerWidth : 1000;
  const screenHeight = typeof window !== "undefined" ? window.innerHeight : 800;

  const positionRight = position.x + popupOffset + popupWidth < screenWidth;
  const left = positionRight
    ? position.x + popupOffset
    : position.x - popupOffset - popupWidth;

  // Position popup centered on marker Y, keep within bounds
  const popupHeight = 280;
  const top = Math.max(10, Math.min(position.y - popupHeight / 3, screenHeight - popupHeight - 10));

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
      <div className="rounded-lg border border-rust-border/50 bg-rust-bg/95 shadow-xl shadow-black/40 backdrop-blur-sm">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-rust-border/50 px-3 py-2">
          <div className="flex items-center gap-2">
            <div
              className="flex h-7 w-7 items-center justify-center rounded-lg text-sm"
              style={{ backgroundColor: marker.color || "#FF3B30" }}
            >
              👤
            </div>
            <div>
              <h3 className="text-sm font-medium text-white">{marker.title}</h3>
              <p className="font-mono text-[10px] text-rust-text-muted">
                {Math.round(marker.x)}, {Math.round(marker.y)}
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="rounded p-1 text-rust-text-muted hover:bg-rust-surface hover:text-rust-text"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="max-h-[180px] overflow-y-auto p-2">
          {/* Residents list */}
          <div className="mb-2 flex items-center justify-between">
            <h4 className="text-xs font-medium text-rust-text-muted">
              Residents ({residents.length})
            </h4>
            {!isAdding && (
              <button
                onClick={() => setIsAdding(true)}
                className="text-[10px] text-rust-primary hover:text-rust-primary-hover"
              >
                + Add
              </button>
            )}
          </div>

          {residents.length === 0 && !isAdding ? (
            <div className="py-3 text-center text-xs text-rust-text-muted">
              No players yet
            </div>
          ) : (
            <div className="space-y-1">
              {residents.map((resident) => (
                <div
                  key={resident.id}
                  className="flex items-center justify-between rounded-md bg-rust-surface/50 px-2 py-1.5"
                >
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-xs text-white">
                      {resident.clanTag && (
                        <span className="text-rust-text-secondary">
                          [{resident.clanTag}]{" "}
                        </span>
                      )}
                      {resident.name}
                    </div>
                    <ThreatBadge level={resident.threatLevel} />
                  </div>
                  <button
                    onClick={() => handleRemovePlayer(resident.id)}
                    className="ml-1 rounded p-1 text-rust-text-muted hover:bg-rust-surface-elevated hover:text-rust-danger"
                    title="Remove"
                  >
                    <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Add player form */}
          {isAdding && (
            <form onSubmit={handleAddPlayer} className="mt-2 space-y-1.5 border-t border-rust-border/50 pt-2">
              <input
                type="text"
                placeholder="Player name"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="w-full rounded-md bg-rust-surface-elevated px-2 py-1.5 text-xs text-white placeholder-rust-text-muted outline-none focus:ring-1 focus:ring-rust-primary"
                required
                autoFocus
              />
              <input
                type="text"
                placeholder="Clan tag (optional)"
                value={newClanTag}
                onChange={(e) => setNewClanTag(e.target.value)}
                className="w-full rounded-md bg-rust-surface-elevated px-2 py-1.5 text-xs text-white placeholder-rust-text-muted outline-none focus:ring-1 focus:ring-rust-primary"
                maxLength={10}
              />
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-0">
                  {[1, 2, 3, 4, 5].map((level) => (
                    <button
                      key={level}
                      type="button"
                      onClick={() => setNewThreatLevel(level)}
                      className={`p-0.5 text-xs transition-colors ${
                        level <= newThreatLevel
                          ? "text-rust-danger"
                          : "text-rust-text-muted hover:text-rust-text-secondary"
                      }`}
                    >
                      💀
                    </button>
                  ))}
                </div>
                <div className="flex gap-1">
                  <button
                    type="button"
                    onClick={() => setIsAdding(false)}
                    className="rounded px-2 py-1 text-[10px] text-rust-text-secondary hover:bg-rust-surface"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={!newName.trim()}
                    className="rounded bg-rust-primary px-2 py-1 text-[10px] text-white hover:bg-rust-primary-hover disabled:opacity-50"
                  >
                    Add
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>

        {/* Footer - Settings button */}
        <div className="border-t border-rust-border/50 p-2">
          <button
            onClick={onOpenSettings}
            className="flex w-full items-center justify-center gap-1.5 rounded-lg bg-rust-surface/50 py-1.5 text-xs text-rust-text-secondary transition-colors hover:bg-rust-surface-elevated hover:text-rust-text"
          >
            <span>⚙️</span>
            <span>Settings</span>
          </button>
        </div>
      </div>

      {/* Arrow pointer to marker */}
      <div
        className="absolute top-1/3 h-2 w-2 -translate-y-1/2 rotate-45 border-rust-border/50 bg-rust-bg/95"
        style={{
          [positionRight ? "left" : "right"]: "-4px",
          borderLeft: positionRight ? "1px solid" : "none",
          borderBottom: positionRight ? "1px solid" : "none",
          borderRight: positionRight ? "none" : "1px solid",
          borderTop: positionRight ? "none" : "1px solid",
        }}
      />
    </div>
  );
}
