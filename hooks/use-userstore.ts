import zustandStorage from "@/utils/zustandStorage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

// Define User type - using unknown for dynamic/unpredictable user structures
type User = unknown;

interface UserStore {
  isGuest: boolean;
  user: User | null;
  setIsGuest: (isGuest: boolean) => void;
  setUser: (user: User) => void;
}

const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      isGuest: false,
      user: null,
      setIsGuest: (isGuest: boolean) => set({ isGuest }),
      setUser: (user: User) => set({ user }),
    }),
    {
      name: "user",
      storage: createJSONStorage(() => zustandStorage),
    }
  )
);

export default useUserStore;
