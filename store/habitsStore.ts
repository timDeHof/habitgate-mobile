import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { zustandStorage } from "./zustandStorage";
import {
  Habit,
  HabitCompletion,
  habits,
  habitCompletions,
  generatedDummyHabits,
  generatedDummyCompletions,
} from "@/data/habits";
import { useTimeBankStore } from "./timeBankStore";
import { calculateRewards } from "@/utils/calculations/rewards";
interface HabitsState {
  habits: Habit[];
  completions: HabitCompletion[];
  lastResetDate: string;
}
interface HabitsActions {
  addHabit: (
    habit: Omit<
      Habit,
      | "id"
      | "completedToday"
      | "completionCountToday"
      | "currentStreak"
      | "longestStreak"
      | "createdAt"
      | "updatedAt"
    >
  ) => void;
  updateHabit: (id: string, updates: Partial<Habit>) => void;
  deleteHabit: (id: string) => void;
  completeHabit: (
    id: string,
    verificationData?: any
  ) => { success: boolean; timeEarned: number; xpEarned: number };
  getHabit: (id: string) => Habit | undefined;
  getHabitsByCategory: (category: string) => Habit[];
  getCompletions: (habitId?: string, limit?: number) => HabitCompletion[];
  resetDailyCompletions: () => void;
}
type HabitsStore = HabitsState & HabitsActions;
export const useHabitsStore = create<HabitsStore>()(
  persist(
    (set, get) => ({
      habits: [...habits, ...generatedDummyHabits],
      completions: [...habitCompletions, ...generatedDummyCompletions],
      lastResetDate: new Date().toISOString().split("T")[0],
      addHabit: (habitData) => {
        const newHabit: Habit = {
          ...habitData,
          id: `${Date.now()}-${Math.random().toString(36).substring(2, 8)}`,
          completedToday: false,
          completionCountToday: 0,
          currentStreak: 0,
          longestStreak: 0,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        };
        set({ habits: [...get().habits, newHabit] });
      },
      updateHabit: (id, updates) => {
        set({
          habits: get().habits.map((h) =>
            h.id === id ? { ...h, ...updates, updatedAt: Date.now() } : h
          ),
        });
      },
      deleteHabit: (id) => {
        set({
          habits: get().habits.map((h) =>
            h.id === id ? { ...h, isActive: false, updatedAt: Date.now() } : h
          ),
        });
      },
      completeHabit: (id, verificationData) => {
        const habit = get().habits.find((h) => h.id === id);
        if (!habit) return { success: false, timeEarned: 0, xpEarned: 0 };
        // Check daily completion cap
        if (habit.completionCountToday >= 3) {
          return { success: false, timeEarned: 0, xpEarned: 0 };
        }
        // Calculate rewards with multipliers
        const { timeEarned, xpEarned, multipliers } = calculateRewards(
          habit,
          get().completions
        );
        // Create completion record
        const completion: HabitCompletion = {
          id: Date.now().toString(),
          habitId: id,
          completedAt: Date.now(),
          verificationData,
          xpEarned,
          timeEarned,
          bonusMultipliers: multipliers,
        };
        // Update habit streak
        const today = new Date().toISOString().split("T")[0];
        const yesterday = new Date(Date.now() - 86400000)
          .toISOString()
          .split("T")[0];
        let newStreak = habit.currentStreak;
        if (habit.lastCompletedDate === yesterday) {
          newStreak += 1;
        } else if (habit.lastCompletedDate !== today) {
          newStreak = 1;
        }
        set({
          habits: get().habits.map((h) =>
            h.id === id
              ? {
                  ...h,
                  completedToday: true,
                  completionCountToday: h.completionCountToday + 1,
                  currentStreak: newStreak,
                  longestStreak: Math.max(newStreak, h.longestStreak),
                  lastCompletedDate: today,
                  updatedAt: Date.now(),
                }
              : h
          ),
          completions: [completion, ...get().completions].slice(0, 100),
        });
        // Update time bank
        useTimeBankStore.getState().addBalance(timeEarned, "habit", {
          habitName: habit.name,
        });
        // Update gamification using callback to avoid circular dependency
        setTimeout(() => {
          const useGamificationStore =
            require("./gamificationStore").useGamificationStore;
          useGamificationStore.getState().addXP(xpEarned);
          useGamificationStore.getState().updateStreak();
        }, 0);
        return { success: true, timeEarned, xpEarned };
      },
      getHabit: (id) => {
        return get().habits.find((h) => h.id === id);
      },
      getHabitsByCategory: (category) => {
        return get().habits.filter(
          (h) => h.category === category && h.isActive
        );
      },
      getCompletions: (habitId, limit = 50) => {
        const completions = get().completions;
        if (habitId) {
          return completions
            .filter((c) => c.habitId === habitId)
            .slice(0, limit);
        }
        return completions.slice(0, limit);
      },
      resetDailyCompletions: () => {
        const today = new Date().toISOString().split("T")[0];
        if (get().lastResetDate !== today) {
          set({
            habits: get().habits.map((h) => ({
              ...h,
              completedToday: false,
              completionCountToday: 0,
            })),
            lastResetDate: today,
          });
        }
      },
    }),
    {
      name: "habits-storage",
      storage: createJSONStorage(() => zustandStorage),
    }
  )
);
