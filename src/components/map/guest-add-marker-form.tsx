"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import type { GuestMarker } from "@/hooks/use-guest-markers";

// Marker types met Nederlandse labels en kleuren
const MARKER_TYPES = [
  { value: "ENEMY", label: "Vijand", color: "#FF3B30" },
  { value: "TEAM_BASE", label: "Team Base", color: "#34C759" },
  { value: "LOOT", label: "Loot", color: "#FFCC00" },
  { value: "MONUMENT", label: "Monument", color: "#007AFF" },
  { value: "DANGER", label: "Gevaar", color: "#FF9500" },
  { value: "NOTE", label: "Notitie", color: "#8E8E93" },
  { value: "RAID", label: "Raid", color: "#AF52DE" },
];

interface GuestAddMarkerFormProps {
  initialX: number;
  initialY: number;
  onSuccess: (marker: GuestMarker) => void;
  onCancel: () => void;
  onAddMarker: (marker: Omit<GuestMarker, "id" | "createdAt">) => GuestMarker;
}

export function GuestAddMarkerForm({
  initialX,
  initialY,
  onSuccess,
  onCancel,
  onAddMarker,
}: GuestAddMarkerFormProps) {
  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("ENEMY");
  const [color, setColor] = useState(MARKER_TYPES[0].color);

  // Update kleur wanneer type verandert
  const handleTypeChange = (newType: string) => {
    setType(newType);
    const markerType = MARKER_TYPES.find((t) => t.value === newType);
    if (markerType) {
      setColor(markerType.color);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newMarker = onAddMarker({
      title,
      description: description || undefined,
      type,
      x: initialX,
      y: initialY,
      color,
    });

    onSuccess(newMarker);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Guest mode indicator */}
      <div className="rounded-xl bg-orange-500/10 border border-orange-500/20 p-3 text-center">
        <span className="text-sm text-orange-400">
          Guest mode - markers worden lokaal opgeslagen
        </span>
      </div>

      {/* Coordinaten weergave */}
      <div className="rounded-xl bg-zinc-800 p-3 text-center">
        <span className="text-sm text-zinc-400">Positie: </span>
        <span className="font-mono text-white">
          {Math.round(initialX)}, {Math.round(initialY)}
        </span>
      </div>

      {/* Titel */}
      <Input
        id="title"
        label="Titel *"
        placeholder="bv. Nakeds base, Loot crate"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
        autoFocus
      />

      {/* Type selectie */}
      <Select
        id="type"
        label="Type"
        options={MARKER_TYPES}
        value={type}
        onChange={(e) => handleTypeChange(e.target.value)}
      />

      {/* Kleur preview met type */}
      <div className="flex items-center gap-3">
        <div
          className="h-8 w-8 rounded-full border-2 border-zinc-600"
          style={{ backgroundColor: color }}
        />
        <div className="flex-1">
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="h-10 w-full cursor-pointer rounded-lg border-0 bg-transparent"
            title="Kies een andere kleur"
          />
        </div>
      </div>

      {/* Beschrijving */}
      <div className="w-full">
        <label
          htmlFor="description"
          className="mb-2 block text-sm font-medium text-zinc-300"
        >
          Beschrijving
        </label>
        <textarea
          id="description"
          placeholder="Extra notities..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={2}
          className="w-full rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-3 text-white placeholder-zinc-500 transition-colors focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>

      {/* Buttons */}
      <div className="flex gap-3 pt-2">
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          className="flex-1"
        >
          Annuleren
        </Button>
        <Button
          type="submit"
          variant="primary"
          className="flex-1"
          disabled={!title.trim()}
        >
          Marker Toevoegen
        </Button>
      </div>
    </form>
  );
}
