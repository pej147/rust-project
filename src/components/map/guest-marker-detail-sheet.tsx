"use client";

import { useState } from "react";
import { BottomSheet } from "@/components/ui/bottom-sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import type { GuestMarker } from "@/hooks/use-guest-markers";

const MARKER_TYPES = [
  { value: "ENEMY", label: "Enemy", color: "#FF3B30" },
  { value: "TEAM_BASE", label: "Team Base", color: "#34C759" },
  { value: "LOOT", label: "Loot", color: "#FFCC00" },
  { value: "MONUMENT", label: "Monument", color: "#007AFF" },
  { value: "DANGER", label: "Danger", color: "#FF9500" },
  { value: "NOTE", label: "Note", color: "#8E8E93" },
  { value: "RAID", label: "Raid", color: "#AF52DE" },
];

interface GuestMarkerDetailSheetProps {
  marker: GuestMarker | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (markerId: string, updates: Partial<Omit<GuestMarker, "id" | "createdAt">>) => void;
  onDelete: (markerId: string) => void;
}

export function GuestMarkerDetailSheet({
  marker,
  isOpen,
  onClose,
  onUpdate,
  onDelete,
}: GuestMarkerDetailSheetProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Edit form state
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editType, setEditType] = useState("");
  const [editColor, setEditColor] = useState("");

  const startEditing = () => {
    if (marker) {
      setEditTitle(marker.title);
      setEditDescription(marker.description || "");
      setEditType(marker.type);
      setEditColor(marker.color);
      setIsEditing(true);
    }
  };

  const handleTypeChange = (newType: string) => {
    setEditType(newType);
    const markerType = MARKER_TYPES.find((t) => t.value === newType);
    if (markerType) {
      setEditColor(markerType.color);
    }
  };

  const handleSave = () => {
    if (marker) {
      onUpdate(marker.id, {
        title: editTitle,
        description: editDescription || undefined,
        type: editType,
        color: editColor,
      });
      setIsEditing(false);
    }
  };

  const handleDelete = () => {
    if (marker) {
      onDelete(marker.id);
      setShowDeleteConfirm(false);
      onClose();
    }
  };

  const handleClose = () => {
    setIsEditing(false);
    setShowDeleteConfirm(false);
    onClose();
  };

  if (!marker) return null;

  const markerTypeInfo = MARKER_TYPES.find((t) => t.value === marker.type);

  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={handleClose}
      title={isEditing ? "Edit Marker" : marker.title}
    >
      <div className="space-y-4">
        {/* Guest mode indicator */}
        <div className="rounded-xl bg-orange-500/10 border border-orange-500/20 p-3 text-center">
          <span className="text-sm text-orange-400">
            Guest mode - saved locally
          </span>
        </div>

        {isEditing ? (
          // Edit Form
          <>
            <Input
              id="edit-title"
              label="Title *"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              required
            />

            <Select
              id="edit-type"
              label="Type"
              options={MARKER_TYPES}
              value={editType}
              onChange={(e) => handleTypeChange(e.target.value)}
            />

            <div className="flex items-center gap-3">
              <div
                className="h-8 w-8 rounded-full border-2 border-zinc-600"
                style={{ backgroundColor: editColor }}
              />
              <div className="flex-1">
                <input
                  type="color"
                  value={editColor}
                  onChange={(e) => setEditColor(e.target.value)}
                  className="h-10 w-full cursor-pointer rounded-lg border-0 bg-transparent"
                />
              </div>
            </div>

            <div className="w-full">
              <label
                htmlFor="edit-description"
                className="mb-2 block text-sm font-medium text-zinc-300"
              >
                Description
              </label>
              <textarea
                id="edit-description"
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                rows={2}
                className="w-full rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-3 text-white placeholder-zinc-500 transition-colors focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div className="flex gap-3 pt-2">
              <Button
                variant="secondary"
                onClick={() => setIsEditing(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handleSave}
                className="flex-1"
                disabled={!editTitle.trim()}
              >
                Save
              </Button>
            </div>
          </>
        ) : showDeleteConfirm ? (
          // Delete Confirmation
          <div className="space-y-4">
            <div className="rounded-xl bg-red-500/10 p-4 text-center">
              <p className="text-red-400">
                Are you sure you want to delete this marker?
              </p>
              <p className="mt-1 text-sm text-zinc-500">
                This cannot be undone.
              </p>
            </div>
            <div className="flex gap-3">
              <Button
                variant="secondary"
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button variant="danger" onClick={handleDelete} className="flex-1">
                Delete
              </Button>
            </div>
          </div>
        ) : (
          // View Mode
          <>
            {/* Type badge */}
            <div className="flex items-center gap-3">
              <div
                className="h-4 w-4 rounded-full"
                style={{ backgroundColor: marker.color }}
              />
              <span
                className="rounded-full px-3 py-1 text-sm font-medium"
                style={{
                  backgroundColor: `${marker.color}20`,
                  color: marker.color,
                }}
              >
                {markerTypeInfo?.label || marker.type}
              </span>
            </div>

            {/* Coordinates */}
            <div className="rounded-xl bg-zinc-800 p-3">
              <span className="text-sm text-zinc-400">Position: </span>
              <span className="font-mono text-white">
                {Math.round(marker.x)}, {Math.round(marker.y)}
              </span>
            </div>

            {/* Description */}
            {marker.description && (
              <div>
                <h4 className="mb-1 text-sm font-medium text-zinc-400">
                  Description
                </h4>
                <p className="text-white">{marker.description}</p>
              </div>
            )}

            {/* Created date */}
            <div className="text-sm text-zinc-500">
              Created on{" "}
              {new Date(marker.createdAt).toLocaleDateString("en-US", {
                day: "numeric",
                month: "long",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </div>

            {/* Action buttons */}
            <div className="flex gap-3 pt-2">
              <Button variant="secondary" onClick={startEditing} className="flex-1">
                Edit
              </Button>
              <Button
                variant="danger"
                onClick={() => setShowDeleteConfirm(true)}
                className="flex-1"
              >
                Delete
              </Button>
            </div>
          </>
        )}
      </div>
    </BottomSheet>
  );
}
