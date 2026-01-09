/**
 * Barrel export for services module.
 * Provides centralized access to all service functions.
 *
 * Note: Due to naming conflicts, some utilities are exported individually
 * rather than via wildcard to avoid ambiguity.
 */

// Habits service
export {
  generateId as generateHabitId,
  createHabit,
  createHabitCompletion,
  isValidHabit,
  getHabitById,
  getCompletionById,
  getCompletionsForHabit,
  createHabitsById,
  createCompletionsById,
  createCompletionsByHabitId,
  fetchHabits,
  fetchHabitById,
  fetchCompletions,
  fetchCompletionsForHabit,
  fetchCompletionById,
  fetchStreak,
  createHabitMutation,
  createCompletionMutation,
  updateHabitMutation,
  deleteHabitMutation,
  habitKeys,
  type HabitFilters,
} from "./habits";

// Apps service
export {
  generateId as generateAppId,
  getLockedAppById,
  getLockedAppByIdentifier,
  getActiveApps,
  getAppsByCategory,
  calculateTotalCost,
  isSessionValid,
  getRemainingTime,
  fetchApps,
  fetchAppById,
  fetchAppByIdentifier,
  fetchActiveApps,
  fetchAppsByCategory,
  fetchUnlockSessions,
  fetchActiveUnlockSessions,
  createUnlockSession,
  updateUnlockSession,
  markSessionUsed,
  endUnlockSession,
  appKeys,
  type AppFilters,
} from "./apps";

// Gamification service
export {
  generateId as generateGamificationId,
  getAchievementById,
  getAchievementByCode,
  getAchievementsByRarity,
  getUnlockedAchievements,
  getLockedAchievements,
  getNextLevel,
  getLevelProgress,
  isAchievementUnlocked,
  calculateProgress,
  getProductivityBadge,
  getRarityColor,
  sortAchievementsByStatus,
  fetchAchievements,
  fetchGamificationState,
  fetchLevelConfig,
  fetchNextLevelXP,
  calculateLevelProgress,
  addXP,
  unlockAchievement,
  updateStreak,
  updateProductivityScore,
  gamificationKeys,
} from "./gamification";

// TimeBank service
export {
  generateId as generateTimebankId,
  getTransactionById,
  getTransactionsByType,
  getTransactionsBySource,
  getRecentTransactions,
  getTransactionSummary,
  formatTime,
  isTransactionTypeEarn,
  isTransactionTypeSpend,
  calculateBalanceChange,
  getAmountSign,
  calculateBalance,
  fetchTimeBankState,
  fetchTransactions,
  fetchTransactionById,
  fetchTransactionsByType,
  fetchTransactionsBySource,
  fetchBalance,
  fetchDailyEarned,
  addTransaction,
  earnTime,
  spendTime,
  applyBonus,
  applyPenalty,
  resetDailyEarned,
  timebankKeys,
} from "./timebank";
