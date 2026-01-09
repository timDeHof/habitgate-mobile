/**
 * TimeBank service functions for the HabitGate application.
 * Handles TanStack Query hooks and async operations for time currency management.
 */

import type {
  Transaction,
  TransactionType,
  TransactionSourceType,
  TimeBankState,
} from "../data/timebank";
import {
  TRANSACTIONS,
  INITIAL_TIME_BANK_STATE,
  MAX_BALANCE,
  MIN_BALANCE,
} from "../data/timebank";

// ============================================================================
// TanStack Query Keys
// ============================================================================

/**
 * Query keys for TanStack Query caching.
 */
export const timebankKeys = {
  all: ["timebank"] as const,
  state: () => [...timebankKeys.all, "state"] as const,
  balance: () => [...timebankKeys.all, "balance"] as const,
  transactions: () => [...timebankKeys.all, "transactions"] as const,
  transaction: (id: string) => [...timebankKeys.transactions(), id] as const,
  transactionsByType: (type: TransactionType) =>
    [...timebankKeys.transactions(), "type", type] as const,
  transactionsBySource: (source: TransactionSourceType) =>
    [...timebankKeys.transactions(), "source", source] as const,
  daily: () => [...timebankKeys.all, "daily"] as const,
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
 * Fetches the current time bank state.
 * @returns Promise resolving to time bank state
 */
export async function fetchTimeBankState(): Promise<TimeBankState> {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 100));

  // In production, this would fetch from a backend
  return { ...INITIAL_TIME_BANK_STATE };
}

/**
 * Fetches all transactions with optional filtering.
 * @param limit - Maximum number of transactions to return
 * @param offset - Number of transactions to skip
 * @returns Promise resolving to array of transactions
 */
export async function fetchTransactions(
  limit?: number,
  offset?: number
): Promise<Transaction[]> {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 100));

  let filtered = [...TRANSACTIONS].sort((a, b) => b.timestamp - a.timestamp);

  if (offset) {
    filtered = filtered.slice(offset);
  }

  if (limit) {
    filtered = filtered.slice(0, limit);
  }

  return filtered;
}

/**
 * Fetches a single transaction by ID.
 * @param id - Transaction ID to fetch
 * @returns Promise resolving to transaction or undefined
 */
export async function fetchTransactionById(
  id: string
): Promise<Transaction | undefined> {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 50));

  return TRANSACTIONS.find((t) => t.id === id);
}

/**
 * Fetches transactions filtered by type.
 * @param type - Transaction type to filter by
 * @param limit - Maximum number of transactions
 * @returns Promise resolving to array of transactions
 */
export async function fetchTransactionsByType(
  type: TransactionType,
  limit?: number
): Promise<Transaction[]> {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 100));

  let filtered = TRANSACTIONS.filter((t) => t.type === type).sort(
    (a, b) => b.timestamp - a.timestamp
  );

  if (limit) {
    filtered = filtered.slice(0, limit);
  }

  return filtered;
}

/**
 * Fetches transactions filtered by source type.
 * @param source - Source type to filter by
 * @param limit - Maximum number of transactions
 * @returns Promise resolving to array of transactions
 */
export async function fetchTransactionsBySource(
  source: TransactionSourceType,
  limit?: number
): Promise<Transaction[]> {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 100));

  let filtered = TRANSACTIONS.filter((t) => t.sourceType === source).sort(
    (a, b) => b.timestamp - a.timestamp
  );

  if (limit) {
    filtered = filtered.slice(0, limit);
  }

  return filtered;
}

/**
 * Fetches the current balance.
 * @returns Promise resolving to balance amount
 */
export async function fetchBalance(): Promise<number> {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 50));

  return INITIAL_TIME_BANK_STATE.balance;
}

/**
 * Fetches the daily earned amount.
 * @returns Promise resolving to daily earned amount
 */
export async function fetchDailyEarned(): Promise<number> {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 50));

  return INITIAL_TIME_BANK_STATE.dailyEarned;
}

// ============================================================================
// Mutation Functions (for TanStack Query mutations)
// ============================================================================

/**
 * Adds a new transaction to the time bank.
 * @param transaction - Transaction to add
 * @returns Promise resolving to created transaction
 */
export async function addTransaction(
  transaction: Omit<Transaction, "id" | "balanceAfter">
): Promise<Transaction> {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 200));

  const currentBalance = INITIAL_TIME_BANK_STATE.balance;
  const balanceAfter = Math.max(
    MIN_BALANCE,
    Math.min(MAX_BALANCE, currentBalance + transaction.amount)
  );

  const newTransaction: Transaction = {
    ...transaction,
    id: generateId("txn"),
    balanceAfter,
  };

  console.log("Added transaction:", newTransaction);
  return newTransaction;
}

/**
 * Records time earned from a habit.
 * @param amount - Amount of time earned
 * @param sourceId - Habit ID that generated this earning
 * @param metadata - Optional metadata
 * @returns Promise resolving to created transaction
 */
export async function earnTime(
  amount: number,
  sourceId: string,
  metadata?: Transaction["metadata"]
): Promise<Transaction> {
  if (amount <= 0) {
    throw new Error("Earn amount must be positive");
  }

  return addTransaction({
    type: "earn",
    amount,
    sourceType: "habit",
    sourceId,
    metadata,
    timestamp: Date.now(),
  });
}

/**
 * Records time spent on app unlock.
 * @param amount - Amount of time spent
 * @param sourceId - App ID that this was spent on
 * @param metadata - Optional metadata
 * @returns Promise resolving to created transaction
 */
export async function spendTime(
  amount: number,
  sourceId: string,
  metadata?: Transaction["metadata"]
): Promise<Transaction> {
  if (amount <= 0) {
    throw new Error("Spend amount must be positive");
  }

  return addTransaction({
    type: "spend",
    amount: -amount,
    sourceType: "app_unlock",
    sourceId,
    metadata,
    timestamp: Date.now(),
  });
}

/**
 * Applies a bonus to the time bank.
 * @param amount - Bonus amount
 * @param reason - Reason for the bonus
 * @returns Promise resolving to created transaction
 */
export async function applyBonus(
  amount: number,
  reason?: string
): Promise<Transaction> {
  if (amount <= 0) {
    throw new Error("Bonus amount must be positive");
  }

  return addTransaction({
    type: "bonus",
    amount,
    sourceType: "bonus",
    metadata: {
      habitName: reason,
      bonusMultiplier: 1.0,
    },
    timestamp: Date.now(),
  });
}

/**
 * Applies a penalty to the time bank.
 * @param amount - Penalty amount
 * @param reason - Reason for the penalty
 * @returns Promise resolving to created transaction
 */
export async function applyPenalty(
  amount: number,
  reason?: string
): Promise<Transaction> {
  if (amount <= 0) {
    throw new Error("Penalty amount must be positive");
  }

  return addTransaction({
    type: "penalty",
    amount: -amount,
    sourceType: "emergency",
    metadata: {
      appName: reason,
    },
    timestamp: Date.now(),
  });
}

/**
 * Resets daily earned amount (called at daily reset).
 * @returns Promise resolving when complete
 */
export async function resetDailyEarned(): Promise<void> {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 100));

  console.log("Reset daily earned amount");
}

// ============================================================================
// Utility Functions (Synchronous - for local state management)
// ============================================================================

/**
 * Find a transaction by its unique ID.
 * @param id - Transaction ID to search for
 * @param transactions - Optional transactions array
 * @returns Transaction if found, undefined otherwise
 */
export function getTransactionById(
  id: string,
  transactions: Transaction[] = TRANSACTIONS
): Transaction | undefined {
  return transactions.find((t) => t.id === id);
}

/**
 * Get transactions filtered by type.
 * @param type - Transaction type to filter by
 * @param transactions - Optional transactions array
 * @returns Array of transactions of the specified type
 */
export function getTransactionsByType(
  type: TransactionType,
  transactions: Transaction[] = TRANSACTIONS
): Transaction[] {
  return transactions.filter((t) => t.type === type);
}

/**
 * Get transactions filtered by source type.
 * @param source - Source type to filter by
 * @param transactions - Optional transactions array
 * @returns Array of transactions from the specified source
 */
export function getTransactionsBySource(
  source: TransactionSourceType,
  transactions: Transaction[] = TRANSACTIONS
): Transaction[] {
  return transactions.filter((t) => t.sourceType === source);
}

/**
 * Get recent transactions sorted by timestamp.
 * @param count - Number of recent transactions to return
 * @param transactions - Optional transactions array
 * @returns Array of recent transactions
 */
export function getRecentTransactions(
  count: number = 10,
  transactions: Transaction[] = TRANSACTIONS
): Transaction[] {
  return [...transactions]
    .sort((a, b) => b.timestamp - a.timestamp)
    .slice(0, count);
}

/**
 * Get a summary of transactions for a time period.
 * @param transactions - Array of transactions to summarize
 * @returns Summary object with totals
 */
export function getTransactionSummary(
  transactions: Transaction[] = TRANSACTIONS
): {
  totalEarned: number;
  totalSpent: number;
  totalBonuses: number;
  totalPenalties: number;
  transactionCount: number;
} {
  return transactions.reduce(
    (summary, txn) => {
      switch (txn.type) {
        case "earn":
          summary.totalEarned += txn.amount;
          break;
        case "spend":
          summary.totalSpent += Math.abs(txn.amount);
          break;
        case "bonus":
          summary.totalBonuses += txn.amount;
          break;
        case "penalty":
          summary.totalPenalties += Math.abs(txn.amount);
          break;
      }
      summary.transactionCount++;
      return summary;
    },
    {
      totalEarned: 0,
      totalSpent: 0,
      totalBonuses: 0,
      totalPenalties: 0,
      transactionCount: 0,
    }
  );
}

/**
 * Format time in minutes to a human-readable string.
 * @param minutes - Time in minutes
 * @returns Formatted time string (e.g., "2h 30m")
 */
export function formatTime(minutes: number): string {
  const hours = Math.floor(Math.abs(minutes) / 60);
  const mins = Math.abs(minutes) % 60;

  if (hours === 0) {
    return `${mins}m`;
  }

  if (mins === 0) {
    return `${hours}h`;
  }

  return `${hours}h ${mins}m`;
}

/**
 * Check if a transaction type is an earning.
 * @param type - Transaction type to check
 * @returns True if this is an earning type
 */
export function isTransactionTypeEarn(type: TransactionType): boolean {
  return type === "earn" || type === "bonus";
}

/**
 * Check if a transaction type is a spending.
 * @param type - Transaction type to check
 * @returns True if this is a spending type
 */
export function isTransactionTypeSpend(type: TransactionType): boolean {
  return type === "spend" || type === "penalty";
}

/**
 * Calculate the balance change from a transaction.
 * @param transaction - Transaction to calculate from
 * @returns Balance change (positive for increase, negative for decrease)
 */
export function calculateBalanceChange(transaction: Transaction): number {
  return transaction.amount;
}

/**
 * Get the sign symbol for a transaction amount.
 * @param amount - Transaction amount
 * @returns "+" for positive, "-" for negative
 */
export function getAmountSign(amount: number): string {
  return amount >= 0 ? "+" : "-";
}

/**
 * Calculate total balance from a list of transactions.
 * @param transactions - Array of transactions
 * @param startingBalance - Starting balance (default 0)
 * @returns Final balance
 */
export function calculateBalance(
  transactions: Transaction[],
  startingBalance: number = 0
): number {
  return transactions.reduce(
    (balance, txn) => balance + txn.amount,
    startingBalance
  );
}
