// =============================================================================
// GAME DATA LOADER
// Laadt en valideert game data van RustClash wiki
// =============================================================================

import type {
  RaidCostsData,
  RaidCostEntry,
  ExplosiveType,
  DataStatus,
} from '@/types/game-data';

// Import JSON data
import raidCostsJson from '@/data/raid-costs.json';

// -----------------------------------------------------------------------------
// RAID COSTS
// -----------------------------------------------------------------------------

/**
 * Laadt alle raid costs data
 */
export function getRaidCostsData(): RaidCostsData {
  return raidCostsJson as unknown as RaidCostsData;
}

/**
 * Zoek raid cost voor een specifiek target
 */
export function getRaidCostById(id: string): RaidCostEntry | undefined {
  const data = getRaidCostsData();

  // Zoek in alle categorieën
  return (
    data.buildings.find((b) => b.id === id) ||
    data.doors.find((d) => d.id === id) ||
    data.deployables.find((d) => d.id === id)
  );
}

/**
 * Haal alle raid costs voor een specifiek type
 */
export function getRaidCostsByType(
  type: 'building' | 'door' | 'deployable'
): RaidCostEntry[] {
  const data = getRaidCostsData();

  switch (type) {
    case 'building':
      return data.buildings;
    case 'door':
      return data.doors;
    case 'deployable':
      return data.deployables;
    default:
      return [];
  }
}

/**
 * Haal sulfur cost per explosive type
 */
export function getSulfurPerExplosive(type: ExplosiveType): number | null {
  const data = getRaidCostsData();
  return data.explosive_sulfur_costs[type] ?? null;
}

/**
 * Bereken totale sulfur cost voor een raid
 */
export function calculateSulfurCost(
  explosiveType: ExplosiveType,
  quantity: number
): number | null {
  const sulfurPer = getSulfurPerExplosive(explosiveType);
  if (sulfurPer === null) return null;
  return sulfurPer * quantity;
}

// -----------------------------------------------------------------------------
// DATA STATUS HELPERS
// -----------------------------------------------------------------------------

/**
 * Check of een entry volledig is ingevuld
 */
export function isEntryComplete(entry: RaidCostEntry): boolean {
  return (
    entry.hp !== null &&
    entry.rockets.quantity !== null &&
    entry.c4.quantity !== null &&
    entry.satchels.quantity !== null &&
    entry.explosive_ammo.quantity !== null
  );
}

/**
 * Haal alle entries die nog ingevuld moeten worden
 */
export function getPendingEntries(): RaidCostEntry[] {
  const data = getRaidCostsData();
  const allEntries = [
    ...data.buildings,
    ...data.doors,
    ...data.deployables,
  ];

  return allEntries.filter(
    (entry) => entry.meta.status !== 'verified'
  );
}

/**
 * Telt het aantal entries per status
 */
export function getDataStatusCounts(): Record<DataStatus, number> {
  const data = getRaidCostsData();
  const allEntries = [
    ...data.buildings,
    ...data.doors,
    ...data.deployables,
  ];

  const counts: Record<DataStatus, number> = {
    pending_manual_fill: 0,
    pending_browser_extract: 0,
    verified: 0,
  };

  allEntries.forEach((entry) => {
    counts[entry.meta.status]++;
  });

  return counts;
}

// -----------------------------------------------------------------------------
// SEARCH & FILTER
// -----------------------------------------------------------------------------

/**
 * Zoek raid targets op naam (case insensitive)
 */
export function searchRaidTargets(query: string): RaidCostEntry[] {
  const data = getRaidCostsData();
  const allEntries = [
    ...data.buildings,
    ...data.doors,
    ...data.deployables,
  ];

  const lowerQuery = query.toLowerCase();

  return allEntries.filter((entry) =>
    entry.target_name.toLowerCase().includes(lowerQuery)
  );
}

/**
 * Sorteer raid targets op goedkoopste sulfur cost
 */
export function sortByCheapestRaid(entries: RaidCostEntry[]): RaidCostEntry[] {
  return [...entries].sort((a, b) => {
    // Entries zonder data komen achteraan
    if (a.cheapest_sulfur === null) return 1;
    if (b.cheapest_sulfur === null) return -1;
    return a.cheapest_sulfur - b.cheapest_sulfur;
  });
}
