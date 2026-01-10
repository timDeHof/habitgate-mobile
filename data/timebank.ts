/**
 * TimeBank Data Module
 *
 * This module defines types and data for the TimeBank feature.
 * Users earn time currency by completing habits and spend it to unlock apps.
 *
 * Note: Service functions have been moved to services/timebank.ts
 */

// ============================================================================
// Types & Constants
// ============================================================================

/**
 * Transaction types for the time bank.
 */
export type TransactionType = "earn" | "spend" | "bonus" | "penalty";

/**
 * Source types that can earn or spend time currency.
 */
export type TransactionSourceType =
  | "habit"
  | "app_unlock"
  | "emergency"
  | "bonus"
  | "streak";

// ============================================================================
// Interfaces
// ============================================================================

/**
 * Metadata for a transaction with optional context.
 */
export interface TransactionMetadata {
  /** Name of the habit if source is habit */
  habitName?: string;
  /** Name of the app if source is app_unlock */
  appName?: string;
  /** Duration in minutes if applicable */
  duration?: number;
  /** Bonus multiplier applied if applicable */
  bonusMultiplier?: number;
}

/**
 * Represents a single transaction in the time bank.
 */
export interface Transaction {
  /** Unique identifier for the transaction */
  id: string;
  /** Type of transaction */
  type: TransactionType;
  /** Amount of time currency (positive for earn/bonus, negative for spend/penalty) */
  amount: number;
  /** Balance after this transaction was applied */
  balanceAfter: number;
  /** What generated this transaction */
  sourceType: TransactionSourceType;
  /** Reference to the source entity (habit ID, app ID, etc.) */
  sourceId?: string;
  /** Additional context for the transaction */
  metadata?: TransactionMetadata;
  /** Unix timestamp when the transaction occurred */
  timestamp: number;
}

/**
 * Overall state of the time bank for a user.
 */
export interface TimeBankState {
  /** Current available balance */
  balance: number;
  /** Total time earned across all time */
  lifetimeEarned: number;
  /** Total time spent across all time */
  lifetimeSpent: number;
  /** Time earned today (resets daily) */
  dailyEarned: number;
  /** ISO date string of last daily reset */
  lastResetDate: string;
  /** Recent transactions (limited to recent history) */
  transactions: Transaction[];
}

// ============================================================================
// Constants
// ============================================================================

/**
 * Daily reset hour (2 AM)
 */
export const DAILY_RESET_HOUR = 2;

/**
 * Maximum daily earning capacity (in minutes)
 */
export const DAILY_EARNING_CAP = 180;

/**
 * Threshold to show "near daily cap" warning (dailyEarned > DAILY_EARNING_CAP - NEAR_CAP_THRESHOLD)
 */
export const NEAR_CAP_THRESHOLD = 30; // Show warning when 30 minutes remaining

/**
 * Critical balance threshold for low balance warning
 */
export const CRITICAL_BALANCE = 15;

/**
 * Maximum balance allowed
 */
export const MAX_BALANCE = 480; // 8 hours in minutes

/**
 * Minimum balance (can go negative due to emergencies)
 */
export const MIN_BALANCE = -60; // -1 hour in minutes

// ============================================================================
// Dummy Data - Transactions
// ============================================================================

export const TRANSACTIONS: Transaction[] = [
  {
    id: "txn_001",
    type: "earn",
    amount: 30,
    balanceAfter: 30,
    sourceType: "habit",
    sourceId: "habit_001",
    metadata: {
      habitName: "Morning Run",
      duration: 30,
    },
    timestamp: 1704734400000, // 2024-01-08 22:00 UTC
  },
  {
    id: "txn_002",
    type: "earn",
    amount: 20,
    balanceAfter: 50,
    sourceType: "habit",
    sourceId: "habit_002",
    metadata: {
      habitName: "Read 20 Pages",
      duration: 20,
    },
    timestamp: 1704676800000, // 2024-01-08 08:00 UTC
  },
  {
    id: "txn_003",
    type: "spend",
    amount: -15,
    balanceAfter: 35,
    sourceType: "app_unlock",
    sourceId: "app_001",
    metadata: {
      appName: "Instagram",
      duration: 30,
    },
    timestamp: 1704669600000, // 2024-01-08 06:00 UTC
  },
  {
    id: "txn_004",
    type: "bonus",
    amount: 5,
    balanceAfter: 40,
    sourceType: "streak",
    metadata: {
      bonusMultiplier: 1.2,
    },
    timestamp: 1704561600000, // 2024-01-07 00:00 UTC
  },
  {
    id: "txn_005",
    type: "earn",
    amount: 15,
    balanceAfter: 55,
    sourceType: "habit",
    sourceId: "habit_003",
    metadata: {
      habitName: "Meditation",
      duration: 15,
    },
    timestamp: 1704561600000, // 2024-01-07 00:00 UTC
  },
  {
    id: "txn_006",
    type: "earn",
    amount: 10,
    balanceAfter: 65,
    sourceType: "habit",
    sourceId: "habit_004",
    metadata: {
      habitName: "Journal",
      duration: 10,
    },
    timestamp: 1704561600000, // 2024-01-07 00:00 UTC
  },
  {
    id: "txn_007",
    type: "spend",
    amount: -20,
    balanceAfter: 45,
    sourceType: "app_unlock",
    sourceId: "app_002",
    metadata: {
      appName: "YouTube",
      duration: 45,
    },
    timestamp: 1704475200000, // 2024-01-06 12:00 UTC
  },
  {
    id: "txn_008",
    type: "penalty",
    amount: -5,
    balanceAfter: 40,
    sourceType: "emergency",
    metadata: {
      appName: "Instagram",
    },
    timestamp: 1704388800000, // 2024-01-05 00:00 UTC
  },
  {
    id: "txn_009",
    type: "earn",
    amount: 25,
    balanceAfter: 65,
    sourceType: "habit",
    sourceId: "habit_005",
    metadata: {
      habitName: "Sleep 8 Hours",
      duration: 480,
    },
    timestamp: 1704302400000, // 2024-01-04 00:00 UTC
  },
  {
    id: "txn_010",
    type: "bonus",
    amount: 10,
    balanceAfter: 75,
    sourceType: "bonus",
    metadata: {
      habitName: "Perfect Week",
      bonusMultiplier: 1.5,
    },
    timestamp: 1704216000000, // 2024-01-03 00:00 UTC
  },
];

// ============================================================================
// Initial TimeBank State
// ============================================================================

/**
 * Default time bank state for new users.
 */
export const INITIAL_TIME_BANK_STATE: TimeBankState = {
  balance: 45,
  lifetimeEarned: 2450,
  lifetimeSpent: 680,
  dailyEarned: 50,
  lastResetDate: new Date().toISOString().split("T")[0],
  transactions: [],
};
