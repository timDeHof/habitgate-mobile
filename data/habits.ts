/**
 * Core type definitions for the HabitGate habit tracking system.
 * These types form the foundation of habit data structures used throughout the application.
 *
 * Note: Service functions have been moved to services/habits.ts
 * for better separation of concerns.
 */

// ============================================================================
// Enums (String Literal Types for Type Safety)
// ============================================================================

/**
 * Categories for classifying habits.
 * Each category represents a different life dimension that habits can improve.
 */
export type HabitCategory =
  | "physical"
  | "mental"
  | "creative"
  | "social"
  | "productive";

/**
 * Difficulty levels for habits.
 * Affects XP rewards and completion requirements.
 */
export type HabitDifficulty = "easy" | "medium" | "hard";

/**
 * Methods for verifying habit completion.
 * - manual: User self-reports completion
 * - timer: Time-based verification (e.g., meditation)
 * - integration: Third-party app sync (e.g., Strava, Apple Health)
 * - photo: Photo evidence verification
 * - location: GPS-based verification
 */
export type VerificationMethod =
  | "manual"
  | "timer"
  | "integration"
  | "photo"
  | "location";

/**
 * Frequency types for habit scheduling.
 * - daily: Every day
 * - specific_days: Only on selected days of the week
 * - flexible: Minimum frequency per week with flexible days
 */
export type FrequencyType = "daily" | "specific_days" | "flexible";

// ============================================================================
// Configuration Interfaces (Separated for Clarity)
// ============================================================================

/**
 * Configuration for timer-based habit verification.
 */
export interface TimerVerificationConfig {
  /** Minimum duration required in minutes */
  duration: number;
}

/**
 * Configuration for integration-based verification.
 */
export interface IntegrationVerificationConfig {
  /** External service identifier for data sync */
  integrationId: string;
}

/**
 * Configuration for location-based verification.
 */
export interface LocationVerificationConfig {
  /** Target latitude coordinates */
  locationLat: number;
  /** Target longitude coordinates */
  locationLng: number;
  /** Acceptable radius in meters from target location */
  locationRadius: number;
}

/**
 * Combined verification configuration supporting multiple methods.
 */
export type VerificationConfig =
  | TimerVerificationConfig
  | IntegrationVerificationConfig
  | LocationVerificationConfig;

/**
 * Configuration for specific day frequency.
 */
export interface SpecificDaysConfig {
  /** Array of days (0 = Sunday, 6 = Saturday) */
  daysOfWeek: number[];
}

/**
 * Configuration for flexible frequency.
 */
export interface FlexibleFrequencyConfig {
  /** Minimum completions required per week */
  minimumPerWeek: number;
}

/**
 * Combined frequency configuration supporting multiple scheduling types.
 */
export type FrequencyConfig = SpecificDaysConfig | FlexibleFrequencyConfig;

// ============================================================================
// Icon System (Enhanced for Expo Vector Icons Support)
// ============================================================================

/**
 * Supported Expo Vector Icons libraries.
 * These match the available icon sets in @expo/vector-icons
 */
export type VectorIconLibrary =
  | "AntDesign"
  | "Entypo"
  | "EvilIcons"
  | "Feather"
  | "FontAwesome"
  | "FontAwesome5"
  | "FontAwesome5Pro"
  | "Fontisto"
  | "Foundation"
  | "Ionicons"
  | "MaterialCommunityIcons"
  | "MaterialIcons"
  | "Octicons"
  | "SimpleLineIcons"
  | "Zocial";

/**
 * SVG icon specification for backward compatibility
 * and custom SVG icon support
 */
export interface SVGIconSpec {
  /** Icon type discriminator */
  type: "svg";
  /** SVG element name or custom SVG component identifier */
  name: string;
  /** Optional SVG props for customization */
  props?: React.SVGProps<SVGSVGElement>;
  /** Size specification (maintains consistency with vector icons) */
  size?: number;
  /** Color specification */
  color?: string;
}

/**
 * Vector icon specification for Expo Vector Icons integration
 */
export interface VectorIconSpec {
  /** Icon type discriminator */
  type: "vector";
  /** Name of the icon library from Expo Vector Icons */
  library: VectorIconLibrary;
  /** Icon name within the specified library */
  name: string;
  /** Icon size (default: 24) */
  size?: number;
  /** Icon color (hex string) */
  color?: string;
}

/**
 * Unified icon specification supporting both SVG and Vector icons
 * with full type safety and backward compatibility
 */
export type IconSpec = SVGIconSpec | VectorIconSpec;

/**
 * Discriminated partial union types for type-safe icon normalization
 * These types ensure compile-time safety by requiring specific fields for each icon type
 */
export type PartialVectorIconSpec = {
  type: "vector";
  library: VectorIconLibrary;
  name: string;
  size?: number;
  color?: string;
};

export type PartialSvgIconSpec = {
  type: "svg";
  name: string;
  props?: React.SVGProps<SVGSVGElement>;
  size?: number;
  color?: string;
};

/**
 * Unified partial icon specification for type-safe normalization
 * Uses discriminated union to ensure proper field requirements for each type
 */
export type PartialIconSpec = PartialVectorIconSpec | PartialSvgIconSpec;

/**
 * Runtime validation and utility functions for icon system
 */
export const IconSystem = {
  /**
   * Validates if a vector icon library is available
   * @param libraryName - Name of the icon library to check
   * @returns boolean indicating availability
   */
  isLibraryAvailable: (libraryName: VectorIconLibrary): boolean => {
    try {
      // Dynamic import check - this would be implemented with actual imports
      // In a real implementation, you'd use dynamic imports or require checks
      const availableLibraries: VectorIconLibrary[] = [
        "AntDesign",
        "Entypo",
        "EvilIcons",
        "Feather",
        "FontAwesome",
        "FontAwesome5",
        "FontAwesome5Pro",
        "Fontisto",
        "Foundation",
        "Ionicons",
        "MaterialCommunityIcons",
        "MaterialIcons",
        "Octicons",
        "SimpleLineIcons",
        "Zocial",
      ];
      return availableLibraries.includes(libraryName);
    } catch (error) {
      return false;
    }
  },

  /**
   * Gets fallback icon specification when requested icon is unavailable
   * @param originalSpec - The original icon specification
   * @returns Fallback icon specification
   */
  getFallbackIcon: (originalSpec: IconSpec): IconSpec => {
    // If it's a vector icon and library is unavailable, fall back to SVG
    if (
      originalSpec.type === "vector" &&
      !IconSystem.isLibraryAvailable(originalSpec.library)
    ) {
      return {
        type: "svg",
        name: "help-circle", // Default fallback SVG icon
        size: originalSpec.size || 24,
        color: originalSpec.color || "#666666",
      };
    }

    // For SVG icons that don't exist, return a default warning icon
    return {
      type: "svg",
      name: "alert-circle",
      size: originalSpec.size || 24,
      color: "#FF5722", // Warning color
    };
  },

  /**
   * Standardizes icon specification with type-safe defaults
   * Uses discriminated union for compile-time type safety and proper field validation
   * @param spec - Input icon specification with required discriminator fields
   * @returns Normalized icon specification with all defaults applied
   */
  normalizeIconSpec: (spec: PartialIconSpec): IconSpec => {
    const defaultSize = 24;
    const defaultColor = "#333333";

    // Type narrowing based on discriminator field
    if (spec.type === "vector") {
      // spec is now typed as PartialVectorIconSpec due to discriminated union
      return {
        type: "vector",
        library: spec.library,
        name: spec.name,
        size: spec.size || defaultSize,
        color: spec.color || defaultColor,
      };
    }

    // spec is now typed as PartialSvgIconSpec due to discriminated union
    return {
      type: "svg",
      name: spec.name,
      props: spec.props,
      size: spec.size || defaultSize,
      color: spec.color || defaultColor,
    };
  },
};

// ============================================================================
// Core Domain Types
// ============================================================================

/**
 * Bonus multiplier types for enhanced XP calculation.
 */
export type BonusMultiplierType = "streak" | "combo" | "time" | "verification";

/**
 * Individual bonus multiplier values.
 */
export interface BonusMultipliers {
  /** Multiplier based on current streak length */
  streak?: number;
  /** Multiplier based on completion combo */
  combo?: number;
  /** Multiplier based on optimal time completion */
  time?: number;
  /** Multiplier based on verification method strength */
  verification?: number;
}

/**
 * Core habit tracking interface.
 * Represents a single habit with all its metadata and state.
 */
export interface Habit {
  /** Unique identifier for the habit */
  id: string;
  /** Display name of the habit */
  name: string;
  /** Detailed description of the habit */
  description?: string;
  /** Icon specification supporting both SVG and Vector icons */
  icon: IconSpec;
  /** Category classification */
  category: HabitCategory;
  /** XP reward amount for completion */
  rewardAmount: number;
  /** Difficulty level affecting rewards */
  difficulty: HabitDifficulty;
  /** Method used to verify completion */
  verificationMethod: VerificationMethod;
  /** Method-specific verification settings */
  verificationConfig?: VerificationConfig;
  /** Frequency scheduling type */
  frequencyType: FrequencyType;
  /** Frequency-specific scheduling rules */
  frequencyConfig?: FrequencyConfig;
  /** Earliest recommended completion time (HH:mm format) */
  optimalTimeStart?: string;
  /** Latest recommended completion time (HH:mm format) */
  optimalTimeEnd?: string;
  /** Whether the habit is currently active */
  isActive: boolean;
  /** Completion status for current day */
  completedToday: boolean;
  /** Number of completions today (supports multi-part habits) */
  completionCountToday: number;
  /** Current consecutive day streak */
  currentStreak: number;
  /** Longest ever consecutive day streak */
  longestStreak: number;
  /** ISO timestamp of last completion */
  lastCompletedDate?: string;
  /** Creation timestamp */
  createdAt: number;
  /** Last modification timestamp */
  updatedAt: number;
}

/**
 * Legacy habit interface for backward compatibility
 * Maps old iconName string format to new IconSpec format
 */
export interface LegacyHabit {
  /** Unique identifier for the habit */
  id: string;
  /** Display name of the habit */
  name: string;
  /** Detailed description of the habit */
  description?: string;
  /** Legacy icon name (string format) */
  iconName: string;
  /** Category classification */
  category: HabitCategory;
  /** XP reward amount for completion */
  rewardAmount: number;
  /** Difficulty level affecting rewards */
  difficulty: HabitDifficulty;
  /** Method used to verify completion */
  verificationMethod: VerificationMethod;
  /** Method-specific verification settings */
  verificationConfig?: VerificationConfig;
  /** Frequency scheduling type */
  frequencyType: FrequencyType;
  /** Frequency-specific scheduling rules */
  frequencyConfig?: FrequencyConfig;
  /** Earliest recommended completion time (HH:mm format) */
  optimalTimeStart?: string;
  /** Latest recommended completion time (HH:mm format) */
  optimalTimeEnd?: string;
  /** Whether the habit is currently active */
  isActive: boolean;
  /** Completion status for current day */
  completedToday: boolean;
  /** Number of completions today (supports multi-part habits) */
  completionCountToday: number;
  /** Current consecutive day streak */
  currentStreak: number;
  /** Longest ever consecutive day streak */
  longestStreak: number;
  /** ISO timestamp of last completion */
  lastCompletedDate?: string;
  /** Creation timestamp */
  createdAt: number;
  /** Last modification timestamp */
  updatedAt: number;
}

/**
 * Utility functions for habit icon migration and compatibility
 */
export const HabitIconUtils = {
  /**
   * Converts legacy iconName to modern IconSpec format
   * @param iconName - Legacy icon name string
   * @returns Modern IconSpec with backward compatibility
   */
  legacyIconToIconSpec: (iconName: string): IconSpec => {
    // Map common legacy icon names to vector icons
    const legacyIconMap: Record<string, IconSpec> = {
      Running: {
        type: "vector",
        library: "FontAwesome5",
        name: "running",
      },
      BookOpen: {
        type: "vector",
        library: "MaterialCommunityIcons",
        name: "book-open",
      },
      Heart: {
        type: "vector",
        library: "MaterialCommunityIcons",
        name: "heart",
      },
      Journal: {
        type: "vector",
        library: "Ionicons",
        name: "journal",
      },
      Sleep: {
        type: "vector",
        library: "MaterialCommunityIcons",
        name: "sleep",
      },
      // Add more mappings as needed for other legacy icons
    };

    // Return mapped vector icon or fallback to SVG
    return (
      legacyIconMap[iconName] || {
        type: "svg",
        name: iconName,
        size: 24,
        color: "#333333",
      }
    );
  },

  /**
   * Converts legacy habit to modern habit format
   * @param legacyHabit - Habit in legacy format
   * @returns Habit in modern format with IconSpec
   */
  legacyHabitToModern: (legacyHabit: LegacyHabit): Habit => {
    const { iconName, ...rest } = legacyHabit;
    return {
      ...rest,
      icon: HabitIconUtils.legacyIconToIconSpec(iconName),
    };
  },
};

/**
 * Single habit completion record.
 */
export interface HabitCompletion {
  /** Unique identifier for the completion */
  id: string;
  /** Reference to completed habit */
  habitId: string;
  /** Timestamp of completion */
  completedAt: number;
  /** Verification-specific data */
  verificationData?: Record<string, unknown>;
  /** Base XP earned */
  xpEarned: number;
  /** Time currency earned */
  timeEarned: number;
  /** Optional bonus multipliers applied */
  bonusMultipliers?: BonusMultipliers;
}

// ============================================================================
// Icon System Documentation and Examples
// ============================================================================

/**
 * ICON SYSTEM USAGE GUIDE
 * =======================
 *
 * The enhanced icon system supports both SVG icons (for backward compatibility)
 * and Expo Vector Icons (for comprehensive icon library support).
 *
 * TWO ICON TYPES SUPPORTED:
 *
 * 1. SVG Icons (type: "svg")
 *    - For custom SVG icons or legacy support
 *    - Example: { type: "svg", name: "custom-icon", size: 24, color: "#FF5722" }
 *
 * 2. Vector Icons (type: "vector")
 *    - For Expo Vector Icons integration
 *    - Example: { type: "vector", library: "MaterialIcons", name: "favorite", size: 24, color: "#FF5722" }
 *
 * SUPPORTED VECTOR ICON LIBRARIES:
 * - AntDesign, Entypo, EvilIcons, Feather, FontAwesome
 * - FontAwesome5, FontAwesome5Pro, Fontisto, Foundation
 * - Ionicons, MaterialCommunityIcons, MaterialIcons
 * - Octicons, SimpleLineIcons, Zocial
 *
 * USAGE EXAMPLES:
 *
 * // Basic vector icon
 * const runIcon: IconSpec = {
 *   type: "vector",
 *   library: "MaterialCommunityIcons",
 *   name: "run-fast"
 * };
 *
 * // Customized vector icon
 * const premiumIcon: IconSpec = {
 *   type: "vector",
 *   library: "MaterialIcons",
 *   name: "star",
 *   size: 32,
 *   color: "#FFD700"
 * };
 *
 * // Legacy SVG icon (backward compatibility)
 * const legacyIcon: IconSpec = {
 *   type: "svg",
 *   name: "custom-svg-icon",
 *   size: 24,
 *   color: "#4CAF50"
 * };
 *
 * // Advanced SVG with custom props
 * const advancedSvgIcon: IconSpec = {
 *   type: "svg",
 *   name: "animated-icon",
 *   props: {
 *     width: "24",
 *     height: "24",
 *     fill: "currentColor",
 *     className: "spin-animation"
 *   },
 *   size: 24
 * };
 *
 * MIGRATION GUIDE:
 *
 * // Old format (still supported via legacy conversion)
 * const oldHabit = {
 *   iconName: "Dumbbell"  // String-based icon name
 * };
 *
 * // New format (recommended)
 * const newHabit = {
 *   icon: {
 *     type: "vector",
 *     library: "MaterialCommunityIcons",
 *     name: "dumbbell"
 *   }
 * };
 *
 * PERFORMANCE OPTIMIZATION:
 * - Vector icons are rendered natively and are highly performant
 * - SVG icons should be used sparingly for custom designs only
 * - IconSystem.normalizeIconSpec() ensures consistent defaults
 * - IconSystem.getFallbackIcon() provides graceful degradation
 *
 * ERROR HANDLING:
 * - Missing icon libraries automatically fall back to SVG icons
 * - Invalid icon names trigger fallback to help/warning icons
 * - Runtime validation ensures robust icon rendering
 */

// ============================================================================
// Sample Data
// ============================================================================

// Legacy habit data for backward compatibility demonstration
const legacyHabits: LegacyHabit[] = [
  {
    id: "habit_001",
    name: "Morning Run",
    description: "30 minutes cardio to start the day",
    iconName: "Running",
    category: "physical",
    rewardAmount: 30,
    difficulty: "medium",
    verificationMethod: "timer",
    verificationConfig: { duration: 30 },
    frequencyType: "daily",
    optimalTimeStart: "06:00",
    optimalTimeEnd: "09:00",
    isActive: true,
    completedToday: false,
    completionCountToday: 0,
    currentStreak: 5,
    longestStreak: 12,
    createdAt: 1704067200000,
    updatedAt: 1704067200000,
  },
  {
    id: "habit_002",
    name: "Read 20 Pages",
    description: "Non-fiction reading for personal growth",
    iconName: "BookOpen",
    category: "mental",
    rewardAmount: 20,
    difficulty: "easy",
    verificationMethod: "manual",
    frequencyType: "daily",
    optimalTimeStart: "21:00",
    optimalTimeEnd: "23:00",
    isActive: true,
    completedToday: false,
    completionCountToday: 0,
    currentStreak: 8,
    longestStreak: 21,
    createdAt: 1704067200000,
    updatedAt: 1704067200000,
  },
  {
    id: "habit_003",
    name: "Meditation",
    description: "15 minutes mindfulness practice",
    iconName: "Heart",
    category: "mental",
    rewardAmount: 15,
    difficulty: "easy",
    verificationMethod: "timer",
    verificationConfig: { duration: 15 },
    frequencyType: "daily",
    optimalTimeStart: "07:00",
    optimalTimeEnd: "08:00",
    isActive: true,
    completedToday: false,
    completionCountToday: 0,
    currentStreak: 3,
    longestStreak: 7,
    createdAt: 1704067200000,
    updatedAt: 1704067200000,
  },
  {
    id: "habit_004",
    name: "Journal",
    description: "Daily reflection and gratitude practice",
    iconName: "Journal",
    category: "productive",
    rewardAmount: 10,
    difficulty: "easy",
    verificationMethod: "photo",
    frequencyType: "daily",
    optimalTimeStart: "21:00",
    optimalTimeEnd: "22:00",
    isActive: true,
    completedToday: false,
    completionCountToday: 0,
    currentStreak: 14,
    longestStreak: 30,
    createdAt: 1704067200000,
    updatedAt: 1704067200000,
  },
  {
    id: "habit_005",
    name: "Sleep 8 Hours",
    description: "Quality sleep tracked with Apple Health",
    iconName: "Sleep",
    category: "physical",
    rewardAmount: 25,
    difficulty: "hard",
    verificationMethod: "integration",
    verificationConfig: { integrationId: "apple_health" },
    frequencyType: "daily",
    optimalTimeStart: "22:00",
    optimalTimeEnd: "23:00",
    isActive: true,
    completedToday: false,
    completionCountToday: 0,
    currentStreak: 2,
    longestStreak: 4,
    createdAt: 1704067200000,
    updatedAt: 1704067200000,
  },
];

// Convert legacy habits to modern format with new icon system
export const habits: Habit[] = legacyHabits.map(
  HabitIconUtils.legacyHabitToModern
);

// Additional example habits demonstrating the new icon system capabilities
export const modernHabits: Habit[] = [
  {
    id: "habit_modern_001",
    name: "Yoga Session",
    description: "30 minutes of yoga for flexibility",
    icon: {
      type: "vector",
      library: "MaterialCommunityIcons",
      name: "yoga",
      size: 28,
      color: "#9C27B0",
    },
    category: "physical",
    rewardAmount: 25,
    difficulty: "medium",
    verificationMethod: "timer",
    verificationConfig: { duration: 30 },
    frequencyType: "daily",
    optimalTimeStart: "07:00",
    optimalTimeEnd: "09:00",
    isActive: true,
    completedToday: false,
    completionCountToday: 0,
    currentStreak: 3,
    longestStreak: 10,
    createdAt: 1704067200000,
    updatedAt: 1704067200000,
  },
  {
    id: "habit_modern_002",
    name: "Code Practice",
    description: "Daily coding challenges",
    icon: {
      type: "vector",
      library: "FontAwesome5",
      name: "code",
      size: 24,
      color: "#2196F3",
    },
    category: "productive",
    rewardAmount: 30,
    difficulty: "hard",
    verificationMethod: "manual",
    frequencyType: "daily",
    optimalTimeStart: "19:00",
    optimalTimeEnd: "22:00",
    isActive: true,
    completedToday: false,
    completionCountToday: 0,
    currentStreak: 7,
    longestStreak: 15,
    createdAt: 1704067200000,
    updatedAt: 1704067200000,
  },
  {
    id: "habit_modern_003",
    name: "Custom SVG Habit",
    description: "Habit with custom SVG icon",
    icon: {
      type: "svg",
      name: "custom-brand-icon",
      props: {
        width: "24",
        height: "24",
        viewBox: "0 0 24 24",
        fill: "currentColor",
      },
      size: 24,
      color: "#FF9800",
    },
    category: "creative",
    rewardAmount: 15,
    difficulty: "easy",
    verificationMethod: "manual",
    frequencyType: "flexible",
    frequencyConfig: { minimumPerWeek: 3 },
    isActive: true,
    completedToday: false,
    completionCountToday: 0,
    currentStreak: 2,
    longestStreak: 5,
    createdAt: 1704067200000,
    updatedAt: 1704067200000,
  },
  {
    id: "habit_modern_004",
    name: "Social Media Detox",
    description: "Limit social media usage",
    icon: {
      type: "vector",
      library: "Ionicons",
      name: "phone-portrait-outline",
      size: 24,
      color: "#607D8B",
    },
    category: "mental",
    rewardAmount: 20,
    difficulty: "medium",
    verificationMethod: "timer",
    verificationConfig: { duration: 120 }, // 2 hours max
    frequencyType: "daily",
    isActive: true,
    completedToday: false,
    completionCountToday: 0,
    currentStreak: 4,
    longestStreak: 8,
    createdAt: 1704067200000,
    updatedAt: 1704067200000,
  },
];

// Combined habit list including both legacy (converted) and modern habits
export const allHabits: Habit[] = [...habits, ...modernHabits];

export const habitCompletions: HabitCompletion[] = [
  {
    id: "completion_001",
    habitId: "habit_001",
    completedAt: 1704734400000, // 2024-01-08 22:00 UTC
    verificationData: { duration: 32, distance: 5.2 },
    xpEarned: 30,
    timeEarned: 30,
    bonusMultipliers: {
      streak: 1.1,
      time: 1.0,
      verification: 1.2,
    },
  },
  {
    id: "completion_002",
    habitId: "habit_002",
    completedAt: 1704676800000, // 2024-01-08 08:00 UTC
    verificationData: { pagesRead: 25 },
    xpEarned: 20,
    timeEarned: 20,
    bonusMultipliers: {
      streak: 1.0,
      combo: 1.2,
    },
  },
  {
    id: "completion_003",
    habitId: "habit_003",
    completedAt: 1704705600000, // 2024-01-08 16:00 UTC
    verificationData: { duration: 15 },
    xpEarned: 15,
    timeEarned: 15,
  },
  {
    id: "completion_004",
    habitId: "habit_004",
    completedAt: 1704673200000, // 2024-01-08 07:00 UTC
    verificationData: { photoUrl: "journal_20240108.jpg" },
    xpEarned: 10,
    timeEarned: 10,
    bonusMultipliers: {
      streak: 1.1,
      combo: 1.3,
    },
  },
  {
    id: "completion_005",
    habitId: "habit_001",
    completedAt: 1704648000000, // 2024-01-08 00:00 UTC
    verificationData: { duration: 35, distance: 6.0 },
    xpEarned: 30,
    timeEarned: 30,
    bonusMultipliers: {
      streak: 1.0,
    },
  },
  {
    id: "completion_006",
    habitId: "habit_002",
    completedAt: 1704561600000, // 2024-01-07 00:00 UTC
    verificationData: { pagesRead: 20 },
    xpEarned: 20,
    timeEarned: 20,
  },
  {
    id: "completion_007",
    habitId: "habit_003",
    completedAt: 1704561600000, // 2024-01-07 00:00 UTC
    verificationData: { duration: 15 },
    xpEarned: 15,
    timeEarned: 15,
  },
  {
    id: "completion_008",
    habitId: "habit_004",
    completedAt: 1704561600000, // 2024-01-07 00:00 UTC
    verificationData: { photoUrl: "journal_20240107.jpg" },
    xpEarned: 10,
    timeEarned: 10,
  },
];

// ============================================================================
// Habit Generation System (Realistic Dummy Data)
// ============================================================================

/**
 * Configuration for habit generation patterns
 */
export interface HabitGenerationConfig {
  /** Number of habits to generate */
  count?: number;
  /** Whether to include only non-completed habits */
  nonCompletedOnly?: boolean;
  /** Categories to include (default: all) */
  categories?: HabitCategory[];
  /** Difficulty distribution weights */
  difficultyWeights?: Record<HabitDifficulty, number>;
  /** Frequency type distribution */
  frequencyDistribution?: Record<FrequencyType, number>;
}

/**
 * Habit generation utility functions
 */
export const HabitGenerator = {
  /**
   * Generate realistic dummy habit data
   * @param config - Generation configuration
   * @returns Array of generated habits
   */
  generateDummyHabits: (config: HabitGenerationConfig = {}): Habit[] => {
    const {
      count = 10,
      nonCompletedOnly = true,
      categories = ["physical", "mental", "creative", "social", "productive"],
      difficultyWeights = { easy: 40, medium: 35, hard: 25 },
      frequencyDistribution = { daily: 60, specific_days: 25, flexible: 15 },
    } = config;

    const habits: Habit[] = [];
    const baseTimestamp = Date.now();

    // Predefined icon configurations for realistic variety
    const iconPresets: Record<string, IconSpec> = {
      // Physical habits
      running: {
        type: "vector",
        library: "MaterialCommunityIcons",
        name: "run-fast",
        size: 24,
        color: "#4CAF50",
      },
      gym: {
        type: "vector",
        library: "MaterialCommunityIcons",
        name: "dumbbell",
        size: 24,
        color: "#FF5722",
      },
      water: {
        type: "vector",
        library: "MaterialCommunityIcons",
        name: "cup-water",
        size: 24,
        color: "#2196F3",
      },
      sleep: {
        type: "vector",
        library: "MaterialCommunityIcons",
        name: "sleep",
        size: 24,
        color: "#673AB7",
      },
      // Mental habits
      meditation: {
        type: "vector",
        library: "MaterialCommunityIcons",
        name: "meditation",
        size: 24,
        color: "#9C27B0",
      },
      book: {
        type: "vector",
        library: "MaterialCommunityIcons",
        name: "book-open",
        size: 24,
        color: "#FF9800",
      },
      journal: {
        type: "vector",
        library: "Ionicons",
        name: "journal",
        size: 24,
        color: "#795548",
      },
      // Creative habits
      paint: {
        type: "vector",
        library: "MaterialCommunityIcons",
        name: "palette",
        size: 24,
        color: "#E91E63",
      },
      music: {
        type: "vector",
        library: "MaterialCommunityIcons",
        name: "music",
        size: 24,
        color: "#00BCD4",
      },
      write: {
        type: "vector",
        library: "MaterialCommunityIcons",
        name: "pencil",
        size: 24,
        color: "#8BC34A",
      },
      // Social habits
      call: {
        type: "vector",
        library: "MaterialCommunityIcons",
        name: "phone",
        size: 24,
        color: "#009688",
      },
      message: {
        type: "vector",
        library: "MaterialCommunityIcons",
        name: "message",
        size: 24,
        color: "#607D8B",
      },
      coffee: {
        type: "vector",
        library: "MaterialCommunityIcons",
        name: "coffee",
        size: 24,
        color: "#795548",
      },
      // Productive habits
      code: {
        type: "vector",
        library: "FontAwesome5",
        name: "code",
        size: 24,
        color: "#2196F3",
      },
      email: {
        type: "vector",
        library: "MaterialCommunityIcons",
        name: "email",
        size: 24,
        color: "#FF5722",
      },
      calendar: {
        type: "vector",
        library: "MaterialCommunityIcons",
        name: "calendar",
        size: 24,
        color: "#4CAF50",
      },
      // Default fallback icon
      default: {
        type: "vector",
        library: "MaterialCommunityIcons",
        name: "help-circle",
        size: 24,
        color: "#666666",
      },
    };

    // Predefined habit templates for realistic variety
    const habitTemplates: Array<{
      category: HabitCategory;
      name: string;
      description: string;
      iconKey: string;
      rewardRange: [number, number];
      difficulty: HabitDifficulty;
      verificationMethod: VerificationMethod;
      frequencyType: FrequencyType;
      optimalTime?: [string, string];
    }> = [
      // Physical habits
      {
        category: "physical",
        name: "Morning Jog",
        description: "30-minute outdoor run to start the day",
        iconKey: "running",
        rewardRange: [25, 35],
        difficulty: "medium",
        verificationMethod: "timer",
        frequencyType: "daily",
        optimalTime: ["06:00", "09:00"],
      },
      {
        category: "physical",
        name: "Gym Workout",
        description: "Strength training session",
        iconKey: "gym",
        rewardRange: [30, 40],
        difficulty: "hard",
        verificationMethod: "location",
        frequencyType: "specific_days",
        optimalTime: ["17:00", "20:00"],
      },
      {
        category: "physical",
        name: "Hydration",
        description: "Drink 8 glasses of water",
        iconKey: "water",
        rewardRange: [15, 20],
        difficulty: "easy",
        verificationMethod: "manual",
        frequencyType: "daily",
      },
      {
        category: "physical",
        name: "Quality Sleep",
        description: "Get 7-8 hours of sleep",
        iconKey: "sleep",
        rewardRange: [20, 25],
        difficulty: "medium",
        verificationMethod: "integration",
        frequencyType: "daily",
        optimalTime: ["22:00", "23:00"],
      },
      // Mental habits
      {
        category: "mental",
        name: "Mindfulness Meditation",
        description: "15 minutes of focused breathing",
        iconKey: "meditation",
        rewardRange: [15, 20],
        difficulty: "easy",
        verificationMethod: "timer",
        frequencyType: "daily",
        optimalTime: ["07:00", "08:00"],
      },
      {
        category: "mental",
        name: "Reading",
        description: "Read 20 pages of non-fiction",
        iconKey: "book",
        rewardRange: [18, 25],
        difficulty: "easy",
        verificationMethod: "manual",
        frequencyType: "daily",
        optimalTime: ["20:00", "23:00"],
      },
      {
        category: "mental",
        name: "Journaling",
        description: "Daily reflection and gratitude",
        iconKey: "journal",
        rewardRange: [12, 18],
        difficulty: "easy",
        verificationMethod: "photo",
        frequencyType: "daily",
        optimalTime: ["21:00", "22:00"],
      },
      // Creative habits
      {
        category: "creative",
        name: "Painting",
        description: "30 minutes of creative painting",
        iconKey: "paint",
        rewardRange: [20, 30],
        difficulty: "medium",
        verificationMethod: "manual",
        frequencyType: "flexible",
      },
      {
        category: "creative",
        name: "Music Practice",
        description: "Practice musical instrument",
        iconKey: "music",
        rewardRange: [25, 35],
        difficulty: "medium",
        verificationMethod: "timer",
        frequencyType: "flexible",
      },
      {
        category: "creative",
        name: "Writing",
        description: "Write 500 words of creative content",
        iconKey: "write",
        rewardRange: [18, 28],
        difficulty: "medium",
        verificationMethod: "manual",
        frequencyType: "flexible",
      },
      // Social habits
      {
        category: "social",
        name: "Call Family",
        description: "Check in with family members",
        iconKey: "call",
        rewardRange: [15, 20],
        difficulty: "easy",
        verificationMethod: "manual",
        frequencyType: "flexible",
      },
      {
        category: "social",
        name: "Networking",
        description: "Reach out to professional contacts",
        iconKey: "message",
        rewardRange: [20, 25],
        difficulty: "medium",
        verificationMethod: "manual",
        frequencyType: "flexible",
      },
      {
        category: "social",
        name: "Coffee Chat",
        description: "Social meeting with friends",
        iconKey: "coffee",
        rewardRange: [18, 22],
        difficulty: "easy",
        verificationMethod: "manual",
        frequencyType: "flexible",
      },
      // Productive habits
      {
        category: "productive",
        name: "Coding Practice",
        description: "Daily programming challenges",
        iconKey: "code",
        rewardRange: [25, 35],
        difficulty: "hard",
        verificationMethod: "manual",
        frequencyType: "daily",
        optimalTime: ["19:00", "22:00"],
      },
      {
        category: "productive",
        name: "Email Management",
        description: "Process and organize emails",
        iconKey: "email",
        rewardRange: [15, 20],
        difficulty: "medium",
        verificationMethod: "manual",
        frequencyType: "daily",
        optimalTime: ["09:00", "11:00"],
      },
      {
        category: "productive",
        name: "Planning",
        description: "Daily task planning and prioritization",
        iconKey: "calendar",
        rewardRange: [12, 18],
        difficulty: "easy",
        verificationMethod: "manual",
        frequencyType: "daily",
        optimalTime: ["08:00", "09:00"],
      },
    ];

    // Filter templates by requested categories
    const filteredTemplates = habitTemplates.filter((template) =>
      categories.includes(template.category)
    );

    for (let i = 0; i < count; i++) {
      // Select random template
      const templateIndex = Math.floor(
        Math.random() * filteredTemplates.length
      );
      const template = filteredTemplates[templateIndex];

      // Generate realistic variations
      const rewardAmount =
        Math.floor(
          Math.random() *
            (template.rewardRange[1] - template.rewardRange[0] + 1)
        ) + template.rewardRange[0];

      // Create habit with realistic patterns
      // Safely handle missing icon keys with fallback mechanism
      const iconSpec = iconPresets[template.iconKey] || iconPresets.default;

      const habit: Habit = {
        id: `dummy_${baseTimestamp}_${i}`,
        name: template.name,
        description: template.description,
        icon: iconSpec,
        category: template.category,
        rewardAmount: rewardAmount,
        difficulty: template.difficulty,
        verificationMethod: template.verificationMethod,
        verificationConfig: HabitGenerator.getVerificationConfig(
          template.verificationMethod
        ),
        frequencyType: template.frequencyType,
        frequencyConfig: HabitGenerator.getFrequencyConfig(
          template.frequencyType
        ),
        optimalTimeStart: template.optimalTime?.[0],
        optimalTimeEnd: template.optimalTime?.[1],
        isActive: true,
        completedToday: nonCompletedOnly ? false : Math.random() < 0.3,
        completionCountToday: nonCompletedOnly
          ? 0
          : Math.random() < 0.3
          ? 1
          : 0,
        currentStreak: Math.floor(Math.random() * 15),
        longestStreak: Math.max(
          Math.floor(Math.random() * 30) + 5,
          Math.floor(Math.random() * 15)
        ),
        lastCompletedDate: nonCompletedOnly
          ? undefined
          : Math.random() < 0.5
          ? new Date(Date.now() - 86400000 * Math.floor(Math.random() * 3))
              .toISOString()
              .split("T")[0]
          : undefined,
        createdAt: baseTimestamp - Math.floor(Math.random() * 30) * 86400000,
        updatedAt: baseTimestamp,
      };

      habits.push(habit);
    }

    return habits;
  },

  /**
   * Generate verification config based on method
   */
  getVerificationConfig: (
    method: VerificationMethod
  ): VerificationConfig | undefined => {
    switch (method) {
      case "timer":
        return { duration: [15, 30, 45, 60][Math.floor(Math.random() * 4)] };
      case "integration":
        return {
          integrationId: `integration_${Math.floor(Math.random() * 1000)}`,
        };
      case "location":
        return {
          locationLat: 37.7749 + (Math.random() - 0.5) * 0.1,
          locationLng: -122.4194 + (Math.random() - 0.5) * 0.1,
          locationRadius: [100, 200, 500][Math.floor(Math.random() * 3)],
        };
      default:
        return undefined;
    }
  },

  /**
   * Generate frequency config based on type
   */
  getFrequencyConfig: (type: FrequencyType): FrequencyConfig | undefined => {
    switch (type) {
      case "specific_days": {
        const days: number[] = [];
        const dayCount = Math.floor(Math.random() * 3) + 2; // 2-4 days per week
        for (let i = 0; i < dayCount; i++) {
          let day;
          do {
            day = Math.floor(Math.random() * 7);
          } while (days.includes(day));
          days.push(day);
        }
        return { daysOfWeek: days.sort((a, b) => a - b) };
      }
      case "flexible":
        return { minimumPerWeek: [2, 3, 4][Math.floor(Math.random() * 3)] };
      default:
        return undefined;
    }
  },

  /**
   * Generate realistic completion patterns for habits
   */
  generateRealisticCompletions: (
    habits: Habit[],
    daysBack: number = 7
  ): HabitCompletion[] => {
    const completions: HabitCompletion[] = [];
    const now = Date.now();

    habits.forEach((habit) => {
      // Generate completions for past days
      for (let day = 1; day <= daysBack; day++) {
        const completionDate = new Date(now - day * 86400000);
        const dateString = completionDate.toISOString().split("T")[0];

        // Realistic completion probability based on habit difficulty
        const completionProbability = {
          easy: 0.7,
          medium: 0.5,
          hard: 0.3,
        }[habit.difficulty];

        if (Math.random() < completionProbability) {
          const { timeEarned, xpEarned, multipliers } =
            HabitGenerator.calculateDummyRewards(habit);

          completions.push({
            id: `completion_${habit.id}_${day}`,
            habitId: habit.id,
            completedAt: completionDate.getTime(),
            verificationData:
              habit.verificationMethod === "timer"
                ? {
                    duration:
                      (habit.verificationConfig as TimerVerificationConfig)
                        ?.duration || 30,
                  }
                : habit.verificationMethod === "integration"
                ? { synced: true }
                : habit.verificationMethod === "location"
                ? { locationVerified: true }
                : { manual: true },
            xpEarned,
            timeEarned,
            bonusMultipliers: multipliers,
          });
        }
      }
    });

    return completions;
  },

  /**
   * Calculate realistic rewards for dummy habits
   */
  calculateDummyRewards: (habit: Habit) => {
    const baseTime = habit.rewardAmount;
    const baseXP = habit.rewardAmount;

    // Calculate multipliers based on habit properties
    const streakMultiplier = 1 + habit.currentStreak * 0.05;
    const difficultyMultiplier = {
      easy: 1.0,
      medium: 1.2,
      hard: 1.5,
    }[habit.difficulty];

    const verificationMultiplier = {
      manual: 1.0,
      timer: 1.1,
      integration: 1.2,
      photo: 1.1,
      location: 1.15,
    }[habit.verificationMethod];

    const timeMultiplier = Math.random() * 0.2 + 0.9; // 0.9-1.1 range

    const timeEarned = Math.round(
      baseTime * streakMultiplier * verificationMultiplier * timeMultiplier
    );
    const xpEarned = Math.round(
      baseXP * streakMultiplier * difficultyMultiplier * verificationMultiplier
    );

    return {
      timeEarned,
      xpEarned,
      multipliers: {
        streak: Math.round(streakMultiplier * 10) / 10,
        verification: Math.round(verificationMultiplier * 10) / 10,
      },
    };
  },
};

// ============================================================================
// Pre-computed Lookup Tables (Performance Optimization)
// ============================================================================

/**
 * O(1) lookup map for habits by ID.
 * Pre-computed for performance in hot paths.
 */
export const habitsById: ReadonlyMap<string, Habit> = new Map(
  habits.map((habit) => [habit.id, habit])
);

/**
 * O(1) lookup map for completions by ID.
 * Pre-computed for performance in hot paths.
 */
export const completionsById: ReadonlyMap<string, HabitCompletion> = new Map(
  habitCompletions.map((completion) => [completion.id, completion])
);

/**
 * Group completions by habit ID for efficient querying.
 * O(1) access to all completions for a specific habit.
 */
export const completionsByHabitId: ReadonlyMap<
  string,
  ReadonlyArray<HabitCompletion>
> = new Map(
  habitCompletions.reduce<Map<string, HabitCompletion[]>>((acc, completion) => {
    const existing = acc.get(completion.habitId) ?? [];
    existing.push(completion);
    acc.set(completion.habitId, existing);
    return acc;
  }, new Map())
);

// ============================================================================
// Generated Dummy Data Integration
// ============================================================================

/**
 * Generate and integrate realistic dummy habits into the system
 */
export const generateAndIntegrateDummyHabits = (
  seed?: number
): {
  habits: Habit[];
  completions: HabitCompletion[];
} => {
  // Use seed for deterministic generation if provided
  if (seed !== undefined) {
    Math.random = seededRandom(seed);
  }

  // Generate 15 diverse, non-completed dummy habits
  const dummyHabits = HabitGenerator.generateDummyHabits({
    count: 15,
    nonCompletedOnly: true,
    categories: ["physical", "mental", "creative", "social", "productive"],
    difficultyWeights: { easy: 35, medium: 40, hard: 25 },
    frequencyDistribution: { daily: 50, specific_days: 30, flexible: 20 },
  });

  // Generate realistic completion patterns for the past week
  const dummyCompletions = HabitGenerator.generateRealisticCompletions(
    dummyHabits,
    7
  );

  // Restore original Math.random if we used a seed
  if (seed !== undefined) {
    Math.random = originalMathRandom;
  }

  return { habits: dummyHabits, completions: dummyCompletions };
};

// Module-scoped cache for lazy initialization
let _generatedData: { habits: Habit[]; completions: HabitCompletion[] } | null =
  null;

/**
 * Memoized accessor for generated dummy data
 * Lazy initialization on first call to avoid module-load side effects
 */
export const getGeneratedDummyData = (): {
  habits: Habit[];
  completions: HabitCompletion[];
} => {
  if (!_generatedData) {
    _generatedData = generateAndIntegrateDummyHabits();
  }
  return _generatedData;
};

// Helper for deterministic generation with seeds
const originalMathRandom = Math.random;

function seededRandom(seed: number): () => number {
  let value = seed;
  return () => {
    value = Math.sin(value) * 10000;
    return value - Math.floor(value);
  };
}

// Export for backward compatibility (deprecated - use getGeneratedDummyData() or generateAndIntegrateDummyHabits(seed))
export const generatedDummyHabits = getGeneratedDummyData().habits;
export const generatedDummyCompletions = getGeneratedDummyData().completions;
