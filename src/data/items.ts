// Item data met extra info (crafting, decay, etc.)
// Wordt gekoppeld aan raid-costs.json via id

export interface ItemDetails {
  id: string;
  name: string;
  description: string;
  category: "door" | "building" | "deployable";
  image?: string;
  crafting?: {
    ingredients: { item: string; amount: number }[];
    time: string;
    workbench?: number;
  };
  upkeep?: {
    cost: string;
    decay: string;
  };
  repair?: {
    maxCost: string;
    requiresBlueprint: boolean;
  };
  recycling?: {
    output: string;
    safeZoneOutput?: string;
  };
  tips?: string[];
}

export const itemDetails: Record<string, ItemDetails> = {
  sheet_metal_door: {
    id: "sheet_metal_door",
    name: "Sheet Metal Door",
    description:
      "The sheet metal door is commonly used because it offers good resistance to melee weapons and fire while being relatively inexpensive to craft. However, it is weaker against explosive attacks than the more expensive armoured door.",
    category: "door",
    image: "/img/items/door.hinged.metal.png",
    crafting: {
      ingredients: [{ item: "Metal Fragments", amount: 150 }],
      time: "7-30 seconds",
      workbench: 0,
    },
    upkeep: {
      cost: "15-50 Metal Fragments",
      decay: "8 hours",
    },
    repair: {
      maxCost: "75 Metal Fragments",
      requiresBlueprint: false,
    },
    recycling: {
      output: "90 Metal Fragments (60%)",
      safeZoneOutput: "60 Metal Fragments (40%)",
    },
    tips: [
      "One rocket plus roughly six explosive rifle rounds is considered an efficient way to destroy a sheet metal door.",
      "A cheaper method uses three satchel charges and three beancan grenades.",
      "The door can be crafted early in the game without a workbench.",
      "You can choose which side the door opens to create an airlock.",
    ],
  },

  wooden_door: {
    id: "wooden_door",
    name: "Wooden Door",
    description:
      "The most basic door in Rust. Very weak and can be destroyed easily with melee weapons or fire.",
    category: "door",
    image: "/img/items/door.hinged.wood.png",
    crafting: {
      ingredients: [{ item: "Wood", amount: 300 }],
      time: "5-15 seconds",
      workbench: 0,
    },
  },

  armored_door: {
    id: "armored_door",
    name: "Armored Door",
    description:
      "The strongest door in Rust. Very expensive to craft but provides excellent protection against all raid methods.",
    category: "door",
    image: "/img/items/door.hinged.armored.png",
    crafting: {
      ingredients: [
        { item: "High Quality Metal", amount: 25 },
        { item: "Gears", amount: 5 },
      ],
      time: "30 seconds",
      workbench: 2,
    },
  },

  garage_door: {
    id: "garage_door",
    name: "Garage Door",
    description:
      "A large door that takes up an entire wall frame. Popular for airlocks and main entrances due to its size and decent protection.",
    category: "door",
    image: "/img/items/door.hinged.garage.png",
    crafting: {
      ingredients: [
        { item: "Metal Fragments", amount: 300 },
        { item: "Gears", amount: 2 },
      ],
      time: "30 seconds",
      workbench: 1,
    },
  },
};
