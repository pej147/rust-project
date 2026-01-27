// Wiki Items Data
// Resources, Components, Tools, Medical items voor de Wiki

export type ItemCategory = "resources" | "components" | "tools" | "medical";

export interface WikiItem {
  id: string;
  name: string;
  description: string;
  category: ItemCategory;
  subcategory?: string;
  image?: string;
  stackSize: number;
  // Waar te vinden
  sources: string[];
  // Recycling output
  recycling?: {
    input: number;
    output: { item: string; amount: number }[];
  };
  // Crafting recipe (als craftable)
  crafting?: {
    ingredients: { item: string; amount: number }[];
    output: number;
    time: number; // seconden
    workbench?: number; // 0, 1, 2, 3
  };
  // Smelting (voor ores)
  smelting?: {
    input: number;
    output: { item: string; amount: number };
    fuel: string;
    time: number; // seconden
  };
  // Extra info
  tips?: string[];
}

export const wikiItems: WikiItem[] = [
  // ============================================
  // RESOURCES - Raw Materials
  // ============================================
  {
    id: "wood",
    name: "Wood",
    description: "The most basic building material in Rust. Obtained by hitting trees with a tool. Essential for early game building, crafting, and fuel.",
    category: "resources",
    subcategory: "raw",
    stackSize: 1000,
    sources: [
      "Hitting trees with rock, hatchet, or chainsaw",
      "Picking up fallen logs and branches",
      "Recycling wooden items",
    ],
    tips: [
      "Salvaged Axe gives the most wood per tree",
      "Chainsaw is fastest but requires Low Grade Fuel",
      "Softer trees (birch) give less wood but are faster",
    ],
  },
  {
    id: "stone",
    name: "Stone",
    description: "A fundamental resource used for building and crafting. Found in stone nodes or picked up from small rocks on the ground.",
    category: "resources",
    subcategory: "raw",
    stackSize: 1000,
    sources: [
      "Mining stone nodes with pickaxe",
      "Picking up small stones from ground",
      "Recycling stone items",
    ],
    tips: [
      "Stone nodes have a sparkle indicating the weak spot",
      "Hitting the weak spot gives bonus resources",
      "Jackhammer is the fastest mining tool",
    ],
  },
  {
    id: "metal_ore",
    name: "Metal Ore",
    description: "Raw metal ore that must be smelted in a furnace to produce Metal Fragments. Found in metal nodes throughout the map.",
    category: "resources",
    subcategory: "raw",
    stackSize: 1000,
    sources: [
      "Mining metal nodes with pickaxe",
      "Recycling some items",
    ],
    smelting: {
      input: 1,
      output: { item: "Metal Fragments", amount: 1 },
      fuel: "Wood",
      time: 5,
    },
    tips: [
      "Metal nodes are darker/shinier than stone nodes",
      "Always smelt ore - raw ore has no direct use",
      "Large Furnace smelts 3x faster than Small Furnace",
    ],
  },
  {
    id: "sulfur_ore",
    name: "Sulfur Ore",
    description: "Yellow ore that must be smelted to produce Sulfur. Essential for crafting explosives and ammunition.",
    category: "resources",
    subcategory: "raw",
    stackSize: 1000,
    sources: [
      "Mining sulfur nodes with pickaxe",
      "Sulfur nodes have a yellow/golden color",
    ],
    smelting: {
      input: 1,
      output: { item: "Sulfur", amount: 1 },
      fuel: "Wood",
      time: 5,
    },
    tips: [
      "Sulfur is the most valuable resource for raiding",
      "Prioritize sulfur nodes over metal nodes late game",
      "Always keep sulfur locked in a secure location",
    ],
  },
  {
    id: "hqm_ore",
    name: "High Quality Metal Ore",
    description: "Rare ore that smelts into High Quality Metal (HQM). Used for the best weapons, armor, and armored building pieces.",
    category: "resources",
    subcategory: "raw",
    stackSize: 1000,
    sources: [
      "Mining any ore node (small chance)",
      "Quarry output",
      "Recycling high-tier items",
    ],
    smelting: {
      input: 1,
      output: { item: "High Quality Metal", amount: 1 },
      fuel: "Wood",
      time: 10,
    },
    tips: [
      "HQM ore drops randomly from all ore nodes",
      "Mining Quarry can produce HQM ore automatically",
      "Recycle cameras, laptops for guaranteed HQM",
    ],
  },
  {
    id: "metal_fragments",
    name: "Metal Fragments",
    description: "Refined metal used for crafting weapons, tools, and building components. Obtained by smelting Metal Ore.",
    category: "resources",
    subcategory: "refined",
    stackSize: 1000,
    sources: [
      "Smelting Metal Ore in furnace",
      "Recycling metal items",
      "Barrels and crates",
    ],
    tips: [
      "Keep a steady supply for base upkeep",
      "Sheet metal doors cost 150 Metal Fragments",
      "Code locks need 100 Metal Fragments",
    ],
  },
  {
    id: "sulfur",
    name: "Sulfur",
    description: "Refined sulfur used exclusively for crafting ammunition and explosives. The key resource for raiding.",
    category: "resources",
    subcategory: "refined",
    stackSize: 1000,
    sources: [
      "Smelting Sulfur Ore in furnace",
      "Recycling explosives",
    ],
    tips: [
      "1 Rocket = 1,400 Sulfur",
      "1 C4 = 2,200 Sulfur",
      "Explosive 5.56 ammo = 25 Sulfur each",
    ],
  },
  {
    id: "high_quality_metal",
    name: "High Quality Metal",
    description: "The highest tier metal in Rust. Required for crafting the best weapons, armor, and armored building pieces.",
    category: "resources",
    subcategory: "refined",
    stackSize: 100,
    sources: [
      "Smelting HQM Ore in furnace",
      "Recycling tech items (cameras, laptops)",
      "Elite crates at monuments",
    ],
    tips: [
      "Armored doors need 25 HQM",
      "AK-47 needs 50 HQM",
      "Metal Facemask needs 15 HQM",
    ],
  },
  {
    id: "charcoal",
    name: "Charcoal",
    description: "Byproduct of burning wood in a furnace. Used primarily for crafting Gunpowder.",
    category: "resources",
    subcategory: "refined",
    stackSize: 1000,
    sources: [
      "Burning wood in furnace (automatic)",
      "Campfire byproduct",
    ],
    crafting: {
      ingredients: [{ item: "Wood", amount: 1 }],
      output: 1,
      time: 3,
    },
    tips: [
      "You'll always have excess charcoal from smelting",
      "Gunpowder needs 30 Charcoal + 20 Sulfur",
      "Don't throw away - essential for explosives",
    ],
  },
  {
    id: "gunpowder",
    name: "Gunpowder",
    description: "Explosive powder used to craft all ammunition and explosives. Made from Sulfur and Charcoal.",
    category: "resources",
    subcategory: "refined",
    stackSize: 1000,
    sources: [
      "Crafting at any workbench",
      "Found in military crates (small amounts)",
    ],
    crafting: {
      ingredients: [
        { item: "Sulfur", amount: 20 },
        { item: "Charcoal", amount: 30 },
      ],
      output: 10,
      time: 2,
      workbench: 0,
    },
    tips: [
      "Always craft in bulk to save time",
      "Keep gunpowder locked up - raiders target it",
      "Mixing Table crafts 2x faster",
    ],
  },
  {
    id: "crude_oil",
    name: "Crude Oil",
    description: "Unrefined oil found at pump jacks and oil monuments. Must be refined into Low Grade Fuel.",
    category: "resources",
    subcategory: "raw",
    stackSize: 500,
    sources: [
      "Oil Rig monuments",
      "Pump Jack",
      "Dome barrel spawns",
      "Underwater labs",
    ],
    tips: [
      "Refine at Oil Refinery for Low Grade Fuel",
      "1 Crude Oil = 3 Low Grade Fuel",
      "Oil Rig has unlimited crude oil barrels",
    ],
  },
  {
    id: "low_grade_fuel",
    name: "Low Grade Fuel",
    description: "Fuel used for vehicles, chainsaws, and flame weapons. Can be crafted or refined from Crude Oil.",
    category: "resources",
    subcategory: "refined",
    stackSize: 500,
    sources: [
      "Crafting from Animal Fat + Cloth",
      "Refining Crude Oil",
      "Red barrels",
      "Recycling fuel items",
    ],
    crafting: {
      ingredients: [
        { item: "Animal Fat", amount: 3 },
        { item: "Cloth", amount: 1 },
      ],
      output: 4,
      time: 5,
      workbench: 0,
    },
    tips: [
      "Kill animals for Animal Fat",
      "Red barrels always contain Low Grade",
      "Boats and Minicopters need Low Grade to run",
    ],
  },
  {
    id: "cloth",
    name: "Cloth",
    description: "Fabric material used for crafting clothing, sleeping bags, and medical items.",
    category: "resources",
    subcategory: "raw",
    stackSize: 1000,
    sources: [
      "Harvesting Hemp plants",
      "Recycling clothing items",
      "Killing animals (small amounts)",
    ],
    tips: [
      "Plant Hemp seeds in planters for passive cloth",
      "Sleeping Bag costs 30 Cloth",
      "Always pick Hemp plants when you see them",
    ],
  },
  {
    id: "leather",
    name: "Leather",
    description: "Animal hide used for crafting certain armor and items. Obtained from harvesting animals.",
    category: "resources",
    subcategory: "raw",
    stackSize: 1000,
    sources: [
      "Harvesting wolves, bears, boars, deer",
      "Horses drop leather",
    ],
    tips: [
      "Bears give the most leather",
      "Roadsign armor needs leather",
      "Not as essential as cloth - don't hoard",
    ],
  },
  {
    id: "animal_fat",
    name: "Animal Fat",
    description: "Fat harvested from animals. Primary use is crafting Low Grade Fuel.",
    category: "resources",
    subcategory: "raw",
    stackSize: 1000,
    sources: [
      "Harvesting bears, boars, wolves, deer, horses",
      "Bears and boars give the most",
    ],
    tips: [
      "Always harvest animals for fat",
      "3 Fat + 1 Cloth = 4 Low Grade Fuel",
      "Essential early game for furnaces",
    ],
  },
  {
    id: "bone_fragments",
    name: "Bone Fragments",
    description: "Bones harvested from animals and human corpses. Used for basic tools and armor.",
    category: "resources",
    subcategory: "raw",
    stackSize: 1000,
    sources: [
      "Harvesting any animal or human corpse",
      "Skeletons at monuments",
    ],
    tips: [
      "Bone Knife and Bone Armor are decent early game",
      "Not valuable late game - can discard excess",
      "Bone Club is a starting melee weapon",
    ],
  },
  {
    id: "scrap",
    name: "Scrap",
    description: "The most valuable resource in Rust. Used for researching blueprints, buying items from Bandit Camp/Outpost, and crafting workbenches.",
    category: "resources",
    subcategory: "special",
    stackSize: 1000,
    sources: [
      "Recycling components and items",
      "Barrels and crates",
      "Completing puzzles at monuments",
      "Fishing",
    ],
    tips: [
      "Recycle everything you don't need",
      "Workbench Level 3 costs 1,250 Scrap",
      "Research costs: 75 (T1), 250 (T2), 500 (T3)",
    ],
  },

  // ============================================
  // COMPONENTS
  // ============================================
  {
    id: "gears",
    name: "Gears",
    description: "Mechanical component used in many mid-tier recipes including garage doors, code locks, and some weapons.",
    category: "components",
    stackSize: 20,
    sources: [
      "Barrels and crates",
      "Recycling applicable items",
      "Road junk piles",
    ],
    recycling: {
      input: 1,
      output: [
        { item: "Scrap", amount: 10 },
        { item: "Metal Fragments", amount: 13 },
      ],
    },
    tips: [
      "Garage Door needs 2 Gears",
      "Armored Door needs 5 Gears",
      "Don't recycle if you need doors",
    ],
  },
  {
    id: "metal_spring",
    name: "Metal Spring",
    description: "A coiled spring used in many weapon recipes. Essential component for semi-automatic and automatic weapons.",
    category: "components",
    stackSize: 20,
    sources: [
      "Barrels and crates",
      "Recycling weapons",
      "Road junk piles",
    ],
    recycling: {
      input: 1,
      output: [
        { item: "Scrap", amount: 10 },
        { item: "High Quality Metal", amount: 1 },
      ],
    },
    tips: [
      "AK-47 and most guns need springs",
      "Auto Turret needs 1 spring",
      "Keep these for weapons - don't recycle",
    ],
  },
  {
    id: "metal_pipe",
    name: "Metal Pipe",
    description: "A metal pipe used in crafting various weapons and some building items.",
    category: "components",
    stackSize: 20,
    sources: [
      "Barrels and crates",
      "Road junk piles",
      "Recycling pipe weapons",
    ],
    recycling: {
      input: 1,
      output: [
        { item: "Scrap", amount: 5 },
        { item: "High Quality Metal", amount: 1 },
      ],
    },
    tips: [
      "Pipe Shotgun only needs a pipe and wood",
      "Water Pipe Shotgun is strong early game",
      "Most guns don't need pipes - can recycle",
    ],
  },
  {
    id: "rope",
    name: "Rope",
    description: "Fibrous rope used in various crafting recipes including crossbows and armor.",
    category: "components",
    stackSize: 20,
    sources: [
      "Barrels and crates",
      "Road junk piles",
    ],
    recycling: {
      input: 1,
      output: [
        { item: "Cloth", amount: 15 },
      ],
    },
    tips: [
      "Crossbow needs 2 Rope",
      "Recycling gives good cloth",
      "Not super rare - can recycle excess",
    ],
  },
  {
    id: "sewing_kit",
    name: "Sewing Kit",
    description: "A kit with needle and thread used for crafting higher tier clothing and armor.",
    category: "components",
    stackSize: 20,
    sources: [
      "Crates at monuments",
      "Recycling high-tier clothing",
    ],
    recycling: {
      input: 1,
      output: [
        { item: "Cloth", amount: 10 },
        { item: "Rope", amount: 1 },
      ],
    },
    tips: [
      "Needed for Hazmat Suit repair",
      "High tier armor crafting",
      "Relatively rare - don't recycle carelessly",
    ],
  },
  {
    id: "sheet_metal",
    name: "Sheet Metal",
    description: "Flat metal sheets used in crafting various items and building components.",
    category: "components",
    stackSize: 10,
    sources: [
      "Military crates",
      "Recycling metal items",
    ],
    recycling: {
      input: 1,
      output: [
        { item: "Scrap", amount: 8 },
        { item: "Metal Fragments", amount: 100 },
      ],
    },
    tips: [
      "Used in armored building parts",
      "Good scrap value when recycled",
      "Not super common - check before recycling",
    ],
  },
  {
    id: "road_signs",
    name: "Road Signs",
    description: "Salvaged road signs used primarily for crafting Roadsign armor - the best non-HQM armor.",
    category: "components",
    stackSize: 5,
    sources: [
      "Barrels and crates",
      "Road junk piles",
      "Recycling Roadsign armor",
    ],
    recycling: {
      input: 1,
      output: [
        { item: "Scrap", amount: 5 },
        { item: "High Quality Metal", amount: 1 },
      ],
    },
    tips: [
      "Roadsign Jacket needs 3 Road Signs",
      "Roadsign armor is excellent mid-game",
      "Keep these for armor - don't recycle",
    ],
  },
  {
    id: "semi_auto_body",
    name: "Semi Automatic Body",
    description: "A weapon body used for crafting semi-automatic weapons like the SAR and Python.",
    category: "components",
    stackSize: 10,
    sources: [
      "Military crates",
      "Elite crates",
      "Recycling semi-auto weapons",
    ],
    recycling: {
      input: 1,
      output: [
        { item: "Scrap", amount: 15 },
        { item: "High Quality Metal", amount: 2 },
        { item: "Metal Fragments", amount: 25 },
      ],
    },
    tips: [
      "Semi-Auto Rifle (SAR) needs this",
      "Python Revolver needs this",
      "Very valuable - keep for weapons",
    ],
  },
  {
    id: "smg_body",
    name: "SMG Body",
    description: "A compact weapon body used for crafting submachine guns like the Custom SMG and MP5.",
    category: "components",
    stackSize: 10,
    sources: [
      "Military crates",
      "Elite crates at monuments",
      "Recycling SMGs",
    ],
    recycling: {
      input: 1,
      output: [
        { item: "Scrap", amount: 15 },
        { item: "High Quality Metal", amount: 2 },
      ],
    },
    tips: [
      "Custom SMG and Thompson need this",
      "MP5A4 needs this body",
      "Keep for weapons - good mid-game guns",
    ],
  },
  {
    id: "rifle_body",
    name: "Rifle Body",
    description: "The most valuable weapon body. Used for crafting the Assault Rifle (AK-47), LR-300, and Bolt Action Rifle.",
    category: "components",
    stackSize: 10,
    sources: [
      "Elite crates at high-tier monuments",
      "Locked crates",
      "Recycling rifles",
      "Bradley and Helicopter",
    ],
    recycling: {
      input: 1,
      output: [
        { item: "Scrap", amount: 25 },
        { item: "High Quality Metal", amount: 2 },
      ],
    },
    tips: [
      "NEVER recycle unless you have excess",
      "AK-47 is the best craftable weapon",
      "Only found at top-tier monuments",
    ],
  },
  {
    id: "tech_trash",
    name: "Tech Trash",
    description: "Electronic waste containing valuable materials. Excellent for recycling into Scrap and HQM.",
    category: "components",
    stackSize: 10,
    sources: [
      "Elite crates",
      "Military crates",
      "Recycling electronics",
    ],
    recycling: {
      input: 1,
      output: [
        { item: "Scrap", amount: 20 },
        { item: "High Quality Metal", amount: 1 },
      ],
    },
    tips: [
      "Best scrap-per-slot ratio in the game",
      "Used for crafting CCTV and Computer Station",
      "Usually better to recycle for scrap",
    ],
  },
  {
    id: "cctv_camera",
    name: "CCTV Camera",
    description: "Electronic camera used for base security systems. Can be placed and viewed remotely.",
    category: "components",
    stackSize: 5,
    sources: [
      "Elite crates",
      "Scientist drops",
      "Cargo Ship",
    ],
    recycling: {
      input: 1,
      output: [
        { item: "Scrap", amount: 25 },
        { item: "High Quality Metal", amount: 3 },
      ],
    },
    tips: [
      "Used for base security",
      "Connect to Computer Station to view",
      "Excellent recycle value if not needed",
    ],
  },
  {
    id: "targeting_computer",
    name: "Targeting Computer",
    description: "Advanced electronics used for crafting Auto Turrets and SAM Sites.",
    category: "components",
    stackSize: 5,
    sources: [
      "Elite crates",
      "Locked crates",
      "Bradley and Helicopter",
    ],
    recycling: {
      input: 1,
      output: [
        { item: "Scrap", amount: 25 },
        { item: "High Quality Metal", amount: 2 },
      ],
    },
    tips: [
      "Auto Turret needs this",
      "SAM Site needs this",
      "Very rare - keep for turrets",
    ],
  },
  {
    id: "electric_fuse",
    name: "Electric Fuse",
    description: "Electrical component needed for monument puzzles. Insert into fuse boxes to unlock doors.",
    category: "components",
    stackSize: 10,
    sources: [
      "Crates at monuments",
      "Scientist drops",
    ],
    recycling: {
      input: 1,
      output: [
        { item: "Scrap", amount: 20 },
      ],
    },
    tips: [
      "Required for monument puzzles",
      "Power Plant, Water Treatment, etc.",
      "Green card rooms need a fuse",
    ],
  },
  {
    id: "propane_tank",
    name: "Propane Tank",
    description: "A pressurized tank used in crafting explosives and flame throwers.",
    category: "components",
    stackSize: 5,
    sources: [
      "Barrels",
      "Junk piles",
      "Road crates",
    ],
    recycling: {
      input: 1,
      output: [
        { item: "Scrap", amount: 1 },
        { item: "Metal Fragments", amount: 50 },
      ],
    },
    tips: [
      "Needed for Flame Thrower",
      "Used in some explosive recipes",
      "Common - can recycle excess",
    ],
  },
  {
    id: "empty_can",
    name: "Empty Can of Beans",
    description: "An empty tin can that can be used as a crafting component for Bean Can Grenades.",
    category: "components",
    stackSize: 20,
    sources: [
      "Eating canned food",
      "Food crates",
      "Barrels",
    ],
    recycling: {
      input: 1,
      output: [
        { item: "Metal Fragments", amount: 5 },
      ],
    },
    crafting: {
      ingredients: [
        { item: "Gunpowder", amount: 60 },
        { item: "Metal Fragments", amount: 20 },
      ],
      output: 1, // Bean Can Grenade
      time: 30,
      workbench: 1,
    },
    tips: [
      "Save cans for Bean Can Grenades",
      "Cheap alternative to Satchels",
      "High dud rate but low cost",
    ],
  },
  {
    id: "tarp",
    name: "Tarp",
    description: "A waterproof tarpaulin used in crafting sleeping bags and certain items.",
    category: "components",
    stackSize: 20,
    sources: [
      "Barrels",
      "Crates",
      "Road junk piles",
    ],
    recycling: {
      input: 1,
      output: [
        { item: "Cloth", amount: 50 },
      ],
    },
    tips: [
      "Great cloth source when recycled",
      "Used in some crafting recipes",
      "Usually better to recycle for cloth",
    ],
  },

  // ============================================
  // TOOLS - Gathering & Building
  // ============================================
  {
    id: "rock",
    name: "Rock",
    description: "The starting tool in Rust. Every player spawns with a rock. Used for gathering basic resources and as a weak melee weapon.",
    category: "tools",
    subcategory: "starter",
    stackSize: 1,
    sources: [
      "Spawned with on beach",
      "Crafted from 10 Stone",
    ],
    crafting: {
      ingredients: [{ item: "Stone", amount: 10 }],
      output: 1,
      time: 5,
      workbench: 0,
    },
    tips: [
      "Hit trees and nodes to get started",
      "Aim for the red X on trees for bonus wood",
      "Upgrade to Stone tools ASAP",
    ],
  },
  {
    id: "stone_pickaxe",
    name: "Stone Pickaxe",
    description: "Basic mining tool for gathering stone, metal ore, and sulfur ore from nodes.",
    category: "tools",
    subcategory: "stone",
    stackSize: 1,
    sources: [
      "Crafting",
    ],
    crafting: {
      ingredients: [
        { item: "Wood", amount: 200 },
        { item: "Stone", amount: 100 },
      ],
      output: 1,
      time: 30,
      workbench: 0,
    },
    tips: [
      "First tool you should craft",
      "Hit the sparkle on nodes for 30% bonus",
      "Gathers ~30% more ore than rock",
    ],
  },
  {
    id: "stone_hatchet",
    name: "Stone Hatchet",
    description: "Basic wood gathering tool. Also used for harvesting animals and as a melee weapon.",
    category: "tools",
    subcategory: "stone",
    stackSize: 1,
    sources: [
      "Crafting",
    ],
    crafting: {
      ingredients: [
        { item: "Wood", amount: 200 },
        { item: "Stone", amount: 100 },
      ],
      output: 1,
      time: 30,
      workbench: 0,
    },
    tips: [
      "Hit the red X on trees for bonus wood",
      "Use for harvesting animals too",
      "Slightly better damage than rock",
    ],
  },
  {
    id: "metal_pickaxe",
    name: "Metal Pickaxe",
    description: "Upgraded mining tool that gathers resources faster and more efficiently than stone tools.",
    category: "tools",
    subcategory: "metal",
    stackSize: 1,
    sources: [
      "Crafting",
    ],
    crafting: {
      ingredients: [
        { item: "Wood", amount: 125 },
        { item: "Metal Fragments", amount: 125 },
      ],
      output: 1,
      time: 20,
      workbench: 0,
    },
    tips: [
      "~50% faster than stone pickaxe",
      "Good balance of cost vs efficiency",
      "Requires Metal Fragments to repair",
    ],
  },
  {
    id: "metal_hatchet",
    name: "Metal Hatchet",
    description: "Upgraded wood gathering tool. Faster and more durable than stone hatchet.",
    category: "tools",
    subcategory: "metal",
    stackSize: 1,
    sources: [
      "Crafting",
    ],
    crafting: {
      ingredients: [
        { item: "Wood", amount: 100 },
        { item: "Metal Fragments", amount: 75 },
      ],
      output: 1,
      time: 20,
      workbench: 0,
    },
    tips: [
      "~50% faster wood gathering",
      "Better for harvesting animals",
      "Decent backup melee weapon",
    ],
  },
  {
    id: "salvaged_pickaxe",
    name: "Salvaged Pickaxe",
    description: "High-tier mining tool made from salvaged parts. Very efficient at gathering ore.",
    category: "tools",
    subcategory: "salvaged",
    stackSize: 1,
    sources: [
      "Crafting (requires blueprint)",
      "Crates at monuments",
    ],
    crafting: {
      ingredients: [
        { item: "Metal Pipe", amount: 1 },
        { item: "Metal Fragments", amount: 125 },
      ],
      output: 1,
      time: 15,
      workbench: 1,
    },
    tips: [
      "Best pickaxe before jackhammer",
      "Gathers ~60% more than metal pick",
      "Blueprint needed - research it early",
    ],
  },
  {
    id: "salvaged_axe",
    name: "Salvaged Axe",
    description: "High-tier wood gathering tool. The most efficient axe for chopping trees.",
    category: "tools",
    subcategory: "salvaged",
    stackSize: 1,
    sources: [
      "Crafting (requires blueprint)",
      "Crates at monuments",
    ],
    crafting: {
      ingredients: [
        { item: "Metal Pipe", amount: 1 },
        { item: "Metal Fragments", amount: 150 },
      ],
      output: 1,
      time: 15,
      workbench: 1,
    },
    tips: [
      "Best axe in the game for wood",
      "Also great for harvesting animals",
      "Strong melee weapon in a pinch",
    ],
  },
  {
    id: "jackhammer",
    name: "Jackhammer",
    description: "Powerful power tool for mining. Extremely fast but requires Low Grade Fuel to operate.",
    category: "tools",
    subcategory: "power",
    stackSize: 1,
    sources: [
      "Outpost vending machine (150 Scrap)",
      "Elite crates",
    ],
    tips: [
      "Fastest mining tool in the game",
      "Uses Low Grade Fuel (hold to mine)",
      "Cannot be crafted - buy at Outpost",
      "Completely depletes nodes in seconds",
    ],
  },
  {
    id: "chainsaw",
    name: "Chainsaw",
    description: "Power tool for cutting trees. Extremely fast but requires Low Grade Fuel.",
    category: "tools",
    subcategory: "power",
    stackSize: 1,
    sources: [
      "Outpost vending machine (125 Scrap)",
      "Elite crates",
    ],
    tips: [
      "Fastest wood gathering tool",
      "Uses Low Grade Fuel",
      "Very loud - attracts attention",
      "Cannot be crafted - buy at Outpost",
    ],
  },
  {
    id: "hammer",
    name: "Hammer",
    description: "Essential building tool for upgrading, repairing, and rotating building pieces.",
    category: "tools",
    subcategory: "building",
    stackSize: 1,
    sources: [
      "Crafting",
    ],
    crafting: {
      ingredients: [
        { item: "Wood", amount: 100 },
      ],
      output: 1,
      time: 10,
      workbench: 0,
    },
    tips: [
      "Hold E to see upgrade/repair options",
      "Can rotate doors and walls (within time limit)",
      "Essential for base building",
      "Also a weak melee weapon",
    ],
  },
  {
    id: "building_plan",
    name: "Building Plan",
    description: "Required tool for placing building components like walls, floors, and foundations.",
    category: "tools",
    subcategory: "building",
    stackSize: 1,
    sources: [
      "Crafting",
    ],
    crafting: {
      ingredients: [
        { item: "Wood", amount: 20 },
      ],
      output: 1,
      time: 5,
      workbench: 0,
    },
    tips: [
      "Right-click to select building piece",
      "Twig pieces are free to place",
      "Must be in building privilege (TC)",
      "Essential - always keep one",
    ],
  },
  {
    id: "torch",
    name: "Torch",
    description: "Basic light source. Provides light and can be used to ignite things.",
    category: "tools",
    subcategory: "utility",
    stackSize: 1,
    sources: [
      "Spawned with on beach",
      "Crafting",
    ],
    crafting: {
      ingredients: [
        { item: "Wood", amount: 30 },
        { item: "Cloth", amount: 1 },
      ],
      output: 1,
      time: 5,
      workbench: 0,
    },
    tips: [
      "Hold right-click to light/extinguish",
      "Gives away your position at night",
      "Can ignite campfires and furnaces",
      "Low Grade Fuel burns longer",
    ],
  },
  {
    id: "flashlight",
    name: "Flashlight",
    description: "Battery-powered light. More practical than a torch as it doesn't require fuel.",
    category: "tools",
    subcategory: "utility",
    stackSize: 1,
    sources: [
      "Crafting",
      "Crates",
    ],
    crafting: {
      ingredients: [
        { item: "Metal Fragments", amount: 50 },
      ],
      output: 1,
      time: 15,
      workbench: 1,
    },
    tips: [
      "Can be attached to weapons",
      "Toggle with F key when attached",
      "Does not consume resources",
      "Reveals your position at night",
    ],
  },
  {
    id: "binoculars",
    name: "Binoculars",
    description: "Optical tool for scouting distant locations and enemies without alerting them.",
    category: "tools",
    subcategory: "utility",
    stackSize: 1,
    sources: [
      "Crates at monuments",
      "Sunken chests",
    ],
    tips: [
      "Right-click to zoom in",
      "Great for scouting bases",
      "Silent - doesn't alert enemies",
      "Cannot be crafted",
    ],
  },

  // ============================================
  // MEDICAL - Healing & Recovery
  // ============================================
  {
    id: "bandage",
    name: "Bandage",
    description: "Basic healing item that stops bleeding and restores a small amount of health over time.",
    category: "medical",
    subcategory: "basic",
    stackSize: 3,
    sources: [
      "Crafting",
      "Barrels and crates",
    ],
    crafting: {
      ingredients: [
        { item: "Cloth", amount: 4 },
      ],
      output: 1,
      time: 5,
      workbench: 0,
    },
    tips: [
      "Heals 5 HP instantly + 10 over time",
      "Stops bleeding effect",
      "Cheap and easy to make early game",
      "Keep a few in your hotbar",
    ],
  },
  {
    id: "medical_syringe",
    name: "Medical Syringe",
    description: "Instant healing item that restores 15 health immediately plus 20 over time.",
    category: "medical",
    subcategory: "advanced",
    stackSize: 2,
    sources: [
      "Crafting (requires blueprint)",
      "Medical crates",
      "Scientists",
    ],
    crafting: {
      ingredients: [
        { item: "Metal Fragments", amount: 10 },
        { item: "Cloth", amount: 10 },
      ],
      output: 1,
      time: 10,
      workbench: 1,
    },
    tips: [
      "15 HP instant + 20 HP over time",
      "Essential for PvP combat",
      "Can use while moving",
      "Research priority - very useful",
    ],
  },
  {
    id: "med_kit",
    name: "Med Kit",
    description: "Advanced healing item that provides significant health restoration over time.",
    category: "medical",
    subcategory: "advanced",
    stackSize: 1,
    sources: [
      "Crafting (requires blueprint)",
      "Medical crates",
      "Elite crates",
    ],
    crafting: {
      ingredients: [
        { item: "Cloth", amount: 15 },
        { item: "Metal Fragments", amount: 30 },
        { item: "Low Grade Fuel", amount: 10 },
      ],
      output: 1,
      time: 20,
      workbench: 2,
    },
    tips: [
      "Heals 100 HP over 10 seconds",
      "Cannot move while using",
      "Best healing item for out-of-combat",
      "Expensive but worth it",
    ],
  },
  {
    id: "large_medkit",
    name: "Large Medkit",
    description: "Military-grade medical kit that fully heals the user. Very rare and valuable.",
    category: "medical",
    subcategory: "military",
    stackSize: 1,
    sources: [
      "Elite crates",
      "Locked crates",
      "Helicopter and Bradley",
    ],
    tips: [
      "Heals to full health",
      "Cannot be crafted",
      "Very rare - save for emergencies",
      "Found only at top-tier loot",
    ],
  },
  {
    id: "anti_rad_pills",
    name: "Anti-Radiation Pills",
    description: "Removes radiation poisoning instantly. Essential for monument runs.",
    category: "medical",
    subcategory: "radiation",
    stackSize: 10,
    sources: [
      "Crafting",
      "Medical crates",
      "Food crates",
    ],
    crafting: {
      ingredients: [
        { item: "Cloth", amount: 3 },
      ],
      output: 1,
      time: 5,
      workbench: 0,
    },
    tips: [
      "Instantly removes radiation",
      "Cheap to craft - make plenty",
      "Essential for rad towns",
      "Does NOT prevent radiation buildup",
    ],
  },
  {
    id: "blood",
    name: "Blood",
    description: "Blood drawn from players or animals. Can be used to craft medical items or consumed directly for minor healing.",
    category: "medical",
    subcategory: "basic",
    stackSize: 10,
    sources: [
      "Blood Draw Kit on players",
      "Harvesting animals",
    ],
    tips: [
      "Drinking restores small HP",
      "Used to craft Med Kits",
      "Blood Draw Kit takes your blood",
      "Can trade blood at Bandit Camp",
    ],
  },
  {
    id: "pure_tea",
    name: "Pure Healing Tea",
    description: "A powerful healing tea that provides rapid health regeneration for a period of time.",
    category: "medical",
    subcategory: "tea",
    stackSize: 10,
    sources: [
      "Mixing Table (requires berries)",
      "Some crates",
    ],
    tips: [
      "Provides healing over time buff",
      "Stacks with other healing",
      "Made from red berries at Mixing Table",
      "Great for sustained fights",
    ],
  },
  {
    id: "pure_max_health_tea",
    name: "Pure Max Health Tea",
    description: "Increases maximum health temporarily, allowing you to survive more damage.",
    category: "medical",
    subcategory: "tea",
    stackSize: 10,
    sources: [
      "Mixing Table (requires yellow berries)",
    ],
    tips: [
      "Temporarily increases max HP",
      "Great before raids or fights",
      "Made from yellow berries",
      "Effect stacks with healing items",
    ],
  },
  {
    id: "pure_anti_rad_tea",
    name: "Pure Anti-Rad Tea",
    description: "Provides radiation resistance for a period of time. Better than pills for extended monument runs.",
    category: "medical",
    subcategory: "tea",
    stackSize: 10,
    sources: [
      "Mixing Table (requires green berries)",
    ],
    tips: [
      "Provides radiation RESISTANCE (not removal)",
      "Lasts several minutes",
      "Better than pills for long runs",
      "Stack with hazmat for full protection",
    ],
  },
];

// Helper functie om items per categorie te krijgen
export function getItemsByCategory(category: ItemCategory): WikiItem[] {
  return wikiItems.filter(item => item.category === category);
}

// Helper functie om item op id te krijgen
export function getItemById(id: string): WikiItem | undefined {
  return wikiItems.find(item => item.id === id);
}

// Categorieën met metadata
export const itemCategories: Record<ItemCategory, { name: string; emoji: string; description: string }> = {
  resources: {
    name: "Resources",
    emoji: "🪨",
    description: "Raw and refined materials for crafting and building",
  },
  components: {
    name: "Components",
    emoji: "⚙️",
    description: "Parts used for crafting weapons, tools, and electronics",
  },
  tools: {
    name: "Tools",
    emoji: "🛠️",
    description: "Equipment for gathering and building",
  },
  medical: {
    name: "Medical",
    emoji: "💊",
    description: "Healing items and medical supplies",
  },
};
