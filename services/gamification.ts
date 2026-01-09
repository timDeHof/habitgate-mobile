/**
 * Gamification service functions for the HabitGate application.
 * Handles TanStack Query hooks and async operations for achievements, XP, and levels.
 */

import type {
  Achievement,
  AchievementRarity,
  GamificationState,
  LevelConfig,
} from "../data/gamification";
import {
  LEVELS,
  ACHIEVEMENTS,
  INITIAL_GAMIFICATION_STATE,
} from "../data/gamification";

// ============================================================================
// TanStack Query Keys
// ============================================================================

/**
 * Query keys for TanStack Query caching.
 */
export const gamificationKeys = {
  all: ["gamification"] as const,
  state: () => [...gamificationKeys.all, "state"] as const,
  achievements: () => [...gamificationKeys.all, "achievements"] as const,
  achievement: (code: string) =>
    [...gamificationKeys.achievements(), code] as const,
  level: () => [...gamificationKeys.all, "level"] as const,
  xp: () => [...gamificationKeys.all, "xp"] as const,
  streaks: () => [...gamificationKeys.all, "streaks"] as const,
};

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
 * Fetches all achievements with optional filtering.
 * @param filters - Optional filters
 * @returns Promise resolving to array of achievements
 */
export async function fetchAchievements(filters?: {
  rarity?: AchievementRarity;
  onlyUnlocked?: boolean;
}): Promise<Achievement[]> {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 100));

  let filtered = ACHIEVEMENTS;

  if (filters) {
    if (filters.rarity) {
      filtered = filtered.filter((a) => a.badge.rarity === filters.rarity);
    }
    if (filters.onlyUnlocked) {
      filtered = filtered.filter((a) => a.unlockedAt !== undefined);
    }
  }

  return filtered;
}

/**
 * Fetches the current gamification state.
 * @returns Promise resolving to gamification state
 */
export async function fetchGamificationState(): Promise<GamificationState> {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 100));

  // In production, this would fetch from a backend
  return { ...INITIAL_GAMIFICATION_STATE };
}

/**
 * Fetches level configuration for a specific level.
 * @param level - Level number to fetch config for
 * @returns Promise resolving to level config or undefined
 */
export async function fetchLevelConfig(
  level: number
): Promise<LevelConfig | undefined> {
  await new Promise((resolve) => setTimeout(resolve, 50));
  return LEVELS.find((l) => l.level === level);
}

/**
 * Fetches XP required for the next level.
 * @param currentLevel - Current level number
 * @param currentXP - Current XP amount
 * @returns Promise resolving to XP info object
 */
export async function fetchNextLevelXP(
  currentLevel: number,
  currentXP: number
): Promise<{
  currentLevel: number;
  nextLevel: number;
  xpForCurrent: number;
  xpForNext: number;
  xpRemaining: number;
  xpProgress: number;
}> {
  await new Promise((resolve) => setTimeout(resolve, 50));

  const currentConfig = LEVELS.find((l) => l.level === currentLevel);
  const nextConfig = LEVELS.find((l) => l.level === currentLevel + 1);

  if (!currentConfig) {
    throw new Error(`Level ${currentLevel} not found`);
  }

  const xpForCurrent = currentConfig.xpRequired;
  const xpForNext = nextConfig?.xpRequired ?? currentConfig.xpRequired + 1000;
  const xpRemaining = xpForNext - currentXP;
  const xpProgress = currentXP - xpForCurrent;

  return {
    currentLevel,
    nextLevel: currentLevel + 1,
    xpForCurrent,
    xpForNext,
    xpRemaining: Math.max(0, xpRemaining),
    xpProgress: Math.max(0, xpProgress),
  };
}

/**
 * Calculates level progress from XP.
 * @param totalXP - Total XP earned
 * @returns Object with level info and progress percentage
 */
export async function calculateLevelProgress(totalXP: number): Promise<{
  level: number;
  currentXP: number;
  levelXP: number;
  nextLevelXP: number;
  progress: number;
  title: string;
}> {
  await new Promise((resolve) => setTimeout(resolve, 50));

  let currentLevel = 1;
  let levelXP = 0;
  let nextLevelXP = 100;

  for (const config of LEVELS) {
    if (totalXP >= config.xpRequired) {
      currentLevel = config.level;
      levelXP = config.xpRequired;
      const nextConfig = LEVELS.find((l) => l.level === config.level + 1);
      nextLevelXP = nextConfig?.xpRequired ?? config.xpRequired + 1000;
    }
  }

  const currentXP = totalXP - levelXP;
  const xpForLevel = nextLevelXP - levelXP;
  const progress = Math.min(100, (currentXP / xpForLevel) * 100);

  const levelConfig = LEVELS.find((l) => l.level === currentLevel);
  const title = levelConfig?.title ?? "Newcomer";

  return {
    level: currentLevel,
    currentXP,
    levelXP,
    nextLevelXP,
    progress,
    title,
  };
}

// ============================================================================
// Mutation Functions (for TanStack Query mutations)
// ============================================================================

/**
 * Adds XP to the user's gamification state.
 * @param amount - Amount of XP to add
 * @returns Promise resolving to updated XP amount
 */
export async function addXP(amount: number): Promise<number> {
  await new Promise((resolve) => setTimeout(resolve, 100));

  if (amount < 0) {
    throw new Error("Cannot add negative XP");
  }

  console.log(`Added ${amount} XP`);
  return amount;
}

/**
 * Unlocks an achievement.
 * @param achievementCode - Code of the achievement to unlock
 * @returns Promise resolving to unlocked achievement
 */
export async function unlockAchievement(
  achievementCode: string
): Promise<Achievement> {
  await new Promise((resolve) => setTimeout(resolve, 200));

  const achievement = ACHIEVEMENTS.find((a) => a.code === achievementCode);

  if (!achievement) {
    throw new Error(`Achievement ${achievementCode} not found`);
  }

  if (achievement.unlockedAt) {
    throw new Error(`Achievement ${achievementCode} already unlocked`);
  }

  const unlocked: Achievement = {
    ...achievement,
    unlockedAt: Date.now(),
    progress: achievement.progressMax,
  };

  console.log("Unlocked achievement:", unlocked);
  return unlocked;
}

/**
 * Updates the user's streak.
 * @param days - Number of days in streak
 * @returns Promise resolving to updated streak
 */
export async function updateStreak(days: number): Promise<number> {
  await new Promise((resolve) => setTimeout(resolve, 100));

  if (days < 0) {
    throw new Error("Streak cannot be negative");
  }

  console.log(`Updated streak to ${days} days`);
  return days;
}

/**
 * Updates the productivity score.
 * @param score - New productivity score (0-100)
 * @returns Promise resolving to updated score
 */
export async function updateProductivityScore(score: number): Promise<number> {
  await new Promise((resolve) => setTimeout(resolve, 100));

  if (score < 0 || score > 100) {
    throw new Error("Productivity score must be between 0 and 100");
  }

  console.log(`Updated productivity score to ${score}`);
  return score;
}

// ============================================================================
// Utility Functions (Synchronous)
// ============================================================================

/**
 * Find an achievement by its unique ID.
 * @param id - Achievement ID to search for
 * @param achievements - Optional achievements array
 * @returns Achievement if found, undefined otherwise
 */
export function getAchievementById(
  id: string,
  achievements: Achievement[] = ACHIEVEMENTS
): Achievement | undefined {
  return achievements.find((a) => a.id === id);
}

/**
 * Find an achievement by its code.
 * @param code - Achievement code to search for
 * @param achievements - Optional achievements array
 * @returns Achievement if found, undefined otherwise
 */
export function getAchievementByCode(
  code: string,
  achievements: Achievement[] = ACHIEVEMENTS
): Achievement | undefined {
  return achievements.find((a) => a.code === code);
}

/**
 * Get achievements filtered by rarity.
 * @param rarity - Rarity to filter by
 * @param achievements - Optional achievements array
 * @returns Array of achievements with the specified rarity
 */
export function getAchievementsByRarity(
  rarity: AchievementRarity,
  achievements: Achievement[] = ACHIEVEMENTS
): Achievement[] {
  return achievements.filter((a) => a.badge.rarity === rarity);
}

/**
 * Get all unlocked achievements.
 * @param achievements - Optional achievements array
 * @returns Array of unlocked achievements
 */
export function getUnlockedAchievements(
  achievements: Achievement[] = ACHIEVEMENTS
): Achievement[] {
  return achievements.filter((a) => a.unlockedAt !== undefined);
}

/**
 * Get all locked achievements.
 * @param achievements - Optional achievements array
 * @returns Array of locked achievements
 */
export function getLockedAchievements(
  achievements: Achievement[] = ACHIEVEMENTS
): Achievement[] {
  return achievements.filter((a) => a.unlockedAt === undefined);
}

/**
 * Get the next level configuration.
 * @param currentLevel - Current level number
 * @returns Next level config or undefined if at max
 */
export function getNextLevel(currentLevel: number): LevelConfig | undefined {
  return LEVELS.find((l) => l.level === currentLevel + 1);
}

/**
 * Calculate progress percentage for an achievement.
 * @param current - Current progress value
 * @param max - Maximum required value
 * @returns Progress percentage (0-100)
 */
export function calculateProgress(current: number, max: number): number {
  if (max <= 0) return 0;
  return Math.min(100, (current / max) * 100);
}

/**
 * Get level progress for current XP.
 * @param currentXP - Current XP amount
 * @returns Object with level number and progress
 */
export function getLevelProgress(currentXP: number): {
  level: number;
  progress: number;
} {
  let level = 1;
  let xpForCurrent = 0;
  let xpForNext = 100;

  for (const config of LEVELS) {
    if (currentXP >= config.xpRequired) {
      level = config.level;
      xpForCurrent = config.xpRequired;
      const nextConfig = LEVELS.find((l) => l.level === config.level + 1);
      xpForNext = nextConfig?.xpRequired ?? config.xpRequired + 1000;
    }
  }

  const xpInLevel = currentXP - xpForCurrent;
  const xpForLevel = xpForNext - xpForCurrent;
  const progress = (xpInLevel / xpForLevel) * 100;

  return { level, progress: Math.min(100, progress) };
}

/**
 * Check if an achievement is unlocked.
 * @param achievement - Achievement to check
 * @returns True if unlocked
 */
export function isAchievementUnlocked(achievement: Achievement): boolean {
  return achievement.unlockedAt !== undefined;
}

/**
 * Get productivity badge based on score.
 * @param score - Productivity score
 * @returns Badge info with icon and color
 */
export function getProductivityBadge(score: number): {
  icon: string;
  label: string;
  color: string;
} {
  if (score >= 90) {
    return { icon: "Trophy", label: "Legendary", color: "#FFD700" };
  }
  if (score >= 75) {
    return { icon: "Award", label: "Gold", color: "#FFA000" };
  }
  if (score >= 60) {
    return { icon: "Medal", label: "Silver", color: "#9E9E9E" };
  }
  if (score >= 40) {
    return { icon: "Badge", label: "Bronze", color: "#8D6E63" };
  }
  return { icon: "Star", label: "Getting Started", color: "#757575" };
}

/**
 * Get rarity color for achievements.
 * @param rarity - Rarity level
 * @returns Color hex code
 */
export function getRarityColor(rarity: AchievementRarity): string {
  const colors: Record<AchievementRarity, string> = {
    common: "#9E9E9E",
    uncommon: "#4CAF50",
    rare: "#2196F3",
    epic: "#9C27B0",
    legendary: "#FFD700",
  };
  return colors[rarity];
}

/**
 * Sort achievements by unlock status and rarity.
 * @param achievements - Array to sort
 * @returns Sorted array
 */
export function sortAchievementsByStatus(
  achievements: Achievement[]
): Achievement[] {
  return [...achievements].sort((a, b) => {
    // Unlocked first
    if (a.unlockedAt && !b.unlockedAt) return -1;
    if (!a.unlockedAt && b.unlockedAt) return 1;

    // Then by rarity (legendary first)
    const rarityOrder = {
      legendary: 0,
      epic: 1,
      rare: 2,
      uncommon: 3,
      common: 4,
    };
    return rarityOrder[a.badge.rarity] - rarityOrder[b.badge.rarity];
  });
}
