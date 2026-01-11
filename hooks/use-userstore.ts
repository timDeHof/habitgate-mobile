import { zustandStorage } from "@/store/zustandStorage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { User } from "@/data/user";

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
