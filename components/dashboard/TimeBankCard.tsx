import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import React from "react";
import { Link } from "expo-router";
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

interface TimeBankCardProps {
  onPress?: () => void;
}

const TimeBankCard = ({ onPress }: TimeBankCardProps): React.ReactElement => {
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

  // Compute remaining daily capacity inline for consistency
  const remainingCapacity = Math.max(DAILY_EARNING_CAP - displayDailyEarned, 0);
  const isLowBalance = displayBalance < CRITICAL_BALANCE;
  // Show warning when remaining capacity is at or below threshold
  const isNearCap =
    remainingCapacity <= NEAR_CAP_THRESHOLD && remainingCapacity > 0;
  return (
    <Link href={"/(app)/(auth)/(modal)/timeBankBalance"} asChild>
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.8}
        style={styles.container}
      >
        <LinearGradient
          colors={["#3B82F6", "#14B8A6", "#10B981"]}
          style={styles.timeBankGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          {/* Balance Display */}
          <View style={styles.balanceContainer}>
            <Text style={styles.label}>Time Bank Balance</Text>
            <Text style={styles.timeBankBalance}>{displayBalance}</Text>
            <Text style={styles.balance}>minutes</Text>
          </View>

          {/* Warning Banners */}
          {isNearCap && (
            <View style={styles.warningBannerCritical}>
              <Text style={styles.warningTextCritical}>
                ⚠️ Only {remainingCapacity} minutes left until daily cap!
                Complete habits now!
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
        </LinearGradient>
      </TouchableOpacity>
    </Link>
  );
};

export default TimeBankCard;

const styles = StyleSheet.create({
  container: {
    borderRadius: BorderRadius.xl,
    overflow: "hidden",
    marginHorizontal: Spacing.md,
    marginTop: Spacing.md,
    ...Shadows.lg,
  },
  timeBankGradient: {
    padding: Spacing.lg,
  },
  balanceContainer: {
    alignItems: "center",
    marginBottom: Spacing.md,
  },
  label: {
    fontFamily: Typography.fontFamily.brandMedium,
    fontSize: Typography.fontSize.base,
    color: "rgba(255,255,255, 0.9)",
    marginBottom: Spacing.xs,
  },
  timeBankBalance: {
    fontFamily: Typography.fontFamily.brandBold,
    fontSize: Typography.fontSize["5xl"],
    color: "rgba(255, 255, 255, 0.9)",
    marginBottom: Spacing.md,
  },
  balance: {
    fontFamily: Typography.fontFamily.brandBold,
    fontSize: Typography.fontSize["5xl"],
    color: "rgba(255, 255, 255, 0.9)",
  },
  warningBanner: {
    backgroundColor: Colors.error[500],
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
    backgroundColor: Colors.error[500],
    borderRadius: BorderRadius.md,
    padding: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  warningTextCritical: {
    color: Colors.error[500],
    fontSize: Typography.fontSize.sm,
    textAlign: "center",
    fontWeight: Typography.fontWeight.semibold,
  },
});
