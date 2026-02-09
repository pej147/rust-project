"use client";

import { useState, useEffect, useCallback } from "react";

export interface GuestResident {
  id: string;
  name: string;
  clanTag?: string;
  threatLevel: number;
}

export interface GuestMarker {
  id: string;
  title: string;
  description?: string;
  type: string;
  x: number;
  y: number;
  color: string;
  createdAt: string;
  residents?: GuestResident[];
  _source?: "guest" | "team";
  sharedBy?: string;
  visibility?: string;
}

export interface GuestMapSession {
  id: string;
  seed: string;
  serverName?: string;
  mapSize: number;
  markers: GuestMarker[];
  createdAt: string;
  updatedAt: string;
}

const STORAGE_KEY = "rust-intel-guest-maps";

// Generate simple unique ID
function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// Auto-sync guest markers to team (fire-and-forget)
function syncToTeam(seed: string, markers: GuestMarker[]) {
  const code = localStorage.getItem(`rust-intel-team-code-${seed}`);
  const guestToken = localStorage.getItem(`rust-intel-team-token-${seed}`);
  const guestName = localStorage.getItem("rust-intel-guest-name");

  if (!code || !guestToken || !guestName) return;

  // Only sync own markers (not team markers)
  const ownMarkers = markers.filter((m) => m._source !== "team");

  fetch("/api/teams/guest/sync", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      guestToken,
      code,
      seed,
      guestName,
      markers: ownMarkers.map((m) => ({
        title: m.title,
        description: m.description,
        type: m.type,
        x: m.x,
        y: m.y,
        color: m.color,
      })),
    }),
  }).catch((err) => console.error("Team sync failed:", err));
}

export function useGuestMarkers() {
  const [maps, setMaps] = useState<GuestMapSession[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) return JSON.parse(stored);
    } catch (error) {
      console.error("Failed to load guest maps:", error);
    }
    return [];
  });
  const [isLoaded] = useState(() => typeof window !== "undefined");

  // Save to localStorage whenever maps change
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(maps));
      } catch (error) {
        console.error("Failed to save guest maps:", error);
      }
    }
  }, [maps, isLoaded]);

  // Get or create a map session by seed
  const getOrCreateMap = useCallback(
    (seed: string, serverName?: string, mapSize: number = 4000): GuestMapSession => {
      const existingMap = maps.find((m) => m.seed === seed);
      if (existingMap) {
        return existingMap;
      }

      const newMap: GuestMapSession = {
        id: generateId(),
        seed,
        serverName,
        mapSize,
        markers: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      setMaps((prev) => [...prev, newMap]);
      return newMap;
    },
    [maps]
  );

  // Get map by seed
  const getMapBySeed = useCallback(
    (seed: string): GuestMapSession | undefined => {
      return maps.find((m) => m.seed === seed);
    },
    [maps]
  );

  // Add marker to a map
  const addMarker = useCallback(
    (seed: string, marker: Omit<GuestMarker, "id" | "createdAt">): GuestMarker => {
      const newMarker: GuestMarker = {
        ...marker,
        id: generateId(),
        createdAt: new Date().toISOString(),
      };

      setMaps((prev) => {
        const updated = prev.map((map) =>
          map.seed === seed
            ? {
                ...map,
                markers: [...map.markers, newMarker],
                updatedAt: new Date().toISOString(),
              }
            : map
        );
        const mapData = updated.find((m) => m.seed === seed);
        if (mapData) syncToTeam(seed, mapData.markers);
        return updated;
      });

      return newMarker;
    },
    []
  );

  // Update a marker
  const updateMarker = useCallback(
    (seed: string, markerId: string, updates: Partial<Omit<GuestMarker, "id" | "createdAt">>) => {
      setMaps((prev) => {
        const updated = prev.map((map) =>
          map.seed === seed
            ? {
                ...map,
                markers: map.markers.map((m) =>
                  m.id === markerId ? { ...m, ...updates } : m
                ),
                updatedAt: new Date().toISOString(),
              }
            : map
        );
        const mapData = updated.find((m) => m.seed === seed);
        if (mapData) syncToTeam(seed, mapData.markers);
        return updated;
      });
    },
    []
  );

  // Delete a marker
  const deleteMarker = useCallback((seed: string, markerId: string) => {
    setMaps((prev) => {
      const updated = prev.map((map) =>
        map.seed === seed
          ? {
              ...map,
              markers: map.markers.filter((m) => m.id !== markerId),
              updatedAt: new Date().toISOString(),
            }
          : map
      );
      const mapData = updated.find((m) => m.seed === seed);
      if (mapData) syncToTeam(seed, mapData.markers);
      return updated;
    });
  }, []);

  // Delete a map session
  const deleteMap = useCallback((seed: string) => {
    setMaps((prev) => prev.filter((m) => m.seed !== seed));
  }, []);

  // Get all maps
  const getAllMaps = useCallback(() => {
    return maps;
  }, [maps]);

  // Clear all guest data
  const clearAllData = useCallback(() => {
    setMaps([]);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  // Manually trigger sync for a seed (e.g. after creating a team)
  const triggerSync = useCallback(
    (seed: string) => {
      const mapData = maps.find((m) => m.seed === seed);
      if (mapData) syncToTeam(seed, mapData.markers);
    },
    [maps]
  );

  return {
    maps,
    isLoaded,
    getOrCreateMap,
    getMapBySeed,
    addMarker,
    updateMarker,
    deleteMarker,
    deleteMap,
    getAllMaps,
    clearAllData,
    triggerSync,
  };
}
