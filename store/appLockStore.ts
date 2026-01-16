import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { zustandStorage } from "./zustandStorage";
import { DistractingApp, POPULAR_APPS } from "@/data/apps";

interface AppUsageStats {
  unlockCount: number;
  minutesUnlocked: number;
}

interface AppLockState {
  monitoredApps: DistractingApp[];
  unlockedSessions: Record<string, number>; // appId -> expiryTimestamp (ms)
  appUsageStats: Record<string, AppUsageStats>;
  isPremium: boolean;
  availableApps: DistractingApp[]; // Mocked list of "installed" apps
}

interface AppLockActions {
  addMonitoredApp: (appId: string) => { success: boolean; error?: string };
  removeMonitoredApp: (appId: string) => void;
  unlockApp: (appId: string, durationMinutes: number) => void;
  cleanupExpiredSessions: () => void;
  isAppUnlocked: (appId: string) => boolean;
  getRemainingTime: (appId: string) => number; // in seconds
  setPremium: (isPremium: boolean) => void;
}

type AppLockStore = AppLockState & AppLockActions;

export const useAppLockStore = create<AppLockStore>()(
  persist(
    (set, get) => ({
      monitoredApps: POPULAR_APPS.slice(0, 3), // Default few apps
      unlockedSessions: {},
      appUsageStats: {},
      isPremium: false,
      availableApps: POPULAR_APPS, // In a real app, this would be fetched from device

      addMonitoredApp: (appId) => {
        const state = get();

        // Check limit
        if (!state.isPremium && state.monitoredApps.length >= 5) {
            return { success: false, error: "Free tier limited to 5 apps. Upgrade to Premium for unlimited!" };
        }

        const appToAdd = state.availableApps.find((a) => a.id === appId);

        if (!appToAdd) {
             return { success: false, error: "App not found." };
        }

        if (state.monitoredApps.find((a) => a.id === appId)) {
             return { success: false, error: "App is already in your vault." };
        }

        set((state) => ({
            monitoredApps: [...state.monitoredApps, appToAdd],
        }));
        return { success: true };
      },

      removeMonitoredApp: (appId) => {
        set((state) => ({
          monitoredApps: state.monitoredApps.filter((a) => a.id !== appId),
        }));
      },

      unlockApp: (appId, durationMinutes) => {
        if (durationMinutes <= 0) return;
        const appExists = get().availableApps.some((a) => a.id === appId);
        if (!appExists) return;
        const expiry = Date.now() + durationMinutes * 60 * 1000;

        set((state) => {
            const currentStats = state.appUsageStats[appId] || { unlockCount: 0, minutesUnlocked: 0 };
            return {
                unlockedSessions: {
                    ...state.unlockedSessions,
                    [appId]: expiry,
                },
                appUsageStats: {
                    ...state.appUsageStats,
                    [appId]: {
                        unlockCount: currentStats.unlockCount + 1,
                        minutesUnlocked: currentStats.minutesUnlocked + durationMinutes
                    }
                }
            }
        });
      },

      cleanupExpiredSessions: () => {
        const now = Date.now();
        const currentSessions = get().unlockedSessions;
        const activeSessions: Record<string, number> = {};

        Object.entries(currentSessions).forEach(([id, expiry]) => {
          if (expiry > now) {
            activeSessions[id] = expiry;
          }
        });

        if (Object.keys(currentSessions).length !== Object.keys(activeSessions).length) {
          set({ unlockedSessions: activeSessions });
        }
      },

      isAppUnlocked: (appId) => {
        const expiry = get().unlockedSessions[appId];
        return !!expiry && expiry > Date.now();
      },

      getRemainingTime: (appId) => {
        const expiry = get().unlockedSessions[appId];
        if (!expiry) return 0;
        const now = Date.now();
        return Math.max(0, Math.floor((expiry - now) / 1000));
      },

      setPremium: (isPremium) => set({ isPremium }),
    }),
    {
      name: "app-lock-storage",
      storage: createJSONStorage(() => zustandStorage),
    }
  )
);
