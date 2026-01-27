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

  // ============================================
  // PISTOLS
  // ============================================
  {
    id: "eoka_pistol",
    name: "Eoka Pistol",
    description: "A crude handmade pistol. Unreliable firing mechanism but can one-shot nakeds. The ultimate gamble gun.",
    category: "pistol",
    subcategory: "primitive",
    damage: 180,
    range: "Very Short",
    ammo: "Handmade Shell",
    magazineSize: 1,
    crafting: {
      ingredients: [
        { item: "Wood", amount: 75 },
        { item: "Metal Fragments", amount: 30 },
      ],
      time: 15,
      workbench: 0,
      blueprint: false,
    },
    tips: [
      "Random fire delay - pray to RNG",
      "Can one-shot full gear players",
      "Cheapest gun in the game",
      "Great for door camping",
      "Hold mouse button until it fires",
    ],
  },
  {
    id: "revolver",
    name: "Revolver",
    description: "A basic six-shot revolver. Reliable early game firearm with decent accuracy.",
    category: "pistol",
    subcategory: "craftable",
    damage: 35,
    rateOfFire: 343,
    range: "Short-Medium",
    ammo: "Pistol Bullet",
    magazineSize: 8,
    attachments: ["Flashlight", "Silencer"],
    crafting: {
      ingredients: [
        { item: "Metal Fragments", amount: 125 },
        { item: "Metal Pipe", amount: 1 },
        { item: "Cloth", amount: 25 },
      ],
      time: 30,
      workbench: 1,
      blueprint: true,
    },
    tips: [
      "First reliable gun for most players",
      "Good accuracy when crouched",
      "8 round cylinder despite being a revolver",
      "Can attach silencer for stealth",
      "Cheap to craft and maintain",
    ],
  },
  {
    id: "semi_auto_pistol",
    name: "Semi-Automatic Pistol",
    description: "A modern semi-automatic pistol. Fast fire rate and good accuracy. Solid mid-game sidearm.",
    category: "pistol",
    subcategory: "craftable",
    damage: 40,
    rateOfFire: 400,
    range: "Medium",
    ammo: "Pistol Bullet",
    magazineSize: 10,
    attachments: ["Flashlight", "Silencer", "Holosight", "Laser Sight"],
    crafting: {
      ingredients: [
        { item: "Metal Fragments", amount: 75 },
        { item: "Metal Pipe", amount: 1 },
        { item: "Semi-Auto Body", amount: 1 },
      ],
      time: 30,
      workbench: 2,
      blueprint: true,
    },
    tips: [
      "Fast fire rate",
      "Good backup weapon",
      "Requires Semi-Auto Body component",
      "Can attach multiple attachments",
      "Popular secondary weapon",
    ],
  },
  {
    id: "python",
    name: "Python Revolver",
    description: "A powerful revolver with high damage per shot. Slower fire rate but hits hard.",
    category: "pistol",
    subcategory: "military",
    damage: 55,
    rateOfFire: 200,
    range: "Medium",
    ammo: "Pistol Bullet",
    magazineSize: 6,
    attachments: ["Flashlight", "Holosight", "Handmade Sight", "Laser Sight"],
    crafting: {
      ingredients: [
        { item: "Metal Fragments", amount: 100 },
        { item: "Metal Pipe", amount: 1 },
        { item: "High Quality Metal", amount: 10 },
      ],
      time: 30,
      workbench: 2,
      blueprint: true,
    },
    tips: [
      "High damage per shot",
      "Slower fire rate than SAP",
      "Good for headshots",
      "Can attach sight for accuracy",
      "Mini sniper pistol",
    ],
  },
  {
    id: "m92",
    name: "M92 Pistol",
    description: "Military-grade pistol with large magazine and fast fire rate. One of the best sidearms.",
    category: "pistol",
    subcategory: "military",
    damage: 45,
    rateOfFire: 400,
    range: "Medium",
    ammo: "Pistol Bullet",
    magazineSize: 15,
    attachments: ["Flashlight", "Silencer", "Holosight", "Laser Sight"],
    crafting: {
      ingredients: [
        { item: "High Quality Metal", amount: 15 },
        { item: "Metal Fragments", amount: 150 },
        { item: "Metal Spring", amount: 1 },
      ],
      time: 45,
      workbench: 3,
      blueprint: true,
    },
    tips: [
      "15 round magazine",
      "Fast fire rate",
      "Military loot only (no craft on Console)",
      "Best pistol in the game",
      "Great backup to any loadout",
    ],
  },

  // ============================================
  // SMGs (Submachine Guns)
  // ============================================
  {
    id: "custom_smg",
    name: "Custom SMG",
    description: "A homemade submachine gun. Fast fire rate but high recoil. Common early-mid game automatic.",
    category: "smg",
    subcategory: "craftable",
    damage: 30,
    rateOfFire: 600,
    range: "Short-Medium",
    ammo: "Pistol Bullet",
    magazineSize: 24,
    attachments: ["Flashlight", "Silencer", "Holosight", "Handmade Sight", "Laser Sight"],
    crafting: {
      ingredients: [
        { item: "Metal Fragments", amount: 200 },
        { item: "High Quality Metal", amount: 8 },
        { item: "Metal Spring", amount: 1 },
        { item: "SMG Body", amount: 1 },
      ],
      time: 45,
      workbench: 1,
      blueprint: true,
    },
    tips: [
      "First automatic for most players",
      "High recoil - control it",
      "Uses cheap pistol ammo",
      "Good up close",
      "Spray and pray",
    ],
  },
  {
    id: "thompson",
    name: "Thompson",
    description: "Classic submachine gun with good damage and manageable recoil. Iconic Tommy Gun.",
    category: "smg",
    subcategory: "military",
    damage: 37,
    rateOfFire: 462,
    range: "Medium",
    ammo: "Pistol Bullet",
    magazineSize: 20,
    attachments: ["Flashlight", "Silencer", "Holosight", "Handmade Sight", "Laser Sight", "16x Scope"],
    crafting: {
      ingredients: [
        { item: "High Quality Metal", amount: 15 },
        { item: "Metal Fragments", amount: 150 },
        { item: "Metal Spring", amount: 1 },
        { item: "SMG Body", amount: 1 },
      ],
      time: 45,
      workbench: 2,
      blueprint: true,
    },
    tips: [
      "Better accuracy than Custom",
      "Good damage per shot",
      "Lower fire rate but more control",
      "Great all-around SMG",
      "Popular mid-game weapon",
    ],
  },
  {
    id: "mp5a4",
    name: "MP5A4",
    description: "Military submachine gun with excellent accuracy and low recoil. The best SMG in Rust.",
    category: "smg",
    subcategory: "military",
    damage: 35,
    rateOfFire: 600,
    range: "Medium-Long",
    ammo: "Pistol Bullet",
    magazineSize: 30,
    attachments: ["Flashlight", "Silencer", "Holosight", "8x Scope", "Laser Sight", "Muzzle Boost", "Muzzle Brake"],
    crafting: {
      ingredients: [
        { item: "High Quality Metal", amount: 20 },
        { item: "Metal Fragments", amount: 200 },
        { item: "Metal Spring", amount: 2 },
        { item: "SMG Body", amount: 1 },
      ],
      time: 60,
      workbench: 3,
      blueprint: true,
    },
    tips: [
      "Best SMG in the game",
      "Very low recoil",
      "30 round magazine",
      "Can use scopes",
      "Competes with rifles at range",
    ],
  },

  // ============================================
  // RIFLES
  // ============================================
  {
    id: "semi_auto_rifle",
    name: "Semi-Automatic Rifle",
    description: "A reliable semi-automatic rifle. Good damage and accuracy. Essential mid-game weapon.",
    category: "rifle",
    subcategory: "craftable",
    damage: 40,
    rateOfFire: 343,
    range: "Long",
    ammo: "5.56 Rifle Ammo",
    magazineSize: 16,
    attachments: ["Flashlight", "Silencer", "Holosight", "8x Scope", "16x Scope", "Handmade Sight", "Laser Sight", "Muzzle Boost", "Muzzle Brake"],
    crafting: {
      ingredients: [
        { item: "Metal Fragments", amount: 450 },
        { item: "High Quality Metal", amount: 4 },
        { item: "Metal Spring", amount: 1 },
        { item: "Semi-Auto Body", amount: 1 },
      ],
      time: 45,
      workbench: 2,
      blueprint: true,
    },
    tips: [
      "Tap fire for best accuracy",
      "Good at all ranges",
      "Cheap to craft",
      "Can use 8x scope for sniping",
      "Reliable and consistent",
    ],
  },
  {
    id: "ak47",
    name: "Assault Rifle (AK-47)",
    description: "The iconic assault rifle. High damage, full auto, but significant recoil. The king of Rust.",
    category: "rifle",
    subcategory: "military",
    damage: 50,
    rateOfFire: 450,
    range: "Medium-Long",
    ammo: "5.56 Rifle Ammo",
    magazineSize: 30,
    attachments: ["Flashlight", "Silencer", "Holosight", "8x Scope", "16x Scope", "Handmade Sight", "Laser Sight", "Muzzle Boost", "Muzzle Brake"],
    crafting: {
      ingredients: [
        { item: "High Quality Metal", amount: 50 },
        { item: "Wood", amount: 200 },
        { item: "Metal Spring", amount: 4 },
        { item: "Rifle Body", amount: 1 },
      ],
      time: 60,
      workbench: 3,
      blueprint: true,
    },
    tips: [
      "Highest DPS automatic",
      "Hard recoil pattern to learn",
      "Practice the spray",
      "Pull down and left",
      "End game weapon",
    ],
  },
  {
    id: "lr300",
    name: "LR-300 Assault Rifle",
    description: "Military assault rifle with lower recoil than AK. Slightly less damage but easier to control.",
    category: "rifle",
    subcategory: "military",
    damage: 40,
    rateOfFire: 500,
    range: "Medium-Long",
    ammo: "5.56 Rifle Ammo",
    magazineSize: 30,
    attachments: ["Flashlight", "Silencer", "Holosight", "8x Scope", "16x Scope", "Laser Sight", "Muzzle Boost", "Muzzle Brake"],
    crafting: {
      ingredients: [
        { item: "High Quality Metal", amount: 30 },
        { item: "Metal Fragments", amount: 450 },
        { item: "Metal Spring", amount: 3 },
        { item: "Rifle Body", amount: 1 },
      ],
      time: 60,
      workbench: 3,
      blueprint: true,
    },
    tips: [
      "Easier recoil than AK",
      "Lower damage but more accurate",
      "Good for beginners",
      "Military crate loot",
      "Can outgun AK at range",
    ],
  },
  {
    id: "bolt_action_rifle",
    name: "Bolt Action Rifle",
    description: "A powerful sniper rifle with high damage per shot. One headshot kills most players.",
    category: "rifle",
    subcategory: "sniper",
    damage: 80,
    rateOfFire: 32,
    range: "Very Long",
    ammo: "5.56 Rifle Ammo",
    magazineSize: 4,
    attachments: ["Flashlight", "Silencer", "Holosight", "8x Scope", "16x Scope", "Handmade Sight", "Laser Sight"],
    crafting: {
      ingredients: [
        { item: "High Quality Metal", amount: 30 },
        { item: "Metal Fragments", amount: 500 },
        { item: "Metal Spring", amount: 2 },
        { item: "Rifle Body", amount: 1 },
      ],
      time: 60,
      workbench: 3,
      blueprint: true,
    },
    tips: [
      "One headshot = instant kill",
      "Slow bolt action reload",
      "Use 8x or 16x scope",
      "Best for long range",
      "Aim for the head",
    ],
  },
  {
    id: "l96",
    name: "L96 Rifle",
    description: "Military sniper rifle with extremely high damage. The best long-range weapon in Rust.",
    category: "rifle",
    subcategory: "sniper",
    damage: 80,
    rateOfFire: 26,
    range: "Extreme",
    ammo: "5.56 Rifle Ammo",
    magazineSize: 5,
    attachments: ["Flashlight", "Silencer", "8x Scope", "16x Scope"],
    crafting: {
      ingredients: [
        { item: "High Quality Metal", amount: 50 },
        { item: "Metal Fragments", amount: 600 },
        { item: "Metal Spring", amount: 3 },
        { item: "Rifle Body", amount: 1 },
      ],
      time: 60,
      workbench: 3,
      blueprint: true,
    },
    tips: [
      "Best sniper rifle",
      "Higher velocity than Bolty",
      "Easier to hit moving targets",
      "Military loot / expensive craft",
      "The roofcamper's choice",
    ],
  },
  {
    id: "m39",
    name: "M39 Rifle",
    description: "A semi-automatic marksman rifle. Good damage with faster follow-up shots than bolt actions.",
    category: "rifle",
    subcategory: "military",
    damage: 50,
    rateOfFire: 200,
    range: "Long",
    ammo: "5.56 Rifle Ammo",
    magazineSize: 20,
    attachments: ["Flashlight", "Silencer", "Holosight", "8x Scope", "16x Scope", "Laser Sight", "Muzzle Brake"],
    crafting: {
      ingredients: [
        { item: "High Quality Metal", amount: 40 },
        { item: "Metal Fragments", amount: 400 },
        { item: "Metal Spring", amount: 2 },
        { item: "Rifle Body", amount: 1 },
      ],
      time: 60,
      workbench: 3,
      blueprint: true,
    },
    tips: [
      "DMR style rifle",
      "Fast semi-auto fire",
      "Good at medium-long range",
      "20 round magazine",
      "Versatile weapon",
    ],
  },

  // ============================================
  // SHOTGUNS
  // ============================================
  {
    id: "waterpipe_shotgun",
    name: "Waterpipe Shotgun",
    description: "A crude single-shot shotgun made from pipes. Devastating at close range but very slow reload.",
    category: "shotgun",
    subcategory: "primitive",
    damage: 180,
    rateOfFire: 30,
    range: "Very Short",
    ammo: "Handmade Shell / 12 Gauge",
    magazineSize: 1,
    crafting: {
      ingredients: [
        { item: "High Quality Metal", amount: 5 },
        { item: "Metal Fragments", amount: 100 },
        { item: "Wood", amount: 75 },
      ],
      time: 30,
      workbench: 1,
      blueprint: false,
    },
    tips: [
      "One shot potential up close",
      "Very slow reload",
      "Use buckshot for damage",
      "Use slugs for range",
      "Door camping weapon",
    ],
  },
  {
    id: "double_barrel_shotgun",
    name: "Double Barrel Shotgun",
    description: "A two-shot shotgun. Fast follow-up shot but limited capacity. High burst damage potential.",
    category: "shotgun",
    subcategory: "craftable",
    damage: 180,
    rateOfFire: 200,
    range: "Short",
    ammo: "12 Gauge Buckshot",
    magazineSize: 2,
    attachments: ["Flashlight"],
    crafting: {
      ingredients: [
        { item: "High Quality Metal", amount: 5 },
        { item: "Metal Fragments", amount: 175 },
        { item: "Metal Pipe", amount: 2 },
      ],
      time: 30,
      workbench: 1,
      blueprint: true,
    },
    tips: [
      "Two quick shots",
      "Massive burst damage",
      "Shoot both barrels fast",
      "Great for ambushes",
      "Low capacity",
    ],
  },
  {
    id: "pump_shotgun",
    name: "Pump Shotgun",
    description: "A reliable pump-action shotgun with 6-round capacity. Good balance of damage and fire rate.",
    category: "shotgun",
    subcategory: "craftable",
    damage: 180,
    rateOfFire: 60,
    range: "Short-Medium",
    ammo: "12 Gauge Buckshot",
    magazineSize: 6,
    attachments: ["Flashlight", "Holosight", "Handmade Sight", "Laser Sight"],
    crafting: {
      ingredients: [
        { item: "High Quality Metal", amount: 10 },
        { item: "Metal Fragments", amount: 200 },
        { item: "Metal Spring", amount: 1 },
        { item: "Metal Pipe", amount: 2 },
      ],
      time: 45,
      workbench: 2,
      blueprint: true,
    },
    tips: [
      "6 round tube magazine",
      "Pump between shots",
      "Use slugs for range",
      "Reliable close quarters",
      "Popular base defense gun",
    ],
  },
  {
    id: "spas12",
    name: "Spas-12 Shotgun",
    description: "Military semi-automatic shotgun with fast fire rate. The best shotgun in Rust.",
    category: "shotgun",
    subcategory: "military",
    damage: 180,
    rateOfFire: 100,
    range: "Short-Medium",
    ammo: "12 Gauge Buckshot",
    magazineSize: 6,
    attachments: ["Flashlight", "Holosight", "Handmade Sight", "Laser Sight"],
    crafting: {
      ingredients: [
        { item: "High Quality Metal", amount: 25 },
        { item: "Metal Fragments", amount: 300 },
        { item: "Metal Spring", amount: 2 },
      ],
      time: 60,
      workbench: 3,
      blueprint: true,
    },
    tips: [
      "Semi-auto - no pump needed",
      "Fastest shotgun fire rate",
      "Devastating up close",
      "Military loot / elite crate",
      "The king of shotguns",
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
