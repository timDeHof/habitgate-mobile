import { View, Text, StyleSheet, TouchableOpacity, Modal } from "react-native";
import React, { useMemo } from "react";
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
import { LinearGradient } from "expo-linear-gradient";
import MaskedView from "@react-native-masked-view/masked-view";
import DailyStatsGrid from "@/components/dashboard/DailyStatsGrid";
import BalanceStatusIndicator from "@/components/dashboard/BalanceStatusIndicator";

const GradientText = (props: React.ComponentProps<typeof Text>) => {
  return (
    <MaskedView
      maskElement={
        <Text {...props} style={[props.style, { color: "black" }]} />
      } // Android fix requires a non-transparent color in the mask
    >
      {/* The LinearGradient provides the colors that show through the mask */}
      <LinearGradient
        colors={["#3B82F6", "#10B981"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.balanceGradientWrapper}
      >
        {/* The underlying text is made transparent so only the gradient is visible */}
        <Text {...props} style={[props.style, { opacity: 0 }]} />
      </LinearGradient>
    </MaskedView>
  );
};

const TimeBankBalanceModal = () => {
  const { balance, dailyEarned } = useTimeBankStore(
    useShallow((state) => ({
      balance: state.balance,
      dailyEarned: state.dailyEarned,
    }))
  );

  // Use dummy initial values for development/testing when store is empty
  const displayBalance =
    balance > 0 ? balance : INITIAL_TIME_BANK_STATE.balance;
  const displayDailyEarned =
    dailyEarned > 0 || balance > 0
      ? dailyEarned
      : INITIAL_TIME_BANK_STATE.dailyEarned;

  // Compute remaining daily capacity and status indicators
  const remainingCapacity = Math.max(DAILY_EARNING_CAP - displayDailyEarned, 0);
  const isLowBalance = displayBalance < CRITICAL_BALANCE;
  const isNearCap =
    remainingCapacity <= NEAR_CAP_THRESHOLD && remainingCapacity > 0;

  // Calculate daily usage percentage
  const dailyUsagePercentage = useMemo(() => {
    return Math.round((displayDailyEarned / DAILY_EARNING_CAP) * 100);
  }, [displayDailyEarned]);

  return (
    <View style={styles.container}>
      {/* Title */}
      <Text style={styles.title}>Daily Balance</Text>

      {/* Balance Display Section */}
      <View style={styles.balanceSection}>
        <Text style={styles.balanceLabel}>Time Bank Balance</Text>

        <GradientText style={styles.balanceAmount}>
          {displayBalance}
        </GradientText>

        <Text style={styles.balanceUnit}>minutes</Text>
      </View>

      {/* Daily Capacity Progress */}
      <View style={styles.progressSection}>
        <View style={styles.progressLabelContainer}>
          <Text style={styles.progressLabel}>Daily Capacity Usage</Text>
          <Text style={styles.progressPercentage}>
            {dailyUsagePercentage}% Used
          </Text>
        </View>
        <View style={styles.progressBarContainer}>
          <LinearGradient
            colors={["#10B981", "#3B82F6"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={[
              styles.progressBarFill,
              { width: `${dailyUsagePercentage}%` },
            ]}
          />
        </View>
      </View>

      {/* Daily Stats Grid */}
      <DailyStatsGrid
        earned={displayDailyEarned}
        remaining={remainingCapacity}
      />

      {/* Status Indicator */}
      <BalanceStatusIndicator
        earned={displayDailyEarned}
        isNearCap={isNearCap}
        isLowBalance={isLowBalance}
      />
    </View>
  );
};

export default TimeBankBalanceModal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  contentContainer: {
    backgroundColor: Colors.background.primary,
    borderTopLeftRadius: BorderRadius.xl,
    borderTopRightRadius: BorderRadius.xl,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    paddingBottom: Spacing["2xl"],
    maxHeight: "85%",
  },
  title: {
    fontFamily: Typography.fontFamily.brandBold,
    fontSize: Typography.fontSize["3xl"],
    color: Colors.text.primary,
    textAlign: "center",
    marginTop: Spacing.xl,
    marginBottom: Spacing.lg,
  },
  balanceSection: {
    alignItems: "center",
    marginBottom: Spacing["2xl"],
  },
  balanceLabel: {
    fontFamily: Typography.fontFamily.brandMedium,
    fontSize: Typography.fontSize.lg,
    color: Colors.text.secondary,
    marginBottom: Spacing.sm,
  },
  balanceGradientWrapper: {
    alignItems: "center",
    justifyContent: "center",
  },
  balanceAmount: {
    fontFamily: Typography.fontFamily.brandBold,
    fontSize: 60,
    color: "black", // Text color for the mask (will be replaced by gradient)
    fontWeight: Typography.fontWeight.bold,
  },
  balanceUnit: {
    fontFamily: Typography.fontFamily.brand,
    fontSize: Typography.fontSize.lg,
    color: Colors.text.tertiary,
  },
  progressSection: {
    marginBottom: Spacing.lg,
  },
  progressLabelContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: Spacing.sm,
  },
  progressLabel: {
    fontFamily: Typography.fontFamily.brandMedium,
    fontSize: Typography.fontSize.base,
    color: Colors.text.secondary,
  },
  progressPercentage: {
    fontFamily: Typography.fontFamily.brandMedium,
    fontSize: Typography.fontSize.base,
    color: Colors.text.secondary,
  },
  progressBarContainer: {
    height: 14,
    backgroundColor: Colors.background.secondary,
    borderRadius: BorderRadius.full,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    borderRadius: BorderRadius.full,
  },
});
