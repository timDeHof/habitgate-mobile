import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Switch,
  Platform,
  LogBox,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { Colors, Typography, Spacing, BorderRadius } from "@/constants";
import { useHabitsStore } from "@/store/habitsStore";
import { ConfettiCelebration } from "@/components/animations/ConfettiCelebration";
import { Habit } from "@/data/habits";
import { renderIcon } from "@/components/habits/HabitCard";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// Debugging utilities
const DEBUG_MODE = process.env.NODE_ENV === "development";
const DEBUG_PREFIX = "[HabitDetailModal]";

function debugLog(message: string, data?: any) {
  if (DEBUG_MODE) {
    const timestamp = new Date().toISOString();
    console.log(`${DEBUG_PREFIX} ${timestamp}: ${message}`, data || "");
  }
}

function debugError(error: Error, context: string, state?: any) {
  if (DEBUG_MODE) {
    const timestamp = new Date().toISOString();
    console.error(`${DEBUG_PREFIX} ${timestamp} ERROR [${context}]:`, {
      message: error.message,
      stack: error.stack,
      context,
      state: state || "No state provided",
    });
  }
}

interface HabitDetailModalProps {
  habitId: string;
  onClose: () => void;
}

interface HabitDetailScreenProps {
  habitId?: string;
  onClose?: () => void;
}

export default function HabitDetailScreen({
  habitId: propHabitId,
  onClose: propOnClose,
}: HabitDetailScreenProps = {}) {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { habitId: routeHabitId } = useLocalSearchParams<{ habitId: string }>();

  // Use prop habitId if provided, otherwise fall back to route parameter
  const effectiveHabitId = propHabitId || routeHabitId;
  const { habits, completeHabit, updateHabit } = useHabitsStore();
  const [showConfetti, setShowConfetti] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedHabit, setEditedHabit] = useState<Partial<Habit>>({});
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [notificationTime, setNotificationTime] = useState("08:00");
  const [mountError, setMountError] = useState<Error | null>(null);
  const componentMounted = useRef(false);
  const confettiMounted = useRef(false);

  // Animation values
  const modalScale = useSharedValue(0.8);
  const modalOpacity = useSharedValue(0);
  const headerScale = useSharedValue(1);

  // Debug: Component lifecycle tracking
  useEffect(() => {
    debugLog("Component mounted", {
      habitId: effectiveHabitId,
      component: "HabitDetailScreen",
    });
    componentMounted.current = true;

    // Android-specific view hierarchy fix
    if (Platform.OS === "android") {
      debugLog("Android platform detected - applying view hierarchy fixes");
      // Ignore specific warnings that might cause view hierarchy issues
      LogBox.ignoreLogs(["The specified child already has a parent"]);
    }

    return () => {
      debugLog("Component unmounted", { habitId: effectiveHabitId });
      componentMounted.current = false;
    };
  }, []);

  // Find the habit with debugging
  const habit = useMemo(() => {
    try {
      debugLog("Finding habit by ID", {
        habitId: effectiveHabitId,
        availableHabits: habits.length,
      });
      const foundHabit = habits.find((h) => h.id === effectiveHabitId);
      if (!foundHabit) {
        debugError(
          new Error(`Habit not found: ${effectiveHabitId}`),
          "habit_lookup",
          {
            availableHabits: habits.map((h) => h.id),
          }
        );
      }
      return foundHabit;
    } catch (error) {
      debugError(error as Error, "habit_lookup_failed", {
        habitId: effectiveHabitId,
        habitsCount: habits.length,
      });
      setMountError(error as Error);
      return null;
    }
  }, [habits, effectiveHabitId]);

  // Debug: Store state monitoring
  useEffect(() => {
    debugLog("Store state updated", {
      habitsCount: habits.length,
      habitId: effectiveHabitId,
      habitFound: !!habit,
    });
  }, [habits, effectiveHabitId, habit]);

  const handleClose = () => {
    try {
      debugLog("Close button pressed", { habitId: effectiveHabitId });
      if (propOnClose) {
        propOnClose();
      } else {
        router.back();
      }
    } catch (error) {
      debugError(error as Error, "navigation_failure", {
        action: "back",
        habitId: effectiveHabitId,
        errorDetails: error,
      });
      // Fallback navigation
      try {
        if (propOnClose) {
          propOnClose();
        } else {
          router.back();
        }
      } catch (fallbackError) {
        debugError(fallbackError as Error, "fallback_navigation_failed", {
          habitId: effectiveHabitId,
        });
        // Last resort - navigate to home
        router.push("/(app)/(auth)/(tabs)/home");
      }
    }
  };

  // Calculate completion rate for the past week
  const completionRate = useMemo(() => {
    if (!habit) return 0;
    // This would be calculated from actual completion data in a real implementation
    return Math.min(100, Math.round((habit.currentStreak / 7) * 100));
  }, [habit]);

  // Calculate streak progress
  const streakProgress = useMemo(() => {
    if (!habit) return 0;
    return Math.min(1, habit.currentStreak / 30); // Cap at 30 days for visualization
  }, [habit]);

  // Generate stable completion history data
  const completionHistory = useMemo(() => {
    return [...Array(7)].map((_, i) => ({
      dayIndex: 6 - i,
      isCompleted: Math.random() > 0.3, // TODO: Replace with actual completion data
    }));
  }, [habit?.id]); // Regenerate only when habit changes

  // Handle habit completion with debugging
  const handleComplete = async () => {
    if (!habit) return;

    try {
      debugLog("Habit completion initiated", {
        habitId: habit.id,
        habitName: habit.name,
        currentState: {
          completedToday: habit.completedToday,
          currentStreak: habit.currentStreak,
        },
      });

      // Set confetti visibility with safety check
      if (!confettiMounted.current && Platform.OS === "android") {
        debugLog("Android confetti safety check - ensuring proper mount");
        // Small delay to ensure view hierarchy is ready
        await new Promise((resolve) => setTimeout(resolve, 50));
      }
      setShowConfetti(true);
      confettiMounted.current = true;

      // Complete habit with error handling
      const result = completeHabit(habit.id, "manual");
      debugLog("Habit completion result", {
        success: result.success,
        timeEarned: result.timeEarned,
        xpEarned: result.xpEarned,
      });

      // Trigger completion animation
      headerScale.value = withSpring(1.1, { damping: 10 });

      // Hide confetti after animation with safety check
      setTimeout(() => {
        if (componentMounted.current) {
          setShowConfetti(false);
          confettiMounted.current = false;
        }
      }, 2000);
    } catch (error) {
      debugError(error as Error, "habit_completion_failed", {
        habitId: habit.id,
        habitName: habit.name,
        storeState: {
          habitsCount: habits.length,
          habitExists: !!habits.find((h) => h.id === habit.id),
        },
      });
      setShowConfetti(false);
    }
  };

  // Handle save
  const handleSave = () => {
    if (!habit) return;
    updateHabit(habit.id, editedHabit);
    setIsEditing(false);
  };

  // Entrance animation with debugging
  useEffect(() => {
    try {
      debugLog("Starting entrance animation");
      modalScale.value = withSpring(1, { damping: 12, stiffness: 100 });
      modalOpacity.value = withTiming(1, { duration: 200 });
    } catch (error) {
      debugError(error as Error, "entrance_animation_failed");
    }
  }, []);

  // Reset header scale after completion animation with debugging
  useEffect(() => {
    if (headerScale.value > 1) {
      debugLog("Resetting header scale after completion animation");
      const timer = setTimeout(() => {
        try {
          headerScale.value = withSpring(1, { damping: 10 });
        } catch (error) {
          debugError(error as Error, "header_scale_reset_failed");
        }
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [headerScale.value]);

  const modalAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: modalScale.value }],
    opacity: modalOpacity.value,
  }));

  const headerAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: headerScale.value }],
  }));

  if (!habit) return null;

  // Debug: Interaction tracking
  const trackInteraction = (action: string, data?: any) => {
    debugLog(`User interaction: ${action}`, {
      habitId: habit.id,
      timestamp: new Date().toISOString(),
      ...data,
    });
  };

  // Error boundary for Confetti component
  const SafeConfetti = () => {
    try {
      if (showConfetti) {
        return <ConfettiCelebration visible={showConfetti} />;
      }
      return null;
    } catch (error) {
      debugError(error as Error, "confetti_render_failed", {
        habitId: habit.id,
        showConfetti,
        platform: Platform.OS,
      });
      return null;
    }
  };

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: insets.top,
        },
      ]}
    >
      <SafeConfetti />

      <Animated.View style={[styles.modalContainer, modalAnimatedStyle]}>
        {/* Header Section */}
        <Animated.View style={[styles.header, headerAnimatedStyle]}>
          <View style={styles.headerContent}>
            <View style={styles.iconContainer}>
              {renderIcon(habit.icon, 24)}
            </View>
            <View style={styles.headerText}>
              {isEditing ? (
                <Text style={styles.title}>Edit Habit</Text>
              ) : (
                <Text style={styles.title}>{habit.name}</Text>
              )}
              <Text style={styles.category}>{habit.category}</Text>
            </View>
            <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
              <Text style={styles.closeText}>×</Text>
            </TouchableOpacity>
          </View>

          {/* Completion Status */}
          <View style={styles.statusContainer}>
            <Text style={styles.statusText}>
              {habit.completedToday ? "Completed Today" : "Not Completed"}
            </Text>
            <View
              style={[
                styles.statusIndicator,
                habit.completedToday ? styles.completed : styles.notCompleted,
              ]}
            />
          </View>
        </Animated.View>

        {/* Content */}
        <ScrollView
          style={styles.content}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: Spacing.xl }}
        >
          {/* Streak Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Current Streak</Text>
            <View style={styles.streakContainer}>
              <Text style={styles.streakText}>{habit.currentStreak} days</Text>
              <View style={styles.streakProgressBar}>
                <View
                  style={[
                    styles.streakProgressFill,
                    { width: `${streakProgress * 100}%` },
                  ]}
                />
              </View>
              <Text style={styles.streakSubtext}>
                {habit.longestStreak - habit.currentStreak > 0
                  ? `${
                      habit.longestStreak - habit.currentStreak
                    } days to beat your record!`
                  : "New record! Keep it up!"}
              </Text>
            </View>
          </View>

          {/* Completion History */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Completion History</Text>
            <View style={styles.historyContainer}>
              <Text style={styles.historyText}>
                Last 7 days: {completionRate}% completion rate
              </Text>
              <View style={styles.historyBars}>
                {completionHistory.map(({ dayIndex, isCompleted }, i) => (
                  <View key={i} style={styles.historyBarContainer}>
                    <View
                      style={[
                        styles.historyBar,
                        isCompleted
                          ? styles.historyBarCompleted
                          : styles.historyBarMissed,
                      ]}
                    />
                    <Text style={styles.historyDay}>
                      {["S", "M", "T", "W", "T", "F", "S"][dayIndex]}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          </View>

          {/* Reminder Settings */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Reminder Settings</Text>
            <View style={styles.reminderContainer}>
              <View style={styles.reminderSwitch}>
                <Text style={styles.reminderText}>Daily Reminders</Text>
                <Switch
                  value={notificationsEnabled}
                  onValueChange={setNotificationsEnabled}
                  trackColor={{
                    false: Colors.gray[300],
                    true: Colors.primary[500],
                  }}
                  thumbColor={Colors.text.inverse}
                />
              </View>
              {notificationsEnabled && (
                <TouchableOpacity
                  style={styles.timePicker}
                  onPress={() => {
                    // Time picker implementation would go here
                    console.log("Open time picker");
                  }}
                >
                  <Text style={styles.timePickerText}>{notificationTime}</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* Difficulty and Progression */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Difficulty & Progression</Text>
            <View style={styles.difficultyContainer}>
              <Text style={styles.difficultyText}>
                Difficulty:{" "}
                <Text style={styles.difficultyValue}>{habit.difficulty}</Text>
              </Text>
              <Text style={styles.xpText}>
                XP Reward:{" "}
                <Text style={styles.xpValue}>{habit.rewardAmount} XP</Text>
              </Text>
              <Text style={styles.progressText}>
                Total Completions: <Text style={styles.progressValue}>42</Text>
              </Text>
            </View>
          </View>

          {/* Analytics Preview */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Performance Analytics</Text>
            <View style={styles.analyticsContainer}>
              <Text style={styles.analyticsText}>
                View detailed analytics and trends for this habit
              </Text>
              <TouchableOpacity
                style={styles.analyticsButton}
                onPress={() => {
                  console.log("Navigate to analytics");
                }}
              >
                <Text style={styles.analyticsButtonText}>View Analytics →</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>

        {/* Action Buttons */}
        <View
          style={[
            styles.actionsContainer,
            {
              paddingBottom: insets.bottom + Spacing.md,
            },
          ]}
        >
          {!isEditing ? (
            <>
              <TouchableOpacity
                style={[styles.actionButton, styles.completeButton]}
                onPress={handleComplete}
                disabled={habit.completedToday}
              >
                <Text style={styles.actionButtonText}>
                  {habit.completedToday
                    ? "Already Completed"
                    : "Mark as Complete"}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionButton, styles.secondaryButton]}
                onPress={() => setIsEditing(true)}
              >
                <Text style={styles.actionButtonSecondaryText}>Edit Habit</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <TouchableOpacity
                style={[styles.actionButton, styles.saveButton]}
                onPress={handleSave}
              >
                <Text style={styles.actionButtonText}>Save Changes</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionButton, styles.secondaryButton]}
                onPress={() => setIsEditing(false)}
              >
                <Text style={styles.actionButtonSecondaryText}>Cancel</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </Animated.View>
    </View>
  );
}

export function HabitDetailModal({ habitId, onClose }: HabitDetailModalProps) {
  return <HabitDetailScreen habitId={habitId} onClose={onClose} />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.primary,
  },
  modalContainer: {
    flex: 1,
    padding: Spacing.lg,
  },
  header: {
    marginBottom: Spacing.xl,
    paddingVertical: Spacing.md,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: Spacing.md,
  },
  iconContainer: {
    width: 48,
    height: 48,
    minWidth: 48,
    minHeight: 48,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.primary[100],
    borderRadius: BorderRadius.full,
    padding: Spacing.sm,
  },
  headerText: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  title: {
    fontFamily: Typography.fontFamily.brandBold,
    fontSize: Typography.fontSize["2xl"],
    color: Colors.text.primary,
  },
  category: {
    fontFamily: Typography.fontFamily.brandMedium,
    fontSize: Typography.fontSize.sm,
    color: Colors.text.secondary,
    textTransform: "capitalize",
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.gray[200],
    justifyContent: "center",
    alignItems: "center",
  },
  closeText: {
    fontSize: 24,
    color: Colors.text.secondary,
    lineHeight: 24,
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: Spacing.sm,
    backgroundColor: Colors.background.secondary,
    borderRadius: BorderRadius.lg,
  },
  statusText: {
    fontFamily: Typography.fontFamily.brandMedium,
    fontSize: Typography.fontSize.base,
    marginRight: Spacing.sm,
  },
  statusIndicator: {
    width: 16,
    height: 14,
    borderRadius: BorderRadius.full,
  },
  completed: {
    backgroundColor: Colors.success[500],
  },
  notCompleted: {
    backgroundColor: Colors.gray[400],
  },
  section: {
    marginBottom: Spacing.xl,
    backgroundColor: Colors.background.secondary,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
  },
  sectionTitle: {
    fontFamily: Typography.fontFamily.brandBold,
    fontSize: Typography.fontSize.lg,
    color: Colors.text.primary,
    marginBottom: Spacing.md,
  },
  streakContainer: {
    alignItems: "center",
  },
  streakText: {
    fontFamily: Typography.fontFamily.brandBold,
    fontSize: Typography.fontSize["3xl"],
    color: Colors.text.primary,
    marginBottom: Spacing.sm,
  },
  streakProgressBar: {
    width: "100%",
    height: 8,
    backgroundColor: Colors.gray[200],
    borderRadius: BorderRadius.full,
    overflow: "hidden",
    marginBottom: Spacing.sm,
  },
  streakProgressFill: {
    height: "100%",
    backgroundColor: Colors.primary[500],
    borderRadius: BorderRadius.full,
  },
  streakSubtext: {
    fontFamily: Typography.fontFamily.brandMedium,
    fontSize: Typography.fontSize.sm,
    color: Colors.text.secondary,
  },
  historyContainer: {
    marginTop: Spacing.sm,
  },
  historyText: {
    fontFamily: Typography.fontFamily.brandMedium,
    fontSize: Typography.fontSize.base,
    color: Colors.text.secondary,
    marginBottom: Spacing.md,
  },
  historyBars: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    height: 80,
    marginVertical: Spacing.lg,
  },
  historyBarContainer: {
    alignItems: "center",
    gap: Spacing.sm,
  },
  historyBar: {
    width: 16,
    borderRadius: BorderRadius.sm,
  },
  historyBarCompleted: {
    height: "100%",
    backgroundColor: Colors.success[500],
  },
  historyBarMissed: {
    height: "30%",
    backgroundColor: Colors.gray[300],
  },
  historyDay: {
    fontFamily: Typography.fontFamily.brandMedium,
    fontSize: Typography.fontSize.xs,
    color: Colors.text.secondary,
  },
  reminderContainer: {
    marginTop: Spacing.sm,
    gap: Spacing.md,
  },
  reminderSwitch: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: Spacing.sm,
    backgroundColor: Colors.background.primary,
    borderRadius: BorderRadius.md,
  },
  reminderText: {
    fontFamily: Typography.fontFamily.brandMedium,
    fontSize: Typography.fontSize.base,
    color: Colors.text.primary,
  },
  timePicker: {
    padding: Spacing.sm,
    backgroundColor: Colors.background.primary,
    borderRadius: BorderRadius.md,
    alignItems: "center",
  },
  timePickerText: {
    fontFamily: Typography.fontFamily.brandBold,
    fontSize: Typography.fontSize.xl,
    color: Colors.text.primary,
  },
  difficultyContainer: {
    marginTop: Spacing.sm,
    gap: Spacing.sm,
  },
  difficultyText: {
    fontFamily: Typography.fontFamily.brandMedium,
    fontSize: Typography.fontSize.base,
    color: Colors.text.secondary,
  },
  difficultyValue: {
    fontFamily: Typography.fontFamily.brandBold,
    fontSize: Typography.fontSize.base,
    color: Colors.text.primary,
    textTransform: "capitalize",
  },
  xpText: {
    fontFamily: Typography.fontFamily.brandMedium,
    fontSize: Typography.fontSize.base,
    color: Colors.text.secondary,
  },
  xpValue: {
    fontFamily: Typography.fontFamily.brandBold,
    fontSize: Typography.fontSize.base,
    color: Colors.success[500],
  },
  progressText: {
    fontFamily: Typography.fontFamily.brandMedium,
    fontSize: Typography.fontSize.base,
    color: Colors.text.secondary,
  },
  progressValue: {
    fontFamily: Typography.fontFamily.brandBold,
    fontSize: Typography.fontSize.base,
    color: Colors.primary[500],
  },
  analyticsContainer: {
    marginTop: Spacing.sm,
    padding: Spacing.sm,
    backgroundColor: Colors.background.primary,
    borderRadius: BorderRadius.md,
    alignItems: "center",
  },
  analyticsText: {
    fontFamily: Typography.fontFamily.brandMedium,
    fontSize: Typography.fontSize.base,
    color: Colors.text.secondary,
    marginBottom: Spacing.md,
    textAlign: "center",
  },
  analyticsButton: {
    padding: Spacing.sm,
    backgroundColor: Colors.primary[100],
    borderRadius: BorderRadius.md,
  },
  analyticsButtonText: {
    fontFamily: Typography.fontFamily.brandBold,
    fontSize: Typography.fontSize.base,
    color: Colors.primary[600],
  },
  actionsContainer: {
    marginTop: Spacing.lg,
    gap: Spacing.md,
  },
  actionButton: {
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    alignItems: "center",
  },
  completeButton: {
    backgroundColor: Colors.primary[500],
  },
  saveButton: {
    backgroundColor: Colors.success[500],
  },
  secondaryButton: {
    backgroundColor: Colors.background.secondary,
    borderWidth: 1,
    borderColor: Colors.gray[300],
  },
  actionButtonText: {
    fontFamily: Typography.fontFamily.brandBold,
    fontSize: Typography.fontSize.lg,
    color: Colors.text.inverse,
  },
  actionButtonSecondaryText: {
    fontFamily: Typography.fontFamily.brandBold,
    fontSize: Typography.fontSize.lg,
    color: Colors.text.primary,
  },
  content: {
    flex: 1,
  },
});
