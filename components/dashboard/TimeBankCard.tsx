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
import { Ionicons } from "@expo/vector-icons";

interface TimeBankCardProps {
  onPress?: () => void;
}

const TimeBankCard = ({ onPress }: TimeBankCardProps): React.ReactElement => {
  const { balance, dailyEarned, dailySpent } = useTimeBankStore(
    useShallow((state) => ({
      balance: state.balance,
      dailyEarned: state.dailyEarned,
      dailySpent: state.dailySpent,
    }))
  );

  // Use dummy initial values for development/testing when store is empty
  const displayBalance =
    balance > 0 ? balance : INITIAL_TIME_BANK_STATE.balance;
  const displayDailyEarned =
    dailyEarned > 0 || balance > 0
      ? dailyEarned
      : INITIAL_TIME_BANK_STATE.dailyEarned;
  const displayDailySpent = dailySpent ?? INITIAL_TIME_BANK_STATE.dailySpent;
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
            <Text style={styles.label}>Time Bank</Text>
            <View style={styles.timeContainer}>
              <Text style={styles.timeBankBalance}>{displayBalance}</Text>
              <Text style={styles.balanceUnit}>min</Text>
            </View>
          </View>
          <View style={styles.badgeContainer}>
            <View style={[styles.badge, styles.badgeEarn]}>
              <Ionicons name="arrow-up" color={Colors.success[500]} size={16} />
              <Text style={styles.badgeEarnText}>
                + {displayDailyEarned} today
              </Text>
            </View>
            <View style={[styles.badge, styles.badgeSpent]}>
              <Text style={styles.badgeSpentText}>
                - {displayDailySpent} today
              </Text>
            </View>
          </View>

          {/* Warning Banners */}
          {isNearCap && (
            <View style={styles.warningBannerCritical}>
              <Text style={styles.warningTextCritical}>
                Only {remainingCapacity} minutes left until daily cap! Complete
                habits now!
              </Text>
            </View>
          )}

          {isLowBalance && !isNearCap && (
            <View style={styles.warningBanner}>
              <Ionicons
                name="warning-sharp"
                size={18}
                color={Colors.warning[100]}
              />
              <Text style={styles.warningText}>
                Low balance! Complete habits to earn more time.
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
  timeContainer: {
    flex: 1,
    flexDirection: "row",
    gap: Spacing.md,
    alignItems: "center",
  },
  timeBankBalance: {
    fontFamily: Typography.fontFamily.brandBold,
    fontSize: Typography.fontSize["5xl"],
    color: "rgba(255, 255, 255, 0.9)",
  },
  balanceUnit: {
    fontFamily: Typography.fontFamily.brandBold,
    fontSize: Typography.fontSize["4xl"],
    textTransform: "uppercase",
    color: "rgba(255, 255, 255, 0.9)",
  },
  warningBanner: {
    backgroundColor: Colors.warning[500],
    flexDirection: "row",
    gap: Spacing.sm,
    alignItems: "center",
    padding: Spacing.sm,
    marginTop: Spacing.sm,
    marginLeft: -Spacing.lg,
    marginRight: -Spacing.lg,
  },
  warningText: {
    color: Colors.warning[100],
    fontSize: Typography.fontSize.sm,
    textAlign: "center",
    fontWeight: Typography.fontWeight.semibold,
  },
  warningBannerCritical: {
    backgroundColor: Colors.error[500],
    flexDirection: "row",
    gap: Spacing.sm,
    alignItems: "center",
    padding: Spacing.sm,
    marginBottom: Spacing.sm,
    marginLeft: -Spacing.lg,
    marginRight: -Spacing.lg,
  },
  warningTextCritical: {
    color: Colors.error[100],
    fontSize: Typography.fontSize.sm,
    textAlign: "center",
    fontWeight: Typography.fontWeight.semibold,
  },
  badgeContainer: {
    width: "100%",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    flexDirection: "row",
    marginBottom: Spacing.lg,
    gap: 1.5,
  },
  badge: {
    width: 120,
    flexDirection: "row",
    gap: Spacing.xs,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: BorderRadius.full,
  },
  badgeEarn: {
    backgroundColor: Colors.success[100],
  },
  badgeEarnText: {
    color: Colors.success[500],
    fontFamily: Typography.fontFamily.brandSemibold,
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.semibold,
  },
  badgeSpent: {
    paddingHorizontal: 0,
    paddingVertical: 0,
    borderRadius: "none",
  },
  badgeSpentText: {
    color: "rgba(255,255,255, 0.9)",
    fontFamily: Typography.fontFamily.brandSemibold,
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.semibold,
  },
});
