"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
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
  _count: {
    markers: number;
  };
}

export default function MapPage() {
  const [maps, setMaps] = useState<MapSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchMaps();
  }, []);

  const fetchMaps = async () => {
    try {
      const response = await fetch("/api/maps");
      if (!response.ok) {
        throw new Error("Kon maps niet laden");
      }
      const data = await response.json();
      setMaps(data);
    } catch {
      setError("Kon maps niet laden");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Header
        title="Intel Map"
        subtitle="Track je vijanden"
        rightAction={
          <Link href="/map/new" className="text-blue-500">
            + Nieuw
          </Link>
        }
      />
      <div className="p-4">
        {isLoading ? (
          <div className="flex justify-center py-8">
            <p className="text-zinc-400">Laden...</p>
          </div>
        ) : error ? (
          <Card variant="elevated">
            <CardContent className="py-8 text-center">
              <p className="text-red-400">{error}</p>
              <Button
                variant="secondary"
                className="mt-4"
                onClick={() => {
                  setError("");
                  setIsLoading(true);
                  fetchMaps();
                }}
              >
                Opnieuw proberen
              </Button>
            </CardContent>
          </Card>
        ) : maps.length === 0 ? (
          <Card variant="elevated">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <div className="mb-4 rounded-full bg-zinc-800 p-4">
                <svg
                  className="h-12 w-12 text-zinc-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z"
                  />
                </svg>
              </div>
              <h2 className="mb-2 text-xl font-semibold text-white">
                Nog geen map sessies
              </h2>
              <p className="mb-6 text-center text-zinc-400">
                Start een nieuwe map sessie om markers toe te voegen
              </p>
              <Link href="/map/new">
                <Button>Nieuwe Map Sessie</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {maps.map((map) => (
              <Link key={map.id} href={`/map/${map.id}`}>
                <Card className="transition-colors hover:bg-zinc-800/50">
                  <CardContent className="py-3">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-white">
                            Seed: {map.seed}
                          </h3>
                          {map.isActive && (
                            <span className="rounded-full bg-green-500/20 px-2 py-0.5 text-xs text-green-400">
                              Actief
                            </span>
                          )}
                        </div>
                        {map.serverName && (
                          <p className="text-sm text-zinc-400">
                            {map.serverName}
                          </p>
                        )}
                        <div className="mt-1 flex items-center gap-3 text-xs text-zinc-500">
                          <span>{map.mapSize}m</span>
                          <span>{map._count.markers} markers</span>
                          {map.wipeDate && (
                            <span>
                              Wipe:{" "}
                              {new Date(map.wipeDate).toLocaleDateString("nl-NL")}
                            </span>
                          )}
                        </div>
                      </div>
                      <svg
                        className="h-5 w-5 text-zinc-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M8.25 4.5l7.5 7.5-7.5 7.5"
                        />
                      </svg>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
