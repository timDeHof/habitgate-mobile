import { zustandStorage } from "@/store/zustandStorage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { User, parseUser } from "@/data/user";

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
      migrate: (persistedState: any) => {
        if (persistedState && persistedState.user) {
          return {
            ...persistedState,
            user: parseUser(persistedState.user),
          };
        }
        return persistedState;
      },
    }
  )
);

export default useUserStore;
