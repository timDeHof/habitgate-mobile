import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
  FontAwesome5,
} from "@expo/vector-icons";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
  withTiming,
  withDelay,
} from "react-native-reanimated";
import { Colors, Typography, Spacing } from "@/constants";
import { useHabitsStore } from "@/store/habitsStore";
import { useTimeBankStore } from "@/store/timeBankStore";
import { useGamificationStore } from "@/store/gamificationStore";
import { IconSpec, VectorIconLibrary } from "@/data/habits";
import { ConfettiCelebration } from "@/components/animations/ConfettiCelebration";
import { calculateRewards } from "@/utils/calculations/rewards";
import { Alert } from "react-native";

type VerificationMethod = "manual" | "timer" | "photo" | "integration";

/**
 * Helper function to render icons based on IconSpec
 */
function renderIcon(iconSpec: IconSpec, size: number = 40) {
  if (iconSpec.type === "vector") {
    const IconComponent = getIconComponent(iconSpec.library);
    return (
      <IconComponent
        name={iconSpec.name}
        size={iconSpec.size || size}
        color={iconSpec.color || Colors.text.primary}
      />
    );
  } else {
    return (
      <Ionicons
        name="help-circle"
        size={iconSpec.size || size}
        color={iconSpec.color || Colors.text.primary}
      />
    );
  }
}

/**
 * Get the appropriate Expo vector icon component based on library name
 */
function getIconComponent(library: VectorIconLibrary) {
  switch (library) {
    case "Ionicons":
      return Ionicons;
    case "MaterialCommunityIcons":
      return MaterialCommunityIcons;
    case "MaterialIcons":
      return MaterialIcons;
    case "FontAwesome5":
      return FontAwesome5;
    default:
      return Ionicons;
  }
}

export default function HabitCompletionModal() {
  const { habitId } = useLocalSearchParams<{ habitId: string }>();
  const router = useRouter();
  const { habits, completeHabit } = useHabitsStore();
  const { addBalance } = useTimeBankStore();
  const { addXP, currentStreak } = useGamificationStore();

  const [selectedMethod, setSelectedMethod] =
    useState<VerificationMethod>("manual");
  const [isCompleting, setIsCompleting] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  /**
   * Centralized XP calculation function to ensure consistency between preview and confirmation
   * Uses the shared calculateRewards function to align with actual XP calculation
   * @param habitRewardAmount - The habit's reward amount in minutes
   * @param currentStreakCount - Current streak count for streak bonus calculation
   * @param verificationMethod - Selected verification method for bonus calculation
   * @returns Object containing total XP and breakdown of bonuses
   */
  const computeXP = (
    habitRewardAmount: number,
    currentStreakCount: number,
    verificationMethod: VerificationMethod
  ): {
    totalXP: number;
    baseXP: number;
    streakBonus: number;
    verificationBonus: number;
  } => {
    // Create a mock habit object for calculateRewards
    const mockHabit: any = {
      id: "temp",
      name: "temp",
      icon: {
        type: "vector",
        library: "MaterialCommunityIcons",
        name: "help-circle",
      },
      category: "physical",
      rewardAmount: habitRewardAmount,
      difficulty: "medium",
      verificationMethod: verificationMethod,
      frequencyType: "daily",
      isActive: true,
      completedToday: false,
      completionCountToday: 0,
      currentStreak: currentStreakCount,
      longestStreak: 0,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      optimalTimeStart: undefined,
      optimalTimeEnd: undefined,
    };

    // Calculate rewards using the shared implementation
    const rewards = calculateRewards(mockHabit, []);

    // Extract base XP (2 XP per minute)
    const baseXP = habitRewardAmount * 2;

    // Calculate streak bonus based on the streak multiplier
    const streakMultiplier = rewards.multipliers.streak || 1;
    const streakBonus = Math.floor(baseXP * (streakMultiplier - 1));

    // Calculate verification bonus
    const verificationBonus = rewards.multipliers.verification
      ? Math.floor(baseXP * 0.2)
      : 0;

    // Calculate total XP
    const totalXP = rewards.xpEarned;

    return { totalXP, baseXP, streakBonus, verificationBonus };
  };

  // Animation values
  const checkmarkScale = useSharedValue(0);
  const checkmarkRotation = useSharedValue(-45);
  const modalScale = useSharedValue(0.8);
  const modalOpacity = useSharedValue(0);

  const habit = habits.find((h) => h.id === habitId);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (habit) {
      // Entrance animation
      modalScale.value = withSpring(1, { damping: 15, stiffness: 150 });
      modalOpacity.value = withTiming(1, { duration: 200 });

      // Checkmark animation
      checkmarkScale.value = withDelay(
        200,
        withSequence(
          withSpring(1.2, { damping: 8 }),
          withSpring(1, { damping: 10 })
        )
      );
      checkmarkRotation.value = withDelay(200, withSpring(0, { damping: 12 }));
    }
  }, [habit]);

  const modalAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: modalScale.value }],
    opacity: modalOpacity.value,
  }));

  const checkmarkAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: checkmarkScale.value },
      { rotate: `${checkmarkRotation.value}deg` },
    ],
  }));

  const handleConfirm = async () => {
    if (!habit) return;

    setIsCompleting(true);

    try {
      // Simulate completion process
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Complete habit
      completeHabit(habit.id, selectedMethod);

      // Note: Time balance is already added by completeHabit via timeBankStore

      // Note: XP is already added by completeHabit via gamificationStore

      // Only show confetti and navigate on success
      setShowConfetti(true);

      // Delay navigation to ensure confetti animation plays fully
      // Wait for 2 seconds (typical confetti animation duration) before navigating back
      await new Promise((resolve) => setTimeout(resolve, 2000));
      router.back();
    } catch (error) {
      console.error("Failed to complete habit:", error);
      // Reset states on error
      setIsCompleting(false);
      setShowConfetti(false);
      // Show error to user
      Alert.alert("Error", "Failed to complete habit. Please try again.");
    }
  };

  const handleCancel = () => {
    setSelectedMethod("manual");
    router.back();
  };

  if (!habit) return null;

  return (
    <View style={styles.container}>
      {/* Confetti Celebration */}
      <ConfettiCelebration visible={showConfetti} />

      <Animated.View style={[styles.modalContainer, modalAnimatedStyle]}>
        {/* Checkmark Icon */}
        <Animated.View style={[styles.iconContainer, checkmarkAnimatedStyle]}>
          <View style={styles.checkmarkCircle}>
            <Text style={styles.checkmarkIcon}>✓</Text>
          </View>
        </Animated.View>

        {/* Title */}
        <Text style={styles.title}>Habit Completed!</Text>

        {/* Habit Info */}
        <View style={styles.habitInfo}>
          <View style={styles.habitIcon}>{renderIcon(habit.icon, 40)}</View>
          <Text style={styles.habitName}>{habit.name}</Text>
          <Text style={styles.rewardAmount}>+{habit.rewardAmount} minutes</Text>
        </View>

        {/* Verification Method */}
        <Text style={styles.verificationLabel}>How did you complete it?</Text>

        <View style={styles.verificationGrid}>
          <TouchableOpacity
            style={[
              styles.verificationButton,
              selectedMethod === "manual" && styles.verificationButtonSelected,
            ]}
            onPress={() => setSelectedMethod("manual")}
          >
            <Text style={styles.verificationIcon}>📝</Text>
            <Text
              style={[
                styles.verificationText,
                selectedMethod === "manual" && styles.verificationTextSelected,
              ]}
            >
              Manual
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.verificationButton,
              selectedMethod === "timer" && styles.verificationButtonSelected,
            ]}
            onPress={() => setSelectedMethod("timer")}
          >
            <Text style={styles.verificationIcon}>⏱️</Text>
            <Text
              style={[
                styles.verificationText,
                selectedMethod === "timer" && styles.verificationTextSelected,
              ]}
            >
              Timer
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.verificationButton,
              selectedMethod === "photo" && styles.verificationButtonSelected,
            ]}
            onPress={() => setSelectedMethod("photo")}
          >
            <Text style={styles.verificationIcon}>📷</Text>
            <Text
              style={[
                styles.verificationText,
                selectedMethod === "photo" && styles.verificationTextSelected,
              ]}
            >
              Photo
            </Text>
            <View style={styles.bonusBadge}>
              <Text style={styles.bonusText}>
                +{Math.floor(habit.rewardAmount * 2 * 0.2)} XP
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.verificationButton,
              selectedMethod === "integration" &&
                styles.verificationButtonSelected,
            ]}
            onPress={() => setSelectedMethod("integration")}
          >
            <Text style={styles.verificationIcon}>🔗</Text>
            <Text
              style={[
                styles.verificationText,
                selectedMethod === "integration" &&
                  styles.verificationTextSelected,
              ]}
            >
              Link
            </Text>
          </TouchableOpacity>
        </View>

        {/* XP Preview - now using centralized calculation for consistency */}
        <View style={styles.xpPreview}>
          <Text style={styles.xpPreviewText}>
            {(() => {
              const { totalXP, baseXP, streakBonus, verificationBonus } =
                computeXP(habit.rewardAmount, currentStreak, selectedMethod);
              const bonusComponents = [];
              if (streakBonus > 0)
                bonusComponents.push(`${streakBonus} streak XP`);
              if (verificationBonus > 0)
                bonusComponents.push(`${verificationBonus} verification XP`);

              if (bonusComponents.length > 0) {
                return `You'll earn ${totalXP} XP (${baseXP} base + ${bonusComponents.join(
                  " + "
                )})`;
              } else {
                return `You'll earn ${totalXP} XP`;
              }
            })()}
          </Text>
        </View>

        {/* Confirm Button */}
        <TouchableOpacity
          style={[
            styles.confirmButton,
            isCompleting && styles.confirmButtonDisabled,
          ]}
          onPress={handleConfirm}
          disabled={isCompleting}
        >
          <Text style={styles.confirmButtonText}>
            {isCompleting ? "Completing..." : "Confirm Completion"}
          </Text>
        </TouchableOpacity>

        {/* Cancel Button */}
        <TouchableOpacity
          style={[
            styles.cancelButton,
            isCompleting && styles.cancelButtonDisabled,
          ]}
          onPress={handleCancel}
          disabled={isCompleting}
        >
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.primary,
  },
  modalContainer: {
    padding: Spacing.xl,
    alignItems: "center",
  },
  iconContainer: {
    marginBottom: Spacing.lg,
  },
  checkmarkCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.success[100],
    justifyContent: "center",
    alignItems: "center",
  },
  checkmarkIcon: {
    fontSize: 48,
    color: Colors.success[600],
    fontFamily: Typography.fontFamily.brandBold,
  },
  title: {
    fontFamily: Typography.fontFamily.brandBold,
    fontSize: Typography.fontSize["3xl"],
    color: Colors.text.primary,
    marginBottom: Spacing.md,
  },
  habitInfo: {
    alignItems: "center",
    marginBottom: Spacing.xl,
  },
  habitIcon: {
    marginBottom: Spacing.sm,
    alignItems: "center",
    justifyContent: "center",
  },
  habitName: {
    fontFamily: Typography.fontFamily.brandSemibold,
    fontSize: Typography.fontSize.xl,
    color: Colors.text.primary,
    marginBottom: Spacing.xs,
  },
  rewardAmount: {
    fontFamily: Typography.fontFamily.brandBold,
    fontSize: Typography.fontSize.lg,
    color: Colors.success[600],
  },
  verificationLabel: {
    fontFamily: Typography.fontFamily.brandMedium,
    fontSize: Typography.fontSize.base,
    color: Colors.text.secondary,
    marginBottom: Spacing.md,
  },
  verificationGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.md,
    marginBottom: Spacing.lg,
    width: "100%",
  },
  verificationButton: {
    flex: 1,
    minWidth: "45%",
    backgroundColor: Colors.background.secondary,
    borderRadius: 12,
    padding: Spacing.md,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "transparent",
  },
  verificationButtonSelected: {
    backgroundColor: Colors.primary[100],
    borderColor: Colors.primary[600],
  },
  verificationIcon: {
    fontSize: 32,
    marginBottom: Spacing.xs,
  },
  verificationText: {
    fontFamily: Typography.fontFamily.brandMedium,
    fontSize: Typography.fontSize.sm,
    color: Colors.text.secondary,
  },
  verificationTextSelected: {
    color: Colors.primary[700],
    fontFamily: Typography.fontFamily.brandSemibold,
  },
  bonusBadge: {
    position: "absolute",
    top: 4,
    right: 4,
    backgroundColor: Colors.warning[500],
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  bonusText: {
    fontFamily: Typography.fontFamily.brandBold,
    fontSize: 10,
    color: "#FFFFFF",
  },
  xpPreview: {
    backgroundColor: Colors.primary[100],
    borderRadius: 8,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  xpPreviewText: {
    fontFamily: Typography.fontFamily.brandMedium,
    fontSize: Typography.fontSize.sm,
    color: Colors.primary[700],
  },
  confirmButton: {
    width: "100%",
    backgroundColor: Colors.primary[600],
    borderRadius: 12,
    paddingVertical: Spacing.md,
    alignItems: "center",
    marginBottom: Spacing.md,
  },
  confirmButtonDisabled: {
    opacity: 0.6,
  },
  confirmButtonText: {
    fontFamily: Typography.fontFamily.brandBold,
    fontSize: Typography.fontSize.lg,
    color: "#FFFFFF",
  },
  cancelButton: {
    paddingVertical: Spacing.sm,
  },
  cancelButtonDisabled: {
    opacity: 0.6,
  },
  cancelButtonText: {
    fontFamily: Typography.fontFamily.brandSemibold,
    fontSize: Typography.fontSize.base,
    color: Colors.text.secondary,
  },
});
