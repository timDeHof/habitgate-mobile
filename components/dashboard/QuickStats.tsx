import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { Colors, Typography, Spacing, BorderRadius } from "@/constants";
import { useTimeBankStore } from "@/store/timeBankStore";
import { useShallow } from "zustand/react/shallow";
import { INITIAL_TIME_BANK_STATE } from "@/data/timebank";
const QuickStats = () => {
  const { dailyEarned, dailySpent } = useTimeBankStore(
    useShallow((state) => ({
      balance: state.balance,
      dailyEarned: state.dailyEarned,
      dailySpent: state.dailySpent,
    }))
  );
  // Use nullish coalescing to handle uninitialized state while preserving legitimate zero values
  const displayDailyEarned = dailyEarned ?? INITIAL_TIME_BANK_STATE.dailyEarned;
  const displayDailySpent = dailySpent ?? INITIAL_TIME_BANK_STATE.dailySpent;
  // Get streak data from time bank store with proper error handling
  const { currentStreak } = useTimeBankStore(
    useShallow((state) => ({
      currentStreak: state.currentStreak,
    }))
  );

  // Use nullish coalescing to handle uninitialized state while preserving legitimate zero values
  const displayStreak =
    currentStreak ?? INITIAL_TIME_BANK_STATE.currentStreak ?? 0;

  return (
    <View style={styles.statsContainer}>
      <Text style={styles.statTitle}>Quick Stats</Text>
      <View style={styles.statGrid}>
        <View style={styles.statItem}>
          <View
            style={[styles.statIcon, { backgroundColor: Colors.success[100] }]}
          >
            <Text style={styles.statEmoji}>💰</Text>
          </View>
          <Text style={styles.statLabel}>Today Earned:</Text>
          <Text style={styles.statValue}>+{displayDailyEarned} min</Text>
        </View>
        <View style={styles.statItem}>
          <View
            style={[styles.statIcon, { backgroundColor: Colors.primary[100] }]}
          >
            <Text style={styles.statEmoji}>💳</Text>
          </View>
          <Text style={styles.statLabel}>Today Spent:</Text>
          <Text style={styles.statValue}>{displayDailySpent} min </Text>
        </View>
        <View style={styles.statItem}>
          <View
            style={[styles.statIcon, { backgroundColor: Colors.warning[100] }]}
          >
            <Text style={styles.statEmoji}>🔥</Text>
          </View>
          <Text style={styles.statLabel}>Streak:</Text>
          <Text style={styles.statValue}>{displayStreak} days</Text>
        </View>
      </View>
    </View>
  );
};

export default QuickStats;

const styles = StyleSheet.create({
  statsContainer: {
    marginVertical: Spacing.md,
  },
  statTitle: {
    fontFamily: Typography.fontFamily.brandBold,
    fontSize: Typography.fontSize.xl,
    color: Colors.text.primary,
    marginBottom: Spacing.md,
  },
  statGrid: {
    flexDirection: "row",
    gap: Spacing.sm,
  },
  statItem: {
    flex: 1,
    backgroundColor: Colors.background.secondary,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    alignItems: "center",
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: Spacing.xs,
  },
  statEmoji: {
    fontSize: Typography.fontSize["2xl"],
  },
  statLabel: {
    fontFamily: Typography.fontFamily.brand,
    fontSize: Typography.fontSize.xs,
    color: Colors.text.secondary,
    textAlign: "center",
    marginBottom: Spacing.xs,
  },
  statValue: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text.primary,
  },
});
