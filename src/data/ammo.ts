// Ammo Data for Rust Console Wiki
// All ammunition types with crafting info and stats

export type AmmoCategory = "pistol" | "rifle" | "shotgun" | "rocket" | "throwable" | "explosive";

export interface Ammo {
  id: string;
  name: string;
  description: string;
  category: AmmoCategory;
  subcategory?: string;
  image?: string;
  // Stats
  damage?: number;
  velocity?: number;
  bleedChance?: number;
  // Special effects
  effects?: string[];
  // Crafting
  crafting: {
    ingredients: { item: string; amount: number }[];
    output: number;
    time: number;
    workbench: number;
    blueprint: boolean;
  };
  // Usage
  usedBy: string[];
  // Tips
  tips: string[];
}

export const ammo: Ammo[] = [
  // ============================================
  // PISTOL AMMO
  // ============================================
  {
    id: "pistol_bullet",
    name: "Pistol Bullet",
    description: "Standard ammunition for pistols and SMGs. Cheap to craft and widely used in early-mid game.",
    category: "pistol",
    subcategory: "standard",
    damage: 1,
    velocity: 300,
    crafting: {
      ingredients: [
        { item: "Metal Fragments", amount: 10 },
        { item: "Gun Powder", amount: 5 },
      ],
      output: 4,
      time: 3,
      workbench: 1,
      blueprint: false,
    },
    usedBy: ["Revolver", "Semi-Auto Pistol", "Python", "M92", "Custom SMG", "Thompson", "MP5A4"],
    tips: [
      "Cheapest gun ammo to craft",
      "4 bullets per craft",
      "Used by all pistols and SMGs",
      "Good for practicing aim",
    ],
  },
  {
    id: "hv_pistol_ammo",
    name: "HV Pistol Ammo",
    description: "High velocity pistol rounds with faster travel time. Easier to hit moving targets.",
    category: "pistol",
    subcategory: "special",
    damage: 1,
    velocity: 400,
    crafting: {
      ingredients: [
        { item: "Metal Fragments", amount: 15 },
        { item: "Gun Powder", amount: 10 },
      ],
      output: 4,
      time: 3,
      workbench: 2,
      blueprint: true,
    },
    usedBy: ["Revolver", "Semi-Auto Pistol", "Python", "M92", "Custom SMG", "Thompson", "MP5A4"],
    tips: [
      "33% faster bullet velocity",
      "Easier to hit moving targets",
      "Slightly more expensive",
      "Good for longer range pistol fights",
    ],
  },
  {
    id: "incendiary_pistol_bullet",
    name: "Incendiary Pistol Bullet",
    description: "Pistol rounds that set targets on fire. Deals burn damage over time.",
    category: "pistol",
    subcategory: "special",
    damage: 1,
    effects: ["Fire damage", "Burn DoT"],
    crafting: {
      ingredients: [
        { item: "Metal Fragments", amount: 10 },
        { item: "Gun Powder", amount: 5 },
        { item: "Sulfur", amount: 5 },
      ],
      output: 4,
      time: 3,
      workbench: 2,
      blueprint: true,
    },
    usedBy: ["Revolver", "Semi-Auto Pistol", "Python", "M92", "Custom SMG", "Thompson", "MP5A4"],
    tips: [
      "Sets targets on fire",
      "Burn damage over time",
      "Good for flushing out enemies",
      "Can ignite wooden structures",
    ],
  },

  // ============================================
  // RIFLE AMMO
  // ============================================
  {
    id: "556_rifle_ammo",
    name: "5.56 Rifle Ammo",
    description: "Standard rifle ammunition. Used by all rifles in the game. Essential for mid-late game.",
    category: "rifle",
    subcategory: "standard",
    damage: 1,
    velocity: 375,
    crafting: {
      ingredients: [
        { item: "Metal Fragments", amount: 10 },
        { item: "Gun Powder", amount: 5 },
      ],
      output: 2,
      time: 3,
      workbench: 2,
      blueprint: false,
    },
    usedBy: ["Semi-Auto Rifle", "AK-47", "LR-300", "Bolt Action Rifle", "L96", "M39"],
    tips: [
      "Standard rifle ammo",
      "Only 2 per craft (expensive)",
      "Used by all rifles",
      "Stock up before fights",
    ],
  },
  {
    id: "hv_556_ammo",
    name: "HV 5.56 Rifle Ammo",
    description: "High velocity rifle rounds. Faster bullet travel makes hitting targets easier at range.",
    category: "rifle",
    subcategory: "special",
    damage: 1,
    velocity: 500,
    crafting: {
      ingredients: [
        { item: "Metal Fragments", amount: 15 },
        { item: "Gun Powder", amount: 10 },
      ],
      output: 2,
      time: 3,
      workbench: 2,
      blueprint: true,
    },
    usedBy: ["Semi-Auto Rifle", "AK-47", "LR-300", "Bolt Action Rifle", "L96", "M39"],
    tips: [
      "33% faster velocity",
      "Great for sniping",
      "Less bullet drop",
      "Worth it for Bolty/L96",
    ],
  },
  {
    id: "incendiary_556_ammo",
    name: "Incendiary 5.56 Rifle Ammo",
    description: "Rifle rounds that ignite targets. Sets players and structures on fire.",
    category: "rifle",
    subcategory: "special",
    damage: 1,
    effects: ["Fire damage", "Burn DoT", "Ignites wood"],
    crafting: {
      ingredients: [
        { item: "Metal Fragments", amount: 10 },
        { item: "Gun Powder", amount: 5 },
        { item: "Sulfur", amount: 5 },
      ],
      output: 2,
      time: 3,
      workbench: 2,
      blueprint: true,
    },
    usedBy: ["Semi-Auto Rifle", "AK-47", "LR-300", "Bolt Action Rifle", "L96", "M39"],
    tips: [
      "Burns targets",
      "Can destroy wooden structures",
      "Good for eco raiding",
      "Shows tracer at night",
    ],
  },
  {
    id: "explosive_556_ammo",
    name: "Explosive 5.56 Rifle Ammo",
    description: "Rifle rounds that explode on impact. Can be used for raiding and dealing splash damage.",
    category: "rifle",
    subcategory: "explosive",
    damage: 3,
    effects: ["Explosion on impact", "Splash damage", "Structure damage"],
    crafting: {
      ingredients: [
        { item: "Metal Fragments", amount: 10 },
        { item: "Gun Powder", amount: 20 },
        { item: "Sulfur", amount: 10 },
      ],
      output: 2,
      time: 5,
      workbench: 3,
      blueprint: true,
    },
    usedBy: ["Semi-Auto Rifle", "AK-47", "LR-300", "Bolt Action Rifle", "L96", "M39"],
    tips: [
      "Explodes on impact",
      "Can raid with enough ammo",
      "Expensive but versatile",
      "Good for door raiding",
      "200 for sheet metal door",
    ],
  },

  // ============================================
  // SHOTGUN AMMO
  // ============================================
  {
    id: "handmade_shell",
    name: "Handmade Shell",
    description: "Crude shotgun shells made from basic materials. Lower damage than proper shells but very cheap.",
    category: "shotgun",
    subcategory: "primitive",
    damage: 0.8,
    crafting: {
      ingredients: [
        { item: "Stone", amount: 5 },
        { item: "Gun Powder", amount: 5 },
      ],
      output: 2,
      time: 2,
      workbench: 0,
      blueprint: false,
    },
    usedBy: ["Eoka Pistol", "Waterpipe Shotgun", "Double Barrel", "Pump Shotgun", "Spas-12"],
    tips: [
      "Cheapest shotgun ammo",
      "No workbench needed",
      "Lower damage than buckshot",
      "Good for early game",
    ],
  },
  {
    id: "12_gauge_buckshot",
    name: "12 Gauge Buckshot",
    description: "Standard shotgun shells firing multiple pellets. Devastating at close range.",
    category: "shotgun",
    subcategory: "standard",
    damage: 1,
    crafting: {
      ingredients: [
        { item: "Metal Fragments", amount: 5 },
        { item: "Gun Powder", amount: 10 },
      ],
      output: 2,
      time: 3,
      workbench: 1,
      blueprint: false,
    },
    usedBy: ["Waterpipe Shotgun", "Double Barrel", "Pump Shotgun", "Spas-12"],
    tips: [
      "Standard shotgun ammo",
      "Multiple pellets per shot",
      "Max damage up close",
      "Spread increases with distance",
    ],
  },
  {
    id: "12_gauge_slug",
    name: "12 Gauge Slug",
    description: "Single projectile shotgun shells. Much better range and accuracy than buckshot.",
    category: "shotgun",
    subcategory: "special",
    damage: 1,
    crafting: {
      ingredients: [
        { item: "Metal Fragments", amount: 10 },
        { item: "Gun Powder", amount: 10 },
      ],
      output: 2,
      time: 3,
      workbench: 1,
      blueprint: true,
    },
    usedBy: ["Waterpipe Shotgun", "Double Barrel", "Pump Shotgun", "Spas-12"],
    tips: [
      "Single projectile",
      "Much better range",
      "No spread - aim matters",
      "Turns shotgun into rifle",
    ],
  },
  {
    id: "12_gauge_incendiary",
    name: "12 Gauge Incendiary Shell",
    description: "Shotgun shells that ignite targets. Sets enemies and structures on fire.",
    category: "shotgun",
    subcategory: "special",
    damage: 0.9,
    effects: ["Fire damage", "Burn DoT"],
    crafting: {
      ingredients: [
        { item: "Metal Fragments", amount: 5 },
        { item: "Gun Powder", amount: 10 },
        { item: "Sulfur", amount: 5 },
      ],
      output: 2,
      time: 3,
      workbench: 2,
      blueprint: true,
    },
    usedBy: ["Waterpipe Shotgun", "Double Barrel", "Pump Shotgun", "Spas-12"],
    tips: [
      "Sets targets on fire",
      "Burns for extra damage",
      "Can ignite wood",
      "Visible tracer rounds",
    ],
  },

  // ============================================
  // ROCKETS
  // ============================================
  {
    id: "rocket",
    name: "Rocket",
    description: "Standard rocket for the Rocket Launcher. High damage to structures, the primary raiding tool.",
    category: "rocket",
    subcategory: "standard",
    damage: 350,
    effects: ["Explosion", "Splash damage", "Structure damage"],
    crafting: {
      ingredients: [
        { item: "Explosives", amount: 10 },
        { item: "Metal Pipe", amount: 2 },
        { item: "Gun Powder", amount: 150 },
      ],
      output: 1,
      time: 10,
      workbench: 3,
      blueprint: true,
    },
    usedBy: ["Rocket Launcher"],
    tips: [
      "Main raiding explosive",
      "4 rockets = stone wall",
      "2 rockets = sheet metal door",
      "Expensive but effective",
      "Can splash multiple walls",
    ],
  },
  {
    id: "hv_rocket",
    name: "High Velocity Rocket",
    description: "Fast-moving rocket with less splash damage. Better for direct hits on targets.",
    category: "rocket",
    subcategory: "special",
    damage: 175,
    velocity: 200,
    effects: ["Explosion", "Direct damage"],
    crafting: {
      ingredients: [
        { item: "Metal Pipe", amount: 1 },
        { item: "Gun Powder", amount: 100 },
      ],
      output: 1,
      time: 10,
      workbench: 2,
      blueprint: true,
    },
    usedBy: ["Rocket Launcher"],
    tips: [
      "Faster than regular rocket",
      "Less splash damage",
      "Cheaper to craft",
      "Good for PvP",
      "Not ideal for raiding",
    ],
  },
  {
    id: "incendiary_rocket",
    name: "Incendiary Rocket",
    description: "Rocket that spreads fire on impact. Creates a burning area that damages players and structures.",
    category: "rocket",
    subcategory: "special",
    damage: 200,
    effects: ["Explosion", "Fire spread", "Area denial", "Burn DoT"],
    crafting: {
      ingredients: [
        { item: "Explosives", amount: 10 },
        { item: "Metal Pipe", amount: 2 },
        { item: "Gun Powder", amount: 150 },
        { item: "Low Grade Fuel", amount: 250 },
      ],
      output: 1,
      time: 10,
      workbench: 3,
      blueprint: true,
    },
    usedBy: ["Rocket Launcher"],
    tips: [
      "Spreads fire on impact",
      "Good for wooden bases",
      "Area denial weapon",
      "Burns for long time",
      "Can destroy wood quickly",
    ],
  },

  // ============================================
  // THROWABLES
  // ============================================
  {
    id: "f1_grenade",
    name: "F1 Grenade",
    description: "Military fragmentation grenade. Cook it by holding before throwing for precise timing.",
    category: "throwable",
    subcategory: "military",
    damage: 100,
    effects: ["Explosion", "Shrapnel damage"],
    crafting: {
      ingredients: [
        { item: "Gun Powder", amount: 60 },
        { item: "Metal Fragments", amount: 40 },
      ],
      output: 1,
      time: 5,
      workbench: 2,
      blueprint: true,
    },
    usedBy: [],
    tips: [
      "Hold to cook the fuse",
      "3.5 second fuse time",
      "Can bounce off walls",
      "Good for clearing rooms",
      "Can damage yourself!",
    ],
  },
  {
    id: "beancan_grenade",
    name: "Beancan Grenade",
    description: "Homemade grenade with unpredictable fuse. Can be used for cheap raiding or combat.",
    category: "throwable",
    subcategory: "craftable",
    damage: 115,
    effects: ["Explosion", "Random fuse", "Can be dud"],
    crafting: {
      ingredients: [
        { item: "Gun Powder", amount: 60 },
        { item: "Metal Fragments", amount: 20 },
      ],
      output: 1,
      time: 5,
      workbench: 1,
      blueprint: true,
    },
    usedBy: [],
    tips: [
      "RANDOM fuse time!",
      "Can be a dud (re-throw)",
      "Can explode instantly",
      "Cheap raiding option",
      "4 for wooden door",
    ],
  },
  {
    id: "smoke_grenade",
    name: "Smoke Grenade",
    description: "Creates a smoke screen for cover. Useful for reviving teammates or escaping.",
    category: "throwable",
    subcategory: "utility",
    damage: 0,
    effects: ["Smoke screen", "Blocks vision"],
    crafting: {
      ingredients: [
        { item: "Gun Powder", amount: 10 },
        { item: "Metal Fragments", amount: 20 },
        { item: "Cloth", amount: 10 },
      ],
      output: 1,
      time: 3,
      workbench: 1,
      blueprint: false,
    },
    usedBy: [],
    tips: [
      "Creates smoke cover",
      "Good for reviving",
      "Useful for escaping",
      "Blocks enemy vision",
      "No damage",
    ],
  },
  {
    id: "flashbang",
    name: "Flashbang",
    description: "Blinds and deafens enemies temporarily. Essential for breaching occupied bases.",
    category: "throwable",
    subcategory: "utility",
    damage: 0,
    effects: ["Blind", "Deafen", "Disorient"],
    crafting: {
      ingredients: [
        { item: "Gun Powder", amount: 30 },
        { item: "Metal Fragments", amount: 20 },
        { item: "Cloth", amount: 5 },
      ],
      output: 1,
      time: 3,
      workbench: 2,
      blueprint: true,
    },
    usedBy: [],
    tips: [
      "Blinds enemies",
      "Also deafens",
      "Great for breaching",
      "Look away to avoid",
      "Can affect yourself",
    ],
  },

  // ============================================
  // EXPLOSIVES
  // ============================================
  {
    id: "c4",
    name: "Timed Explosive Charge (C4)",
    description: "The most efficient raiding explosive. Place on structures and run. 10 second timer.",
    category: "explosive",
    subcategory: "raiding",
    damage: 550,
    effects: ["Explosion", "Timed fuse", "Structure damage"],
    crafting: {
      ingredients: [
        { item: "Explosives", amount: 20 },
        { item: "Tech Trash", amount: 2 },
        { item: "Cloth", amount: 5 },
      ],
      output: 1,
      time: 15,
      workbench: 3,
      blueprint: true,
    },
    usedBy: [],
    tips: [
      "Best sulfur efficiency",
      "1 C4 = sheet metal door",
      "2 C4 = stone wall",
      "10 second timer",
      "Cannot be picked up",
    ],
  },
  {
    id: "satchel_charge",
    name: "Satchel Charge",
    description: "Homemade explosive with unreliable fuse. Cheaper than C4 but can malfunction.",
    category: "explosive",
    subcategory: "raiding",
    damage: 475,
    effects: ["Explosion", "Random fuse", "Can be dud", "Structure damage"],
    crafting: {
      ingredients: [
        { item: "Beancan Grenade", amount: 4 },
        { item: "Small Stash", amount: 1 },
        { item: "Rope", amount: 1 },
      ],
      output: 1,
      time: 10,
      workbench: 1,
      blueprint: true,
    },
    usedBy: [],
    tips: [
      "Can be a DUD",
      "Random fuse time",
      "Can be defused if dud",
      "4 for sheet metal door",
      "10 for stone wall",
    ],
  },
  {
    id: "explosives",
    name: "Explosives",
    description: "Crafting component for C4 and rockets. Made from sulfur and other materials.",
    category: "explosive",
    subcategory: "component",
    damage: 0,
    crafting: {
      ingredients: [
        { item: "Gun Powder", amount: 50 },
        { item: "Low Grade Fuel", amount: 3 },
        { item: "Sulfur", amount: 10 },
        { item: "Metal Fragments", amount: 10 },
      ],
      output: 1,
      time: 5,
      workbench: 3,
      blueprint: true,
    },
    usedBy: ["C4 crafting", "Rocket crafting"],
    tips: [
      "Component, not weapon",
      "Used for C4 and Rockets",
      "Expensive to craft",
      "Requires WB3",
    ],
  },
  {
    id: "gunpowder",
    name: "Gun Powder",
    description: "Essential crafting component for all ammunition and explosives. Made from charcoal and sulfur.",
    category: "explosive",
    subcategory: "component",
    damage: 0,
    crafting: {
      ingredients: [
        { item: "Charcoal", amount: 30 },
        { item: "Sulfur", amount: 20 },
      ],
      output: 10,
      time: 2,
      workbench: 0,
      blueprint: false,
    },
    usedBy: ["All ammo", "All explosives"],
    tips: [
      "Foundation of all ammo",
      "No workbench needed",
      "Farm sulfur nodes",
      "Burn wood for charcoal",
      "10 per craft",
    ],
  },
];

// Helper functions
export function getAmmoByCategory(category: AmmoCategory): Ammo[] {
  return ammo.filter(a => a.category === category);
}

export function getAmmoById(id: string): Ammo | undefined {
  return ammo.find(a => a.id === id);
}

// Category metadata
export const ammoCategories: Record<AmmoCategory, { name: string; emoji: string; description: string }> = {
  pistol: {
    name: "Pistol Ammo",
    emoji: "🔫",
    description: "Ammunition for pistols and SMGs",
  },
  rifle: {
    name: "Rifle Ammo",
    emoji: "🎯",
    description: "Ammunition for rifles",
  },
  shotgun: {
    name: "Shotgun Ammo",
    emoji: "💥",
    description: "Shells for shotguns",
  },
  rocket: {
    name: "Rockets",
    emoji: "🚀",
    description: "Rockets for the Rocket Launcher",
  },
  throwable: {
    name: "Throwables",
    emoji: "💣",
    description: "Grenades and throwable items",
  },
  explosive: {
    name: "Explosives",
    emoji: "🧨",
    description: "Raiding explosives and components",
  },
};
