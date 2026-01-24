"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import Image from "next/image";
import { Header } from "@/components/layout/header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

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
  const [imageError, setImageError] = useState(false);

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

  if (isLoading) {
    return (
      <>
        <Header title="Laden..." />
        <div className="flex justify-center p-8">
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
    <>
      <Header
        title={`Seed: ${map.seed}`}
        subtitle={map.serverName || undefined}
        leftAction={
          <Link href="/map" className="text-blue-500">
            Terug
          </Link>
        }
      />

      <div className="p-4">
        {/* Map Info Card */}
        <Card className="mb-4">
          <CardContent className="py-3">
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
          </CardContent>
        </Card>

        {/* Map Image */}
        <Card variant="elevated" className="overflow-hidden">
          <div className="relative aspect-square w-full bg-zinc-800">
            {imageError ? (
              <div className="flex h-full flex-col items-center justify-center p-8 text-center">
                <svg
                  className="mb-4 h-16 w-16 text-zinc-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
                  />
                </svg>
                <p className="mb-2 text-zinc-400">Map afbeelding niet gevonden</p>
                <p className="text-sm text-zinc-500">
                  Upload de map naar:
                  <br />
                  <code className="rounded bg-zinc-700 px-2 py-1">
                    public/maps/{map.seed}.png
                  </code>
                </p>
              </div>
            ) : (
              <Image
                src={`/maps/${map.seed}.png`}
                alt={`Map seed ${map.seed}`}
                fill
                className="object-contain"
                onError={() => setImageError(true)}
                priority
              />
            )}
          </div>
        </Card>

        {/* Quick Actions */}
        <div className="mt-4 flex gap-3">
          <Button className="flex-1" disabled>
            + Marker Toevoegen
          </Button>
          <Button variant="secondary" className="flex-1" disabled>
            Filter
          </Button>
        </div>

        <p className="mt-4 text-center text-xs text-zinc-500">
          Marker functionaliteit komt in FASE 6
        </p>
      </div>
    </>
  );
}
