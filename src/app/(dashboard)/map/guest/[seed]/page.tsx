"use client";

import { useEffect, useState, use, useCallback, useRef } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { Header } from "@/components/layout/header";
import { BottomSheet } from "@/components/ui/bottom-sheet";
import { GuestAddMarkerForm } from "@/components/map/guest-add-marker-form";
import { GuestMarkerDetailSheet } from "@/components/map/guest-marker-detail-sheet";
import { MarkerFilter } from "@/components/map/marker-filter";
import { useGuestMarkers, type GuestMarker, type GuestResident } from "@/hooks/use-guest-markers";

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

// Dynamic import voor Leaflet (client-side only)
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

export default function GuestMapDetailPage({
  params,
}: {
  params: Promise<{ seed: string }>;
}) {
  const { seed: encodedSeed } = use(params);
  const seed = decodeURIComponent(encodedSeed);

  const {
    getOrCreateMap,
    getMapBySeed,
    addMarker,
    updateMarker,
    deleteMarker,
    isLoaded,
    triggerSync,
  } = useGuestMarkers();

  const [showInfo, setShowInfo] = useState(false);

  // Add marker state
  const [showAddMarker, setShowAddMarker] = useState(false);
  const [markerPosition, setMarkerPosition] = useState<{ x: number; y: number } | null>(null);

  // Marker detail state
  const [selectedMarker, setSelectedMarker] = useState<GuestMarker | null>(null);
  const [showMarkerDetail, setShowMarkerDetail] = useState(false);

  // Filter state
  const [activeFilters, setActiveFilters] = useState<string[]>(ALL_MARKER_TYPES);

  // Team intel state
  const [showTeamInput, setShowTeamInput] = useState(false);
  const [teamCodeInput, setTeamCodeInput] = useState("");
  const [connectedTeam, setConnectedTeam] = useState<string | null>(null);
  const [teamMarkers, setTeamMarkers] = useState<GuestMarker[]>([]);
  const [teamError, setTeamError] = useState<string | null>(null);
  const [teamLoading, setTeamLoading] = useState(false);
  const teamCodeRef = useRef<string | null>(null);

  // Create team state
  const [showCreateTeam, setShowCreateTeam] = useState(false);
  const [createTeamName, setCreateTeamName] = useState("");
  const [createGuestName, setCreateGuestName] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("rust-intel-guest-name") || "";
    }
    return "";
  });
  const [createTeamLoading, setCreateTeamLoading] = useState(false);
  const [createdTeamCode, setCreatedTeamCode] = useState<string | null>(null);
  const [isSynced, setIsSynced] = useState(false);

  // Get or create the map on load
  const map = getMapBySeed(seed);

  useEffect(() => {
    if (isLoaded && !map) {
      // Create the map if it doesn't exist
      getOrCreateMap(seed);
    }
  }, [isLoaded, map, seed, getOrCreateMap]);

  // Fetch team markers by code
  const fetchTeamMarkers = useCallback(async (code: string) => {
    setTeamLoading(true);
    setTeamError(null);
    try {
      const res = await fetch(`/api/teams/shared-markers?code=${encodeURIComponent(code)}&seed=${encodeURIComponent(seed)}`);
      const data = await res.json();
      if (!res.ok) {
        setTeamError(data.error || "Could not fetch team markers");
        setConnectedTeam(null);
        setTeamMarkers([]);
        return;
      }
      setConnectedTeam(data.teamName);
      teamCodeRef.current = code;
      // Convert API markers to GuestMarker-compatible format with _source
      const mapped: GuestMarker[] = data.markers.map((m: { id: string; title: string; description?: string; type: string; x: number; y: number; color?: string; visibility?: string; createdAt: string; sharedBy?: string; residents?: { name: string; clanTag?: string; threatLevel: number }[] }) => ({
        ...m,
        _source: "team" as const,
        sharedBy: m.sharedBy,
      }));
      setTeamMarkers(mapped);
      // Save to localStorage
      localStorage.setItem(`rust-intel-team-code-${seed}`, code);
      if (mapped.length === 0) {
        setTeamError("No team markers found for this seed");
      }
    } catch {
      setTeamError("Connection error");
    } finally {
      setTeamLoading(false);
    }
  }, [seed]);

  // Auto-reconnect from localStorage
  useEffect(() => {
    const savedCode = localStorage.getItem(`rust-intel-team-code-${seed}`);
    if (savedCode) {
      setTeamCodeInput(savedCode);
      fetchTeamMarkers(savedCode);
    }
    // Check if we have a guestToken (we created/joined this team)
    const savedToken = localStorage.getItem(`rust-intel-team-token-${seed}`);
    if (savedToken && savedCode) {
      setIsSynced(true);
    }
    // Restore guest name
    const savedGuestName = localStorage.getItem("rust-intel-guest-name");
    if (savedGuestName) {
      setCreateGuestName(savedGuestName);
    }
  }, [seed, fetchTeamMarkers]);

  const handleTeamConnect = async () => {
    const code = teamCodeInput.trim().toUpperCase();
    if (code.length < 2) return;

    // If connecting and we have a guest name, also set up syncing
    const guestName = createGuestName.trim() || localStorage.getItem("rust-intel-guest-name");
    if (guestName) {
      localStorage.setItem("rust-intel-guest-name", guestName);

      // Generate a guestToken if we don't have one
      const existingToken = localStorage.getItem(`rust-intel-team-token-${seed}`);
      if (!existingToken) {
        const token = Array.from(crypto.getRandomValues(new Uint8Array(16)))
          .map((b) => b.toString(16).padStart(2, "0"))
          .join("");
        localStorage.setItem(`rust-intel-team-token-${seed}`, token);
      }
      setIsSynced(true);
    }

    await fetchTeamMarkers(code);

    // Trigger sync after connecting
    if (guestName) {
      setTimeout(() => triggerSync(seed), 500);
    }
  };

  const handleTeamDisconnect = () => {
    localStorage.removeItem(`rust-intel-team-code-${seed}`);
    localStorage.removeItem(`rust-intel-team-token-${seed}`);
    setConnectedTeam(null);
    setTeamMarkers([]);
    setTeamCodeInput("");
    setTeamError(null);
    teamCodeRef.current = null;
    setShowTeamInput(false);
    setIsSynced(false);
    setCreatedTeamCode(null);
    setShowCreateTeam(false);
  };

  const handleCreateTeam = async () => {
    if (!createTeamName.trim() || !createGuestName.trim()) return;
    setCreateTeamLoading(true);
    setTeamError(null);
    try {
      const res = await fetch("/api/teams/guest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: createTeamName.trim(),
          guestName: createGuestName.trim(),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setTeamError(data.error || "Could not create team");
        return;
      }
      // Save to localStorage
      localStorage.setItem(`rust-intel-team-code-${seed}`, data.code);
      localStorage.setItem(`rust-intel-team-token-${seed}`, data.guestToken);
      localStorage.setItem("rust-intel-guest-name", createGuestName.trim());

      setCreatedTeamCode(data.code);
      setConnectedTeam(data.teamName);
      setTeamCodeInput(data.code);
      teamCodeRef.current = data.code;
      setShowCreateTeam(false);
      setIsSynced(true);

      // Trigger initial sync
      triggerSync(seed);

      // Fetch team markers (will include our just-synced markers)
      setTimeout(() => fetchTeamMarkers(data.code), 1000);
    } catch {
      setTeamError("Connection error");
    } finally {
      setCreateTeamLoading(false);
    }
  };

  const handleMapClick = (x: number, y: number) => {
    setMarkerPosition({ x, y });
    setShowAddMarker(true);
  };

  const handleAddMarker = useCallback(
    (marker: Omit<GuestMarker, "id" | "createdAt">) => {
      return addMarker(seed, marker);
    },
    [seed, addMarker]
  );

  const handleMarkerAdded = () => {
    setShowAddMarker(false);
    setMarkerPosition(null);
  };

  const handleCloseAddMarker = () => {
    setShowAddMarker(false);
    setMarkerPosition(null);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleMarkerClick = (marker: any) => {
    // Team markers are read-only, don't open detail sheet
    if (marker._source === "team") return;
    const guestMarker = marker as GuestMarker;
    setSelectedMarker(guestMarker);
    setShowMarkerDetail(true);
  };

  const handleCloseMarkerDetail = () => {
    setShowMarkerDetail(false);
    setSelectedMarker(null);
  };

  const handleUpdateResidents = useCallback(
    (markerId: string, residents: GuestResident[]) => {
      updateMarker(seed, markerId, { residents });
      // Update selected marker to reflect changes
      if (selectedMarker && selectedMarker.id === markerId) {
        setSelectedMarker({ ...selectedMarker, residents });
      }
    },
    [seed, updateMarker, selectedMarker]
  );

  const handleMarkerUpdate = useCallback(
    (markerId: string, updates: Partial<Omit<GuestMarker, "id" | "createdAt">>) => {
      updateMarker(seed, markerId, updates);
      // Update the selected marker to reflect changes
      if (selectedMarker && selectedMarker.id === markerId) {
        setSelectedMarker({ ...selectedMarker, ...updates });
      }
    },
    [seed, updateMarker, selectedMarker]
  );

  const handleMarkerDelete = useCallback(
    (markerId: string) => {
      deleteMarker(seed, markerId);
    },
    [seed, deleteMarker]
  );

  // Loading state
  if (!isLoaded) {
    return (
      <>
        <Header title="Loading..." />
        <div className="flex h-[calc(100vh-8rem)] items-center justify-center">
          <p className="text-rust-text-secondary">Loading map...</p>
        </div>
      </>
    );
  }

  const mapSize = map?.mapSize || 4000;
  const guestMarkers = map?.markers || [];

  // Merge guest markers (with _source="guest") and team markers
  const allMarkers = [
    ...guestMarkers.map((m) => ({ ...m, _source: "guest" as const })),
    ...teamMarkers,
  ];

  // Bereken marker counts per type (all markers)
  const markerCounts = allMarkers.reduce(
    (acc, marker) => {
      acc[marker.type] = (acc[marker.type] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  // Filter markers op basis van actieve filters
  const filteredMarkers = allMarkers.filter((marker) =>
    activeFilters.includes(marker.type)
  );

  return (
    <div className="flex h-screen flex-col">
      <Header
        title={`Seed: ${seed}`}
        subtitle={map?.serverName || "Guest Mode"}
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

      {/* Guest Mode Banner */}
      <div className="border-b border-rust-primary/20">
        <div className="bg-rust-primary/10 px-4 py-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-rust-primary">👤</span>
              <span className="text-sm text-rust-primary">
                Guest Mode - markers saved locally
              </span>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowTeamInput(!showTeamInput)}
                className={`text-xs px-2 py-1 rounded-md border transition-colors ${
                  connectedTeam
                    ? "bg-[#8B9A46]/20 border-[#8B9A46]/40 text-[#8B9A46]"
                    : "bg-rust-surface border-rust-border text-rust-text-secondary hover:text-rust-text"
                }`}
              >
                {connectedTeam ? `👥 ${connectedTeam}` : "👥 Team Intel"}
              </button>
              <Link
                href="/login"
                className="text-xs text-rust-primary hover:text-rust-primary-hover underline"
              >
                Login
              </Link>
            </div>
          </div>
        </div>

        {/* Team Code Input Panel */}
        {showTeamInput && (
          <div className="bg-rust-surface px-4 py-3 border-t border-rust-border">
            {connectedTeam ? (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-[#8B9A46]">
                      Connected to <strong>{connectedTeam}</strong>
                    </span>
                    <span className="text-xs text-rust-text-muted">
                      ({teamMarkers.length} markers)
                    </span>
                    {isSynced && (
                      <span className="text-xs text-[#8B9A46]/70">• Synced</span>
                    )}
                  </div>
                  <button
                    onClick={handleTeamDisconnect}
                    className="text-xs px-2 py-1 rounded-md bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 transition-colors"
                  >
                    Disconnect
                  </button>
                </div>
                {/* Show team code for sharing */}
                {createdTeamCode && (
                  <div className="flex items-center gap-2 bg-rust-bg/50 rounded-md px-3 py-2">
                    <span className="text-xs text-rust-text-secondary">Share code:</span>
                    <span className="font-mono text-sm text-[#8B9A46] tracking-wider font-bold">{createdTeamCode}</span>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(createdTeamCode);
                      }}
                      className="text-xs px-2 py-0.5 rounded bg-rust-surface-elevated text-rust-text-secondary hover:text-rust-text transition-colors"
                    >
                      Copy
                    </button>
                  </div>
                )}
              </div>
            ) : showCreateTeam ? (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-rust-text-secondary font-medium">Create a Team</span>
                  <button
                    onClick={() => setShowCreateTeam(false)}
                    className="text-xs text-rust-text-muted hover:text-rust-text"
                  >
                    Cancel
                  </button>
                </div>
                <input
                  type="text"
                  value={createTeamName}
                  onChange={(e) => setCreateTeamName(e.target.value)}
                  placeholder="Team name"
                  maxLength={30}
                  className="w-full bg-rust-bg border border-rust-border rounded-md px-3 py-1.5 text-sm text-rust-text placeholder:text-rust-text-muted focus:outline-none focus:border-[#8B9A46]"
                />
                <input
                  type="text"
                  value={createGuestName}
                  onChange={(e) => setCreateGuestName(e.target.value)}
                  placeholder="Your name"
                  maxLength={20}
                  className="w-full bg-rust-bg border border-rust-border rounded-md px-3 py-1.5 text-sm text-rust-text placeholder:text-rust-text-muted focus:outline-none focus:border-[#8B9A46]"
                />
                <button
                  onClick={handleCreateTeam}
                  disabled={createTeamLoading || !createTeamName.trim() || !createGuestName.trim()}
                  className="w-full px-3 py-1.5 rounded-md bg-[#8B9A46] text-white text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#7a8a3d] transition-colors"
                >
                  {createTeamLoading ? "Creating..." : "Create Team"}
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <input
                  type="text"
                  value={createGuestName}
                  onChange={(e) => setCreateGuestName(e.target.value)}
                  placeholder="Your name (for shared markers)"
                  maxLength={20}
                  className="w-full bg-rust-bg border border-rust-border rounded-md px-3 py-1.5 text-sm text-rust-text placeholder:text-rust-text-muted focus:outline-none focus:border-[#8B9A46]"
                />
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={teamCodeInput}
                    onChange={(e) => {
                      setTeamCodeInput(e.target.value.toUpperCase());
                      setTeamError(null);
                    }}
                    placeholder="Team code (e.g. ABC123)"
                    maxLength={6}
                    className="flex-1 bg-rust-bg border border-rust-border rounded-md px-3 py-1.5 text-sm text-rust-text placeholder:text-rust-text-muted focus:outline-none focus:border-[#8B9A46] font-mono tracking-wider"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleTeamConnect();
                    }}
                  />
                  <button
                    onClick={handleTeamConnect}
                    disabled={teamLoading || teamCodeInput.trim().length < 2}
                    className="px-3 py-1.5 rounded-md bg-[#8B9A46] text-white text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#7a8a3d] transition-colors"
                  >
                    {teamLoading ? "..." : "Connect"}
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 border-t border-rust-border"></div>
                  <span className="text-xs text-rust-text-muted">or</span>
                  <div className="flex-1 border-t border-rust-border"></div>
                </div>
                <button
                  onClick={() => setShowCreateTeam(true)}
                  className="w-full px-3 py-1.5 rounded-md border border-[#8B9A46]/40 text-[#8B9A46] text-sm font-medium hover:bg-[#8B9A46]/10 transition-colors"
                >
                  Create Team
                </button>
              </div>
            )}
            {teamError && (
              <p className="text-xs text-red-400 mt-2">{teamError}</p>
            )}
          </div>
        )}
      </div>

      {/* Info panel */}
      {showInfo && (
        <div className="border-b border-rust-border bg-rust-surface px-4 py-3">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-4 text-rust-text-secondary">
              <span>{mapSize}m</span>
              <span>{guestMarkers.length} markers</span>
              {teamMarkers.length > 0 && (
                <span className="text-[#8B9A46]">+{teamMarkers.length} team</span>
              )}
            </div>
            <span className="rounded-full bg-rust-primary/20 px-2 py-0.5 text-xs text-rust-primary">
              Guest
            </span>
          </div>
        </div>
      )}

      {/* Map Container */}
      <div className="relative flex-1">
        <RustMap
          seed={seed}
          mapSize={mapSize}
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
            setMarkerPosition({ x: mapSize / 2, y: mapSize / 2 });
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

        {/* Tip for user */}
        <div className="absolute bottom-20 left-4 z-[1000] rounded-lg bg-rust-surface-elevated/80 px-3 py-2 text-xs text-rust-text backdrop-blur-sm">
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
          <GuestAddMarkerForm
            initialX={markerPosition.x}
            initialY={markerPosition.y}
            onSuccess={handleMarkerAdded}
            onCancel={handleCloseAddMarker}
            onAddMarker={handleAddMarker}
          />
        )}
      </BottomSheet>

      {/* Marker Detail Bottom Sheet */}
      <GuestMarkerDetailSheet
        marker={selectedMarker}
        isOpen={showMarkerDetail}
        onClose={handleCloseMarkerDetail}
        onUpdate={handleMarkerUpdate}
        onDelete={handleMarkerDelete}
      />
    </div>
  );
}
