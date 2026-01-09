/**
 * Habit-related service functions for the HabitGate application.
 * Handles utility functions, factory methods, and TanStack Query hooks.
 */

import type {
  Habit,
  HabitCompletion,
  VerificationConfig,
  FrequencyConfig,
  BonusMultipliers,
  HabitCategory,
  HabitDifficulty,
  VerificationMethod,
  FrequencyType,
} from "../data/habits";

// ============================================================================
// ID Generation
// ============================================================================

/**
 * Generates a unique ID with optional prefix.
 * @param prefix - Optional prefix for the ID
 * @returns Unique string identifier
 */
export function generateId(prefix: string = "id"): string {
  const timestamp = Date.now().toString(36);
  const randomPart = Math.random().toString(36).substring(2, 9);
  return `${prefix}_${timestamp}${randomPart}`;
}

// ============================================================================
// Factory Functions
// ============================================================================

/**
 * Creates a new habit with sensible defaults.
 * @param data - Partial habit data
 * @returns Fully initialized habit object
 */
export function createHabit(data: Partial<Habit>): Habit {
  const now = Date.now();

  return {
    id: data.id ?? generateId("habit"),
    name: data.name ?? "Untitled Habit",
    description: data.description,
    iconName: data.iconName ?? "CheckCircle",
    category: data.category ?? "productive",
    rewardAmount: data.rewardAmount ?? 10,
    difficulty: data.difficulty ?? "easy",
    verificationMethod: data.verificationMethod ?? "manual",
    verificationConfig: data.verificationConfig,
    frequencyType: data.frequencyType ?? "daily",
    frequencyConfig: data.frequencyConfig,
    optimalTimeStart: data.optimalTimeStart,
    optimalTimeEnd: data.optimalTimeEnd,
    isActive: data.isActive ?? true,
    completedToday: false,
    completionCountToday: 0,
    currentStreak: 0,
    longestStreak: 0,
    lastCompletedDate: undefined,
    createdAt: data.createdAt ?? now,
    updatedAt: now,
  };
}

/**
 * Creates a habit completion record.
 * @param data - Partial completion data (habitId is required)
 * @returns Fully initialized completion object
 */
export function createHabitCompletion(
  data: Omit<Partial<HabitCompletion>, "habitId"> & { habitId: string }
): HabitCompletion {
  return {
    id: data.id ?? generateId("completion"),
    habitId: data.habitId,
    completedAt: data.completedAt ?? Date.now(),
    verificationData: data.verificationData,
    xpEarned: data.xpEarned ?? 0,
    timeEarned: data.timeEarned ?? 0,
    bonusMultipliers: data.bonusMultipliers,
  };
}

// ============================================================================
// Validation Functions
// ============================================================================

/**
 * Type guard to validate habit objects at runtime.
 * @param habit - Object to validate
 * @returns True if valid Habit, false otherwise
 */
export function isValidHabit(habit: unknown): habit is Habit {
  if (!habit || typeof habit !== "object") {
    return false;
  }

  const h = habit as Record<string, unknown>;

  return (
    typeof h.id === "string" &&
    typeof h.name === "string" &&
    typeof h.category === "string" &&
    typeof h.rewardAmount === "number" &&
    typeof h.difficulty === "string" &&
    typeof h.verificationMethod === "string" &&
    typeof h.frequencyType === "string" &&
    typeof h.isActive === "boolean" &&
    typeof h.createdAt === "number" &&
    typeof h.updatedAt === "number"
  );
}

// ============================================================================
// TanStack Query Keys
// ============================================================================

/**
 * Query keys for TanStack Query caching.
 */
export const habitKeys = {
  all: ["habits"] as const,
  lists: () => [...habitKeys.all, "list"] as const,
  list: (filters?: HabitFilters) => [...habitKeys.lists(), filters] as const,
  details: () => [...habitKeys.all, "detail"] as const,
  detail: (id: string) => [...habitKeys.details(), id] as const,
  completions: (habitId?: string) =>
    habitId ? ["completions", habitId] : (["completions"] as const),
  streak: (habitId: string) => ["streak", habitId] as const,
};

/**
 * Optional filters for habit queries.
 */
export interface HabitFilters {
  category?: HabitCategory;
  difficulty?: HabitDifficulty;
  isActive?: boolean;
}

// ============================================================================
// Async Query Functions (for TanStack Query)
// ============================================================================

/**
 * Fetches all habits from the data source.
 * @param filters - Optional filters to apply
 * @returns Promise resolving to array of habits
 */
export async function fetchHabits(filters?: HabitFilters): Promise<Habit[]> {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 100));

  // Import from data layer (would be API call in production)
  const { habits } = await import("../data/habits");

  let filtered = habits;

  if (filters) {
    if (filters.category) {
      filtered = filtered.filter((h) => h.category === filters.category);
    }
    if (filters.difficulty) {
      filtered = filtered.filter((h) => h.difficulty === filters.difficulty);
    }
    if (filters.isActive !== undefined) {
      filtered = filtered.filter((h) => h.isActive === filters.isActive);
    }
  }

  return filtered;
}

/**
 * Fetches a single habit by ID.
 * @param id - Habit ID to fetch
 * @returns Promise resolving to habit or undefined
 */
export async function fetchHabitById(id: string): Promise<Habit | undefined> {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 50));

  const { habitsById, habits } = await import("../data/habits");

  // Try lookup map first, fallback to array search
  return habitsById.get(id) ?? habits.find((h) => h.id === id);
}

/**
 * Fetches all habit completions.
 * @param habitId - Optional habit ID to filter completions
 * @returns Promise resolving to array of completions
 */
export async function fetchCompletions(
  habitId?: string
): Promise<HabitCompletion[]> {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 100));

  const { habitCompletions } = await import("../data/habits");

  if (habitId) {
    return habitCompletions.filter((c) => c.habitId === habitId);
  }

  return habitCompletions;
}

/**
 * Fetches completions for a specific habit.
 * @param habitId - Habit ID to get completions for
 * @returns Promise resolving to array of completions
 */
export async function fetchCompletionsForHabit(
  habitId: string
): Promise<HabitCompletion[]> {
  const { completionsByHabitId, habitCompletions } = await import(
    "../data/habits"
  );

  // Try lookup map first, fallback to array filter
  const fromMap = completionsByHabitId.get(habitId);
  if (fromMap) {
    return Array.from(fromMap);
  }

  return habitCompletions.filter((c) => c.habitId === habitId);
}

/**
 * Fetches a single completion by ID.
 * @param id - Completion ID to fetch
 * @returns Promise resolving to completion or undefined
 */
export async function fetchCompletionById(
  id: string
): Promise<HabitCompletion | undefined> {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 50));

  const { completionsById, habitCompletions } = await import("../data/habits");

  // Try lookup map first, fallback to array search
  return completionsById.get(id) ?? habitCompletions.find((c) => c.id === id);
}

/**
 * Fetches streak data for a habit.
 * @param habitId - Habit ID to get streak for
 * @returns Promise resolving to streak data
 */
export async function fetchStreak(habitId: string): Promise<{
  currentStreak: number;
  longestStreak: number;
  lastCompletedDate?: string;
}> {
  const habit = await fetchHabitById(habitId);

  if (!habit) {
    throw new Error(`Habit with ID ${habitId} not found`);
  }

  return {
    currentStreak: habit.currentStreak,
    longestStreak: habit.longestStreak,
    lastCompletedDate: habit.lastCompletedDate,
  };
}

// ============================================================================
// Mutation Functions (for TanStack Query mutations)
// ============================================================================

/**
 * Creates a new habit and invalidates relevant queries.
 * @param data - Partial habit data
 * @returns Promise resolving to created habit
 */
export async function createHabitMutation(
  data: Partial<Habit>
): Promise<Habit> {
  const newHabit = createHabit(data);

  // In production, this would be an API call
  // For now, we simulate the mutation
  await new Promise((resolve) => setTimeout(resolve, 200));

  console.log("Created new habit:", newHabit);
  return newHabit;
}

/**
 * Records a habit completion and invalidates relevant queries.
 * @param data - Partial completion data
 * @returns Promise resolving to created completion
 */
export async function createCompletionMutation(
  data: Omit<Partial<HabitCompletion>, "habitId"> & { habitId: string }
): Promise<HabitCompletion> {
  const newCompletion = createHabitCompletion(data);

  // In production, this would be an API call
  // For now, we simulate the mutation
  await new Promise((resolve) => setTimeout(resolve, 200));

  console.log("Created new completion:", newCompletion);
  return newCompletion;
}

/**
 * Updates an existing habit.
 * @param id - Habit ID to update
 * @param data - Partial habit data to update
 * @returns Promise resolving to updated habit
 */
export async function updateHabitMutation(
  id: string,
  data: Partial<Habit>
): Promise<Habit> {
  // In production, this would be an API call
  await new Promise((resolve) => setTimeout(resolve, 200));

  const existingHabit = await fetchHabitById(id);
  if (!existingHabit) {
    throw new Error(`Habit with ID ${id} not found`);
  }

  const updatedHabit: Habit = {
    ...existingHabit,
    ...data,
    id: existingHabit.id, // Prevent ID modification
    updatedAt: Date.now(),
  };

  console.log("Updated habit:", updatedHabit);
  return updatedHabit;
}

/**
 * Deletes a habit by ID.
 * @param id - Habit ID to delete
 * @returns Promise resolving when deletion is complete
 */
export async function deleteHabitMutation(id: string): Promise<void> {
  // In production, this would be an API call
  await new Promise((resolve) => setTimeout(resolve, 200));

  console.log("Deleted habit:", id);
}

// ============================================================================
// Utility Functions (Synchronous - for local state management)
// ============================================================================

/**
 * Safely retrieves a habit by ID from a map or array.
 * @param id - Habit ID to look up
 * @param habitsMap - Optional lookup source
 * @returns Habit if found, undefined otherwise
 */
export function getHabitById(
  id: string,
  habitsMap: ReadonlyMap<string, Habit> | Habit[] = []
): Habit | undefined {
  if (habitsMap instanceof Map) {
    return habitsMap.get(id);
  }
  return (habitsMap as Habit[]).find((habit) => habit.id === id);
}

/**
 * Safely retrieves a completion by ID from a map or array.
 * @param id - Completion ID to look up
 * @param completionsMap - Optional lookup source
 * @returns Completion if found, undefined otherwise
 */
export function getCompletionById(
  id: string,
  completionsMap: ReadonlyMap<string, HabitCompletion> | HabitCompletion[] = []
): HabitCompletion | undefined {
  if (completionsMap instanceof Map) {
    return completionsMap.get(id);
  }
  return (completionsMap as HabitCompletion[]).find(
    (completion) => completion.id === id
  );
}

/**
 * Retrieves all completions for a specific habit from an array.
 * @param habitId - ID of the habit
 * @param completions - Array of completions to filter
 * @returns Array of completions (empty array if none found)
 */
export function getCompletionsForHabit(
  habitId: string,
  completions: HabitCompletion[] = []
): HabitCompletion[] {
  return completions.filter((c) => c.habitId === habitId);
}

/**
 * Creates an O(1) lookup map for habits by ID.
 * @param habits - Array of habits to index
 * @returns ReadonlyMap of habit IDs to habits
 */
export function createHabitsById(habits: Habit[]): ReadonlyMap<string, Habit> {
  return new Map(habits.map((habit) => [habit.id, habit]));
}

/**
 * Creates an O(1) lookup map for completions by ID.
 * @param completions - Array of completions to index
 * @returns ReadonlyMap of completion IDs to completions
 */
export function createCompletionsById(
  completions: HabitCompletion[]
): ReadonlyMap<string, HabitCompletion> {
  return new Map(completions.map((completion) => [completion.id, completion]));
}

/**
 * Groups completions by habit ID for efficient querying.
 * @param completions - Array of completions to group
 * @returns ReadonlyMap of habit IDs to arrays of completions
 */
export function createCompletionsByHabitId(
  completions: HabitCompletion[]
): ReadonlyMap<string, ReadonlyArray<HabitCompletion>> {
  const grouped = new Map<string, HabitCompletion[]>();

  for (const completion of completions) {
    const existing = grouped.get(completion.habitId) ?? [];
    existing.push(completion);
    grouped.set(completion.habitId, existing);
  }

  return new Map(
    Array.from(grouped.entries()).map(([habitId, comps]) => [
      habitId,
      comps as ReadonlyArray<HabitCompletion>,
    ])
  );
}
