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

  // ============================================
  // TIER 3 - RED CARD MONUMENTS
  // ============================================
  {
    id: "launch_site",
    name: "Launch Site",
    description: "The largest and most dangerous monument in Rust. Features a massive rocket, heavy scientist presence, and the best loot in the game. Red card puzzle leads to elite crates.",
    tier: "tier3",
    radiation: "high",
    scientists: true,
    puzzle: {
      keycard: "red",
      fuses: 2,
      steps: [
        "Enter from the main gate or side entrances",
        "Navigate to the main building (beware scientists!)",
        "Find the first fuse box and insert fuse",
        "Go to the second building and insert second fuse",
        "Swipe Red Keycard at the locked door",
        "Navigate through the building to reach elite crates",
        "Exit carefully - scientists respawn!",
      ],
    },
    loot: {
      barrels: true,
      crates: ["basic", "military", "elite"],
      specialLoot: [
        "Multiple elite crates in puzzle room",
        "Bradley APC spawns here",
        "Best loot density in the game",
      ],
    },
    features: {
      recycler: true,
      repairBench: true,
      researchTable: true,
      workbench: 3,
      refinery: true,
      vendingMachines: false,
    },
    spawnInfo: "1 per map",
    tips: [
      "BRING HAZMAT - very high radiation!",
      "Scientists are heavily armed - bring good weapons",
      "Bradley APC patrols the area - avoid or destroy",
      "Level 3 workbench available inside",
      "Best monument for end-game loot",
      "Very high PvP traffic - expect fights",
    ],
  },
  {
    id: "military_tunnels",
    name: "Military Tunnels",
    description: "Underground military bunker with a red card puzzle. Very dark, tight corridors, and heavy scientist presence. Excellent loot but extremely dangerous.",
    tier: "tier3",
    radiation: "medium",
    scientists: true,
    puzzle: {
      keycard: "red",
      fuses: 1,
      steps: [
        "Enter through the main tunnel entrance",
        "Navigate through dark corridors (bring flashlight!)",
        "Fight through scientists to reach the fuse room",
        "Insert Electric Fuse",
        "Swipe Red Keycard at the door",
        "Loot the elite crate room",
        "Exit carefully through the train tunnel",
      ],
    },
    loot: {
      barrels: true,
      crates: ["military", "elite"],
      specialLoot: [
        "Multiple elite crates",
        "Elite crate at end of train tunnel",
        "Military crates throughout",
      ],
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
      "BRING A FLASHLIGHT - it's very dark!",
      "Scientists are in tight corridors - dangerous",
      "Learn the layout before attempting puzzle",
      "Train tunnel exit has an elite crate",
      "Can camp entrance easily - be careful",
      "Radiation is medium - hazmat recommended",
    ],
  },
  {
    id: "small_oil_rig",
    name: "Small Oil Rig",
    description: "An offshore oil platform with heavy scientist presence. No keycard needed but must clear all scientists to access locked crate. Accessible only by boat or helicopter.",
    tier: "tier3",
    radiation: "none",
    scientists: true,
    loot: {
      barrels: true,
      crates: ["military", "elite"],
      specialLoot: [
        "Locked crate (15 min timer after clearing)",
        "Multiple elite crates",
        "Crude oil for refineries",
      ],
    },
    features: {
      recycler: true,
      repairBench: false,
      researchTable: false,
      refinery: false,
      vendingMachines: false,
    },
    spawnInfo: "1-2 per map, offshore",
    tips: [
      "Need boat or minicopter to reach",
      "Kill all scientists to trigger locked crate",
      "Locked crate takes 15 minutes to unlock",
      "Counter-raids are common - defend your crate!",
      "Bring meds - scientists deal heavy damage",
      "No radiation but heavy combat",
    ],
  },
  {
    id: "large_oil_rig",
    name: "Large Oil Rig",
    description: "The larger offshore oil platform with even more scientists and better loot. Heavy Scientist spawns make this extremely challenging. Best non-event loot in the game.",
    tier: "tier3",
    radiation: "none",
    scientists: true,
    loot: {
      barrels: true,
      crates: ["military", "elite"],
      specialLoot: [
        "Locked crate (15 min timer)",
        "Heavy Scientists with better loot",
        "Multiple elite crates",
        "Chinook crate event possible",
      ],
    },
    features: {
      recycler: true,
      repairBench: true,
      researchTable: false,
      refinery: false,
      vendingMachines: false,
    },
    spawnInfo: "1 per map, offshore",
    tips: [
      "HEAVY SCIENTISTS - bring the best gear!",
      "Heavy scientists have 400 HP and good weapons",
      "Locked crate has top-tier loot",
      "Teams often contest this monument",
      "Can take 30+ minutes to fully clear",
      "Bring lots of meds and ammo",
    ],
  },
  {
    id: "underwater_labs",
    name: "Underwater Labs",
    description: "Procedurally generated underwater research facilities. Multiple modules connected by moonpools. Scientists patrol inside. Requires diving equipment to access.",
    tier: "tier3",
    radiation: "none",
    scientists: true,
    puzzle: {
      keycard: "blue",
      fuses: 1,
      steps: [
        "Dive down to find a moonpool entrance",
        "Surface inside the lab module",
        "Navigate through connected modules",
        "Find the fuse box in one of the modules",
        "Insert fuse and swipe Blue Keycard",
        "Loot the secured room with elite crates",
      ],
    },
    loot: {
      barrels: false,
      crates: ["military", "elite"],
      specialLoot: [
        "Elite crates in puzzle rooms",
        "Tech trash and components",
        "Unique underwater loot tables",
      ],
    },
    features: {
      recycler: false,
      repairBench: false,
      researchTable: false,
      refinery: false,
      vendingMachines: true,
    },
    spawnInfo: "Multiple per map, underwater",
    tips: [
      "Bring diving gear (tank + flippers)",
      "Layout is random - explore carefully",
      "Scientists inside are dangerous in tight spaces",
      "Vending machines sell diving equipment",
      "Multiple labs per map - find the closest one",
      "Good for avoiding land PvP",
    ],
  },

  // ============================================
  // SAFE ZONES
  // ============================================
  {
    id: "outpost",
    name: "Outpost",
    description: "A safe zone run by scientists where no PvP is allowed. Features shops, recyclers, and essential services. Great for new players and trading.",
    tier: "safe",
    radiation: "none",
    scientists: false,
    loot: {
      barrels: false,
      crates: [],
      specialLoot: ["Shops sell items for scrap", "Drone marketplace access"],
    },
    features: {
      recycler: true,
      repairBench: true,
      researchTable: true,
      workbench: 1,
      refinery: true,
      vendingMachines: true,
    },
    spawnInfo: "1 per map",
    tips: [
      "NO PVP - attacking players gets you killed by turrets",
      "Hostile timer if you recently killed someone",
      "Buy low grade fuel, clothes, and tools here",
      "Recycler is safe to use",
      "Research table available for 75 scrap",
      "Minicopter and boat spawns nearby",
    ],
  },
  {
    id: "bandit_camp",
    name: "Bandit Camp",
    description: "A safe zone in the swamp run by bandits. Features gambling, shops, and the only place to buy certain items. Air Wolf shop sells minicopters.",
    tier: "safe",
    radiation: "none",
    scientists: false,
    loot: {
      barrels: false,
      crates: [],
      specialLoot: [
        "Casino with gambling wheel",
        "Air Wolf sells minicopters (750 scrap)",
        "Unique shop items",
      ],
    },
    features: {
      recycler: true,
      repairBench: true,
      researchTable: true,
      workbench: 2,
      refinery: false,
      vendingMachines: true,
    },
    spawnInfo: "1 per map, in swamp biome",
    tips: [
      "NO PVP - bandits will kill you if you attack",
      "Gambling wheel can win/lose scrap fast",
      "ONLY place to buy minicopter (750 scrap)",
      "Level 2 workbench available",
      "Always in swamp - dress warmly",
      "Great for selling excess items",
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
