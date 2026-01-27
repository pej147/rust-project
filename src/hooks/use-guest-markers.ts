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

export function useGuestMarkers() {
  const [maps, setMaps] = useState<GuestMapSession[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setMaps(JSON.parse(stored));
      }
    } catch (error) {
      console.error("Failed to load guest maps:", error);
    }
    setIsLoaded(true);
  }, []);

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

      setMaps((prev) =>
        prev.map((map) =>
          map.seed === seed
            ? {
                ...map,
                markers: [...map.markers, newMarker],
                updatedAt: new Date().toISOString(),
              }
            : map
        )
      );

      return newMarker;
    },
    []
  );

  // Update a marker
  const updateMarker = useCallback(
    (seed: string, markerId: string, updates: Partial<Omit<GuestMarker, "id" | "createdAt">>) => {
      setMaps((prev) =>
        prev.map((map) =>
          map.seed === seed
            ? {
                ...map,
                markers: map.markers.map((m) =>
                  m.id === markerId ? { ...m, ...updates } : m
                ),
                updatedAt: new Date().toISOString(),
              }
            : map
        )
      );
    },
    []
  );

  // Delete a marker
  const deleteMarker = useCallback((seed: string, markerId: string) => {
    setMaps((prev) =>
      prev.map((map) =>
        map.seed === seed
          ? {
              ...map,
              markers: map.markers.filter((m) => m.id !== markerId),
              updatedAt: new Date().toISOString(),
            }
          : map
      )
    );
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
  };
}
