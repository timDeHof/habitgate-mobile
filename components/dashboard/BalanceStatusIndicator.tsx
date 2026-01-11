import { View, Text, StyleSheet } from "react-native";
import React from "react";
import { Colors, Typography, Spacing, BorderRadius } from "@/constants";

interface BalanceStatusIndicatorProps {
  earned: number;
  isNearCap: boolean;
  isLowBalance: boolean;
}

const BalanceStatusIndicator = ({
  earned,
  isNearCap,
  isLowBalance,
}: BalanceStatusIndicatorProps): React.ReactElement => {
  let icon = "✓";
  let message = `Excellent progress! You've earned ${earned} minutes today. Keep it up!`;
  let backgroundColor = Colors.success[100];
  let borderColor = Colors.success[500];
  let textColor = Colors.success[600];

  if (isNearCap) {
    icon = "⚠️";
    message = `Only ${Math.max(
      180 - earned,
      0
    )} minutes left until daily cap! Complete habits now!`;
    backgroundColor = "#FEF3C7";
    borderColor = Colors.warning[500];
    textColor = "#92400E";
  } else if (isLowBalance) {
    icon = "⚠️";
    message = "Low balance! Complete habits to earn more time.";
    backgroundColor = Colors.error[100];
    borderColor = Colors.error[500];
    textColor = "#7F1D1D";
  }

  return (
    <View style={[styles.container, { backgroundColor, borderColor }]}>
      <Text style={[styles.icon, { color: textColor }]}>{icon}</Text>
      <Text style={[styles.message, { color: textColor }]}>{message}</Text>
    </View>
  );
};

export default BalanceStatusIndicator;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: BorderRadius.md,
    borderLeftWidth: 4,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  icon: {
    fontSize: Typography.fontSize.xl,
    marginRight: Spacing.sm,
  },
  message: {
    flex: 1,
    fontFamily: Typography.fontFamily.brand,
    fontSize: Typography.fontSize.base,
    lineHeight: 20,
  },
});
