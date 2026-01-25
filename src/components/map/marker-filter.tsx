"use client";

import { useState } from "react";

// Marker types met configuratie
const MARKER_TYPES = [
  { value: "ENEMY", label: "Vijand", icon: "👤", color: "#FF3B30" },
  { value: "TEAM_BASE", label: "Base", icon: "🏠", color: "#34C759" },
  { value: "LOOT", label: "Loot", icon: "📦", color: "#FFCC00" },
  { value: "MONUMENT", label: "Monument", icon: "🏛️", color: "#007AFF" },
  { value: "DANGER", label: "Gevaar", icon: "⚠️", color: "#FF9500" },
  { value: "NOTE", label: "Notitie", icon: "📝", color: "#8E8E93" },
  { value: "RAID", label: "Raid", icon: "💥", color: "#AF52DE" },
];

interface MarkerFilterProps {
  activeFilters: string[];
  onFilterChange: (filters: string[]) => void;
  markerCounts?: Record<string, number>;
}

export function MarkerFilter({
  activeFilters,
  onFilterChange,
  markerCounts = {},
}: MarkerFilterProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleFilter = (type: string) => {
    if (activeFilters.includes(type)) {
      onFilterChange(activeFilters.filter((f) => f !== type));
    } else {
      onFilterChange([...activeFilters, type]);
    }
  };

  const selectAll = () => {
    onFilterChange(MARKER_TYPES.map((t) => t.value));
  };

  const selectNone = () => {
    onFilterChange([]);
  };

  const totalMarkers = Object.values(markerCounts).reduce((a, b) => a + b, 0);
  const visibleMarkers = activeFilters.reduce(
    (sum, type) => sum + (markerCounts[type] || 0),
    0
  );

  return (
    <div className="absolute left-4 top-4 z-[1000]">
      {/* Collapsed state - just a button */}
      {!isExpanded ? (
        <button
          onClick={() => setIsExpanded(true)}
          className="flex items-center gap-2 rounded-xl bg-zinc-900/90 px-3 py-2 text-sm text-white shadow-lg backdrop-blur-sm transition-colors hover:bg-zinc-800"
        >
          <svg
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
            />
          </svg>
          <span>
            {visibleMarkers}/{totalMarkers}
          </span>
        </button>
      ) : (
        /* Expanded state - full filter panel */
        <div className="rounded-2xl bg-zinc-900/95 p-3 shadow-xl backdrop-blur-sm">
          {/* Header */}
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm font-medium text-white">Filters</span>
            <button
              onClick={() => setIsExpanded(false)}
              className="rounded-lg p-1 text-zinc-400 hover:bg-zinc-800 hover:text-white"
            >
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Quick actions */}
          <div className="mb-2 flex gap-2">
            <button
              onClick={selectAll}
              className="flex-1 rounded-lg bg-zinc-800 px-2 py-1 text-xs text-zinc-300 hover:bg-zinc-700"
            >
              Alles
            </button>
            <button
              onClick={selectNone}
              className="flex-1 rounded-lg bg-zinc-800 px-2 py-1 text-xs text-zinc-300 hover:bg-zinc-700"
            >
              Geen
            </button>
          </div>

          {/* Filter chips */}
          <div className="flex flex-wrap gap-1.5">
            {MARKER_TYPES.map((type) => {
              const isActive = activeFilters.includes(type.value);
              const count = markerCounts[type.value] || 0;

              return (
                <button
                  key={type.value}
                  onClick={() => toggleFilter(type.value)}
                  className={`flex items-center gap-1 rounded-lg px-2 py-1.5 text-xs transition-all ${
                    isActive
                      ? "bg-zinc-700 text-white"
                      : "bg-zinc-800/50 text-zinc-500"
                  }`}
                  style={{
                    borderLeft: isActive
                      ? `3px solid ${type.color}`
                      : "3px solid transparent",
                  }}
                >
                  <span>{type.icon}</span>
                  <span>{type.label}</span>
                  {count > 0 && (
                    <span
                      className={`ml-0.5 rounded-full px-1.5 text-[10px] ${
                        isActive
                          ? "bg-zinc-600 text-white"
                          : "bg-zinc-700 text-zinc-400"
                      }`}
                    >
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Summary */}
          <div className="mt-2 text-center text-xs text-zinc-500">
            {visibleMarkers} van {totalMarkers} markers zichtbaar
          </div>
        </div>
      )}
    </div>
  );
}
