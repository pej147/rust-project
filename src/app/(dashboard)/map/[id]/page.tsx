"use client";

import { useEffect, useState, use, useCallback } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useSession } from "next-auth/react";
import { Header } from "@/components/layout/header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BottomSheet } from "@/components/ui/bottom-sheet";
import { AddMarkerForm } from "@/components/map/add-marker-form";
import { MarkerDetailSheet } from "@/components/map/marker-detail-sheet";
import { MarkerFilter } from "@/components/map/marker-filter";
import { CommandBar } from "@/components/command-bar/command-bar";
import type { MarkerType } from "@/lib/command-parser";

// All marker types for default filter
const ALL_MARKER_TYPES = [
  "ENEMY",
  "TEAM_BASE",
  "LOOT",
  "MONUMENT",
  "DANGER",
  "NOTE",
  "RAID",
];

// Dynamic import for Leaflet (client-side only)
const RustMap = dynamic(
  () => import("@/components/map/rust-map").then((mod) => mod.RustMap),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full items-center justify-center bg-rust-surface">
        <p className="text-rust-text-secondary">Loading map...</p>
      </div>
    ),
  }
);

interface MarkerData {
  id: string;
  title: string;
  type: string;
  x: number;
  y: number;
  color?: string;
  description?: string;
  visibility?: string;
  createdAt?: string;
  createdBy?: {
    id: string;
    displayName: string;
  };
}

interface MapSession {
  id: string;
  seed: string;
  serverName: string | null;
  mapSize: number;
  wipeDate: string | null;
  isActive: boolean;
  createdAt: string;
  createdBy: {
    id: string;
    displayName: string;
  };
  markers: MarkerData[];
}

export default function MapDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { data: session } = useSession();
  const [map, setMap] = useState<MapSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [showInfo, setShowInfo] = useState(false);

  // Add marker state
  const [showAddMarker, setShowAddMarker] = useState(false);
  const [markerPosition, setMarkerPosition] = useState<{ x: number; y: number } | null>(null);

  // Marker detail state
  const [selectedMarker, setSelectedMarker] = useState<MarkerData | null>(null);
  const [showMarkerDetail, setShowMarkerDetail] = useState(false);

  // Filter state
  const [activeFilters, setActiveFilters] = useState<string[]>(ALL_MARKER_TYPES);
  const ALL_VISIBILITY_TYPES = ["PRIVATE", "TEAM", "PUBLIC"];
  const [activeVisibilityFilters, setActiveVisibilityFilters] = useState<string[]>(ALL_VISIBILITY_TYPES);

  // Command bar state
  const [showCommandBar, setShowCommandBar] = useState(false);
  const [gotoPosition, setGotoPosition] = useState<{ x: number; y: number } | null>(null);

  const fetchMap = useCallback(async () => {
    try {
      const response = await fetch(`/api/maps/${id}`);
      if (!response.ok) {
        throw new Error("Could not load map");
      }
      const data = await response.json();
      setMap(data);
    } catch {
      setError("Could not load map");
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchMap();
  }, [fetchMap]);

  // Keyboard shortcut to open command bar
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }
      // "/" opens command bar
      if (e.key === "/" && !showCommandBar) {
        e.preventDefault();
        setShowCommandBar(true);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [showCommandBar]);

  // Handle command bar add marker
  const handleCommandAddMarker = async (type: MarkerType, x: number, y: number, name?: string) => {
    try {
      const response = await fetch("/api/markers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mapSessionId: id,
          title: name || `${type} marker`,
          type,
          x,
          y,
          visibility: "TEAM",
        }),
      });

      if (response.ok) {
        fetchMap();
      }
    } catch (error) {
      console.error("Failed to add marker:", error);
    }
  };

  // Handle command bar goto
  const handleCommandGoto = (x: number, y: number) => {
    setGotoPosition({ x, y });
    // Clear after a short delay to allow re-navigation to same position
    setTimeout(() => setGotoPosition(null), 100);
  };

  const handleMapClick = (x: number, y: number) => {
    setMarkerPosition({ x, y });
    setShowAddMarker(true);
  };

  const handleMarkerAdded = () => {
    setShowAddMarker(false);
    setMarkerPosition(null);
    // Reload map to show the new marker
    fetchMap();
  };

  const handleCloseAddMarker = () => {
    setShowAddMarker(false);
    setMarkerPosition(null);
  };

  const handleMarkerClick = (marker: MarkerData) => {
    setSelectedMarker(marker);
    setShowMarkerDetail(true);
  };

  const handleCloseMarkerDetail = () => {
    setShowMarkerDetail(false);
    setSelectedMarker(null);
  };

  const handleMarkerUpdated = () => {
    // Reload map to show changes
    fetchMap();
  };

  // Calculate marker counts per type
  const markerCounts = map?.markers.reduce(
    (acc, marker) => {
      acc[marker.type] = (acc[marker.type] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  ) || {};

  // Calculate marker counts per visibility
  const visibilityCounts = map?.markers.reduce(
    (acc, marker) => {
      const vis = marker.visibility || "TEAM";
      acc[vis] = (acc[vis] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  ) || {};

  // Filter markers based on active type AND visibility filters
  const filteredMarkers = map?.markers.filter((marker) =>
    activeFilters.includes(marker.type) &&
    activeVisibilityFilters.includes(marker.visibility || "TEAM")
  ) || [];

  if (isLoading) {
    return (
      <>
        <Header title="Loading..." />
        <div className="flex h-[calc(100vh-8rem)] items-center justify-center">
          <p className="text-rust-text-secondary">Loading map...</p>
        </div>
      </>
    );
  }

  if (error || !map) {
    return (
      <>
        <Header
          title="Error"
          leftAction={
            <Link href="/map" className="text-rust-primary">
              Back
            </Link>
          }
        />
        <div className="p-4">
          <Card variant="elevated">
            <CardContent className="py-8 text-center">
              <p className="text-rust-danger">{error || "Map not found"}</p>
              <Link href="/map">
                <Button variant="secondary" className="mt-4">
                  Back to overview
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </>
    );
  }

  return (
    <div className="flex h-screen flex-col">
      <Header
        title={`Seed: ${map.seed}`}
        subtitle={map.serverName || undefined}
        leftAction={
          <Link href="/map" className="text-rust-primary">
            ←
          </Link>
        }
        rightAction={
          <button
            onClick={() => setShowInfo(!showInfo)}
            className="text-rust-primary"
          >
            ⓘ
          </button>
        }
      />

      {/* Info panel */}
      {showInfo && (
        <div className="border-b border-rust-border bg-rust-surface px-4 py-3">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-4 text-rust-text-secondary">
              <span>{map.mapSize}m</span>
              <span>{map.markers.length} markers</span>
              {map.wipeDate && (
                <span>
                  Wipe: {new Date(map.wipeDate).toLocaleDateString("en-US")}
                </span>
              )}
            </div>
            {map.isActive && (
              <span className="rounded-full bg-green-500/20 px-2 py-0.5 text-xs text-green-400">
                Active
              </span>
            )}
          </div>
        </div>
      )}

      {/* Map Container */}
      <div className="relative flex-1">
        <RustMap
          seed={map.seed}
          mapSize={map.mapSize}
          markers={filteredMarkers}
          onMapClick={handleMapClick}
          onMarkerClick={handleMarkerClick}
          gotoPosition={gotoPosition}
        />

        {/* Marker Filter */}
        <MarkerFilter
          activeFilters={activeFilters}
          onFilterChange={setActiveFilters}
          markerCounts={markerCounts}
          activeVisibilityFilters={activeVisibilityFilters}
          onVisibilityFilterChange={setActiveVisibilityFilters}
          visibilityCounts={visibilityCounts}
        />

        {/* Floating action button */}
        <button
          onClick={() => {
            // Use center of the map as default position
            setMarkerPosition({ x: map.mapSize / 2, y: map.mapSize / 2 });
            setShowAddMarker(true);
          }}
          className="absolute bottom-20 right-4 z-[1000] flex h-14 w-14 items-center justify-center rounded-full bg-rust-primary text-white shadow-lg transition-transform hover:scale-105 active:scale-95"
          title="Add marker"
        >
          <svg
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 4.5v15m7.5-7.5h-15"
            />
          </svg>
        </button>

        {/* Tip for user - hide when command bar is open */}
        {!showCommandBar && (
          <div className="absolute bottom-20 left-4 z-[1000] rounded-lg bg-rust-surface-elevated/80 px-3 py-2 text-xs text-rust-text backdrop-blur-sm">
            Click on the map to place a marker • Press <span className="font-mono">/</span> for commands
          </div>
        )}

        {/* Command bar toggle button */}
        <button
          onClick={() => setShowCommandBar(!showCommandBar)}
          className={`absolute bottom-20 left-1/2 -translate-x-1/2 z-[1000] flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all ${
            showCommandBar
              ? "bg-rust-primary text-white"
              : "bg-rust-surface-elevated/80 text-rust-text hover:bg-rust-surface-elevated backdrop-blur-sm"
          }`}
          title="Toggle command bar (press /)"
        >
          <span className="font-mono">/</span>
          <span>Command</span>
        </button>

        {/* Command Bar */}
        {showCommandBar && (
          <CommandBar
            mapSize={map.mapSize}
            onAddMarker={handleCommandAddMarker}
            onGoto={handleCommandGoto}
            onClose={() => setShowCommandBar(false)}
          />
        )}
      </div>

      {/* Add Marker Bottom Sheet */}
      <BottomSheet
        isOpen={showAddMarker}
        onClose={handleCloseAddMarker}
        title="Add Marker"
      >
        {markerPosition && (
          <AddMarkerForm
            mapSessionId={map.id}
            initialX={markerPosition.x}
            initialY={markerPosition.y}
            onSuccess={handleMarkerAdded}
            onCancel={handleCloseAddMarker}
          />
        )}
      </BottomSheet>

      {/* Marker Detail Bottom Sheet */}
      <MarkerDetailSheet
        marker={selectedMarker}
        isOpen={showMarkerDetail}
        onClose={handleCloseMarkerDetail}
        onUpdate={handleMarkerUpdated}
        currentUserId={session?.user?.id}
      />
    </div>
  );
}
