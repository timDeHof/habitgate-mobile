import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { zustandStorage } from "./zustandStorage";
import { UserPreferences, THEME_OPTIONS, parseUserPreferences } from "@/data/user";

interface SettingsState {
  preferences: UserPreferences;
}

interface SettingsActions {
  setPreference: <K extends keyof UserPreferences>(
    key: K,
    value: UserPreferences[K]
  ) => void;
  resetPreferences: () => void;
}

type SettingsStore = SettingsState & SettingsActions;

const DEFAULT_PREFERENCES: UserPreferences = {
  theme: THEME_OPTIONS.AUTO,
  notifications: true,
  sound: true,
  vibration: true,
  strictMode: false,
};

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      preferences: DEFAULT_PREFERENCES,
      setPreference: (key, value) =>
        set((state) => ({
          preferences: {
            ...state.preferences,
            [key]: value,
          },
        })),
      resetPreferences: () => set({ preferences: DEFAULT_PREFERENCES }),
    }),
    {
      name: "settings-storage",
      storage: createJSONStorage(() => zustandStorage),
      version: 1,
      migrate: (persistedState: any, version: number) => {
        if (version < 1) {
          return {
            ...persistedState,
            preferences: persistedState?.preferences
              ? parseUserPreferences(persistedState.preferences)
              : DEFAULT_PREFERENCES,
          };
        }
        return persistedState;
      },
    }
  )
);
