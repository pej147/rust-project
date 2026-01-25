"use client";

import { useState } from "react";
import { BottomSheet } from "@/components/ui/bottom-sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";

// Marker type configuratie
const MARKER_TYPES = [
  { value: "ENEMY", label: "Vijand", icon: "👤", color: "#FF3B30" },
  { value: "TEAM_BASE", label: "Team Base", icon: "🏠", color: "#34C759" },
  { value: "LOOT", label: "Loot", icon: "📦", color: "#FFCC00" },
  { value: "MONUMENT", label: "Monument", icon: "🏛️", color: "#007AFF" },
  { value: "DANGER", label: "Gevaar", icon: "⚠️", color: "#FF9500" },
  { value: "NOTE", label: "Notitie", icon: "📝", color: "#8E8E93" },
  { value: "RAID", label: "Raid", icon: "💥", color: "#AF52DE" },
];

const VISIBILITY_OPTIONS = [
  { value: "TEAM", label: "Team" },
  { value: "PRIVATE", label: "Privé" },
  { value: "PUBLIC", label: "Publiek" },
];

interface MarkerData {
  id: string;
  title: string;
  type: string;
  x: number;
  y: number;
  color?: string;
  description?: string;
  visibility?: string;
  createdBy?: {
    id: string;
    displayName: string;
  };
  createdAt?: string;
}

interface MarkerDetailSheetProps {
  marker: MarkerData | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: () => void;
  currentUserId?: string;
}

export function MarkerDetailSheet({
  marker,
  isOpen,
  onClose,
  onUpdate,
  currentUserId,
}: MarkerDetailSheetProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  // Edit form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("");
  const [color, setColor] = useState("");
  const [visibility, setVisibility] = useState("");

  if (!marker) return null;

  const markerConfig = MARKER_TYPES.find((t) => t.value === marker.type);
  const isOwner = currentUserId === marker.createdBy?.id;

  const startEditing = () => {
    setTitle(marker.title);
    setDescription(marker.description || "");
    setType(marker.type);
    setColor(marker.color || markerConfig?.color || "#FF0000");
    setVisibility(marker.visibility || "TEAM");
    setIsEditing(true);
    setError("");
  };

  const cancelEditing = () => {
    setIsEditing(false);
    setError("");
  };

  const handleTypeChange = (newType: string) => {
    setType(newType);
    const config = MARKER_TYPES.find((t) => t.value === newType);
    if (config) {
      setColor(config.color);
    }
  };

  const handleSave = async () => {
    setError("");
    setIsSaving(true);

    try {
      const response = await fetch(`/api/markers/${marker.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description: description || null,
          type,
          color,
          visibility,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Kon marker niet updaten");
      }

      setIsEditing(false);
      onUpdate();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Er ging iets mis");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    setError("");
    setIsDeleting(true);

    try {
      const response = await fetch(`/api/markers/${marker.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Kon marker niet verwijderen");
      }

      onClose();
      onUpdate();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Er ging iets mis");
      setIsDeleting(false);
    }
  };

  const handleClose = () => {
    setIsEditing(false);
    setError("");
    onClose();
  };

  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={handleClose}
      title={isEditing ? "Marker Bewerken" : "Marker Details"}
    >
      {isEditing ? (
        // Edit mode
        <div className="space-y-4">
          <Input
            id="edit-title"
            label="Titel"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <Select
            id="edit-type"
            label="Type"
            options={MARKER_TYPES}
            value={type}
            onChange={(e) => handleTypeChange(e.target.value)}
          />

          <div className="flex items-center gap-3">
            <div
              className="h-8 w-8 rounded-full border-2 border-zinc-600"
              style={{ backgroundColor: color }}
            />
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="h-10 flex-1 cursor-pointer rounded-lg border-0 bg-transparent"
            />
          </div>

          <div className="w-full">
            <label
              htmlFor="edit-description"
              className="mb-2 block text-sm font-medium text-zinc-300"
            >
              Beschrijving
            </label>
            <textarea
              id="edit-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              className="w-full rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-3 text-white placeholder-zinc-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <Select
            id="edit-visibility"
            label="Zichtbaarheid"
            options={VISIBILITY_OPTIONS}
            value={visibility}
            onChange={(e) => setVisibility(e.target.value)}
          />

          {error && (
            <div className="rounded-xl bg-red-500/10 p-3 text-center text-sm text-red-400">
              {error}
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="secondary"
              onClick={cancelEditing}
              className="flex-1"
              disabled={isSaving}
            >
              Annuleren
            </Button>
            <Button
              type="button"
              variant="primary"
              onClick={handleSave}
              className="flex-1"
              disabled={isSaving || !title.trim()}
            >
              {isSaving ? "Opslaan..." : "Opslaan"}
            </Button>
          </div>
        </div>
      ) : (
        // View mode
        <div className="space-y-4">
          {/* Header met icoon en titel */}
          <div className="flex items-start gap-4">
            <div
              className="flex h-14 w-14 items-center justify-center rounded-2xl text-2xl"
              style={{ backgroundColor: marker.color || markerConfig?.color }}
            >
              {markerConfig?.icon || "📍"}
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-white">{marker.title}</h3>
              <p className="text-sm text-zinc-400">
                {markerConfig?.label || marker.type}
              </p>
            </div>
          </div>

          {/* Beschrijving */}
          {marker.description && (
            <div className="rounded-xl bg-zinc-800 p-4">
              <p className="text-zinc-300">{marker.description}</p>
            </div>
          )}

          {/* Info grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-zinc-800 p-3">
              <p className="text-xs text-zinc-500">Positie</p>
              <p className="font-mono text-white">
                {Math.round(marker.x)}, {Math.round(marker.y)}
              </p>
            </div>
            <div className="rounded-xl bg-zinc-800 p-3">
              <p className="text-xs text-zinc-500">Zichtbaarheid</p>
              <p className="text-white">
                {VISIBILITY_OPTIONS.find((v) => v.value === marker.visibility)?.label || "Team"}
              </p>
            </div>
          </div>

          {/* Gemaakt door */}
          {marker.createdBy && (
            <div className="rounded-xl bg-zinc-800 p-3">
              <p className="text-xs text-zinc-500">Toegevoegd door</p>
              <p className="text-white">{marker.createdBy.displayName}</p>
              {marker.createdAt && (
                <p className="text-xs text-zinc-500">
                  {new Date(marker.createdAt).toLocaleDateString("nl-NL", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              )}
            </div>
          )}

          {error && (
            <div className="rounded-xl bg-red-500/10 p-3 text-center text-sm text-red-400">
              {error}
            </div>
          )}

          {/* Acties - alleen voor eigenaar */}
          {isOwner && (
            <div className="flex gap-3 pt-2">
              <Button
                type="button"
                variant="danger"
                onClick={handleDelete}
                className="flex-1"
                disabled={isDeleting}
              >
                {isDeleting ? "Verwijderen..." : "Verwijderen"}
              </Button>
              <Button
                type="button"
                variant="primary"
                onClick={startEditing}
                className="flex-1"
              >
                Bewerken
              </Button>
            </div>
          )}

          {!isOwner && (
            <p className="text-center text-sm text-zinc-500">
              Alleen de maker kan deze marker bewerken
            </p>
          )}
        </div>
      )}
    </BottomSheet>
  );
}
