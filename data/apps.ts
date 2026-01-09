/**
 * App Data Module
 *
 * This module defines types and data for locked/unlocked apps in the HabitGate app.
 * Apps can be temporarily unlocked using time currency.
 *
 * Note: Service functions have been moved to services/apps.ts
 */

// ============================================================================
// Constants & Types
// ============================================================================

// App identifiers as constants for type safety and easier maintenance
export const APP_IDENTIFIERS = {
  INSTAGRAM: "Instagram",
  YOUTUBE: "YouTube",
  TWITTER: "Twitter",
  TIKTOK: "TikTok",
} as const;

export type AppIdentifier =
  (typeof APP_IDENTIFIERS)[keyof typeof APP_IDENTIFIERS];

// Unlock type discriminator for type-safe handling
export const UNLOCK_TYPES = {
  NORMAL: "normal",
  EMERGENCY: "emergency",
  BONUS: "bonus",
} as const;

export type UnlockType = (typeof UNLOCK_TYPES)[keyof typeof UNLOCK_TYPES];

// ============================================================================
// Interfaces
// ============================================================================

/**
 * Represents an app that can be locked and unlocked by the user.
 * The user spends time currency to temporarily unlock these apps.
 */
export interface LockedApp {
  /** Unique identifier for the locked app configuration */
  id: string;
  /** Machine-readable app identifier (e.g., "Instagram") */
  appIdentifier: AppIdentifier;
  /** Human-readable app name displayed to users */
  appName: string;
  /** URL to the app's icon image */
  appIconUrl?: string;
  /** Category for grouping apps (e.g., "Social", "Entertainment") */
  category?: string;
  /** Time currency cost to unlock this app */
  unlockCost: number;
  /** Duration in minutes the unlock lasts */
  unlockDuration: number;
  /** Whether this app is currently available for unlocking */
  isActive: boolean;
  /** Timestamp when this record was created */
  createdAt: number;
  /** Timestamp when this record was last updated */
  updatedAt: number;
}

/**
 * Represents an active or past unlock session for a locked app.
 */
export interface UnlockSession {
  /** Unique identifier for the unlock session */
  id: string;
  /** Reference to the locked app being unlocked */
  lockedAppId: string;
  /** Type of unlock - affects cost/behavior */
  unlockType: UnlockType;
  /** Time currency cost for this specific unlock */
  cost: number;
  /** Duration in minutes for this specific unlock */
  duration: number;
  /** Timestamp when the unlock was started */
  startedAt: number;
  /** Timestamp when the unlock expires */
  expiresAt: number;
  /** Whether the user actually used the app during the unlock period */
  actuallyUsed: boolean;
  /** Icon identifier or URL for display purposes */
  icon: string;
}

// ============================================================================
// Mock Data - Locked Apps Configuration
// ============================================================================

/**
 * Predefined locked apps available in the app.
 * In production, this would likely come from a backend or database.
 */
export const LOCKED_APPS: LockedApp[] = [
  {
    id: "app_001",
    appIdentifier: APP_IDENTIFIERS.INSTAGRAM,
    appName: "Instagram",
    appIconUrl: "https://instagram.com/icon.png",
    category: "Social",
    unlockCost: 15,
    unlockDuration: 30,
    isActive: true,
    createdAt: 1700000000000,
    updatedAt: 1700000000000,
  },
  {
    id: "app_002",
    appIdentifier: APP_IDENTIFIERS.YOUTUBE,
    appName: "YouTube",
    appIconUrl: "https://youtube.com/icon.png",
    category: "Entertainment",
    unlockCost: 20,
    unlockDuration: 45,
    isActive: true,
    createdAt: 1700000000000,
    updatedAt: 1700000000000,
  },
  {
    id: "app_003",
    appIdentifier: APP_IDENTIFIERS.TWITTER,
    appName: "Twitter",
    appIconUrl: "https://twitter.com/icon.png",
    category: "Social",
    unlockCost: 10,
    unlockDuration: 20,
    isActive: true,
    createdAt: 1700000000000,
    updatedAt: 1700000000000,
  },
  {
    id: "app_004",
    appIdentifier: APP_IDENTIFIERS.TIKTOK,
    appName: "TikTok",
    appIconUrl: "https://tiktok.com/icon.png",
    category: "Entertainment",
    unlockCost: 15,
    unlockDuration: 30,
    isActive: true,
    createdAt: 1700000000000,
    updatedAt: 1700000000000,
  },
];

// ============================================================================
// Re-exports from Services (Convenience)
// ============================================================================

// Query functions (async - for TanStack Query)
export {
  fetchApps,
  fetchAppById,
  fetchAppByIdentifier,
  fetchActiveApps,
  fetchAppsByCategory,
  fetchUnlockSessions,
  fetchActiveUnlockSessions,
} from "../services/apps";

// Mutation functions (async - for TanStack Query mutations)
export {
  createUnlockSession,
  updateUnlockSession,
  markSessionUsed,
  endUnlockSession,
} from "../services/apps";

// Query keys for TanStack Query caching
export { appKeys, type AppFilters } from "../services/apps";

// Utility functions (sync - for local state)
export {
  generateId,
  getLockedAppById,
  getLockedAppByIdentifier,
  getActiveApps,
  getAppsByCategory,
  calculateTotalCost,
  isSessionValid,
  getRemainingTime,
} from "../services/apps";
