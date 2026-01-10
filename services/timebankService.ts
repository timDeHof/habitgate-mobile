/**
 * TimeBank service module for the HabitGate application.
 *
 * This module provides a TimeBankService class which wraps store calls
 * and exposes async operations for time currency management. The class
 * serves as an abstraction layer over the underlying store, encapsulating
 * the logic for interacting with the time bank store and providing a clean
 * async API for time currency operations throughout the application.
 */

import { ITimeBankService } from "../types/interfaces";
import { useTimeBankStore } from "@/store/timeBankStore";
import {
  Transaction,
  TransactionSourceType,
  DAILY_EARNING_CAP,
} from "@/data/timebank";

export class LocalTimeBankService implements ITimeBankService {
  async getBalance(): Promise<number> {
    return useTimeBankStore.getState().balance;
  }
  async addBalance(
    amount: number,
    source: TransactionSourceType,
    metadata?: Transaction["metadata"]
  ): Promise<boolean> {
    return useTimeBankStore.getState().addBalance(amount, source, metadata);
  }
  async deductBalance(
    amount: number,
    source: TransactionSourceType,
    metadata?: Transaction["metadata"]
  ): Promise<boolean> {
    return useTimeBankStore.getState().deductBalance(amount, source, metadata);
  }
  async getTransactions(limit?: number): Promise<Transaction[]> {
    return useTimeBankStore.getState().getTransactions(limit);
  }
  async getRemainingDailyCapacity(): Promise<number> {
    const state = useTimeBankStore.getState();
    // Perform daily reset check as side effect
    const today = new Date().toISOString().split("T")[0];
    if (state.lastResetDate !== today) {
      useTimeBankStore.setState({ dailyEarned: 0, lastResetDate: today });
    }
    // Calculate and return actual remaining capacity
    return Math.max(DAILY_EARNING_CAP - state.dailyEarned, 0);
  }
}
export const timeBankService = new LocalTimeBankService();
