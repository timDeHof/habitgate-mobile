import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { zustandStorage } from "./zustandStorage";
import {
  ACHIEVEMENTS as allAchievements,
  GamificationState,
} from "@/data/gamification";
import {
  calculateLevel,
  calculateProductivityScore,
} from "@/utils/calculations/xp";
import { useHabitsStore } from "@/store/habitsStore";
import { useTimeBankStore } from "@/store/timeBankStore";

function getXPForLevel(level: number): number {
  return Math.floor(100 * Math.pow(1.5, level - 1));
}

interface GamificationActions {
  addXP: (amount: number) => void;
  updateStreak: () => void;
  checkAchievements: () => void;
  unlockAchievement: (achievementId: string) => void;
  calculateProductivity: () => void;
}
type GamificationStore = GamificationState & GamificationActions;
export const useGamificationStore = create<GamificationStore>()(
  persist(
    (set, get) => ({
      level: 1,
      currentXP: 0,
      totalXP: 0,
      currentStreak: 0,
      longestStreak: 0,
      lastActivityDate: null,
      productivityScore: 0,
      achievements: allAchievements.map((a) => ({ ...a, progress: 0 })),
      addXP: (amount) => {
        const newTotalXP = get().totalXP + amount;
        const newLevel = calculateLevel(newTotalXP);
        const xpForCurrentLevel = newTotalXP - getXPForLevel(newLevel - 1);
        set({
          currentXP: xpForCurrentLevel,
          totalXP: newTotalXP,
          level: newLevel,
        });
        get().checkAchievements();
      },
      updateStreak: () => {
        // Use calendar-aware date arithmetic to handle DST transitions correctly
        const now = new Date();

        // Get today's date in yyyy-mm-dd format (UTC to avoid timezone issues)
        const today = now.toISOString().split("T")[0];

        // Calculate yesterday using calendar arithmetic (handles DST, month/year boundaries)
        const yesterday = (() => {
          const yesterdayDate = new Date(now);
          yesterdayDate.setUTCDate(yesterdayDate.getUTCDate() - 1); // Use UTC methods for consistency
          return yesterdayDate.toISOString().split("T")[0];
        })();

        const lastActivity = get().lastActivityDate;
        let newStreak = get().currentStreak;
        if (lastActivity === yesterday) {
          newStreak += 1;
        } else if (lastActivity !== today) {
          newStreak = 1;
        }
        set({
          currentStreak: newStreak,
          longestStreak: Math.max(newStreak, get().longestStreak),
          lastActivityDate: today,
        });
        get().checkAchievements();
      },
      checkAchievements: () => {
        const state = get();
        const updatedAchievements = state.achievements.map((achievement) => {
          if (achievement.unlockedAt) return achievement;
          let progress = 0;
          let shouldUnlock = false;

          // Guard against division by zero
          const requirementValue = achievement.requirement.value;
          const isValidValue = requirementValue !== 0 && requirementValue > 0;

          switch (achievement.requirement.type) {
            case "xp_earned":
              if (isValidValue) {
                progress = (state.totalXP / requirementValue) * 100;
                shouldUnlock = state.totalXP >= requirementValue;
              } else {
                // Handle zero/negative values with direct comparison
                progress = 0;
                shouldUnlock = state.totalXP >= requirementValue;
              }
              break;
            case "current_streak":
              if (isValidValue) {
                progress = (state.currentStreak / requirementValue) * 100;
                shouldUnlock = state.currentStreak >= requirementValue;
              } else {
                // Handle zero/negative values with direct comparison
                progress = 0;
                shouldUnlock = state.currentStreak >= requirementValue;
              }
              break;
            case "longest_streak":
              if (isValidValue) {
                progress = (state.longestStreak / requirementValue) * 100;
                shouldUnlock = state.longestStreak >= requirementValue;
              } else {
                // Handle zero/negative values with direct comparison
                progress = 0;
                shouldUnlock = state.longestStreak >= requirementValue;
              }
              break;
            default:
              // Handle unexpected requirement types safely
              console.warn(
                `Unknown achievement requirement type: ${achievement.requirement.type}`
              );
              progress = 0;
              shouldUnlock = false;
              break;
          }
          if (shouldUnlock) {
            return {
              ...achievement,
              progress: 100,
              unlockedAt: Date.now(),
            };
          }
          return {
            ...achievement,
            progress: Math.min(100, progress),
          };
        });
        set({ achievements: updatedAchievements });
      },
      unlockAchievement: (achievementId) => {
        set({
          achievements: get().achievements.map((a) =>
            a.id === achievementId
              ? { ...a, unlockedAt: Date.now(), progress: 100 }
              : a
          ),
        });
      },
      calculateProductivity: () => {
        const habitsStore = useHabitsStore.getState();
        const timeBankStore = useTimeBankStore.getState();
        const score = calculateProductivityScore(habitsStore, timeBankStore);
        set({ productivityScore: score });
      },
    }),
    {
      name: "gamification-storage",
      storage: createJSONStorage(() => zustandStorage),
    }
  )
);
