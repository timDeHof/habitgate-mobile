import { Habit, HabitCompletion } from "@/data/habits";
import { Transaction, TransactionSourceType } from "@/data/timebank";
import { DistractingApp } from "@/data/apps";
import { ValidationResult } from "@/utils/validation/timeBankValidation";

export type LockedApp = DistractingApp;

export interface UnlockSession {
  appId: string;
  expiresAt: number;
}

export interface ITimeBankService {
  getBalance(): Promise<number>;
  addBalance(
    amount: number,
    source: TransactionSourceType,
    metadata?: Transaction["metadata"]
  ): Promise<ValidationResult>;
  deductBalance(
    amount: number,
    source: TransactionSourceType,
    metadata?: Transaction["metadata"]
  ): Promise<ValidationResult>;
  getTransactions(limit?: number): Promise<Transaction[]>;
  getRemainingDailyCapacity(): Promise<number>;
}
export interface IHabitsService {
  getHabits(): Promise<Habit[]>;
  getHabit(id: string): Promise<Habit | null>;
  createHabit(
    habit: Omit<Habit, "id" | "createdAt" | "updatedAt">
  ): Promise<Habit>;
  updateHabit(id: string, updates: Partial<Habit>): Promise<Habit | null>;
  deleteHabit(id: string): Promise<boolean>;
  completeHabit(
    id: string,
    verificationData?: any
  ): Promise<{ success: boolean; timeEarned: number; xpEarned: number }>;
  getCompletions(habitId?: string, limit?: number): Promise<HabitCompletion[]>;
}
export interface IAppsService {
  getLockedApps(): Promise<LockedApp[]>;
  addLockedApp(
    app: Omit<LockedApp, "id" | "createdAt" | "updatedAt">
  ): Promise<LockedApp>;
  removeLockedApp(id: string): Promise<boolean>;
  unlockApp(
    appId: string,
    unlockType?: "normal" | "emergency"
  ): Promise<{
    success: boolean;
    expiresAt?: number;
  }>;
  isAppUnlocked(appId: string): Promise<boolean>;
  getUnlocks(appId?: string, limit?: number): Promise<UnlockSession[]>;
}
