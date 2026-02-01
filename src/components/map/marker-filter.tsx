"use client";

import { useState } from "react";

// Marker types configuration
const MARKER_TYPES = [
  { value: "ENEMY", label: "Enemy", icon: "👤", color: "#FF3B30" },
  { value: "TEAM_BASE", label: "Base", icon: "🏠", color: "#34C759" },
  { value: "LOOT", label: "Loot", icon: "📦", color: "#FFCC00" },
  { value: "MONUMENT", label: "Monument", icon: "🏛️", color: "#007AFF" },
  { value: "DANGER", label: "Danger", icon: "⚠️", color: "#FF9500" },
  { value: "NOTE", label: "Note", icon: "📝", color: "#8E8E93" },
  { value: "RAID", label: "Raid", icon: "💥", color: "#AF52DE" },
];

const VISIBILITY_TYPES = [
  { value: "PRIVATE", label: "Private", icon: "🔒" },
  { value: "TEAM", label: "Team", icon: "👥" },
  { value: "PUBLIC", label: "Public", icon: "🌐" },
];

interface MarkerFilterProps {
  activeFilters: string[];
  onFilterChange: (filters: string[]) => void;
  markerCounts?: Record<string, number>;
  activeVisibilityFilters?: string[];
  onVisibilityFilterChange?: (filters: string[]) => void;
  visibilityCounts?: Record<string, number>;
}

export function MarkerFilter({
  activeFilters,
  onFilterChange,
  markerCounts = {},
  activeVisibilityFilters = [],
  onVisibilityFilterChange,
  visibilityCounts = {},
}: MarkerFilterProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleFilter = (type: string) => {
    if (activeFilters.includes(type)) {
      onFilterChange(activeFilters.filter((f) => f !== type));
    } else {
      onFilterChange([...activeFilters, type]);
    }
  };

  const toggleVisibility = (vis: string) => {
    if (!onVisibilityFilterChange) return;
    if (activeVisibilityFilters.includes(vis)) {
      onVisibilityFilterChange(activeVisibilityFilters.filter((f) => f !== vis));
    } else {
      onVisibilityFilterChange([...activeVisibilityFilters, vis]);
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
          className="flex items-center gap-2 rounded-lg bg-rust-bg/90 px-3 py-2 text-sm uppercase tracking-wide text-white shadow-lg backdrop-blur-sm transition-colors hover:bg-rust-surface"
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
        <div className="rounded-lg bg-rust-bg/95 p-3 shadow-xl backdrop-blur-sm border border-rust-border">
          {/* Header */}
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm font-medium text-white">Filters</span>
            <button
              onClick={() => setIsExpanded(false)}
              className="rounded-lg p-1 text-rust-text-secondary hover:bg-rust-surface hover:text-white"
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
              className="flex-1 rounded-lg bg-rust-surface px-2 py-1 text-xs uppercase tracking-wide text-rust-text-secondary hover:bg-rust-surface-elevated"
            >
              All
            </button>
            <button
              onClick={selectNone}
              className="flex-1 rounded-lg bg-rust-surface px-2 py-1 text-xs uppercase tracking-wide text-rust-text-secondary hover:bg-rust-surface-elevated"
            >
              None
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
                      ? "bg-rust-surface-elevated text-white"
                      : "bg-rust-surface/50 text-rust-text-muted"
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
                          ? "bg-rust-surface text-white"
                          : "bg-rust-surface-elevated text-rust-text-secondary"
                      }`}
                    >
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Visibility filter */}
          {onVisibilityFilterChange && (
            <>
              <div className="mt-3 mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-rust-text-secondary">
                Visibility
              </div>
              <div className="flex flex-wrap gap-1.5">
                {VISIBILITY_TYPES.map((vis) => {
                  const isActive = activeVisibilityFilters.includes(vis.value);
                  const count = visibilityCounts[vis.value] || 0;

                  return (
                    <button
                      key={vis.value}
                      onClick={() => toggleVisibility(vis.value)}
                      className={`flex items-center gap-1 rounded-lg px-2 py-1.5 text-xs transition-all ${
                        isActive
                          ? "bg-rust-surface-elevated text-white"
                          : "bg-rust-surface/50 text-rust-text-muted"
                      }`}
                    >
                      <span>{vis.icon}</span>
                      <span>{vis.label}</span>
                      {count > 0 && (
                        <span
                          className={`ml-0.5 rounded-full px-1.5 text-[10px] ${
                            isActive
                              ? "bg-rust-surface text-white"
                              : "bg-rust-surface-elevated text-rust-text-secondary"
                          }`}
                        >
                          {count}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </>
          )}

          {/* Summary */}
          <div className="mt-2 text-center text-xs text-rust-text-secondary">
            {visibleMarkers} of {totalMarkers} markers visible
          </div>
        </div>
      )}
    </div>
  );
}
