import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { v4 as uuidv4 } from "uuid";
import { zustandStorage } from "./zustandStorage";
import {
  Transaction,
  TimeBankState,
  INITIAL_TIME_BANK_STATE,
  DAILY_EARNING_CAP,
  DAILY_SPENDING_CAP,
} from "@/data/timebank";

interface TimeBankActions {
  addBalance: (
    amount: number,
    source: Transaction["sourceType"],
    metadata?: Transaction["metadata"]
  ) => boolean;
  deductBalance: (
    amount: number,
    source: Transaction["sourceType"],
    metadata?: Transaction["metadata"]
  ) => boolean;
  resetDailyCounters: () => void;
  getTransactions: (limit?: number) => Transaction[];
  getRemainingDailyCapacity: () => number;
  updateStreak: (completedToday: boolean) => void;
  resetStreak: () => void;
}

type TimeBankStore = TimeBankState & TimeBankActions;

export const useTimeBankStore = create<TimeBankStore>()(
  persist(
    (set, get) => ({
      ...INITIAL_TIME_BANK_STATE,
      // ACTIONS
      addBalance: (amount, source, metadata) => {
        let state = get();
        // Check if daily reset needed (use local date)
        const today = new Date().toLocaleDateString("en-CA"); // YYYY-MM-DD in local timezone
        if (state.lastResetDate !== today) {
          set({ dailyEarned: 0, lastResetDate: today });
          // Get fresh state after reset for accurate calculations
          state = get();
        }
        // Check daily cap
        const remainingCapacity = DAILY_EARNING_CAP - state.dailyEarned;
        if (remainingCapacity <= 0) return false;
        const cappedAmount = Math.min(amount, remainingCapacity);
        const newDailyEarned = state.dailyEarned + cappedAmount;
        const newBalance = state.balance + cappedAmount;
        const transaction: Transaction = {
          id: uuidv4(),
          type: "earn",
          amount: cappedAmount,
          balanceAfter: newBalance,
          sourceType: source,
          metadata,
          timestamp: Date.now(),
        };
        set({
          balance: newBalance,
          lifetimeEarned: state.lifetimeEarned + cappedAmount,
          dailyEarned: newDailyEarned,
          transactions: [transaction, ...state.transactions].slice(0, 50),
        });
        return true;
      },
      deductBalance: (amount, source, metadata) => {
        const state = get();
        if (state.balance < amount) {
          return false; // Insufficient balance
        }
        // Check daily spending cap
        const remainingSpendingCapacity = DAILY_SPENDING_CAP - state.dailySpent;
        if (remainingSpendingCapacity <= 0) return false;
        const cappedAmount = Math.min(amount, remainingSpendingCapacity);
        const newBalance = state.balance - cappedAmount;
        const transaction: Transaction = {
          id: uuidv4(),
          type: "spend",
          amount: cappedAmount,
          balanceAfter: newBalance,
          sourceType: source,
          metadata,
          timestamp: Date.now(),
        };
        set({
          balance: newBalance,
          lifetimeSpent: state.lifetimeSpent + cappedAmount,
          dailySpent: state.dailySpent + cappedAmount,
          transactions: [transaction, ...state.transactions].slice(0, 50),
        });
        return true;
      },
      resetDailyCounters: () => {
        const today = new Date().toLocaleDateString("en-CA"); // YYYY-MM-DD in local timezone
        set({ dailyEarned: 0, dailySpent: 0, lastResetDate: today });
      },
      getTransactions: (limit = 50) => {
        return get().transactions.slice(0, limit);
      },
      getRemainingDailyCapacity: () => {
        const state = get();
        const today = new Date().toLocaleDateString("en-CA"); // YYYY-MM-DD in local timezone
        if (state.lastResetDate !== today) {
          // Perform the same reset side-effect as addBalance
          set({ dailyEarned: 0, dailySpent: 0, lastResetDate: today });
        }
        return Math.max(DAILY_EARNING_CAP - state.dailyEarned, 0);
      },
      updateStreak: (completedToday: boolean) => {
        const state = get();
        const today = new Date().toLocaleDateString("en-CA");

        // Check if we need to reset streak (new day)
        if (state.lastResetDate !== today) {
          // Reset daily counters and update streak
          const newStreak = completedToday ? state.currentStreak + 1 : 0;
          const newLongestStreak = Math.max(state.longestStreak, newStreak);

          set({
            dailyEarned: 0,
            dailySpent: 0,
            lastResetDate: today,
            currentStreak: newStreak,
            longestStreak: newLongestStreak,
          });
        } else {
          // Same day - only update streak if it's not already set for today
          // We assume streak is set once per day when first habit is completed
          if (completedToday && state.currentStreak === 0) {
            // Start a new streak of 1 for today
            const newStreak = 1;
            const newLongestStreak = Math.max(state.longestStreak, newStreak);

            set({
              currentStreak: newStreak,
              longestStreak: newLongestStreak,
            });
          } else if (!completedToday && state.currentStreak > 0) {
            // If habit not completed today but we have an active streak, reset it
            set({ currentStreak: 0 });
          }
        }
      },
      resetStreak: () => {
        set({ currentStreak: 0 });
      },
    }),
    {
      name: "time-bank-storage",
      storage: createJSONStorage(() => zustandStorage),
    }
  )
);
