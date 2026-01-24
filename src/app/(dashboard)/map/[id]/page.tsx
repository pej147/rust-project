"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { Header } from "@/components/layout/header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// Dynamic import voor Leaflet (client-side only)
const RustMap = dynamic(
  () => import("@/components/map/rust-map").then((mod) => mod.RustMap),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full items-center justify-center bg-zinc-900">
        <p className="text-zinc-400">Map laden...</p>
      </div>
    ),
  }
);

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
  markers: Array<{
    id: string;
    title: string;
    type: string;
    x: number;
    y: number;
    color?: string;
  }>;
}

export default function MapDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [map, setMap] = useState<MapSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [showInfo, setShowInfo] = useState(false);

  useEffect(() => {
    fetchMap();
  }, [id]);

  const fetchMap = async () => {
    try {
      const response = await fetch(`/api/maps/${id}`);
      if (!response.ok) {
        throw new Error("Kon map niet laden");
      }
      const data = await response.json();
      setMap(data);
    } catch {
      setError("Kon map niet laden");
    } finally {
      setIsLoading(false);
    }
  };

  const handleMapClick = (x: number, y: number) => {
    // Voor nu alleen console log, later marker toevoegen
    console.log(`Clicked at: ${x}, ${y}`);
  };

  if (isLoading) {
    return (
      <>
        <Header title="Laden..." />
        <div className="flex h-[calc(100vh-8rem)] items-center justify-center">
          <p className="text-zinc-400">Map laden...</p>
        </div>
      </>
    );
  }

  if (error || !map) {
    return (
      <>
        <Header
          title="Fout"
          leftAction={
            <Link href="/map" className="text-blue-500">
              Terug
            </Link>
          }
        />
        <div className="p-4">
          <Card variant="elevated">
            <CardContent className="py-8 text-center">
              <p className="text-red-400">{error || "Map niet gevonden"}</p>
              <Link href="/map">
                <Button variant="secondary" className="mt-4">
                  Terug naar overzicht
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
                  Wipe: {new Date(map.wipeDate).toLocaleDateString("nl-NL")}
                </span>
              )}
            </div>
            {map.isActive && (
              <span className="rounded-full bg-green-500/20 px-2 py-0.5 text-xs text-green-400">
                Actief
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
          markers={map.markers}
          onMapClick={handleMapClick}
        />

        {/* Floating action button */}
        <button
          className="absolute bottom-20 right-4 z-[1000] flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg transition-transform hover:scale-105 active:scale-95"
          title="Marker toevoegen (coming soon)"
          disabled
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
      </div>
    </div>
  );
}
