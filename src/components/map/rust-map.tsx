"use client";

import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./map-styles.css";

// Marker type configuration with icons
const MARKER_CONFIG: Record<string, { icon: string; label: string }> = {
  ENEMY: { icon: "👤", label: "Enemy" },
  TEAM_BASE: { icon: "🏠", label: "Team Base" },
  LOOT: { icon: "📦", label: "Loot" },
  MONUMENT: { icon: "🏛️", label: "Monument" },
  DANGER: { icon: "⚠️", label: "Danger" },
  NOTE: { icon: "📝", label: "Note" },
  RAID: { icon: "💥", label: "Raid" },
};

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

interface RustMapProps {
  seed: string;
  mapSize: number;
  markers?: MarkerData[];
  onMapClick?: (x: number, y: number) => void;
  onMarkerClick?: (marker: MarkerData) => void;
}

export function RustMap({ seed, mapSize, markers = [], onMapClick, onMarkerClick }: RustMapProps) {
  const mapRef = useRef<L.Map | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [imageError, setImageError] = useState(false);
  const [coords, setCoords] = useState<{ x: number; y: number } | null>(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    // Calculate bounds based on map size
    // Rust maps are square, coordinates run from 0 to mapSize
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

    // Add zoom controls to top right
    L.control.zoom({ position: "topright" }).addTo(map);

    // Add the map image as overlay
    const imageUrl = `/maps/${seed}.png`;

    // Check if the image exists
    const img = new Image();
    img.onload = () => {
      // Check if map still exists and has a valid container
      if (mapRef.current && containerRef.current) {
        try {
          L.imageOverlay(imageUrl, bounds).addTo(map);
          map.fitBounds(bounds);
        } catch (e) {
          console.warn("Map fitBounds failed:", e);
        }
      }
    };
    img.onerror = () => {
      setImageError(true);
    };
    img.src = imageUrl;

    // Set initial view immediately
    map.setView([mapSize / 2, mapSize / 2], -1);

    // Store map reference before async operations
    mapRef.current = map;

    // Track mouse position for coordinates display
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

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [seed, mapSize, onMapClick]);

  // Update markers when they change
  useEffect(() => {
    if (!mapRef.current) return;

    // Remove existing markers
    mapRef.current.eachLayer((layer) => {
      if (layer instanceof L.Marker) {
        mapRef.current?.removeLayer(layer);
      }
    });

    // Add new markers
    markers.forEach((marker) => {
      const latLng: L.LatLngExpression = [mapSize - marker.y, marker.x];
      const config = MARKER_CONFIG[marker.type] || { icon: "📍", label: marker.type };

      const icon = L.divIcon({
        className: "custom-marker",
        html: `
          <div style="
            display: flex;
            align-items: center;
            justify-content: center;
            width: 36px;
            height: 36px;
            background-color: ${marker.color || "#FF0000"};
            border: 3px solid white;
            border-radius: 50%;
            box-shadow: 0 2px 8px rgba(0,0,0,0.4);
            font-size: 18px;
            cursor: pointer;
          ">${config.icon}</div>
        `,
        iconSize: [36, 36],
        iconAnchor: [18, 18],
      });

      // Popup content with dark theme styling
      const popupContent = `
        <div style="
          background: #18181b;
          color: white;
          padding: 12px;
          border-radius: 12px;
          min-width: 180px;
          font-family: system-ui, -apple-system, sans-serif;
        ">
          <div style="
            display: flex;
            align-items: center;
            gap: 8px;
            margin-bottom: 8px;
          ">
            <span style="font-size: 20px;">${config.icon}</span>
            <span style="
              font-weight: 600;
              font-size: 16px;
            ">${marker.title}</span>
          </div>
          <div style="
            display: flex;
            align-items: center;
            gap: 6px;
            color: #a1a1aa;
            font-size: 12px;
            margin-bottom: 4px;
          ">
            <span style="
              background: ${marker.color || "#FF0000"};
              width: 10px;
              height: 10px;
              border-radius: 50%;
            "></span>
            ${config.label}
          </div>
          ${marker.description ? `
            <div style="
              color: #d4d4d8;
              font-size: 13px;
              margin-top: 8px;
              padding-top: 8px;
              border-top: 1px solid #27272a;
            ">${marker.description}</div>
          ` : ""}
          <div style="
            color: #71717a;
            font-size: 11px;
            margin-top: 8px;
          ">
            📍 ${Math.round(marker.x)}, ${Math.round(marker.y)}
            ${marker.createdBy ? `<br>By: ${marker.createdBy.displayName}` : ""}
          </div>
        </div>
      `;

      const leafletMarker = L.marker(latLng, { icon }).addTo(mapRef.current!);

      // For ENEMY markers, only use the click handler (show bottom sheet)
      // For other markers, show popup on hover and click handler for details
      if (marker.type === "ENEMY") {
        // ENEMY markers: only click handler, no popup
        if (onMarkerClick) {
          leafletMarker.on("click", (e) => {
            // Stop event from reaching the map click handler
            L.DomEvent.stopPropagation(e);
            if (e.originalEvent) {
              e.originalEvent.stopPropagation();
              e.originalEvent.preventDefault();
            }
            onMarkerClick(marker);
          });
        }
      } else {
        // Other markers: bind popup
        leafletMarker.bindPopup(popupContent, {
          className: "custom-popup",
          closeButton: true,
          maxWidth: 300,
        });

        // Click handler for marker details
        if (onMarkerClick) {
          leafletMarker.on("click", () => {
            onMarkerClick(marker);
          });
        }
      }
    });
  }, [markers, mapSize, onMarkerClick]);

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
        <p className="mb-2 text-zinc-400">Map image not found</p>
        <p className="text-sm text-zinc-500">
          Upload the map to:
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

      {/* Coordinates overlay */}
      {coords && (
        <div className="absolute bottom-2 left-2 z-[1000] rounded-lg bg-zinc-900/90 px-3 py-1.5 font-mono text-sm text-white backdrop-blur-sm">
          X: {coords.x} | Y: {coords.y}
        </div>
      )}

      {/* Grid toggle - for later */}
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
