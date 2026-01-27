"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/layout/header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useGuestMarkers, type GuestMapSession } from "@/hooks/use-guest-markers";

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
  const { data: session, status } = useSession();
  const router = useRouter();

  // Guest mode state
  const { maps: guestMaps, isLoaded: guestLoaded, getOrCreateMap } = useGuestMarkers();
  const [guestSeed, setGuestSeed] = useState("");
  const [guestServerName, setGuestServerName] = useState("");

  // Logged-in mode state
  const [maps, setMaps] = useState<MapSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const isGuest = status === "unauthenticated";
  const isLoggedIn = status === "authenticated";

  useEffect(() => {
    if (isLoggedIn) {
      fetchMaps();
    } else {
      setIsLoading(false);
    }
  }, [isLoggedIn]);

  const fetchMaps = async () => {
    try {
      const response = await fetch("/api/maps");
      if (!response.ok) {
        throw new Error("Could not load maps");
      }
      const data = await response.json();
      setMaps(data);
    } catch {
      setError("Could not load maps");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGuestStart = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestSeed.trim()) return;

    // Create or get the map session
    getOrCreateMap(guestSeed.trim(), guestServerName.trim() || undefined);

    // Navigate to guest map view
    router.push(`/map/guest/${encodeURIComponent(guestSeed.trim())}`);
  };

  const handleGuestMapClick = (map: GuestMapSession) => {
    router.push(`/map/guest/${encodeURIComponent(map.seed)}`);
  };

  // Loading state
  if (status === "loading" || (isLoggedIn && isLoading)) {
    return (
      <>
        <Header title="Intel Map" subtitle="Track your enemies" />
        <div className="flex justify-center py-8">
          <p className="text-zinc-400">Loading...</p>
        </div>
      </>
    );
  }

  // Guest Mode
  if (isGuest) {
    return (
      <>
        <Header
          title="Intel Map"
          subtitle="Guest Mode"
          rightAction={
            <Link href="/login" className="text-blue-500 text-sm">
              Login
            </Link>
          }
        />

        <div className="p-4 space-y-6">
          {/* Guest Mode Banner */}
          <div className="rounded-2xl bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-500/30 p-4">
            <div className="flex items-start gap-3">
              <span className="text-2xl">👤</span>
              <div>
                <h3 className="font-semibold text-white">Guest Mode</h3>
                <p className="text-sm text-zinc-400 mt-1">
                  Your markers are saved locally in your browser.{" "}
                  <Link href="/register" className="text-orange-400 hover:underline">
                    Create an account
                  </Link>{" "}
                  to sync across devices.
                </p>
              </div>
            </div>
          </div>

          {/* Start New Map */}
          <Card variant="elevated">
            <CardContent className="py-4">
              <h2 className="text-lg font-semibold text-white mb-4">
                Start New Map
              </h2>
              <form onSubmit={handleGuestStart} className="space-y-4">
                <Input
                  id="seed"
                  label="Map Seed *"
                  placeholder="e.g. 12345678"
                  value={guestSeed}
                  onChange={(e) => setGuestSeed(e.target.value)}
                  required
                />
                <Input
                  id="serverName"
                  label="Server Name (optional)"
                  placeholder="e.g. Rustafied EU Main"
                  value={guestServerName}
                  onChange={(e) => setGuestServerName(e.target.value)}
                />
                <Button type="submit" className="w-full" disabled={!guestSeed.trim()}>
                  Start Map
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Existing Guest Maps */}
          {guestLoaded && guestMaps.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-white mb-3">
                Your Maps ({guestMaps.length})
              </h2>
              <div className="space-y-3">
                {guestMaps.map((map) => (
                  <Card
                    key={map.id}
                    className="transition-colors hover:bg-zinc-800/50 cursor-pointer"
                    onClick={() => handleGuestMapClick(map)}
                  >
                    <CardContent className="py-3">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-white">
                              Seed: {map.seed}
                            </h3>
                            <span className="rounded-full bg-orange-500/20 px-2 py-0.5 text-xs text-orange-400">
                              Guest
                            </span>
                          </div>
                          {map.serverName && (
                            <p className="text-sm text-zinc-400">{map.serverName}</p>
                          )}
                          <div className="mt-1 flex items-center gap-3 text-xs text-zinc-500">
                            <span>{map.mapSize}m</span>
                            <span>{map.markers.length} markers</span>
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
                ))}
              </div>
            </div>
          )}
        </div>
      </>
    );
  }

  // Logged-in Mode (existing behavior)
  return (
    <>
      <Header
        title="Intel Map"
        subtitle="Track your enemies"
        rightAction={
          <Link href="/map/new" className="text-blue-500">
            + New
          </Link>
        }
      />
      <div className="p-4">
        {error ? (
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
                Try again
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
                No map sessions yet
              </h2>
              <p className="mb-6 text-center text-zinc-400">
                Start a new map session to add markers
              </p>
              <Link href="/map/new">
                <Button>New Map Session</Button>
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
                              Active
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
                              {new Date(map.wipeDate).toLocaleDateString("en-US")}
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
