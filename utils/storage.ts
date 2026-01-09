import { storage } from "@/store/zustandStorage";

export const StorageKeys = {
  TIME_BANK: "time-bank-storage",
  HABITS: "habits-storage",
  APPS: "apps-storage",
  GAMIFICATION: "gamification-storage",
  USER: "user-storage",
  ONBOARDING: "onboarding-storage",
} as const;

export function getStorageSize(): number {
  const keys = storage.getAllKeys();
  let totalSize = 0;
  keys.forEach((key) => {
    const value = storage.getString(key);
    if (value) {
      totalSize += value.length;
    }
  });
  return totalSize; // bytes
}

export function exportAllData(): Record<string, any> {
  const keys = storage.getAllKeys();
  const data: Record<string, any> = {};
  keys.forEach((key) => {
    const value = storage.getString(key);
    if (value) {
      try {
        data[key] = JSON.parse(value);
      } catch {
        data[key] = value;
      }
    }
  });
  return data;
}

export function importData(data: Record<string, any>): void {
  Object.entries(data).forEach(([key, value]) => {
    storage.set(key, JSON.stringify(value));
  });
}
