import { Habit, HabitCompletion } from "@/data/habits";
import { getStreakMultiplier } from "./xp";

/**
 * Strongly-typed multipliers interface to replace `any` type
 * Defines all possible multiplier types and their value types
 */
interface Multipliers {
  streak?: number;
  combo?: number;
  time?: number;
  verification?: number;
}

/**
 * Strongly-typed result interface for calculateRewards function
 * Enforces consistent return structure and type safety
 */
interface RewardsResult {
  timeEarned: number;
  xpEarned: number;
  multipliers: Multipliers;
  baseReward: number;
  totalMultiplier: number;
}

export function calculateRewards(
  habit: Habit,
  recentCompletions: HabitCompletion[]
): RewardsResult {
  const baseReward = habit.rewardAmount;
  const multipliers: Multipliers = {};
  // Streak multiplier
  const streakMultiplier = getStreakMultiplier(habit.currentStreak);
  if (streakMultiplier > 1) {
    multipliers.streak = streakMultiplier;
  }
  // Combo multiplier (3 habits in last hour)
  const recentCount = recentCompletions.filter(
    (c) => Date.now() - c.completedAt < 3600000
  ).length;
  if (recentCount >= 2) {
    multipliers.combo = 1.2;
  }
  // Time multiplier (optimal time window)
  if (habit.optimalTimeStart && habit.optimalTimeEnd) {
    const now = new Date();
    const currentHours = now.getHours();
    const currentMinutes = now.getMinutes();
    const currentTimeInMinutes = currentHours * 60 + currentMinutes;

    // Parse optimal time window by splitting on ":" and converting to minutes
    const parseTimeToMinutes = (timeStr: string): number => {
      const [hours, minutes] = timeStr.split(":").map(Number);
      return hours * 60 + minutes;
    };

    const optimalStartInMinutes = parseTimeToMinutes(habit.optimalTimeStart);
    const optimalEndInMinutes = parseTimeToMinutes(habit.optimalTimeEnd);

    // Perform numeric comparison (start <= now <= end)
    if (
      currentTimeInMinutes >= optimalStartInMinutes &&
      currentTimeInMinutes <= optimalEndInMinutes
    ) {
      multipliers.time = 1.1;
    }
  }
  // Verification multiplier
  if (
    habit.verificationMethod === "photo" ||
    habit.verificationMethod === "integration"
  ) {
    multipliers.verification = 1.2;
  }
  // Apply all multipliers
  let totalMultiplier = 1;
  Object.values(multipliers).forEach((m: number) => {
    totalMultiplier *= m;
  });
  const timeEarned = Math.floor(baseReward * totalMultiplier);
  const xpEarned = Math.floor(timeEarned * 2); // XP is 2x time earned

  return {
    timeEarned,
    xpEarned,
    multipliers,
    baseReward,
    totalMultiplier,
  };
}
