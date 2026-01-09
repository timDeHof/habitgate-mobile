/**
 * App-related service functions for the HabitGate application.
 * Handles TanStack Query hooks and async operations for app management.
 */

import type {
  LockedApp,
  UnlockSession,
  AppIdentifier,
  UnlockType,
} from "../data/apps";

// ============================================================================
// TanStack Query Keys
// ============================================================================

/**
 * Query keys for TanStack Query caching.
 */
export const appKeys = {
  all: ["apps"] as const,
  lists: () => [...appKeys.all, "list"] as const,
  list: (filters?: AppFilters) => [...appKeys.lists(), filters] as const,
  details: () => [...appKeys.all, "detail"] as const,
  detail: (id: string) => [...appKeys.details(), id] as const,
  byIdentifier: (identifier: AppIdentifier) =>
    [...appKeys.all, "identifier", identifier] as const,
  sessions: (appId?: string) =>
    appId ? ["sessions", appId] : (["sessions"] as const),
  activeSessions: () => ["active-sessions"] as const,
};

/**
 * Optional filters for app queries.
 */
export interface AppFilters {
  category?: string;
  isActive?: boolean;
  maxCost?: number;
  minCost?: number;
}

// ============================================================================
// ID Generation
// ============================================================================

/**
 * Generates a unique ID with optional prefix.
 * @param prefix - Optional prefix for the ID
 * @returns Unique string identifier
 */
export function generateId(prefix: string = "id"): string {
  const timestamp = Date.now().toString(36);
  const randomPart = Math.random().toString(36).substring(2, 9);
  return `${prefix}_${timestamp}${randomPart}`;
}

// ============================================================================
// Async Query Functions (for TanStack Query)
// ============================================================================

/**
 * Fetches all locked apps from the data source.
 * @param filters - Optional filters to apply
 * @returns Promise resolving to array of locked apps
 */
export async function fetchApps(filters?: AppFilters): Promise<LockedApp[]> {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 100));

  const { LOCKED_APPS } = await import("../data/apps");

  let filtered = LOCKED_APPS;

  if (filters) {
    if (filters.category) {
      filtered = filtered.filter((app) => app.category === filters.category);
    }
    if (filters.isActive !== undefined) {
      filtered = filtered.filter((app) => app.isActive === filters.isActive);
    }
    if (filters.maxCost !== undefined) {
      filtered = filtered.filter((app) => app.unlockCost <= filters.maxCost!);
    }
    if (filters.minCost !== undefined) {
      filtered = filtered.filter((app) => app.unlockCost >= filters.minCost!);
    }
  }

  return filtered;
}

/**
 * Fetches a single locked app by ID.
 * @param id - App ID to fetch
 * @returns Promise resolving to LockedApp or undefined
 */
export async function fetchAppById(id: string): Promise<LockedApp | undefined> {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 50));

  const { LOCKED_APPS } = await import("../data/apps");
  return LOCKED_APPS.find((app) => app.id === id);
}

/**
 * Fetches a locked app by its app identifier (e.g., "Instagram").
 * @param appIdentifier - App identifier to search for
 * @returns Promise resolving to LockedApp or undefined
 */
export async function fetchAppByIdentifier(
  appIdentifier: AppIdentifier
): Promise<LockedApp | undefined> {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 50));

  const { LOCKED_APPS } = await import("../data/apps");
  return LOCKED_APPS.find((app) => app.appIdentifier === appIdentifier);
}

/**
 * Fetches all active (unlockable) apps.
 * @returns Promise resolving to array of active LockedApp objects
 */
export async function fetchActiveApps(): Promise<LockedApp[]> {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 50));

  const { LOCKED_APPS } = await import("../data/apps");
  return LOCKED_APPS.filter((app) => app.isActive);
}

/**
 * Fetches apps filtered by category.
 * @param category - Category to filter by
 * @returns Promise resolving to array of LockedApp objects
 */
export async function fetchAppsByCategory(
  category: string
): Promise<LockedApp[]> {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 50));

  const { LOCKED_APPS } = await import("../data/apps");
  return LOCKED_APPS.filter((app) => app.category === category);
}

// ============================================================================
// Unlock Session Functions
// ============================================================================

/**
 * Fetches all unlock sessions.
 * @param appId - Optional app ID to filter sessions
 * @returns Promise resolving to array of unlock sessions
 */
export async function fetchUnlockSessions(
  appId?: string
): Promise<UnlockSession[]> {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 100));

  // In production, this would be an API call
  // For now, return empty array as sessions are runtime data
  const sessions: UnlockSession[] = [];

  if (appId) {
    return sessions.filter((s) => s.lockedAppId === appId);
  }

  return sessions;
}

/**
 * Fetches all active (non-expired) unlock sessions.
 * @returns Promise resolving to array of active unlock sessions
 */
export async function fetchActiveUnlockSessions(): Promise<UnlockSession[]> {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 100));

  const now = Date.now();
  const sessions: UnlockSession[] = [];

  // In production, filter by expiresAt > now
  return sessions.filter((s) => s.expiresAt > now);
}

// ============================================================================
// Mutation Functions (for TanStack Query mutations)
// ============================================================================

/**
 * Creates a new unlock session.
 * @param appId - ID of the app to unlock
 * @param unlockType - Type of unlock
 * @returns Promise resolving to created session
 */
export async function createUnlockSession(
  appId: string,
  unlockType: UnlockType
): Promise<UnlockSession> {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 200));

  const { LOCKED_APPS } = await import("../data/apps");
  const app = LOCKED_APPS.find((a) => a.id === appId);

  if (!app) {
    throw new Error(`App with ID ${appId} not found`);
  }

  const now = Date.now();
  const session: UnlockSession = {
    id: generateId("session"),
    lockedAppId: appId,
    unlockType,
    cost: app.unlockCost,
    duration: app.unlockDuration,
    startedAt: now,
    expiresAt: now + app.unlockDuration * 60 * 1000,
    actuallyUsed: false,
    icon: app.appIconUrl || "",
  };

  console.log("Created unlock session:", session);
  return session;
}

/**
 * Updates an unlock session.
 * @param sessionId - Session ID to update
 * @param data - Partial session data
 * @returns Promise resolving to updated session
 */
export async function updateUnlockSession(
  sessionId: string,
  data: Partial<UnlockSession>
): Promise<UnlockSession> {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 200));

  // In production, fetch and update from API
  console.log("Updated session:", sessionId, data);

  return {
    id: sessionId,
    lockedAppId: data.lockedAppId || "",
    unlockType: data.unlockType || "normal",
    cost: data.cost || 0,
    duration: data.duration || 0,
    startedAt: data.startedAt || Date.now(),
    expiresAt: data.expiresAt || Date.now(),
    actuallyUsed: data.actuallyUsed || false,
    icon: data.icon || "",
  };
}

/**
 * Marks a session as used.
 * @param sessionId - Session ID to mark as used
 * @returns Promise resolving when complete
 */
export async function markSessionUsed(sessionId: string): Promise<void> {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 100));

  console.log("Marked session as used:", sessionId);
}

/**
 * Ends an unlock session early.
 * @param sessionId - Session ID to end
 * @returns Promise resolving when complete
 */
export async function endUnlockSession(sessionId: string): Promise<void> {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 100));

  console.log("Ended unlock session:", sessionId);
}

// ============================================================================
// Utility Functions (Synchronous - for local state management)
// ============================================================================

/**
 * Find a locked app by its unique ID.
 * @param id - The unique identifier to search for
 * @param apps - Optional apps array to search
 * @returns The LockedApp if found, undefined otherwise
 */
export function getLockedAppById(
  id: string,
  apps: LockedApp[] = []
): LockedApp | undefined {
  const appList = apps.length > 0 ? apps : [];
  return (appList as LockedApp[]).find((app) => app.id === id);
}

/**
 * Find a locked app by its app identifier (e.g., "Instagram").
 * @param appIdentifier - The app identifier to search for
 * @param apps - Optional apps array to search
 * @returns The LockedApp if found, undefined otherwise
 */
export function getLockedAppByIdentifier(
  appIdentifier: AppIdentifier,
  apps: LockedApp[] = []
): LockedApp | undefined {
  const appList = apps.length > 0 ? apps : [];
  return (appList as LockedApp[]).find(
    (app) => app.appIdentifier === appIdentifier
  );
}

/**
 * Get all active (unlockable) apps.
 * @param apps - Optional apps array to filter
 * @returns Array of active LockedApp objects
 */
export function getActiveApps(apps: LockedApp[] = []): LockedApp[] {
  const appList = apps.length > 0 ? apps : [];
  return (appList as LockedApp[]).filter((app) => app.isActive);
}

/**
 * Get apps filtered by category.
 * @param category - The category to filter by
 * @param apps - Optional apps array to filter
 * @returns Array of LockedApp objects in the specified category
 */
export function getAppsByCategory(
  category: string,
  apps: LockedApp[] = []
): LockedApp[] {
  const appList = apps.length > 0 ? apps : [];
  return (appList as LockedApp[]).filter((app) => app.category === category);
}

/**
 * Calculate total cost for multiple apps.
 * @param appIds - Array of app IDs to calculate cost for
 * @param apps - Optional apps array to reference
 * @returns Total unlock cost
 */
export function calculateTotalCost(
  appIds: string[],
  apps: LockedApp[] = []
): number {
  const appList = apps.length > 0 ? apps : [];
  return (appIds as string[]).reduce((total, id) => {
    const app = (appList as LockedApp[]).find((a) => a.id === id);
    return total + (app?.unlockCost || 0);
  }, 0);
}

/**
 * Check if an unlock session is still valid.
 * @param session - Unlock session to check
 * @returns True if session is still active
 */
export function isSessionValid(session: UnlockSession): boolean {
  return session.expiresAt > Date.now();
}

/**
 * Get remaining time in milliseconds for a session.
 * @param session - Unlock session to check
 * @returns Remaining time in ms (0 if expired)
 */
export function getRemainingTime(session: UnlockSession): number {
  const remaining = session.expiresAt - Date.now();
  return remaining > 0 ? remaining : 0;
}
