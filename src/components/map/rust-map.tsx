"use client";

import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface RustMapProps {
  seed: string;
  mapSize: number;
  markers?: Array<{
    id: string;
    title: string;
    type: string;
    x: number;
    y: number;
    color?: string;
  }>;
  onMapClick?: (x: number, y: number) => void;
}

export function RustMap({ seed, mapSize, markers = [], onMapClick }: RustMapProps) {
  const mapRef = useRef<L.Map | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [imageError, setImageError] = useState(false);
  const [coords, setCoords] = useState<{ x: number; y: number } | null>(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    // Bereken bounds gebaseerd op map grootte
    // Rust maps zijn vierkant, coördinaten lopen van 0 tot mapSize
    const bounds = L.latLngBounds(
      [0, 0],
      [mapSize, mapSize]
    );

    // Initialiseer de map
    const map = L.map(containerRef.current, {
      crs: L.CRS.Simple,
      minZoom: -2,
      maxZoom: 2,
      maxBounds: bounds.pad(0.1),
      maxBoundsViscosity: 1.0,
      zoomControl: false,
      attributionControl: false,
    });

    // Voeg zoom controls toe rechtsboven
    L.control.zoom({ position: "topright" }).addTo(map);

    // Voeg de map afbeelding toe als overlay
    const imageUrl = `/maps/${seed}.png`;

    // Check of de afbeelding bestaat
    const img = new Image();
    img.onload = () => {
      L.imageOverlay(imageUrl, bounds).addTo(map);
      map.fitBounds(bounds);
    };
    img.onerror = () => {
      setImageError(true);
    };
    img.src = imageUrl;

    // Track mouse positie voor coördinaten display
    map.on("mousemove", (e) => {
      const x = Math.round(e.latlng.lng);
      const y = Math.round(mapSize - e.latlng.lat); // Invert Y axis
      setCoords({ x, y });
    });

    map.on("mouseout", () => {
      setCoords(null);
    });

    // Handle click events
    if (onMapClick) {
      map.on("click", (e) => {
        const x = Math.round(e.latlng.lng);
        const y = Math.round(mapSize - e.latlng.lat);
        onMapClick(x, y);
      });
    }

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [seed, mapSize, onMapClick]);

  // Update markers wanneer ze veranderen
  useEffect(() => {
    if (!mapRef.current) return;

    // Verwijder bestaande markers
    mapRef.current.eachLayer((layer) => {
      if (layer instanceof L.Marker) {
        mapRef.current?.removeLayer(layer);
      }
    });

    // Voeg nieuwe markers toe
    markers.forEach((marker) => {
      const latLng: L.LatLngExpression = [mapSize - marker.y, marker.x];

      const icon = L.divIcon({
        className: "custom-marker",
        html: `<div style="
          width: 24px;
          height: 24px;
          background-color: ${marker.color || "#FF0000"};
          border: 2px solid white;
          border-radius: 50%;
          box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        "></div>`,
        iconSize: [24, 24],
        iconAnchor: [12, 12],
      });

      L.marker(latLng, { icon })
        .bindPopup(`<b>${marker.title}</b><br>${marker.type}`)
        .addTo(mapRef.current!);
    });
  }, [markers, mapSize]);

  if (imageError) {
    return (
      <div className="flex h-full flex-col items-center justify-center bg-zinc-800 p-8 text-center">
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
            public/maps/{seed}.png
          </code>
        </p>
      </div>
    );
  }

  return (
    <div className="relative h-full w-full">
      <div ref={containerRef} className="h-full w-full bg-zinc-900" />

      {/* Coördinaten overlay */}
      {coords && (
        <div className="absolute bottom-2 left-2 z-[1000] rounded-lg bg-zinc-900/90 px-3 py-1.5 font-mono text-sm text-white backdrop-blur-sm">
          X: {coords.x} | Y: {coords.y}
        </div>
      )}

      {/* Grid toggle - voor later */}
      <div className="absolute right-2 top-16 z-[1000]">
        <button
          className="rounded-lg bg-zinc-900/90 p-2 text-zinc-400 backdrop-blur-sm transition-colors hover:bg-zinc-800 hover:text-white"
          title="Grid overlay (coming soon)"
          disabled
        >
          <svg
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
