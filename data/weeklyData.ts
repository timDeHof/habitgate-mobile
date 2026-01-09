interface WeeklyDataPoint {
  day: string;
  earned: number;
  wasted: number;
}

export const weeklyDataPoints: WeeklyDataPoint[] = [
  { day: "Mon", earned: 90, wasted: 20 },
  { day: "Tue", earned: 75, wasted: 30 },
  { day: "Wed", earned: 100, wasted: 25 },
  { day: "Thu", earned: 85, wasted: 35 },
  { day: "Fri", earned: 95, wasted: 40 },
  { day: "Sat", earned: 70, wasted: 45 },
  { day: "Sun", earned: 80, wasted: 50 },
];
