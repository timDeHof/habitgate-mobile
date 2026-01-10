import { View, Text, StyleSheet } from "react-native";
import React from "react";
import { useTimeBankStore } from "@/store/timeBankStore";
import { useShallow } from "zustand/react/shallow";
import {
  NEAR_CAP_THRESHOLD,
  CRITICAL_BALANCE,
  DAILY_EARNING_CAP,
  INITIAL_TIME_BANK_STATE,
} from "@/data/timebank";
import {
  Colors,
  Typography,
  Spacing,
  BorderRadius,
  Shadows,
} from "@/constants";

const TimeBankCard = (): React.ReactElement => {
  const { balance, dailyEarned, getRemainingDailyCapacity } = useTimeBankStore(
    useShallow((state) => ({
      balance: state.balance,
      dailyEarned: state.dailyEarned,
      getRemainingDailyCapacity: state.getRemainingDailyCapacity,
    }))
  );

  // Use dummy initial values for development/testing when store is empty
  const displayBalance =
    balance > 0 ? balance : INITIAL_TIME_BANK_STATE.balance;
  const displayDailyEarned =
    dailyEarned > 0 || balance > 0
      ? dailyEarned
      : INITIAL_TIME_BANK_STATE.dailyEarned;

  // Compute remaining daily capacity inline for consistency
  const remainingCapacity = Math.max(DAILY_EARNING_CAP - displayDailyEarned, 0);
  const isLowBalance = displayBalance < CRITICAL_BALANCE;
  const isNearCap = displayDailyEarned > DAILY_EARNING_CAP - NEAR_CAP_THRESHOLD;
  return (
    <View style={styles.container}>
      {/* Balance Display */}
      <View style={styles.balanceContainer}>
        <Text style={styles.label}>Time Bank Balance</Text>
        <Text
          style={[
            styles.balance,
            isLowBalance ? styles.balanceLow : styles.balanceNormal,
          ]}
        >
          {displayBalance}
        </Text>
        <Text style={styles.unit}>minutes</Text>
      </View>

      {/* Warning Banners */}
      {isNearCap && (
        <View style={styles.warningBannerCritical}>
          <Text style={styles.warningTextCritical}>
            ⚠️ Only {remainingCapacity} minutes left until daily cap! Complete
            habits now!
          </Text>
        </View>
      )}

      {isLowBalance && !isNearCap && (
        <View style={styles.warningBanner}>
          <Text style={styles.warningText}>
            ⚠️ Low balance! Complete habits to earn more time.
          </Text>
        </View>
      )}

      {/* Quick Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Today</Text>
          <Text style={styles.statValue}>+{displayDailyEarned}</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Capacity</Text>
          <Text style={styles.statValue}>{remainingCapacity}</Text>
        </View>
      </View>
    </View>
  );
};

export default TimeBankCard;

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.background.light,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    marginHorizontal: Spacing.md,
    marginTop: Spacing.md,
    ...Shadows.lg,
  },
  balanceContainer: {
    alignItems: "center",
    marginBottom: Spacing.md,
  },
  label: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text.secondary,
    marginBottom: Spacing.xs,
  },
  balance: {
    fontSize: Typography.fontSize["5xl"],
    fontWeight: Typography.fontWeight.bold,
  },
  balanceNormal: {
    color: Colors.success[500],
  },
  balanceLow: {
    color: Colors.warning[500],
  },
  unit: {
    fontSize: Typography.fontSize.xs,
    color: Colors.text.secondary,
    marginTop: Spacing.xs,
  },
  warningBanner: {
    backgroundColor: Colors.error[100],
    borderRadius: BorderRadius.md,
    padding: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  warningText: {
    color: Colors.error[500],
    fontSize: Typography.fontSize.sm,
    textAlign: "center",
  },
  warningBannerCritical: {
    backgroundColor: Colors.error[200],
    borderRadius: BorderRadius.md,
    padding: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  warningTextCritical: {
    color: Colors.error[600],
    fontSize: Typography.fontSize.sm,
    textAlign: "center",
    fontWeight: Typography.fontWeight.semibold,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.gray[100],
  },
  statItem: {
    alignItems: "center",
  },
  statLabel: {
    fontSize: Typography.fontSize.xs,
    color: Colors.text.secondary,
  },
  statValue: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text.primary,
  },
});
