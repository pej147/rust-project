"use client";

import { useState, useEffect, useCallback, useRef } from "react";

interface EnemyProfile {
  id: string;
  name: string;
  clanTag?: string | null;
  threatLevel: number;
}

interface Resident {
  id: string;
  enemy: EnemyProfile;
}

interface MarkerData {
  id: string;
  title: string;
  type: string;
  x: number;
  y: number;
  color?: string;
  createdBy?: {
    id: string;
  };
}

interface EnemyMarkerPopupProps {
  marker: MarkerData | null;
  isOpen: boolean;
  position: { x: number; y: number } | null;
  onClose: () => void;
  onOpenSettings: () => void;
  currentUserId?: string;
}

export function EnemyMarkerPopup({
  marker,
  isOpen,
  position,
  onClose,
  onOpenSettings,
  currentUserId,
}: EnemyMarkerPopupProps) {
  const popupRef = useRef<HTMLDivElement>(null);
  const [residents, setResidents] = useState<Resident[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const isOwner = currentUserId === marker?.createdBy?.id;

  // Fetch residents
  const fetchResidents = useCallback(async () => {
    if (!marker?.id) return;
    setIsLoading(true);
    try {
      const res = await fetch(`/api/markers/${marker.id}/residents`);
      if (res.ok) {
        setResidents(await res.json());
      }
    } finally {
      setIsLoading(false);
    }
  }, [marker?.id]);

  useEffect(() => {
    if (isOpen && marker?.id) {
      fetchResidents();
    }
  }, [isOpen, marker?.id, fetchResidents]);

  // Close on click outside
  useEffect(() => {
    if (!isOpen) return;
    const handle = (e: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    const t = setTimeout(() => document.addEventListener("mousedown", handle), 50);
    return () => { clearTimeout(t); document.removeEventListener("mousedown", handle); };
  }, [isOpen, onClose]);

  // Close on map move (listen for any mouse drag on the map container)
  useEffect(() => {
    if (!isOpen) return;
    const mapContainer = document.querySelector(".leaflet-container");
    if (!mapContainer) return;

    const handleMove = () => onClose();
    mapContainer.addEventListener("mousedown", (e) => {
      if (popupRef.current?.contains(e.target as Node)) return;
      const handleDrag = () => { handleMove(); document.removeEventListener("mousemove", handleDrag); };
      document.addEventListener("mousemove", handleDrag, { once: true });
    });
  }, [isOpen, onClose]);

  if (!isOpen || !marker || !position) return null;

  const popupWidth = 160;
  const screenWidth = typeof window !== "undefined" ? window.innerWidth : 1000;
  const positionRight = position.x + 15 + popupWidth < screenWidth;
  const left = positionRight ? position.x + 15 : position.x - 15 - popupWidth;
  const top = Math.max(50, position.y - 40);

  return (
    <div
      ref={popupRef}
      className="fixed z-[2000]"
      style={{ left: `${left}px`, top: `${top}px` }}
    >
      <div className="rounded-lg border border-zinc-700/60 bg-zinc-900/95 shadow-lg backdrop-blur-sm">
        {/* Compact header */}
        <div className="flex items-center justify-between gap-2 border-b border-zinc-800/40 px-2.5 py-1.5">
          <span className="text-xs font-medium text-white truncate max-w-[100px]">{marker.title}</span>
          <div className="flex items-center gap-1">
            <button
              onClick={onOpenSettings}
              className="p-1 text-zinc-500 hover:text-zinc-300"
              title="Settings"
            >
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>
            <button onClick={onClose} className="p-1 text-zinc-500 hover:text-zinc-300">
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Names only */}
        <div className="px-2.5 py-2 max-h-[120px] overflow-y-auto">
          {isLoading ? (
            <div className="text-[10px] text-zinc-500">...</div>
          ) : residents.length === 0 ? (
            <div className="text-[10px] text-zinc-500 italic">No players</div>
          ) : (
            <div className="space-y-0.5">
              {residents.map((r) => (
                <div key={r.id} className="text-[11px] text-zinc-300 truncate">
                  {r.enemy.clanTag && <span className="text-zinc-500">[{r.enemy.clanTag}] </span>}
                  {r.enemy.name}
                  {r.enemy.threatLevel > 2 && <span className="ml-1 text-red-500">{"💀".repeat(Math.min(r.enemy.threatLevel - 2, 3))}</span>}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Add button for owner */}
        {isOwner && (
          <div className="border-t border-zinc-800/40 px-2.5 py-1.5">
            <button
              onClick={onOpenSettings}
              className="text-[10px] text-blue-400 hover:text-blue-300"
            >
              + Add player
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
