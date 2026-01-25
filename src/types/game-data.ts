// =============================================================================
// RUST GAME DATA TYPES
// Source: wiki.rustclash.com (pending manual extraction)
// =============================================================================

// -----------------------------------------------------------------------------
// ENUMS
// -----------------------------------------------------------------------------

export type BuildingTier = 'twig' | 'wood' | 'stone' | 'metal' | 'armored';

export type BuildingType =
  | 'wall'
  | 'foundation'
  | 'floor'
  | 'roof'
  | 'stairs'
  | 'door_frame'
  | 'window_frame'
  | 'wall_frame'
  | 'floor_frame';

export type DoorType =
  | 'wooden_door'
  | 'sheet_metal_door'
  | 'garage_door'
  | 'armored_door'
  | 'ladder_hatch'
  | 'floor_grill';

export type DeployableType =
  | 'tool_cupboard'
  | 'workbench_t1'
  | 'workbench_t2'
  | 'workbench_t3'
  | 'vending_machine'
  | 'large_wood_box'
  | 'small_wood_box'
  | 'furnace'
  | 'large_furnace'
  | 'oil_refinery'
  | 'research_table'
  | 'repair_bench'
  | 'mixing_table'
  | 'sleeping_bag'
  | 'bed'
  | 'auto_turret'
  | 'flame_turret'
  | 'shotgun_trap'
  | 'sam_site'
  | 'high_external_wood_wall'
  | 'high_external_stone_wall'
  | 'high_external_wood_gate'
  | 'high_external_stone_gate';

export type ExplosiveType =
  | 'rocket'
  | 'c4'
  | 'satchel'
  | 'explosive_ammo'
  | 'high_velocity_rocket'
  | 'incendiary_rocket'
  | 'f1_grenade'
  | 'beancan_grenade';

// -----------------------------------------------------------------------------
// DATA STATUS (for tracking extraction progress)
// -----------------------------------------------------------------------------

export type DataStatus = 'pending_manual_fill' | 'pending_browser_extract' | 'verified';

export interface DataMeta {
  status: DataStatus;
  source_page: string;       // e.g., "wiki.rustclash.com/raid-chart"
  last_updated: string | null;
  notes?: string;
}

// -----------------------------------------------------------------------------
// RAID COSTS
// -----------------------------------------------------------------------------

export interface RaidMethod {
  quantity: number | null;   // null = pending
  sulfur_cost: number | null;
}

export interface RaidCostEntry {
  id: string;                           // unique identifier
  target_name: string;                  // display name
  target_type: 'building' | 'door' | 'deployable';
  tier?: BuildingTier;                  // only for buildings
  hp: number | null;

  // Raid methods
  rockets: RaidMethod;
  c4: RaidMethod;
  satchels: RaidMethod;
  explosive_ammo: RaidMethod;

  // Most efficient method (lowest sulfur)
  cheapest_sulfur: number | null;
  cheapest_method: ExplosiveType | null;

  // Metadata
  meta: DataMeta;
}

// -----------------------------------------------------------------------------
// EXPLOSIVES (crafting costs)
// -----------------------------------------------------------------------------

export interface ExplosiveCraftCost {
  id: ExplosiveType;
  name: string;
  sulfur_per_unit: number | null;
  gunpowder_per_unit: number | null;

  // Full recipe
  recipe: {
    sulfur: number | null;
    charcoal: number | null;
    metal_frags: number | null;
    low_grade: number | null;
    cloth: number | null;
    tech_trash: number | null;
    metal_pipe: number | null;
  };

  // Crafting info
  workbench_tier: 1 | 2 | 3 | null;
  craft_time_seconds: number | null;

  // Damage output
  damage_to_buildings: number | null;

  meta: DataMeta;
}

// -----------------------------------------------------------------------------
// BUILDINGS (HP & construction costs)
// -----------------------------------------------------------------------------

export interface BuildingEntry {
  id: string;
  type: BuildingType;
  tier: BuildingTier;
  display_name: string;

  // Stats
  hp: number | null;
  decay_hours: number | null;

  // Construction cost
  build_cost: {
    wood: number | null;
    stone: number | null;
    metal_frags: number | null;
    high_quality_metal: number | null;
  };

  // Upkeep per 24h
  upkeep_cost: {
    wood: number | null;
    stone: number | null;
    metal_frags: number | null;
    high_quality_metal: number | null;
  };

  // Upgrade cost (from previous tier)
  upgrade_cost: {
    wood: number | null;
    stone: number | null;
    metal_frags: number | null;
    high_quality_metal: number | null;
  } | null;

  meta: DataMeta;
}

// -----------------------------------------------------------------------------
// DOORS
// -----------------------------------------------------------------------------

export interface DoorEntry {
  id: DoorType;
  display_name: string;
  hp: number | null;

  // Construction cost
  build_cost: {
    wood: number | null;
    metal_frags: number | null;
    high_quality_metal: number | null;
    gears: number | null;
  };

  // Lock compatibility
  accepts_lock: boolean;
  accepts_code_lock: boolean;

  meta: DataMeta;
}

// -----------------------------------------------------------------------------
// COLLECTION TYPES (for JSON files)
// -----------------------------------------------------------------------------

export interface RaidCostsData {
  version: string;
  source: 'wiki.rustclash.com';
  extraction_date: string | null;

  // Sulfur costs per explosive (reference values)
  explosive_sulfur_costs: Record<ExplosiveType, number | null>;

  // All raid targets
  buildings: RaidCostEntry[];
  doors: RaidCostEntry[];
  deployables: RaidCostEntry[];
}

export interface ExplosivesData {
  version: string;
  source: 'wiki.rustclash.com';
  extraction_date: string | null;
  explosives: ExplosiveCraftCost[];
}

export interface BuildingsData {
  version: string;
  source: 'wiki.rustclash.com';
  extraction_date: string | null;
  buildings: BuildingEntry[];
  doors: DoorEntry[];
}
