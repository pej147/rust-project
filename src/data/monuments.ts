// Monument Data for Rust Console Wiki
// Contains all monument information including puzzles, loot, and tips

export type MonumentTier = "safe" | "tier1" | "tier2" | "tier3";

export interface Monument {
  id: string;
  name: string;
  description: string;
  tier: MonumentTier;
  image?: string;
  // Danger levels
  radiation: "none" | "low" | "medium" | "high";
  scientists: boolean;
  // Puzzle info
  puzzle?: {
    keycard: "green" | "blue" | "red";
    fuses: number;
    steps: string[];
  };
  // Loot
  loot: {
    barrels: boolean;
    crates: ("basic" | "military" | "elite" | "food" | "medical" | "tool")[];
    specialLoot?: string[];
  };
  // Utilities
  features: {
    recycler: boolean;
    repairBench: boolean;
    researchTable: boolean;
    workbench?: number; // 1, 2, or 3
    refinery: boolean;
    vendingMachines: boolean;
  };
  // Map presence
  spawnInfo: string;
  // Tips
  tips: string[];
}

export const monuments: Monument[] = [
  // ============================================
  // TIER 1 - GREEN CARD MONUMENTS
  // ============================================
  {
    id: "lighthouse",
    name: "Lighthouse",
    description: "A tall lighthouse on the coast. Good early-game monument with basic loot and a recycler. No puzzle required.",
    tier: "tier1",
    radiation: "none",
    scientists: false,
    loot: {
      barrels: true,
      crates: ["basic", "food"],
      specialLoot: ["Green Keycard spawn on top floor"],
    },
    features: {
      recycler: true,
      repairBench: false,
      researchTable: false,
      refinery: false,
      vendingMachines: false,
    },
    spawnInfo: "1-2 per map, always on coastline",
    tips: [
      "Green keycard spawns on desk at the top",
      "Great first stop for recycling early game",
      "Low traffic - good for solos",
      "Barrels spawn along the road nearby",
    ],
  },
  {
    id: "supermarket",
    name: "Supermarket",
    description: "An abandoned supermarket with food crates and a recycler. Safe and easy to loot with no radiation or scientists.",
    tier: "tier1",
    radiation: "none",
    scientists: false,
    loot: {
      barrels: true,
      crates: ["basic", "food"],
    },
    features: {
      recycler: true,
      repairBench: false,
      researchTable: false,
      refinery: false,
      vendingMachines: false,
    },
    spawnInfo: "1-3 per map",
    tips: [
      "Great for early food and components",
      "Recycler inside - relatively safe",
      "Check shelves for food items",
      "Low-tier but consistent loot",
    ],
  },
  {
    id: "gas_station",
    name: "Gas Station",
    description: "A small roadside gas station with basic loot and a recycler. Quick pit stop for early game players.",
    tier: "tier1",
    radiation: "none",
    scientists: false,
    loot: {
      barrels: true,
      crates: ["basic", "food"],
    },
    features: {
      recycler: true,
      repairBench: false,
      researchTable: false,
      refinery: false,
      vendingMachines: false,
    },
    spawnInfo: "Multiple per map, along roads",
    tips: [
      "Quick recycler access",
      "Low loot but safe",
      "Good road barrel farming nearby",
      "Often overlooked - less competition",
    ],
  },
  {
    id: "oxums_gas_station",
    name: "Oxum's Gas Station",
    description: "A larger gas station variant with more loot spawns than the regular gas station. Features a small shop area.",
    tier: "tier1",
    radiation: "none",
    scientists: false,
    loot: {
      barrels: true,
      crates: ["basic", "food", "tool"],
    },
    features: {
      recycler: true,
      repairBench: false,
      researchTable: false,
      refinery: false,
      vendingMachines: false,
    },
    spawnInfo: "1-2 per map",
    tips: [
      "Better loot than regular gas station",
      "Check the shop shelves",
      "Sometimes has tool crates",
      "Recycler behind the counter",
    ],
  },
  {
    id: "mining_outpost",
    name: "Mining Outpost",
    description: "A small mining facility with industrial equipment. Good source of components and has a recycler.",
    tier: "tier1",
    radiation: "none",
    scientists: false,
    loot: {
      barrels: true,
      crates: ["basic", "tool"],
    },
    features: {
      recycler: true,
      repairBench: false,
      researchTable: false,
      refinery: false,
      vendingMachines: false,
    },
    spawnInfo: "1-2 per map",
    tips: [
      "Good for early tool crates",
      "Components spawn frequently",
      "Safe recycling spot",
      "Often has metal ore nearby",
    ],
  },
  {
    id: "junkyard",
    name: "Junkyard",
    description: "A large scrapyard filled with barrels, crates, and vehicle spawns. Great for components but spread out.",
    tier: "tier1",
    radiation: "none",
    scientists: false,
    loot: {
      barrels: true,
      crates: ["basic", "tool", "military"],
      specialLoot: ["Vehicle parts", "Components galore"],
    },
    features: {
      recycler: true,
      repairBench: true,
      researchTable: false,
      refinery: false,
      vendingMachines: false,
    },
    spawnInfo: "1 per map",
    tips: [
      "Best component farming early game",
      "Lots of barrels everywhere",
      "Magnetic crane has good loot",
      "Can take a while to fully loot",
    ],
  },
  {
    id: "harbor",
    name: "Harbor",
    description: "A large shipping harbor with warehouses and containers. Two variants exist: small and large harbor.",
    tier: "tier1",
    radiation: "low",
    scientists: false,
    puzzle: {
      keycard: "green",
      fuses: 1,
      steps: [
        "Find the fuse box inside the main building",
        "Insert 1 Electric Fuse",
        "Swipe Green Keycard at the door",
        "Loot the room with military crates",
      ],
    },
    loot: {
      barrels: true,
      crates: ["basic", "military", "food"],
      specialLoot: ["Military crates in puzzle room"],
    },
    features: {
      recycler: true,
      repairBench: true,
      researchTable: false,
      refinery: false,
      vendingMachines: false,
    },
    spawnInfo: "1-2 per map, always on coastline",
    tips: [
      "Green card puzzle has 2-3 military crates",
      "Large harbor has more loot than small",
      "Check all the containers",
      "Diving gear can spawn here",
    ],
  },
  {
    id: "satellite_dish",
    name: "Satellite Dish",
    description: "A satellite array facility with a green card puzzle. Good mid-tier loot with moderate radiation.",
    tier: "tier1",
    radiation: "low",
    scientists: false,
    puzzle: {
      keycard: "green",
      fuses: 1,
      steps: [
        "Go to the building with the fuse box",
        "Insert 1 Electric Fuse",
        "Swipe Green Keycard",
        "Loot the room - contains Blue Keycard!",
      ],
    },
    loot: {
      barrels: true,
      crates: ["basic", "military"],
      specialLoot: ["Blue Keycard spawns in puzzle room"],
    },
    features: {
      recycler: true,
      repairBench: false,
      researchTable: false,
      refinery: false,
      vendingMachines: false,
    },
    spawnInfo: "1 per map",
    tips: [
      "Blue keycard spawns in puzzle room!",
      "Essential for progressing to T2 monuments",
      "Bring rad protection (low rads)",
      "Quick puzzle - good for keycard runs",
    ],
  },
  {
    id: "sewer_branch",
    name: "Sewer Branch",
    description: "Underground sewer tunnels with a green card puzzle. Dark and cramped but has good loot.",
    tier: "tier1",
    radiation: "low",
    scientists: false,
    puzzle: {
      keycard: "green",
      fuses: 1,
      steps: [
        "Enter through the surface building",
        "Navigate down into the sewers",
        "Find the fuse box and insert fuse",
        "Swipe Green Keycard at the door",
      ],
    },
    loot: {
      barrels: true,
      crates: ["basic", "military"],
      specialLoot: ["Blue Keycard can spawn here"],
    },
    features: {
      recycler: true,
      repairBench: false,
      researchTable: false,
      refinery: false,
      vendingMachines: false,
    },
    spawnInfo: "1 per map",
    tips: [
      "Bring a flashlight or torch",
      "Blue keycard can spawn in puzzle room",
      "Easy to get lost - learn the layout",
      "Good for avoiding other players",
    ],
  },
  {
    id: "warehouse",
    name: "Warehouse",
    description: "A small industrial warehouse with basic crates. Simple and quick to loot.",
    tier: "tier1",
    radiation: "none",
    scientists: false,
    loot: {
      barrels: true,
      crates: ["basic"],
    },
    features: {
      recycler: false,
      repairBench: false,
      researchTable: false,
      refinery: false,
      vendingMachines: false,
    },
    spawnInfo: "Multiple per map",
    tips: [
      "Very basic loot",
      "Quick to clear",
      "Good for early game barrels",
      "No recycler - bring loot elsewhere",
    ],
  },

  // ============================================
  // TIER 2 - BLUE CARD MONUMENTS
  // ============================================
  {
    id: "trainyard",
    name: "Train Yard",
    description: "A large railway facility with multiple buildings and a blue card puzzle. Good loot but high traffic area.",
    tier: "tier2",
    radiation: "medium",
    scientists: false,
    puzzle: {
      keycard: "blue",
      fuses: 1,
      steps: [
        "Go to the main building with the fuse box",
        "Insert 1 Electric Fuse",
        "Flip the switch to power the area",
        "Go to the tall tower building",
        "Swipe Blue Keycard at the door",
        "Climb up and loot - Red Keycard spawns here!",
      ],
    },
    loot: {
      barrels: true,
      crates: ["basic", "military", "elite"],
      specialLoot: ["Red Keycard in puzzle room", "Elite crate at top"],
    },
    features: {
      recycler: true,
      repairBench: true,
      researchTable: false,
      workbench: 1,
      refinery: true,
      vendingMachines: false,
    },
    spawnInfo: "1 per map",
    tips: [
      "Red keycard spawns in the blue card room!",
      "Elite crate at the very top of the tower",
      "High PvP area - be careful",
      "Multiple military crates throughout",
      "Oil refinery available here",
    ],
  },
  {
    id: "water_treatment",
    name: "Water Treatment Plant",
    description: "A large water treatment facility with multiple puzzles and excellent loot. One of the best T2 monuments.",
    tier: "tier2",
    radiation: "medium",
    scientists: false,
    puzzle: {
      keycard: "blue",
      fuses: 2,
      steps: [
        "Find the first fuse box near the entrance building",
        "Insert fuse and flip switch",
        "Go to the main puzzle building",
        "Insert second fuse in that building",
        "Swipe Blue Keycard at the door",
        "Navigate through to reach the loot room",
      ],
    },
    loot: {
      barrels: true,
      crates: ["basic", "military", "elite"],
      specialLoot: ["Red Keycard spawn", "Multiple elite crates"],
    },
    features: {
      recycler: true,
      repairBench: true,
      researchTable: false,
      workbench: 2,
      refinery: false,
      vendingMachines: false,
    },
    spawnInfo: "1 per map",
    tips: [
      "One of the best monuments for loot",
      "Red keycard spawns in puzzle room",
      "Requires 2 fuses total",
      "Level 2 workbench available",
      "Learn the puzzle route - it's worth it",
    ],
  },
  {
    id: "power_plant",
    name: "Power Plant",
    description: "A massive power generation facility with a complex blue card puzzle. High radiation but excellent rewards.",
    tier: "tier2",
    radiation: "high",
    scientists: false,
    puzzle: {
      keycard: "blue",
      fuses: 2,
      steps: [
        "Go to the first building and insert fuse",
        "Flip the switch to start power",
        "Navigate to the main building",
        "Insert second fuse",
        "Swipe Blue Keycard",
        "Follow the path through multiple rooms",
        "Red Keycard at the end!",
      ],
    },
    loot: {
      barrels: true,
      crates: ["basic", "military", "elite"],
      specialLoot: ["Red Keycard", "Multiple elite crates", "Lots of military crates"],
    },
    features: {
      recycler: true,
      repairBench: true,
      researchTable: false,
      workbench: 2,
      refinery: false,
      vendingMachines: false,
    },
    spawnInfo: "1 per map",
    tips: [
      "HIGH radiation - bring hazmat or rad tea!",
      "Complex puzzle but very rewarding",
      "Red keycard spawns at the end",
      "Multiple elite crates in puzzle",
      "Level 2 workbench inside",
    ],
  },
  {
    id: "airfield",
    name: "Airfield",
    description: "A large military airfield with hangars, a control tower, and a blue card puzzle. Very high traffic monument.",
    tier: "tier2",
    radiation: "low",
    scientists: true,
    puzzle: {
      keycard: "blue",
      fuses: 1,
      steps: [
        "Go to the main hangar building",
        "Find the fuse box and insert fuse",
        "Head to the office building",
        "Swipe Blue Keycard at the door",
        "Loot the room - has military crates",
      ],
    },
    loot: {
      barrels: true,
      crates: ["basic", "military", "elite"],
      specialLoot: ["Elite crate on top of buildings", "Military crates in hangars"],
    },
    features: {
      recycler: true,
      repairBench: true,
      researchTable: false,
      workbench: 1,
      refinery: true,
      vendingMachines: false,
    },
    spawnInfo: "1 per map",
    tips: [
      "Scientists patrol the area!",
      "Elite crate spawns on top of hangars",
      "Very popular - expect PvP",
      "Lots of military crates in hangars",
      "Oil refinery available",
    ],
  },
  {
    id: "dome",
    name: "The Dome",
    description: "A large spherical structure that must be climbed for loot. No puzzle but requires parkour skills.",
    tier: "tier2",
    radiation: "low",
    scientists: false,
    loot: {
      barrels: true,
      crates: ["basic", "military", "elite"],
      specialLoot: ["Elite crates at the very top", "Military crates on platforms"],
    },
    features: {
      recycler: true,
      repairBench: false,
      researchTable: false,
      refinery: false,
      vendingMachines: false,
    },
    spawnInfo: "1 per map",
    tips: [
      "No keycard needed - just climb!",
      "Elite crates spawn at the top",
      "Learn the climbing route",
      "Very exposed while climbing",
      "Fall damage is real - be careful",
    ],
  },
  {
    id: "arctic_research_base",
    name: "Arctic Research Base",
    description: "A research facility in the snow biome with good loot and a blue card puzzle. Cold damage is a factor.",
    tier: "tier2",
    radiation: "low",
    scientists: true,
    puzzle: {
      keycard: "blue",
      fuses: 1,
      steps: [
        "Find the building with the fuse box",
        "Insert Electric Fuse",
        "Swipe Blue Keycard at the locked door",
        "Loot the military and elite crates inside",
      ],
    },
    loot: {
      barrels: true,
      crates: ["basic", "military", "elite"],
      specialLoot: ["Elite crate in puzzle room"],
    },
    features: {
      recycler: true,
      repairBench: true,
      researchTable: false,
      workbench: 1,
      refinery: false,
      vendingMachines: false,
    },
    spawnInfo: "1 per map, always in snow biome",
    tips: [
      "Bring cold protection!",
      "Scientists patrol here",
      "Less contested due to location",
      "Good alternative to crowded monuments",
    ],
  },
  {
    id: "excavator",
    name: "Giant Excavator Pit",
    description: "A massive mining excavator that can be activated to produce resources. Unique monument with special mechanics.",
    tier: "tier2",
    radiation: "none",
    scientists: false,
    loot: {
      barrels: true,
      crates: ["basic", "military"],
      specialLoot: ["Diesel fuel barrels", "Can produce HQM, Sulfur, Stone, Metal"],
    },
    features: {
      recycler: true,
      repairBench: true,
      researchTable: false,
      workbench: 1,
      refinery: false,
      vendingMachines: false,
    },
    spawnInfo: "1 per map",
    tips: [
      "Can be activated with Diesel Fuel!",
      "Produces resources over time",
      "Very loud when running - attracts attention",
      "Engine room has the controls",
      "Great for clans needing bulk resources",
    ],
  },
];

// Helper functions
export function getMonumentsByTier(tier: MonumentTier): Monument[] {
  return monuments.filter(m => m.tier === tier);
}

export function getMonumentById(id: string): Monument | undefined {
  return monuments.find(m => m.id === id);
}

// Tier metadata
export const monumentTiers: Record<MonumentTier, { name: string; color: string; description: string }> = {
  safe: {
    name: "Safe Zone",
    color: "text-green-400",
    description: "No PvP allowed, trading and recycling",
  },
  tier1: {
    name: "Tier 1 (Green)",
    color: "text-green-500",
    description: "Low difficulty, green keycard puzzles",
  },
  tier2: {
    name: "Tier 2 (Blue)",
    color: "text-blue-500",
    description: "Medium difficulty, blue keycard puzzles",
  },
  tier3: {
    name: "Tier 3 (Red)",
    color: "text-red-500",
    description: "High difficulty, red keycard puzzles",
  },
};
