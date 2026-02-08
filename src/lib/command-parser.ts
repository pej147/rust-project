// Command Parser for Rust Console Intel Map
// Parses quick commands like "m18", "m18 +3", "/enemy Player", "/marker enemy m18"

export type MarkerType = "ENEMY" | "TEAM_BASE" | "LOOT" | "MONUMENT" | "DANGER" | "NOTE" | "RAID";

export interface ParsedCommand {
  type: "marker" | "enemy" | "goto" | "unknown";
  markerType?: MarkerType;
  position?: { x: number; y: number };
  gridRef?: string;
  name?: string;
  offset?: { x: number; y: number };
  raw: string;
}

// Grid system: A-Z columns (0-25), 0-25 rows
// Each grid cell is mapSize / 26 units (Rust uses 26x26 grid)
const GRID_SIZE = 26;

// Convert grid reference like "M18" to coordinates
export function gridToCoordinates(gridRef: string, mapSize: number): { x: number; y: number } | null {
  // Grid ref format: Letter + Number, e.g., "M18", "A0", "Z25"
  const match = gridRef.toUpperCase().match(/^([A-Z])(\d{1,2})$/);
  if (!match) return null;

  const col = match[1].charCodeAt(0) - 65; // A=0, B=1, etc.
  const row = parseInt(match[2], 10);

  if (col < 0 || col >= GRID_SIZE || row < 0 || row >= GRID_SIZE) {
    return null;
  }

  const cellSize = mapSize / GRID_SIZE;
  // Center of the cell
  const x = col * cellSize + cellSize / 2;
  const y = row * cellSize + cellSize / 2;

  return { x, y };
}

// Convert coordinates to grid reference
export function coordinatesToGrid(x: number, y: number, mapSize: number): string {
  const cellSize = mapSize / GRID_SIZE;
  const col = Math.floor(x / cellSize);
  const row = Math.floor(y / cellSize);

  const letter = String.fromCharCode(65 + Math.min(Math.max(col, 0), GRID_SIZE - 1));
  const number = Math.min(Math.max(row, 0), GRID_SIZE - 1);

  return `${letter}${number}`;
}

// Parse offset like "+3", "-2", "+3-2" (x offset, y offset)
function parseOffset(offsetStr: string): { x: number; y: number } {
  let x = 0;
  let y = 0;

  // Match patterns like "+3", "-2", "+3-2", "-1+4"
  const matches = offsetStr.match(/([+-]\d+)/g);
  if (matches) {
    if (matches.length >= 1) {
      y = parseInt(matches[0], 10); // First offset is vertical (row)
    }
    if (matches.length >= 2) {
      x = parseInt(matches[1], 10); // Second offset is horizontal (col)
    }
  }

  return { x, y };
}

// Marker type aliases for quick input
const MARKER_TYPE_ALIASES: Record<string, MarkerType> = {
  enemy: "ENEMY",
  e: "ENEMY",
  base: "TEAM_BASE",
  b: "TEAM_BASE",
  team: "TEAM_BASE",
  loot: "LOOT",
  l: "LOOT",
  monument: "MONUMENT",
  mon: "MONUMENT",
  m: "MONUMENT",
  danger: "DANGER",
  d: "DANGER",
  note: "NOTE",
  n: "NOTE",
  raid: "RAID",
  r: "RAID",
};

// Parse a command string
export function parseCommand(input: string, mapSize: number = 4000): ParsedCommand {
  const raw = input.trim();
  if (!raw) {
    return { type: "unknown", raw };
  }

  // Command: /enemy PlayerName [gridRef]
  // Example: /enemy Nakeds, /enemy ClanBoi M18
  if (raw.startsWith("/enemy ") || raw.startsWith("/e ")) {
    const parts = raw.replace(/^\/(enemy|e)\s+/, "").trim();
    const gridMatch = parts.match(/\s+([A-Za-z]\d{1,2})$/);

    let name = parts;
    let position: { x: number; y: number } | undefined;
    let gridRef: string | undefined;

    if (gridMatch) {
      name = parts.slice(0, gridMatch.index).trim();
      gridRef = gridMatch[1].toUpperCase();
      const coords = gridToCoordinates(gridRef, mapSize);
      if (coords) {
        position = coords;
      }
    }

    return {
      type: "enemy",
      markerType: "ENEMY",
      name: name || undefined,
      position,
      gridRef,
      raw,
    };
  }

  // Command: /marker type gridRef
  // Example: /marker enemy M18, /marker loot K12
  if (raw.startsWith("/marker ") || raw.startsWith("/m ")) {
    const parts = raw.replace(/^\/(marker|m)\s+/, "").trim().split(/\s+/);

    if (parts.length >= 2) {
      const typeInput = parts[0].toLowerCase();
      const gridRef = parts[1].toUpperCase();
      const markerType = MARKER_TYPE_ALIASES[typeInput];
      const coords = gridToCoordinates(gridRef, mapSize);

      if (markerType && coords) {
        return {
          type: "marker",
          markerType,
          position: coords,
          gridRef,
          raw,
        };
      }
    }

    return { type: "unknown", raw };
  }

  // Command: /goto gridRef
  // Example: /goto M18, /g K12
  if (raw.startsWith("/goto ") || raw.startsWith("/g ")) {
    const gridRef = raw.replace(/^\/(goto|g)\s+/, "").trim().toUpperCase();
    const coords = gridToCoordinates(gridRef, mapSize);

    if (coords) {
      return {
        type: "goto",
        position: coords,
        gridRef,
        raw,
      };
    }

    return { type: "unknown", raw };
  }

  // Quick grid reference: M18, M18+3, M18-2+1
  // This adds an ENEMY marker at the grid position
  const quickGridMatch = raw.match(/^([A-Za-z])(\d{1,2})(([+-]\d+)+)?$/);
  if (quickGridMatch) {
    const gridRef = `${quickGridMatch[1].toUpperCase()}${quickGridMatch[2]}`;
    const offsetStr = quickGridMatch[3] || "";
    const coords = gridToCoordinates(gridRef, mapSize);

    if (coords) {
      const offset = parseOffset(offsetStr);
      const cellSize = mapSize / GRID_SIZE;

      return {
        type: "marker",
        markerType: "ENEMY",
        position: {
          x: coords.x + offset.x * cellSize,
          y: coords.y + offset.y * cellSize,
        },
        gridRef,
        offset: offset.x !== 0 || offset.y !== 0 ? offset : undefined,
        raw,
      };
    }
  }

  return { type: "unknown", raw };
}

// Get command suggestions based on partial input
export function getCommandSuggestions(input: string): string[] {
  const suggestions: string[] = [];
  const lowerInput = input.toLowerCase().trim();

  if (!lowerInput) {
    return [
      "/enemy <name> [grid]",
      "/marker <type> <grid>",
      "/goto <grid>",
      "M18 (quick enemy marker)",
    ];
  }

  // Suggest slash commands
  if (lowerInput.startsWith("/")) {
    if ("/enemy".startsWith(lowerInput)) {
      suggestions.push("/enemy <name> [grid] - Add enemy marker");
    }
    if ("/marker".startsWith(lowerInput)) {
      suggestions.push("/marker <type> <grid> - Add marker");
    }
    if ("/goto".startsWith(lowerInput)) {
      suggestions.push("/goto <grid> - Go to grid position");
    }
  }

  // Suggest marker types for /marker command
  if (lowerInput.startsWith("/marker ") || lowerInput.startsWith("/m ")) {
    const typesPart = lowerInput.replace(/^\/(marker|m)\s+/, "");
    if (!typesPart.includes(" ")) {
      const types = ["enemy", "base", "loot", "monument", "danger", "note", "raid"];
      for (const t of types) {
        if (t.startsWith(typesPart)) {
          suggestions.push(`/marker ${t} <grid>`);
        }
      }
    }
  }

  // Suggest grid refs (just show format hint)
  if (/^[a-z]$/i.test(lowerInput)) {
    suggestions.push(`${lowerInput.toUpperCase()}0-${lowerInput.toUpperCase()}25 (grid rows)`);
  }

  return suggestions.slice(0, 5);
}

// List of monument names for autocomplete
export const MONUMENT_NAMES = [
  "Lighthouse",
  "Supermarket",
  "Gas Station",
  "Mining Outpost",
  "Oxum's Gas Station",
  "Harbor",
  "Satellite Dish",
  "Sewer Branch",
  "Junkyard",
  "Abandoned Cabins",
  "Train Yard",
  "Water Treatment",
  "Power Plant",
  "Airfield",
  "Dome",
  "Excavator",
  "Giant Excavator",
  "Launch Site",
  "Military Tunnels",
  "Oil Rig Small",
  "Oil Rig Large",
  "Underwater Labs",
  "Arctic Research Base",
  "Outpost",
  "Bandit Camp",
];

// Get monument suggestions based on partial input
export function getMonumentSuggestions(input: string): string[] {
  const lowerInput = input.toLowerCase().trim();
  if (!lowerInput) return [];

  return MONUMENT_NAMES
    .filter((name) => name.toLowerCase().includes(lowerInput))
    .slice(0, 5);
}
