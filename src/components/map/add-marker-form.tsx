"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";

// Marker types with colors
const MARKER_TYPES = [
  { value: "ENEMY", label: "Enemy", color: "#FF3B30" },
  { value: "TEAM_BASE", label: "Team Base", color: "#34C759" },
  { value: "LOOT", label: "Loot", color: "#FFCC00" },
  { value: "MONUMENT", label: "Monument", color: "#007AFF" },
  { value: "DANGER", label: "Danger", color: "#FF9500" },
  { value: "NOTE", label: "Note", color: "#8E8E93" },
  { value: "RAID", label: "Raid", color: "#AF52DE" },
];

const VISIBILITY_OPTIONS = [
  { value: "TEAM", label: "Team (team members only)" },
  { value: "PRIVATE", label: "Private (only you)" },
  { value: "PUBLIC", label: "Public (everyone)" },
];

interface AddMarkerFormProps {
  mapSessionId: string;
  initialX: number;
  initialY: number;
  onSuccess: () => void;
  onCancel: () => void;
}

export function AddMarkerForm({
  mapSessionId,
  initialX,
  initialY,
  onSuccess,
  onCancel,
}: AddMarkerFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("ENEMY");
  const [visibility, setVisibility] = useState("TEAM");
  const [color, setColor] = useState(MARKER_TYPES[0].color);

  // Update color when type changes
  const handleTypeChange = (newType: string) => {
    setType(newType);
    const markerType = MARKER_TYPES.find((t) => t.value === newType);
    if (markerType) {
      setColor(markerType.color);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/markers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description: description || undefined,
          type,
          x: initialX,
          y: initialY,
          color,
          visibility,
          mapSessionId,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Could not create marker");
      }

      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Coordinates display */}
      <div className="rounded-lg bg-rust-surface p-3 text-center">
        <span className="text-sm text-rust-text-secondary">Position: </span>
        <span className="font-mono text-white">
          {Math.round(initialX)}, {Math.round(initialY)}
        </span>
      </div>

      {/* Title */}
      <Input
        id="title"
        label="Title *"
        placeholder="e.g. Nakeds base, Loot crate"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
        autoFocus
      />

      {/* Type selection */}
      <Select
        id="type"
        label="Type"
        options={MARKER_TYPES}
        value={type}
        onChange={(e) => handleTypeChange(e.target.value)}
      />

      {/* Color preview with type */}
      <div className="flex items-center gap-3">
        <div
          className="h-8 w-8 rounded-full border-2 border-rust-border"
          style={{ backgroundColor: color }}
        />
        <div className="flex-1">
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="h-10 w-full cursor-pointer rounded-lg border-0 bg-transparent"
            title="Choose a different color"
          />
        </div>
      </div>

      {/* Description */}
      <div className="w-full">
        <label
          htmlFor="description"
          className="mb-2 block text-xs font-semibold uppercase tracking-wide text-rust-text-secondary"
        >
          Description
        </label>
        <textarea
          id="description"
          placeholder="Additional notes..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={2}
          className="w-full rounded-lg border border-rust-border bg-rust-surface-elevated px-4 py-3 text-rust-text placeholder-rust-text-muted transition-colors focus:border-rust-primary focus:outline-none focus:ring-1 focus:ring-rust-primary"
        />
      </div>

      {/* Visibility */}
      <Select
        id="visibility"
        label="Visibility"
        options={VISIBILITY_OPTIONS}
        value={visibility}
        onChange={(e) => setVisibility(e.target.value)}
      />

      {/* Error message */}
      {error && (
        <div className="rounded-lg bg-rust-danger/10 p-3 text-center text-sm text-rust-danger">
          {error}
        </div>
      )}

      {/* Buttons */}
      <div className="flex gap-3 pt-2">
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          className="flex-1"
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="primary"
          className="flex-1"
          disabled={isSubmitting || !title.trim()}
        >
          {isSubmitting ? "Saving..." : "Add Marker"}
        </Button>
      </div>
    </form>
  );
}
