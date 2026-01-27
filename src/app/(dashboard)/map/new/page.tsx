"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/layout/header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";

export default function NewMapPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const [seed, setSeed] = useState("");
  const [serverName, setServerName] = useState("");
  const [mapSize, setMapSize] = useState("4000");
  const [wipeDate, setWipeDate] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/maps", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          seed,
          serverName: serverName || undefined,
          mapSize: parseInt(mapSize),
          wipeDate: wipeDate || undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Kon map niet aanmaken");
        return;
      }

      router.push(`/map/${data.id}`);
    } catch {
      setError("Er is iets misgegaan");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Header
        title="Nieuwe Map"
        leftAction={
          <Link href="/map" className="text-blue-500">
            Back
          </Link>
        }
      />
      <div className="p-4">
        <Card variant="elevated">
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4 py-2">
              {error && (
                <div className="rounded-xl bg-red-500/10 p-4 text-sm text-red-400">
                  {error}
                </div>
              )}

              <Input
                id="seed"
                label="Map Seed *"
                value={seed}
                onChange={(e) => setSeed(e.target.value)}
                placeholder="bijv. 10358"
                required
              />

              <Input
                id="serverName"
                label="Server Naam (optioneel)"
                value={serverName}
                onChange={(e) => setServerName(e.target.value)}
                placeholder="bijv. Rustafied EU Main"
              />

              <div>
                <label
                  htmlFor="mapSize"
                  className="mb-2 block text-sm font-medium text-zinc-300"
                >
                  Map Grootte
                </label>
                <select
                  id="mapSize"
                  value={mapSize}
                  onChange={(e) => setMapSize(e.target.value)}
                  className="w-full rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-3 text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="3000">3000 (Small)</option>
                  <option value="3500">3500</option>
                  <option value="4000">4000 (Default)</option>
                  <option value="4500">4500</option>
                  <option value="5000">5000 (Large)</option>
                  <option value="6000">6000</option>
                </select>
              </div>

              <Input
                id="wipeDate"
                label="Wipe Datum (optioneel)"
                type="date"
                value={wipeDate}
                onChange={(e) => setWipeDate(e.target.value)}
              />

              <div className="pt-4">
                <Button
                  type="submit"
                  disabled={isLoading || !seed}
                  className="w-full"
                >
                  {isLoading ? "Map aanmaken..." : "Map Sessie Starten"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <p className="mt-4 text-center text-sm text-zinc-500">
          De map afbeelding moet je zelf uploaden naar{" "}
          <code className="rounded bg-zinc-800 px-1">public/maps/[seed].png</code>
        </p>
      </div>
    </>
  );
}
