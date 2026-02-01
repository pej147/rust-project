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
  residents?: {
    id?: string;
    name: string;
    clanTag?: string;
    threatLevel: number;
  }[];
  _source?: "guest" | "team";
  sharedBy?: string;
}

interface RustMapProps {
  seed: string;
  mapSize: number;
  markers?: MarkerData[];
  onMapClick?: (x: number, y: number) => void;
  onMarkerClick?: (marker: MarkerData, screenPosition: { x: number; y: number }) => void;
}

export function RustMap({ seed, mapSize, markers = [], onMapClick, onMarkerClick }: RustMapProps) {
  const mapRef = useRef<L.Map | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const markerClickedRef = useRef(false); // Flag to prevent map click after marker click
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
      minZoom: -1,
      maxZoom: 2,
      maxBounds: bounds,
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
        console.log("MAP CLICK - markerClickedRef:", markerClickedRef.current);
        // Skip if a marker was just clicked
        if (markerClickedRef.current) {
          markerClickedRef.current = false;
          console.log("MAP CLICK BLOCKED");
          return;
        }
        const x = Math.round(e.latlng.lng);
        const y = Math.round(mapSize - e.latlng.lat);
        console.log("MAP CLICK ALLOWED at", x, y);
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
      const isTeamMarker = marker._source === "team";

      const visibilityIcon = marker.visibility === "PRIVATE" ? "🔒"
        : marker.visibility === "PUBLIC" ? "🌐" : "👥";

      // Team markers get dashed olive border, guest markers get solid white
      const borderStyle = isTeamMarker
        ? "border: 3px dashed #8B9A46;"
        : "border: 3px solid white;";

      const icon = L.divIcon({
        className: "custom-marker",
        html: `
          <div style="
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
            width: 36px;
            height: 36px;
            background-color: ${marker.color || "#FF0000"};
            ${borderStyle}
            border-radius: 50%;
            box-shadow: 0 2px 8px rgba(0,0,0,0.4);
            font-size: 18px;
            cursor: pointer;
          ">
            ${config.icon}
            <span style="
              position: absolute;
              bottom: -4px;
              right: -4px;
              font-size: 10px;
              background: #1a1a1a;
              border-radius: 50%;
              width: 16px;
              height: 16px;
              display: flex;
              align-items: center;
              justify-content: center;
              border: 1.5px solid #333333;
              line-height: 1;
            ">${visibilityIcon}</span>
          </div>
        `,
        iconSize: [36, 36],
        iconAnchor: [18, 18],
      });

      // Popup content with Rust Console theme styling
      const popupContent = `
        <div style="
          background: #1a1a1a;
          color: white;
          padding: 12px;
          border-radius: 8px;
          border: 1px solid #333333;
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
              font-size: 14px;
              text-transform: uppercase;
              letter-spacing: 0.05em;
            ">${marker.title}</span>
          </div>
          <div style="
            display: flex;
            align-items: center;
            gap: 6px;
            color: #A0A0A0;
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
              color: #A0A0A0;
              font-size: 13px;
              margin-top: 8px;
              padding-top: 8px;
              border-top: 1px solid #333333;
            ">${marker.description}</div>
          ` : ""}
          <div style="
            color: #666666;
            font-size: 11px;
            margin-top: 8px;
          ">
            📍 ${Math.round(marker.x)}, ${Math.round(marker.y)}
            ${marker.createdBy ? `<br>By: ${marker.createdBy.displayName}` : ""}
            ${isTeamMarker && marker.sharedBy ? `<br><span style="color: #8B9A46;">Shared by: ${marker.sharedBy}</span>` : ""}
          </div>
          <div style="
            display: inline-flex;
            align-items: center;
            gap: 4px;
            margin-top: 6px;
            padding: 2px 8px;
            background: #2d2d2d;
            border-radius: 9999px;
            font-size: 10px;
            color: #A0A0A0;
          ">
            <span>${visibilityIcon}</span>
            ${marker.visibility === "PRIVATE" ? "Private" : marker.visibility === "PUBLIC" ? "Public" : "Team"}
          </div>
        </div>
      `;

      const leafletMarker = L.marker(latLng, { icon }).addTo(mapRef.current!);

      // Click handler — set flag to prevent map click
      leafletMarker.on("click", () => {
        markerClickedRef.current = true;
      });

      if (marker.type === "ENEMY") {
        // Enemy markers: Leaflet popup with residents + settings button
        const settingsSection = isTeamMarker ? "" : `
            <div style="
              padding: 6px 10px;
              border-top: 1px solid #333333;
            ">
              <span class="enemy-settings-btn" data-marker-id="${marker.id}" style="
                color: #8B9A46;
                font-size: 10px;
                cursor: pointer;
                text-transform: uppercase;
                letter-spacing: 0.05em;
              ">&#9881; Settings</span>
            </div>`;

        const sharedByLabel = isTeamMarker && marker.sharedBy ? `
            <div style="
              padding: 4px 10px;
              border-top: 1px solid #333333;
              color: #8B9A46;
              font-size: 10px;
            ">Shared by: ${marker.sharedBy}</div>` : "";

        const enemyPopupContent = `
          <div style="
            background: #1a1a1a;
            color: white;
            padding: 0;
            border-radius: 8px;
            border: 1px solid #333333;
            min-width: 160px;
            font-family: system-ui, -apple-system, sans-serif;
          ">
            <div style="
              display: flex;
              align-items: center;
              gap: 6px;
              padding: 8px 10px;
              border-bottom: 1px solid #333333;
            ">
              <span style="font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em;">${marker.title}</span>
              <span style="font-size: 9px;">${visibilityIcon}</span>
            </div>
            <div class="enemy-residents" data-marker-id="${marker.id}" style="
              padding: 8px 10px;
              max-height: 120px;
              overflow-y: auto;
            ">
              <span style="color: #666666; font-size: 10px;">Loading...</span>
            </div>
            ${sharedByLabel}
            ${settingsSection}
          </div>
        `;

        leafletMarker.bindPopup(enemyPopupContent, {
          className: "custom-popup",
          closeButton: true,
          maxWidth: 200,
          interactive: true,
        });

        // When popup opens: load residents + bind settings button
        leafletMarker.on("popupopen", async () => {
          const el = document.querySelector(`.enemy-residents[data-marker-id="${marker.id}"]`);

          // Helper to render resident list into the popup DOM
          const renderResidents = (list: { name: string; clanTag?: string; threatLevel: number }[]) => {
            if (!el) return;
            if (list.length === 0) {
              el.innerHTML = '<span style="color:#666666;font-size:10px;font-style:italic;">No players</span>';
            } else {
              el.innerHTML = list.map((r) => {
                let html = '<div style="font-size:11px;color:#A0A0A0;padding:1px 0;">';
                if (r.clanTag) html += `<span style="color:#666666;">[${r.clanTag}]</span> `;
                html += r.name;
                if (r.threatLevel > 2) html += ' ' + '💀'.repeat(Math.min(r.threatLevel - 2, 3));
                html += '</div>';
                return html;
              }).join('');
            }
          };

          if (marker.residents) {
            // Guest mode: residents are on the marker object
            renderResidents(marker.residents);
          } else {
            // Logged-in mode: fetch residents from API
            try {
              const res = await fetch(`/api/markers/${marker.id}/residents`);
              if (res.ok) {
                const data = await res.json();
                renderResidents(data.map((r: { enemy: { name: string; clanTag?: string; threatLevel: number } }) => r.enemy));
              }
            } catch { /* ignore fetch errors */ }
          }

          // Bind settings button
          const btn = document.querySelector(`.enemy-settings-btn[data-marker-id="${marker.id}"]`);
          if (btn && onMarkerClick) {
            btn.addEventListener("click", () => {
              leafletMarker.closePopup();
              onMarkerClick(marker, { x: 0, y: 0 });
            });
          }
        });
      } else {
        // Non-enemy markers: popup + click opens detail sheet (not for team markers)
        leafletMarker.bindPopup(popupContent, {
          className: "custom-popup",
          closeButton: true,
          maxWidth: 300,
        });

        if (onMarkerClick && !isTeamMarker) {
          leafletMarker.on("click", (e) => {
            const screenPosition = {
              x: e.originalEvent?.clientX ?? 0,
              y: e.originalEvent?.clientY ?? 0,
            };
            onMarkerClick(marker, screenPosition);
          });
        }
      }
    });
  }, [markers, mapSize, onMarkerClick]);

  if (imageError) {
    return (
      <div className="flex h-full flex-col items-center justify-center bg-rust-surface-elevated p-8 text-center">
        <svg
          className="mb-4 h-16 w-16 text-rust-text-muted"
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
        <p className="mb-2 text-rust-text-secondary">Map image not found</p>
        <p className="text-sm text-rust-text-muted">
          Upload the map to:
          <br />
          <code className="rounded bg-rust-surface-elevated px-2 py-1">
            public/maps/{seed}.png
          </code>
        </p>
      </div>
    );
  }

  return (
    <div className="relative h-full w-full">
      <div ref={containerRef} className="h-full w-full bg-rust-surface" />

      {/* Coordinates overlay */}
      {coords && (
        <div className="absolute bottom-2 left-2 z-[1000] rounded-lg bg-rust-bg/90 px-3 py-1.5 font-mono text-sm text-white backdrop-blur-sm">
          X: {coords.x} | Y: {coords.y}
        </div>
      )}

      {/* Grid toggle - for later */}
      <div className="absolute right-2 top-16 z-[1000]">
        <button
          className="rounded-lg bg-rust-bg/90 p-2 text-rust-text-secondary backdrop-blur-sm transition-colors hover:bg-rust-surface hover:text-white"
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
