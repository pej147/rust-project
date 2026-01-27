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
import { EnemyMarkerPopup } from "@/components/map/enemy-marker-popup";
import { MarkerFilter } from "@/components/map/marker-filter";

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
      <div className="flex h-full items-center justify-center bg-zinc-900">
        <p className="text-zinc-400">Loading map...</p>
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
  const [showEnemyPopup, setShowEnemyPopup] = useState(false);
  const [enemyPopupPosition, setEnemyPopupPosition] = useState<{ x: number; y: number } | null>(null);

  // Filter state
  const [activeFilters, setActiveFilters] = useState<string[]>(ALL_MARKER_TYPES);

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

  const handleMarkerClick = (marker: MarkerData, screenPosition: { x: number; y: number }) => {
    setSelectedMarker(marker);
    // For ENEMY markers, show the popup near the marker
    if (marker.type === "ENEMY") {
      setEnemyPopupPosition(screenPosition);
      setShowEnemyPopup(true);
    } else {
      setShowMarkerDetail(true);
    }
  };

  const handleCloseMarkerDetail = () => {
    setShowMarkerDetail(false);
    setSelectedMarker(null);
  };

  const handleCloseEnemyPopup = () => {
    setShowEnemyPopup(false);
    setEnemyPopupPosition(null);
    setSelectedMarker(null);
  };

  const handleOpenSettingsFromEnemy = () => {
    // Close enemy popup, open marker detail sheet
    setShowEnemyPopup(false);
    setEnemyPopupPosition(null);
    setShowMarkerDetail(true);
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

  // Filter markers based on active filters
  const filteredMarkers = map?.markers.filter((marker) =>
    activeFilters.includes(marker.type)
  ) || [];

  if (isLoading) {
    return (
      <>
        <Header title="Loading..." />
        <div className="flex h-[calc(100vh-8rem)] items-center justify-center">
          <p className="text-zinc-400">Loading map...</p>
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
            <Link href="/map" className="text-blue-500">
              Back
            </Link>
          }
        />
        <div className="p-4">
          <Card variant="elevated">
            <CardContent className="py-8 text-center">
              <p className="text-red-400">{error || "Map not found"}</p>
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
          <Link href="/map" className="text-blue-500">
            ←
          </Link>
        }
        rightAction={
          <button
            onClick={() => setShowInfo(!showInfo)}
            className="text-blue-500"
          >
            ⓘ
          </button>
        }
      />

      {/* Info panel */}
      {showInfo && (
        <div className="border-b border-zinc-800 bg-zinc-900 px-4 py-3">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-4 text-zinc-400">
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
        />

        {/* Marker Filter */}
        <MarkerFilter
          activeFilters={activeFilters}
          onFilterChange={setActiveFilters}
          markerCounts={markerCounts}
        />

        {/* Floating action button */}
        <button
          onClick={() => {
            // Use center of the map as default position
            setMarkerPosition({ x: map.mapSize / 2, y: map.mapSize / 2 });
            setShowAddMarker(true);
          }}
          className="absolute bottom-20 right-4 z-[1000] flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg transition-transform hover:scale-105 active:scale-95"
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

        {/* Tip for user */}
        <div className="absolute bottom-20 left-4 z-[1000] rounded-lg bg-zinc-800/80 px-3 py-2 text-xs text-zinc-300 backdrop-blur-sm">
          Click on the map to place a marker
        </div>
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

      {/* Enemy Marker Popup - shows residents near the marker */}
      <EnemyMarkerPopup
        marker={selectedMarker}
        isOpen={showEnemyPopup}
        position={enemyPopupPosition}
        onClose={handleCloseEnemyPopup}
        onOpenSettings={handleOpenSettingsFromEnemy}
        currentUserId={session?.user?.id}
      />

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
