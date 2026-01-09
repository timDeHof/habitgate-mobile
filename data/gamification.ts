/**
 * Gamification Data Module
 *
 * This module defines types, data, and utilities for gamification features
 * including achievements, XP tracking, levels, and user progress.
 *
 * Note: Service functions have been moved to services/gamification.ts
 */

// ============================================================================
// Types & Enums
// ============================================================================

/**
 * Categories for classifying achievements.
 */
export type AchievementCategory =
  | "habits"
  | "streaks"
  | "social"
  | "milestones";

/**
 * Types of requirements for achievements.
 */
export type AchievementRequirementType =
  | "total_completions"
  | "current_streak"
  | "longest_streak"
  | "habits_created"
  | "perfect_days"
  | "xp_earned"
  | "days_active"
  | "friends_joined";

/**
 * Rarity levels for achievements.
 */
export const ACHIEVEMENT_RARITY = {
  COMMON: "common",
  UNCOMMON: "uncommon",
  RARE: "rare",
  EPIC: "epic",
  LEGENDARY: "legendary",
} as const;

export type AchievementRarity =
  (typeof ACHIEVEMENT_RARITY)[keyof typeof ACHIEVEMENT_RARITY];

// ============================================================================
// Interfaces
// ============================================================================

/**
 * Requirement definition for an achievement.
 */
export interface AchievementRequirement {
  /** Type of requirement */
  type: AchievementRequirementType;
  /** Value needed to complete the requirement */
  value: number;
}

/**
 * Badge/rarity metadata for visual display.
 */
export interface AchievementBadge {
  /** Icon name or URL */
  icon: string;
  /** Color hex code for the badge */
  color: string;
  /** Rarity level affecting drop rate and prestige */
  rarity: AchievementRarity;
}

/**
 * Represents an achievement that can be unlocked.
 */
export interface Achievement {
  /** Unique identifier */
  id: string;
  /** Machine-readable code (e.g., "first_habit") */
  code: string;
  /** Display name of the achievement */
  name: string;
  /** Detailed description of how to unlock */
  description: string;
  /** Badge/metadata for display */
  badge: AchievementBadge;
  /** Requirement to unlock */
  requirement: AchievementRequirement;
  /** XP reward for unlocking */
  rewardXP: number;
  /** Time currency reward for unlocking */
  rewardTime: number;
  /** Whether the achievement is hidden until unlocked */
  isHidden: boolean;
  /** Timestamp when achievement was unlocked (undefined if locked) */
  unlockedAt?: number;
  /** Current progress toward requirement (0-100) */
  progress: number;
  /** Maximum value for progress calculation */
  progressMax: number;
}

/**
 * Overall gamification state for a user.
 */
export interface GamificationState {
  /** Current level */
  level: number;
  /** XP earned in current level */
  currentXP: number;
  /** Total XP earned across all time */
  totalXP: number;
  /** Current consecutive day streak */
  currentStreak: number;
  /** Longest streak ever achieved */
  longestStreak: number;
  /** ISO date string of last activity */
  lastActivityDate: string | null;
  /** Calculated productivity score (0-100) */
  productivityScore: number;
  /** Array of achievement states */
  achievements: Achievement[];
}

/**
 * Level configuration for XP thresholds.
 */
export interface LevelConfig {
  /** Level number */
  level: number;
  /** XP required to reach this level */
  xpRequired: number;
  /** Title earned at this level */
  title: string;
  /** Icon for level display */
  icon: string;
}

// ============================================================================
// Level Configuration
// ============================================================================

/**
 * Level configurations defining XP thresholds and titles.
 */
export const LEVELS: LevelConfig[] = [
  { level: 1, xpRequired: 0, title: "Newcomer", icon: "Star" },
  { level: 2, xpRequired: 100, title: "Beginner", icon: "Award" },
  { level: 3, xpRequired: 250, title: "Regular", icon: "Badge" },
  { level: 4, xpRequired: 500, title: "Dedicated", icon: "Trophy" },
  { level: 5, xpRequired: 1000, title: "Pro", icon: "Crown" },
  { level: 6, xpRequired: 2000, title: "Expert", icon: "Zap" },
  { level: 7, xpRequired: 3500, title: "Master", icon: "Flame" },
  { level: 8, xpRequired: 5000, title: "Champion", icon: "Lightning" },
  { level: 9, xpRequired: 7500, title: "Legend", icon: "Rocket" },
  { level: 10, xpRequired: 10000, title: "Habit Gatekeeper", icon: "Castle" },
];

// ============================================================================
// Dummy Data - Achievements
// ============================================================================

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: "ach_001",
    code: "first_habit",
    name: "First Steps",
    description: "Create your first habit",
    badge: {
      icon: "PlusCircle",
      color: "#4CAF50",
      rarity: "common",
    },
    requirement: {
      type: "habits_created",
      value: 1,
    },
    rewardXP: 50,
    rewardTime: 5,
    isHidden: false,
    progress: 1,
    progressMax: 1,
  },
  {
    id: "ach_002",
    code: "habit_master",
    name: "Habit Master",
    description: "Create 5 habits",
    badge: {
      icon: "List",
      color: "#2196F3",
      rarity: "uncommon",
    },
    requirement: {
      type: "habits_created",
      value: 5,
    },
    rewardXP: 100,
    rewardTime: 10,
    isHidden: false,
    progress: 3,
    progressMax: 5,
  },
  {
    id: "ach_003",
    code: "streak_week",
    name: "Week Warrior",
    description: "Maintain a 7-day streak",
    badge: {
      icon: "Calendar",
      color: "#9C27B0",
      rarity: "uncommon",
    },
    requirement: {
      type: "current_streak",
      value: 7,
    },
    rewardXP: 150,
    rewardTime: 15,
    isHidden: false,
    progress: 5,
    progressMax: 7,
  },
  {
    id: "ach_004",
    code: "streak_month",
    name: "Monthly Master",
    description: "Maintain a 30-day streak",
    badge: {
      icon: " Flame",
      color: "#FF9800",
      rarity: "rare",
    },
    requirement: {
      type: "current_streak",
      value: 30,
    },
    rewardXP: 500,
    rewardTime: 30,
    isHidden: false,
    progress: 5,
    progressMax: 30,
  },
  {
    id: "ach_005",
    code: "completions_100",
    name: "Century Club",
    description: "Complete habits 100 times",
    badge: {
      icon: "CheckSquare",
      color: "#E91E63",
      rarity: "rare",
    },
    requirement: {
      type: "total_completions",
      value: 100,
    },
    rewardXP: 300,
    rewardTime: 20,
    isHidden: false,
    progress: 45,
    progressMax: 100,
  },
  {
    id: "ach_006",
    code: "perfect_week",
    name: "Perfect Week",
    description: "Complete all habits every day for a week",
    badge: {
      icon: "Star",
      color: "#FFD700",
      rarity: "epic",
    },
    requirement: {
      type: "perfect_days",
      value: 7,
    },
    rewardXP: 400,
    rewardTime: 25,
    isHidden: false,
    progress: 0,
    progressMax: 7,
  },
  {
    id: "ach_007",
    code: "xp_5000",
    name: "XP Hunter",
    description: "Earn 5,000 total XP",
    badge: {
      icon: "Zap",
      color: "#00BCD4",
      rarity: "epic",
    },
    requirement: {
      type: "xp_earned",
      value: 5000,
    },
    rewardXP: 0,
    rewardTime: 60,
    isHidden: false,
    progress: 2450,
    progressMax: 5000,
  },
  {
    id: "ach_008",
    code: "legendary_streak",
    name: "Legendary Streak",
    description: "Maintain a 100-day streak",
    badge: {
      icon: "Crown",
      color: "#9C27B0",
      rarity: "legendary",
    },
    requirement: {
      type: "longest_streak",
      value: 100,
    },
    rewardXP: 2000,
    rewardTime: 120,
    isHidden: true,
    progress: 12,
    progressMax: 100,
  },
  {
    id: "ach_009",
    code: "early_bird",
    name: "Early Bird",
    description: "Complete a habit before 6 AM",
    badge: {
      icon: "Sunrise",
      color: "#FFC107",
      rarity: "common",
    },
    requirement: {
      type: "total_completions",
      value: 10,
    },
    rewardXP: 75,
    rewardTime: 5,
    isHidden: false,
    progress: 3,
    progressMax: 10,
  },
  {
    id: "ach_010",
    code: "night_owl",
    name: "Night Owl",
    description: "Complete a habit after 10 PM",
    badge: {
      icon: "Moon",
      color: "#3F51B5",
      rarity: "common",
    },
    requirement: {
      type: "total_completions",
      value: 10,
    },
    rewardXP: 75,
    rewardTime: 5,
    isHidden: false,
    progress: 7,
    progressMax: 10,
  },
];

// ============================================================================
// Initial Gamification State
// ============================================================================

/**
 * Default gamification state for new users.
 */
export const INITIAL_GAMIFICATION_STATE: GamificationState = {
  level: 1,
  currentXP: 0,
  totalXP: 2450,
  currentStreak: 5,
  longestStreak: 12,
  lastActivityDate: new Date().toISOString().split("T")[0],
  productivityScore: 72,
  achievements: ACHIEVEMENTS,
};
