/**
 * User-related types and schemas for HabitGate
 * Provides type safety, validation, and runtime checking
 */

/**
 * Supported theme options for the application
 */
export const THEME_OPTIONS = {
  LIGHT: "light" as const,
  DARK: "dark" as const,
  AUTO: "auto" as const,
} as const;

export type ThemeOption = (typeof THEME_OPTIONS)[keyof typeof THEME_OPTIONS];

/**
 * User preferences configuration
 * Controls app appearance and behavioral settings
 */
export interface UserPreferences {
  /** Visual theme preference */
  theme: ThemeOption;
  /** Enable push notifications */
  notifications: boolean;
  /** Strict mode for habit enforcement */
  strictMode: boolean;
  /** Daily reminder time in HH:mm format (24-hour) */
  dailyReminderTime?: string;
  /** Weekly habit completion goal (1-7) */
  weeklyGoal?: number;
}

/**
 * Core user entity
 * Represents an authenticated user in the HabitGate system
 */
export interface User {
  /** Unique user identifier */
  id: string;
  /** User email address */
  email?: string;
  /** Display name */
  name?: string;
  /** Profile picture URL */
  avatarUrl?: string;
  /** Account creation timestamp (Unix epoch ms) */
  createdAt: number;
  /** User preferences and settings */
  preferences: UserPreferences;
}

/**
 * Partial user data for profile updates
 * Excludes immutable fields like id and createdAt
 */
export type UserUpdateData = Omit<Partial<User>, "id" | "createdAt">;

/**
 * User creation payload for new user registration
 */
export interface CreateUserPayload {
  email: string;
  name: string;
  preferences?: Partial<UserPreferences>;
}
