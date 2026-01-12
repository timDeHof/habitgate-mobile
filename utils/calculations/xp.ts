import { useTimeBankStore } from "@/store/timeBankStore";

// Constants for time calculations
const MS_PER_DAY = 24 * 60 * 60 * 1000; // Milliseconds in one day
const DAYS_BACK = 7; // Days to look back for consistency calculation

export function calculateLevel(totalXP: number): number {
  let level = 1;
  let xpRequired = 100;
  let totalRequired = 0;
  while (totalRequired + xpRequired <= totalXP) {
    totalRequired += xpRequired;
    level++;
    xpRequired = Math.floor(100 * Math.pow(1.5, level - 1));
  }
  return level;
}
export function getXPForNextLevel(currentLevel: number): number {
  return Math.floor(100 * Math.pow(1.5, currentLevel - 1));
}
export function calculateProductivityScore(
  habitsStore: {
    habits: Array<{
      currentStreak: number;
      isActive: boolean;
      completedToday: boolean;
    }>;
    completions: Array<{ completedAt: number }>;
  },
  timeBankStore: { balance: number }
): number {
  // Factors: completion rate, streak, balance, consistency
  const completionRate = calculateCompletionRate(habitsStore);
  const streakScore = Math.min(
    100,
    habitsStore.habits.reduce(
      (max: number, h) => Math.max(max, h.currentStreak),
      0
    ) * 2
  );
  const balanceScore = Math.max(0, Math.min(100, timeBankStore.balance / 2));
  const consistencyScore = calculateConsistency(habitsStore);
  const score =
    completionRate * 0.4 +
    streakScore * 0.3 +
    balanceScore * 0.15 +
    consistencyScore * 0.15;
  return Math.round(score);
}
function calculateCompletionRate(habitsStore: any): number {
  const activeHabits = habitsStore.habits.filter((h: any) => h.isActive);
  if (activeHabits.length === 0) return 0;
  const completedToday = activeHabits.filter(
    (h: any) => h.completedToday
  ).length;
  return (completedToday / activeHabits.length) * 100;
}
function calculateConsistency(habitsStore: any): number {
  const last7Days = habitsStore.completions.filter(
    (c: any) => Date.now() - c.completedAt < DAYS_BACK * MS_PER_DAY
  );
  const daysWithCompletions = new Set(
    last7Days.map(
      (c: any) => new Date(c.completedAt).toISOString().split("T")[0]
    )
  ).size;
  return (daysWithCompletions / DAYS_BACK) * 100;
}
export function getStreakMultiplier(streak: number): number {
  if (streak >= 100) return 2.0;
  if (streak >= 50) return 1.75;
  if (streak >= 30) return 1.5;
  if (streak >= 14) return 1.25;
  if (streak >= 7) return 1.1;
  return 1.0;
}
