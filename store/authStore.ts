// stores/authStore.ts
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { zustandStorage } from "@/store/zustandStorage";

/**
 * User interface representing authenticated user data
 * @property {string} id - Unique user identifier (required)
 * @property {string} email - User email address (required)
 * @property {string} fullName - User's full name
 */
interface User {
  id: string;
  email: string;
  fullName: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;

  /**
   * Sets authenticated user data with validation and normalization
   * @param {User} user - User object containing id, email, and fullName
   * @param {string} token - Authentication token
   * @throws {Error} If validation fails for required fields or token
   */
  setUser: (user: User, token: string) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      setUser: (user, token) => {
        // Validate token: must be a non-empty string
        if (typeof token !== "string" || token.trim() === "") {
          throw new Error(
            `setUser validation failed: 'token' must be a non-empty string. ` +
              `Received: ${typeof token} with value "${token}"`
          );
        }

        // Validate user object structure and required fields
        if (!user || typeof user !== "object") {
          throw new Error(
            `setUser validation failed: 'user' must be an object. ` +
              `Received: ${typeof user}`
          );
        }

        // Validate required user.id field
        if (typeof user.id !== "string" || user.id.trim() === "") {
          throw new Error(
            `setUser validation failed: 'user.id' must be a non-empty string. ` +
              `Received: ${typeof user.id} with value "${user.id}"`
          );
        }

        // Validate required user.email field
        if (typeof user.email !== "string" || user.email.trim() === "") {
          throw new Error(
            `setUser validation failed: 'user.email' must be a non-empty string. ` +
              `Received: ${typeof user.email} with value "${user.email}"`
          );
        }

        // Normalize/sanitize user object
        const normalizedUser = {
          id: user.id.trim(),
          email: user.email.trim().toLowerCase(), // Ensure consistent email casing
          fullName: user.fullName ? user.fullName.trim() : "",
        };

        // Set authenticated state with validated and normalized data
        set({
          user: normalizedUser,
          token: token.trim(),
          isAuthenticated: true,
        });
      },

      clearAuth: () =>
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        }),
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => zustandStorage),
    }
  )
);
