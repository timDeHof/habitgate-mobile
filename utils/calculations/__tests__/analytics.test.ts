import {
  getDailyActivity,
  getCategoryBreakdown,
  getBalanceTrend,
  getSummaryStats,
} from "../analytics";
import { Transaction } from "@/data/timebank";
import { HabitCompletion, Habit } from "@/data/habits";

describe("analytics utilities", () => {
  const mockTransactions: Transaction[] = [
    {
      id: "1",
      type: "earn",
      amount: 30,
      balanceAfter: 30,
      sourceType: "habit",
      timestamp: Date.now(),
    },
    {
      id: "2",
      type: "spend",
      amount: -15,
      balanceAfter: 15,
      sourceType: "app_unlock",
      timestamp: Date.now(),
    },
    {
      id: "3",
      type: "earn",
      amount: 20,
      balanceAfter: 35,
      sourceType: "habit",
      timestamp: Date.now() - 86400000, // yesterday
    },
  ];

  const mockHabits: Habit[] = [
    { id: "h1", name: "Run", category: "physical" } as any,
    { id: "h2", name: "Read", category: "mental" } as any,
  ];

  const mockCompletions: HabitCompletion[] = [
    { id: "c1", habitId: "h1", xpEarned: 10, completedAt: Date.now() } as any,
    { id: "c2", habitId: "h2", xpEarned: 5, completedAt: Date.now() } as any,
    { id: "c3", habitId: "h1", xpEarned: 10, completedAt: Date.now() } as any,
  ];

  test("getDailyActivity groups transactions correctly", () => {
    const activity = getDailyActivity(mockTransactions, 2);
    expect(activity).toHaveLength(2);
    expect(activity[1].earned).toBe(30); // today
    expect(activity[1].spent).toBe(15);
    expect(activity[0].earned).toBe(20); // yesterday
    expect(activity[0].spent).toBe(0);
  });

  test("getCategoryBreakdown aggregates completions correctly", () => {
    const breakdown = getCategoryBreakdown(mockCompletions, mockHabits);
    expect(breakdown).toHaveLength(2);
    const physical = breakdown.find((b) => b.category === "physical");
    const mental = breakdown.find((b) => b.category === "mental");
    expect(physical?.count).toBe(2);
    expect(physical?.xpEarned).toBe(20);
    expect(mental?.count).toBe(1);
    expect(mental?.xpEarned).toBe(5);
  });

  test("getBalanceTrend calculates history correctly", () => {
    const trend = getBalanceTrend(mockTransactions, 35, 2);
    expect(trend).toHaveLength(2);
    expect(trend[1].balance).toBe(35); // today
    expect(trend[0].balance).toBe(20); // yesterday (35 - 30 + 15 = 20)
  });

  test("getSummaryStats calculates totals correctly", () => {
    const stats = getSummaryStats(mockTransactions);
    expect(stats.totalEarned).toBe(50);
    expect(stats.totalSpent).toBe(15);
  });
});
