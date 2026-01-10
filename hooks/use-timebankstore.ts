/**
 * TimeBank Query Hooks
 *
 * TanStack Query hooks for fetching time bank data with optimized caching,
 * error handling, and type safety.
 */

import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import { timeBankService } from "@/services/timebankService";
import type { Transaction } from "@/data/timebank";

// ============================================================================
// TanStack Query Keys
// ============================================================================

const TIME_BANK_QUERY_KEY = ["timebank"] as const;

/**
 * Query keys for TanStack Query caching.
 * Only includes keys that are actually used in the application.
 */
export const timebankKeys = {
  all: TIME_BANK_QUERY_KEY,
  transactions: () => [...TIME_BANK_QUERY_KEY, "transactions"] as const,
  balance: () => [...TIME_BANK_QUERY_KEY, "balance"] as const,
  dailyCapacity: () => [...TIME_BANK_QUERY_KEY, "daily", "capacity"] as const,
} as const;

// ============================================================================
// Query Configuration
// ============================================================================

/**
 * Default retry configuration for time bank queries.
 * Uses exponential backoff to avoid overwhelming the server on transient failures.
 */
const DEFAULT_RETRY_CONFIG = {
  retry: 3,
  retryDelay: (attemptIndex: number) =>
    Math.min(1000 * 2 ** attemptIndex, 30000),
} as const;

/**
 * Default query configuration for frequently changing data (balance).
 */
const BALANCE_QUERY_CONFIG = {
  staleTime: 1 * 60 * 1000, // 1 minute - balance changes more frequently
  gcTime: 10 * 60 * 1000, // 10 minutes
  retry: 2, // Fewer retries for balance - less critical if it fails
} as const;

// ============================================================================
// Types
// ============================================================================

/**
 * Options for the useTransactions hook.
 */
export type UseTransactionsOptions = UseQueryOptions<
  Transaction[],
  Error,
  Transaction[],
  string[]
>;

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Wraps service calls with consistent error handling that preserves the original
 * error's stack trace and properties via the cause chain.
 */
async function wrapTimeBankCall<T>(
  fn: () => Promise<T>,
  operationLabel: string
): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown error occurred";
    throw new Error(`[TimeBank] ${operationLabel}: ${message}`, {
      cause: error,
    });
  }
}

/**
 * Fetches transactions from the time bank service.
 */
async function fetchTransactions(): Promise<Transaction[]> {
  return wrapTimeBankCall(
    () => timeBankService.getTransactions(),
    "fetch transactions"
  );
}

/**
 * Fetches the current balance from the time bank service.
 */
async function fetchBalance(): Promise<number> {
  return wrapTimeBankCall(() => timeBankService.getBalance(), "fetch balance");
}

/**
 * Fetches the remaining daily capacity from the time bank service.
 */
async function fetchDailyCapacity(): Promise<number> {
  return wrapTimeBankCall(
    () => timeBankService.getRemainingDailyCapacity(),
    "fetch daily capacity"
  );
}

// ============================================================================
// Hooks
// ============================================================================

/**
 * Fetches all time bank transactions.
 *
 * Features:
 * - Automatic caching with 5-minute stale time
 * - Error handling delegated to wrapTimeBankCall<T> helper (preserves original error's stack trace via cause chain)
 * - Retry on failure (3 attempts)
 * - Customizable through options parameter
 *
 * @param options - Optional TanStack Query options to override defaults
 * @returns Query result containing transactions array
 *
 * @example
 * const { data, isLoading, error } = useTransactions();
 */
export const useTransactions = (
  options?: UseQueryOptions<Transaction[], Error>
) => {
  return useQuery({
    queryKey: timebankKeys.transactions(),
    queryFn: fetchTransactions,
    staleTime: 5 * 60 * 1000, // 5 minutes - reduce unnecessary refetches
    gcTime: 30 * 60 * 1000, // 30 minutes - keep unused data in cache (React Query v5)
    ...DEFAULT_RETRY_CONFIG,
    ...options, // Allow overrides
  });
};

/**
 * Fetches the current time bank balance.
 * Useful for displaying current balance in the UI.
 */
export const useBalance = (options?: UseQueryOptions<number, Error>) => {
  return useQuery({
    queryKey: timebankKeys.balance(),
    queryFn: fetchBalance,
    ...BALANCE_QUERY_CONFIG,
    ...options,
  });
};

/**
 * Fetches remaining daily capacity for earning time.
 * Useful for showing daily progress to users.
 */
export const useDailyCapacity = (options?: UseQueryOptions<number, Error>) => {
  return useQuery({
    queryKey: timebankKeys.dailyCapacity(),
    queryFn: fetchDailyCapacity,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 2, // Fewer retries for capacity - derived from balance
    ...options,
  });
};
