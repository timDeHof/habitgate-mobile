import {
  format,
  subDays,
  startOfDay,
  eachDayOfInterval,
  isSameDay,
} from "date-fns";
import { Transaction } from "@/data/timebank";
import { HabitCompletion, Habit } from "@/data/habits";

export interface DailyActivity {
  date: string;
  earned: number;
  spent: number;
  [key: string]: string | number;
}

export interface CategoryBreakdown {
  category: string;
  count: number;
  xpEarned: number;
}

export interface BalancePoint {
  date: string;
  balance: number;
  [key: string]: string | number;
}

/**
 * Groups transactions by day for a given period.
 */
export const getDailyActivity = (
  transactions: Transaction[],
  days: number = 7
): DailyActivity[] => {
  const endDate = new Date();
  const startDate = subDays(startOfDay(endDate), days - 1);

  const daysInterval = eachDayOfInterval({ start: startDate, end: endDate });

  return daysInterval.map((day) => {
    const dayTransactions = transactions.filter((tx) =>
      isSameDay(new Date(tx.timestamp), day)
    );

    const earned = dayTransactions
      .filter((tx) => tx.type === "earn" || tx.type === "bonus")
      .reduce((sum, tx) => sum + tx.amount, 0);

    const spent = dayTransactions
      .filter((tx) => tx.type === "spend" || tx.type === "penalty")
      .reduce((sum, tx) => sum + Math.abs(tx.amount), 0);

    return {
      date: format(day, "MMM dd"),
      earned,
      spent,
    };
  });
};

/**
 * Aggregates habit completions by category.
 */
export const getCategoryBreakdown = (
  completions: HabitCompletion[],
  habits: Habit[]
): CategoryBreakdown[] => {
  const categoryMap: Record<string, { count: number; xpEarned: number }> = {};

  completions.forEach((completion) => {
    const habit = habits.find((h) => h.id === completion.habitId);
    const category = habit?.category || "other";

    if (!categoryMap[category]) {
      categoryMap[category] = { count: 0, xpEarned: 0 };
    }

    categoryMap[category].count += 1;
    categoryMap[category].xpEarned += completion.xpEarned;
  });

  return Object.entries(categoryMap).map(([category, stats]) => ({
    category,
    ...stats,
  }));
};

/**
 * Calculates current balance trend over time.
 */
export const getBalanceTrend = (
  transactions: Transaction[],
  currentBalance: number,
  days: number = 7
): BalancePoint[] => {
  const endDate = new Date();
  const startDate = subDays(startOfDay(endDate), days - 1);
  const daysInterval = eachDayOfInterval({ start: startDate, end: endDate });



  return daysInterval.map((day) => {
    const dayEnd = new Date(day);
    dayEnd.setHours(23, 59, 59, 999);

    // The balance at the end of a day is the balance AFTER all transactions of that day.
    // This is equivalent to current balance MINUS all transactions that occurred AFTER this day.
    const futureTransactions = transactions.filter(
      (tx) => tx.timestamp > dayEnd.getTime()
    );
    const totalFuture = futureTransactions.reduce((sum, tx) => sum + tx.amount, 0);

    return {
      date: format(day, "MMM dd"),
      balance: currentBalance - totalFuture,
    };
  });
};

/**
 * Calculates summary statistics.
 */
export const getSummaryStats = (transactions: Transaction[]) => {
  const totalEarnedValue = transactions
    .filter((tx) => tx.type === "earn" || tx.type === "bonus")
    .reduce((sum, tx) => sum + tx.amount, 0);

  const totalSpentValue = transactions
    .filter((tx) => tx.type === "spend" || tx.type === "penalty")
    .reduce((sum, tx) => sum + Math.abs(tx.amount), 0);

  const avgEarning =
    transactions.length > 0
      ? totalEarnedValue / (new Set(transactions.map(tx => format(tx.timestamp, 'yyyy-MM-dd'))).size || 1)
      : 0;

  return {
    totalEarned: totalEarnedValue,
    totalSpent: totalSpentValue,
    avgDailyEarning: Math.round(avgEarning),
  };
};
