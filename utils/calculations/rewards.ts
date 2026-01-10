export function calculateRewardAmount(
  baseReward: number,
  multipliers: {
    streak?: number;
    combo?: number;
    time?: number;
    verification?: number;
  }
): number {
  let totalMultiplier = 1;
  Object.values(multipliers).forEach((m) => {
    if (m != null) totalMultiplier *= m;
  });
  return Math.floor(baseReward * totalMultiplier);
}
export function getStreakMultiplier(streak: number): number {
  if (streak >= 100) return 2.0;
  if (streak >= 50) return 1.75;
  if (streak >= 30) return 1.5;
  if (streak >= 14) return 1.25;
  if (streak >= 7) return 1.1;
  return 1.0;
}
