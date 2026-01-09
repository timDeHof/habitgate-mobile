/**
 * Core type definitions for the HabitGate habit tracking system.
 * These types form the foundation of habit data structures used throughout the application.
 *
 * Note: Service functions have been moved to services/habits.ts
 * for better separation of concerns.
 */

// ============================================================================
// Enums (String Literal Types for Type Safety)
// ============================================================================

/**
 * Categories for classifying habits.
 * Each category represents a different life dimension that habits can improve.
 */
export type HabitCategory =
  | "physical"
  | "mental"
  | "creative"
  | "social"
  | "productive";

/**
 * Difficulty levels for habits.
 * Affects XP rewards and completion requirements.
 */
export type HabitDifficulty = "easy" | "medium" | "hard";

/**
 * Methods for verifying habit completion.
 * - manual: User self-reports completion
 * - timer: Time-based verification (e.g., meditation)
 * - integration: Third-party app sync (e.g., Strava, Apple Health)
 * - photo: Photo evidence verification
 * - location: GPS-based verification
 */
export type VerificationMethod =
  | "manual"
  | "timer"
  | "integration"
  | "photo"
  | "location";

/**
 * Frequency types for habit scheduling.
 * - daily: Every day
 * - specific_days: Only on selected days of the week
 * - flexible: Minimum frequency per week with flexible days
 */
export type FrequencyType = "daily" | "specific_days" | "flexible";

// ============================================================================
// Configuration Interfaces (Separated for Clarity)
// ============================================================================

/**
 * Configuration for timer-based habit verification.
 */
export interface TimerVerificationConfig {
  /** Minimum duration required in minutes */
  duration: number;
}

/**
 * Configuration for integration-based verification.
 */
export interface IntegrationVerificationConfig {
  /** External service identifier for data sync */
  integrationId: string;
}

/**
 * Configuration for location-based verification.
 */
export interface LocationVerificationConfig {
  /** Target latitude coordinates */
  locationLat: number;
  /** Target longitude coordinates */
  locationLng: number;
  /** Acceptable radius in meters from target location */
  locationRadius: number;
}

/**
 * Combined verification configuration supporting multiple methods.
 */
export type VerificationConfig =
  | TimerVerificationConfig
  | IntegrationVerificationConfig
  | LocationVerificationConfig;

/**
 * Configuration for specific day frequency.
 */
export interface SpecificDaysConfig {
  /** Array of days (0 = Sunday, 6 = Saturday) */
  daysOfWeek: number[];
}

/**
 * Configuration for flexible frequency.
 */
export interface FlexibleFrequencyConfig {
  /** Minimum completions required per week */
  minimumPerWeek: number;
}

/**
 * Combined frequency configuration supporting multiple scheduling types.
 */
export type FrequencyConfig = SpecificDaysConfig | FlexibleFrequencyConfig;

// ============================================================================
// Core Domain Types
// ============================================================================

/**
 * Bonus multiplier types for enhanced XP calculation.
 */
export type BonusMultiplierType = "streak" | "combo" | "time" | "verification";

/**
 * Individual bonus multiplier values.
 */
export interface BonusMultipliers {
  /** Multiplier based on current streak length */
  streak?: number;
  /** Multiplier based on completion combo */
  combo?: number;
  /** Multiplier based on optimal time completion */
  time?: number;
  /** Multiplier based on verification method strength */
  verification?: number;
}

/**
 * Core habit tracking interface.
 * Represents a single habit with all its metadata and state.
 */
export interface Habit {
  /** Unique identifier for the habit */
  id: string;
  /** Display name of the habit */
  name: string;
  /** Detailed description of the habit */
  description?: string;
  /** Icon identifier for UI representation */
  iconName: string;
  /** Category classification */
  category: HabitCategory;
  /** XP reward amount for completion */
  rewardAmount: number;
  /** Difficulty level affecting rewards */
  difficulty: HabitDifficulty;
  /** Method used to verify completion */
  verificationMethod: VerificationMethod;
  /** Method-specific verification settings */
  verificationConfig?: VerificationConfig;
  /** Frequency scheduling type */
  frequencyType: FrequencyType;
  /** Frequency-specific scheduling rules */
  frequencyConfig?: FrequencyConfig;
  /** Earliest recommended completion time (HH:mm format) */
  optimalTimeStart?: string;
  /** Latest recommended completion time (HH:mm format) */
  optimalTimeEnd?: string;
  /** Whether the habit is currently active */
  isActive: boolean;
  /** Completion status for current day */
  completedToday: boolean;
  /** Number of completions today (supports multi-part habits) */
  completionCountToday: number;
  /** Current consecutive day streak */
  currentStreak: number;
  /** Longest ever consecutive day streak */
  longestStreak: number;
  /** ISO timestamp of last completion */
  lastCompletedDate?: string;
  /** Creation timestamp */
  createdAt: number;
  /** Last modification timestamp */
  updatedAt: number;
}

/**
 * Single habit completion record.
 */
export interface HabitCompletion {
  /** Unique identifier for the completion */
  id: string;
  /** Reference to completed habit */
  habitId: string;
  /** Timestamp of completion */
  completedAt: number;
  /** Verification-specific data */
  verificationData?: Record<string, unknown>;
  /** Base XP earned */
  xpEarned: number;
  /** Time currency earned */
  timeEarned: number;
  /** Optional bonus multipliers applied */
  bonusMultipliers?: BonusMultipliers;
}

// ============================================================================
// Sample Data
// ============================================================================

export const habits: Habit[] = [
  {
    id: "habit_001",
    name: "Morning Run",
    description: "30 minutes cardio to start the day",
    iconName: "Dumbbell",
    category: "physical",
    rewardAmount: 30,
    difficulty: "medium",
    verificationMethod: "timer",
    verificationConfig: { duration: 30 },
    frequencyType: "daily",
    optimalTimeStart: "06:00",
    optimalTimeEnd: "09:00",
    isActive: true,
    completedToday: false,
    completionCountToday: 0,
    currentStreak: 5,
    longestStreak: 12,
    createdAt: 1704067200000,
    updatedAt: 1704067200000,
  },
  {
    id: "habit_002",
    name: "Read 20 Pages",
    description: "Non-fiction reading for personal growth",
    iconName: "BookOpen",
    category: "mental",
    rewardAmount: 20,
    difficulty: "easy",
    verificationMethod: "manual",
    frequencyType: "daily",
    optimalTimeStart: "21:00",
    optimalTimeEnd: "23:00",
    isActive: true,
    completedToday: false,
    completionCountToday: 0,
    currentStreak: 8,
    longestStreak: 21,
    createdAt: 1704067200000,
    updatedAt: 1704067200000,
  },
  {
    id: "habit_003",
    name: "Meditation",
    description: "15 minutes mindfulness practice",
    iconName: "Heart",
    category: "mental",
    rewardAmount: 15,
    difficulty: "easy",
    verificationMethod: "timer",
    verificationConfig: { duration: 15 },
    frequencyType: "daily",
    optimalTimeStart: "07:00",
    optimalTimeEnd: "08:00",
    isActive: true,
    completedToday: false,
    completionCountToday: 0,
    currentStreak: 3,
    longestStreak: 7,
    createdAt: 1704067200000,
    updatedAt: 1704067200000,
  },
  {
    id: "habit_004",
    name: "Journal",
    description: "Daily reflection and gratitude practice",
    iconName: "Coffee",
    category: "productive",
    rewardAmount: 10,
    difficulty: "easy",
    verificationMethod: "photo",
    frequencyType: "daily",
    optimalTimeStart: "21:00",
    optimalTimeEnd: "22:00",
    isActive: true,
    completedToday: false,
    completionCountToday: 0,
    currentStreak: 14,
    longestStreak: 30,
    createdAt: 1704067200000,
    updatedAt: 1704067200000,
  },
  {
    id: "habit_005",
    name: "Sleep 8 Hours",
    description: "Quality sleep tracked with Apple Health",
    iconName: "Moon",
    category: "physical",
    rewardAmount: 25,
    difficulty: "hard",
    verificationMethod: "integration",
    verificationConfig: { integrationId: "apple_health" },
    frequencyType: "daily",
    optimalTimeStart: "22:00",
    optimalTimeEnd: "23:00",
    isActive: true,
    completedToday: false,
    completionCountToday: 0,
    currentStreak: 2,
    longestStreak: 4,
    createdAt: 1704067200000,
    updatedAt: 1704067200000,
  },
];

export const habitCompletions: HabitCompletion[] = [
  {
    id: "completion_001",
    habitId: "habit_001",
    completedAt: 1704734400000, // 2024-01-08 22:00 UTC
    verificationData: { duration: 32, distance: 5.2 },
    xpEarned: 30,
    timeEarned: 30,
    bonusMultipliers: {
      streak: 1.1,
      time: 1.0,
      verification: 1.2,
    },
  },
  {
    id: "completion_002",
    habitId: "habit_002",
    completedAt: 1704676800000, // 2024-01-08 08:00 UTC
    verificationData: { pagesRead: 25 },
    xpEarned: 20,
    timeEarned: 20,
    bonusMultipliers: {
      streak: 1.0,
      combo: 1.2,
    },
  },
  {
    id: "completion_003",
    habitId: "habit_003",
    completedAt: 1704705600000, // 2024-01-08 16:00 UTC
    verificationData: { duration: 15 },
    xpEarned: 15,
    timeEarned: 15,
  },
  {
    id: "completion_004",
    habitId: "habit_004",
    completedAt: 1704673200000, // 2024-01-08 07:00 UTC
    verificationData: { photoUrl: "journal_20240108.jpg" },
    xpEarned: 10,
    timeEarned: 10,
    bonusMultipliers: {
      streak: 1.1,
      combo: 1.3,
    },
  },
  {
    id: "completion_005",
    habitId: "habit_001",
    completedAt: 1704648000000, // 2024-01-08 00:00 UTC
    verificationData: { duration: 35, distance: 6.0 },
    xpEarned: 30,
    timeEarned: 30,
    bonusMultipliers: {
      streak: 1.0,
    },
  },
  {
    id: "completion_006",
    habitId: "habit_002",
    completedAt: 1704561600000, // 2024-01-07 00:00 UTC
    verificationData: { pagesRead: 20 },
    xpEarned: 20,
    timeEarned: 20,
  },
  {
    id: "completion_007",
    habitId: "habit_003",
    completedAt: 1704561600000, // 2024-01-07 00:00 UTC
    verificationData: { duration: 15 },
    xpEarned: 15,
    timeEarned: 15,
  },
  {
    id: "completion_008",
    habitId: "habit_004",
    completedAt: 1704561600000, // 2024-01-07 00:00 UTC
    verificationData: { photoUrl: "journal_20240107.jpg" },
    xpEarned: 10,
    timeEarned: 10,
  },
];

// ============================================================================
// Pre-computed Lookup Tables (Performance Optimization)
// ============================================================================

/**
 * O(1) lookup map for habits by ID.
 * Pre-computed for performance in hot paths.
 */
export const habitsById: ReadonlyMap<string, Habit> = new Map(
  habits.map((habit) => [habit.id, habit])
);

/**
 * O(1) lookup map for completions by ID.
 * Pre-computed for performance in hot paths.
 */
export const completionsById: ReadonlyMap<string, HabitCompletion> = new Map(
  habitCompletions.map((completion) => [completion.id, completion])
);

/**
 * Group completions by habit ID for efficient querying.
 * O(1) access to all completions for a specific habit.
 */
export const completionsByHabitId: ReadonlyMap<
  string,
  ReadonlyArray<HabitCompletion>
> = new Map(
  habitCompletions.reduce<Map<string, HabitCompletion[]>>((acc, completion) => {
    const existing = acc.get(completion.habitId) ?? [];
    existing.push(completion);
    acc.set(completion.habitId, existing);
    return acc;
  }, new Map())
);

// ============================================================================
// Re-exports from Services (Convenience)
// ============================================================================

// Query functions (async - for TanStack Query)
export {
  fetchHabits,
  fetchHabitById,
  fetchCompletions,
  fetchCompletionsForHabit,
  fetchCompletionById,
  fetchStreak,
} from "../services/habits";

// Mutation functions (async - for TanStack Query mutations)
export {
  createHabitMutation,
  createCompletionMutation,
  updateHabitMutation,
  deleteHabitMutation,
} from "../services/habits";

// Query keys for TanStack Query caching
export { habitKeys, type HabitFilters } from "../services/habits";

// Utility functions (sync - for local state)
export {
  generateId,
  createHabit,
  createHabitCompletion,
  isValidHabit,
  getHabitById,
  getCompletionById,
  getCompletionsForHabit,
  createHabitsById,
  createCompletionsById,
  createCompletionsByHabitId,
} from "../services/habits";
