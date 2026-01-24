// Re-export Prisma types for convenience
export type {
  User,
  Team,
  TeamMember,
  MapSession,
  Marker,
  EnemyProfile,
  AuditLog,
} from "@prisma/client";

// Enums
export { Role, TeamRole, MarkerType, Visibility } from "@prisma/client";

// Custom types for API responses
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

// Marker with relations
export interface MarkerWithRelations {
  id: string;
  title: string;
  description: string | null;
  type: string;
  x: number;
  y: number;
  color: string;
  icon: string | null;
  visibility: string;
  lastSeenAt: Date | null;
  tags: string | null;
  createdAt: Date;
  updatedAt: Date;
  createdBy: {
    id: string;
    displayName: string;
  };
  enemyProfile?: {
    id: string;
    name: string;
    clanTag: string | null;
    threatLevel: number;
  } | null;
}

// Map session with markers count
export interface MapSessionWithCount {
  id: string;
  seed: string;
  serverName: string | null;
  mapSize: number;
  wipeDate: Date | null;
  isActive: boolean;
  createdAt: Date;
  _count: {
    markers: number;
  };
}
