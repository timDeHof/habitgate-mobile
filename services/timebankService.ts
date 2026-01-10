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
import { Transaction, TransactionSourceType } from "@/data/timebank";

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
    return useTimeBankStore.getState().getRemainingDailyCapacity();
  }
}
export const timeBankService = new LocalTimeBankService();
