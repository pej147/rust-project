// Weapons Data for Rust Console Wiki
// Melee weapons, bows, and ranged weapons with stats

export type WeaponCategory = "melee" | "bow" | "pistol" | "smg" | "rifle" | "shotgun" | "explosive";

export interface Weapon {
  id: string;
  name: string;
  description: string;
  category: WeaponCategory;
  subcategory?: string;
  image?: string;
  // Stats
  damage: number;
  rateOfFire?: number; // rounds per minute
  range?: string; // effective range
  // Crafting
  crafting?: {
    ingredients: { item: string; amount: number }[];
    time: number;
    workbench: number;
    blueprint: boolean;
  };
  // Ammo (for ranged)
  ammo?: string;
  magazineSize?: number;
  // Attachments
  attachments?: string[];
  // Tips
  tips: string[];
}

export const weapons: Weapon[] = [
  // ============================================
  // MELEE WEAPONS - Primitive
  // ============================================
  {
    id: "rock",
    name: "Rock",
    description: "Every player spawns with a rock. It's your first weapon and tool. Weak but always available.",
    category: "melee",
    subcategory: "primitive",
    damage: 10,
    crafting: {
      ingredients: [{ item: "Stone", amount: 10 }],
      time: 5,
      workbench: 0,
      blueprint: false,
    },
    tips: [
      "Spawned with this - never truly unarmed",
      "Aim for the head for 1.5x damage",
      "Better as a tool than a weapon",
      "Upgrade to spear ASAP",
    ],
  },
  {
    id: "stone_spear",
    name: "Stone Spear",
    description: "A basic spear with a stone tip. Can be thrown for ranged damage. Essential early game weapon.",
    category: "melee",
    subcategory: "primitive",
    damage: 25,
    range: "Can be thrown",
    crafting: {
      ingredients: [
        { item: "Wood", amount: 300 },
        { item: "Stone", amount: 100 },
      ],
      time: 30,
      workbench: 0,
      blueprint: false,
    },
    tips: [
      "Right-click to throw",
      "Thrown spear does 60 damage",
      "Cheap and effective early game",
      "Carry multiple for throwing",
    ],
  },
  {
    id: "wooden_spear",
    name: "Wooden Spear",
    description: "A simple wooden spear. Slightly weaker than stone spear but very cheap to make.",
    category: "melee",
    subcategory: "primitive",
    damage: 20,
    range: "Can be thrown",
    crafting: {
      ingredients: [{ item: "Wood", amount: 300 }],
      time: 20,
      workbench: 0,
      blueprint: false,
    },
    tips: [
      "Cheapest throwable weapon",
      "Good for fresh spawns",
      "Upgrade to stone spear when possible",
      "Throw multiple for quick damage",
    ],
  },
  {
    id: "bone_club",
    name: "Bone Club",
    description: "A club made from bones. Decent early game melee weapon with good durability.",
    category: "melee",
    subcategory: "primitive",
    damage: 18,
    crafting: {
      ingredients: [{ item: "Bone Fragments", amount: 20 }],
      time: 15,
      workbench: 0,
      blueprint: false,
    },
    tips: [
      "Made from animal bones",
      "Fast swing speed",
      "Good durability for primitive",
      "Decent option until you find better",
    ],
  },
  {
    id: "bone_knife",
    name: "Bone Knife",
    description: "A knife crafted from bone fragments. Fast attack speed and decent damage.",
    category: "melee",
    subcategory: "primitive",
    damage: 15,
    crafting: {
      ingredients: [{ item: "Bone Fragments", amount: 30 }],
      time: 15,
      workbench: 0,
      blueprint: false,
    },
    tips: [
      "Very fast attack speed",
      "Good for harvesting animals",
      "Low damage per hit but DPS is decent",
      "Cheap to make from bones",
    ],
  },

  // ============================================
  // MELEE WEAPONS - Salvaged
  // ============================================
  {
    id: "salvaged_sword",
    name: "Salvaged Sword",
    description: "A makeshift sword crafted from salvaged materials. High damage and good reach.",
    category: "melee",
    subcategory: "salvaged",
    damage: 50,
    crafting: {
      ingredients: [
        { item: "Metal Blade", amount: 1 },
        { item: "Metal Pipe", amount: 1 },
      ],
      time: 30,
      workbench: 1,
      blueprint: true,
    },
    tips: [
      "One of the best early melee weapons",
      "Good reach and damage",
      "Requires blueprint to craft",
      "Great for door campers",
    ],
  },
  {
    id: "salvaged_cleaver",
    name: "Salvaged Cleaver",
    description: "A heavy cleaver made from salvaged parts. Slower but hits harder than the sword.",
    category: "melee",
    subcategory: "salvaged",
    damage: 55,
    crafting: {
      ingredients: [
        { item: "Metal Blade", amount: 1 },
        { item: "Wood", amount: 50 },
      ],
      time: 30,
      workbench: 1,
      blueprint: true,
    },
    tips: [
      "Higher damage than sword",
      "Slower swing speed",
      "Good for ambushes",
      "Requires blueprint",
    ],
  },
  {
    id: "machete",
    name: "Machete",
    description: "A long blade effective for combat and harvesting. Fast attacks and decent damage.",
    category: "melee",
    subcategory: "salvaged",
    damage: 40,
    crafting: {
      ingredients: [
        { item: "Metal Blade", amount: 1 },
        { item: "Rope", amount: 1 },
      ],
      time: 20,
      workbench: 1,
      blueprint: true,
    },
    tips: [
      "Fast attack speed",
      "Good for harvesting plants",
      "Balanced damage and speed",
      "Popular melee choice",
    ],
  },
  {
    id: "longsword",
    name: "Longsword",
    description: "A proper sword with excellent reach and damage. One of the best melee weapons in the game.",
    category: "melee",
    subcategory: "military",
    damage: 60,
    crafting: {
      ingredients: [
        { item: "High Quality Metal", amount: 10 },
        { item: "Metal Fragments", amount: 150 },
      ],
      time: 45,
      workbench: 2,
      blueprint: true,
    },
    tips: [
      "Best melee damage output",
      "Excellent reach",
      "Requires L2 workbench",
      "Can compete with guns in close quarters",
    ],
  },
  {
    id: "mace",
    name: "Mace",
    description: "A heavy blunt weapon. Good against armored targets due to blunt damage type.",
    category: "melee",
    subcategory: "military",
    damage: 50,
    crafting: {
      ingredients: [
        { item: "High Quality Metal", amount: 8 },
        { item: "Metal Fragments", amount: 75 },
        { item: "Wood", amount: 20 },
      ],
      time: 30,
      workbench: 2,
      blueprint: true,
    },
    tips: [
      "Blunt damage - good vs armor",
      "Slightly slower than sword",
      "Can knock players back",
      "Underrated weapon",
    ],
  },
  {
    id: "combat_knife",
    name: "Combat Knife",
    description: "A military-grade knife. Very fast attacks and can be thrown for ranged damage.",
    category: "melee",
    subcategory: "military",
    damage: 30,
    range: "Can be thrown (45 damage)",
    crafting: {
      ingredients: [
        { item: "High Quality Metal", amount: 5 },
        { item: "Metal Fragments", amount: 25 },
      ],
      time: 20,
      workbench: 2,
      blueprint: true,
    },
    tips: [
      "Fastest melee attack speed",
      "Can be thrown for 45 damage",
      "Great for stealth plays",
      "Low damage but high DPS",
    ],
  },

  // ============================================
  // BOWS
  // ============================================
  {
    id: "hunting_bow",
    name: "Hunting Bow",
    description: "A simple wooden bow. The first ranged weapon most players craft. Uses wooden arrows.",
    category: "bow",
    subcategory: "primitive",
    damage: 50,
    range: "Medium",
    ammo: "Wooden Arrow",
    crafting: {
      ingredients: [
        { item: "Wood", amount: 200 },
        { item: "Cloth", amount: 50 },
      ],
      time: 30,
      workbench: 0,
      blueprint: false,
    },
    tips: [
      "Essential early game weapon",
      "Headshots deal 100+ damage",
      "Arrows can be recovered",
      "Silent - great for stealth",
      "Cheap to craft and maintain",
    ],
  },
  {
    id: "crossbow",
    name: "Crossbow",
    description: "A powerful crossbow that fires bolts. Higher damage than hunting bow but slower reload.",
    category: "bow",
    subcategory: "advanced",
    damage: 60,
    range: "Medium-Long",
    ammo: "Wooden Arrow",
    attachments: ["Flashlight", "Handmade Sight", "Holosight"],
    crafting: {
      ingredients: [
        { item: "Wood", amount: 200 },
        { item: "Metal Fragments", amount: 75 },
        { item: "Rope", amount: 2 },
      ],
      time: 45,
      workbench: 1,
      blueprint: true,
    },
    tips: [
      "Can attach sights!",
      "Higher damage than bow",
      "Slower to reload",
      "Headshot = instant kill on nakeds",
      "Good early-mid game option",
    ],
  },
  {
    id: "compound_bow",
    name: "Compound Bow",
    description: "An advanced bow with charge mechanic. Hold to charge for more damage and accuracy. Best bow in the game.",
    category: "bow",
    subcategory: "advanced",
    damage: 100,
    range: "Long",
    ammo: "High Velocity Arrow",
    attachments: ["Handmade Sight", "Holosight", "Flashlight"],
    crafting: {
      ingredients: [
        { item: "Wood", amount: 100 },
        { item: "Metal Fragments", amount: 75 },
        { item: "Gears", amount: 2 },
        { item: "Rope", amount: 2 },
      ],
      time: 45,
      workbench: 2,
      blueprint: true,
    },
    tips: [
      "HOLD to charge for max damage",
      "Fully charged = 100 damage!",
      "Use High Velocity arrows",
      "Can attach sights",
      "Silent and deadly",
      "Headshot = instant kill with armor",
    ],
  },
  {
    id: "nail_gun",
    name: "Nail Gun",
    description: "A construction tool repurposed as a weapon. Fast fire rate but low damage per shot.",
    category: "bow",
    subcategory: "tool",
    damage: 18,
    rateOfFire: 400,
    range: "Short",
    ammo: "Nails",
    magazineSize: 16,
    crafting: {
      ingredients: [
        { item: "Metal Fragments", amount: 75 },
        { item: "High Quality Metal", amount: 3 },
        { item: "Gears", amount: 1 },
      ],
      time: 30,
      workbench: 1,
      blueprint: true,
    },
    tips: [
      "Very fast fire rate",
      "Low damage per nail",
      "Good for up-close fights",
      "Nails are cheap to craft",
      "Underrated weapon",
    ],
  },

  // ============================================
  // ARROWS
  // ============================================
  {
    id: "wooden_arrow",
    name: "Wooden Arrow",
    description: "Basic arrows for bows and crossbows. Cheap and easy to make.",
    category: "bow",
    subcategory: "ammo",
    damage: 0, // Damage comes from weapon
    crafting: {
      ingredients: [
        { item: "Wood", amount: 25 },
        { item: "Stone", amount: 10 },
      ],
      time: 3,
      workbench: 0,
      blueprint: false,
    },
    tips: [
      "Basic ammo for bows",
      "Can be recovered from bodies",
      "Craft in bulk",
    ],
  },
  {
    id: "high_velocity_arrow",
    name: "High Velocity Arrow",
    description: "Faster arrows with flatter trajectory. Best ammo for compound bow.",
    category: "bow",
    subcategory: "ammo",
    damage: 0,
    crafting: {
      ingredients: [
        { item: "Wood", amount: 25 },
        { item: "Metal Fragments", amount: 5 },
      ],
      time: 3,
      workbench: 0,
      blueprint: false,
    },
    tips: [
      "Faster and more accurate",
      "Flatter trajectory",
      "Best for compound bow",
      "Worth the extra metal",
    ],
  },
  {
    id: "bone_arrow",
    name: "Bone Arrow",
    description: "Arrows made from bone. More damage than wooden but can't be recovered.",
    category: "bow",
    subcategory: "ammo",
    damage: 0,
    crafting: {
      ingredients: [
        { item: "Wood", amount: 25 },
        { item: "Bone Fragments", amount: 15 },
      ],
      time: 3,
      workbench: 0,
      blueprint: false,
    },
    tips: [
      "More damage than wooden",
      "Cannot be recovered",
      "Good for early fights",
      "Use bones from animals",
    ],
  },
  {
    id: "fire_arrow",
    name: "Fire Arrow",
    description: "Arrows that set targets on fire. Good for wood raiding and area denial.",
    category: "bow",
    subcategory: "ammo",
    damage: 0,
    crafting: {
      ingredients: [
        { item: "Wooden Arrow", amount: 2 },
        { item: "Cloth", amount: 1 },
        { item: "Low Grade Fuel", amount: 3 },
      ],
      time: 5,
      workbench: 0,
      blueprint: false,
    },
    tips: [
      "Sets targets on fire",
      "Deals burn damage over time",
      "Can raid wooden structures",
      "Good for soft-siding",
    ],
  },
];

// Helper functions
export function getWeaponsByCategory(category: WeaponCategory): Weapon[] {
  return weapons.filter(w => w.category === category);
}

export function getWeaponById(id: string): Weapon | undefined {
  return weapons.find(w => w.id === id);
}

// Category metadata
export const weaponCategories: Record<WeaponCategory, { name: string; emoji: string; description: string }> = {
  melee: {
    name: "Melee",
    emoji: "🗡️",
    description: "Close combat weapons",
  },
  bow: {
    name: "Bows & Arrows",
    emoji: "🏹",
    description: "Silent ranged weapons",
  },
  pistol: {
    name: "Pistols",
    emoji: "🔫",
    description: "Sidearms and handguns",
  },
  smg: {
    name: "SMGs",
    emoji: "🔫",
    description: "Submachine guns",
  },
  rifle: {
    name: "Rifles",
    emoji: "🎯",
    description: "Assault and sniper rifles",
  },
  shotgun: {
    name: "Shotguns",
    emoji: "💥",
    description: "Close range devastation",
  },
  explosive: {
    name: "Explosives",
    emoji: "💣",
    description: "Raiding and area damage",
  },
};
