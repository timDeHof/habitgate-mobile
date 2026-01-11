import { View, Text, StyleSheet } from "react-native";
import React from "react";
import { Colors, Typography, Spacing, BorderRadius } from "@/constants";

interface DailyStatsGridProps {
  earned: number;
  remaining: number;
}

const DailyStatsGrid = ({
  earned,
  remaining,
}: DailyStatsGridProps): React.ReactElement => {
  return (
    <View style={styles.gridContainer}>
      {/* Earned Card */}
      <View style={[styles.statCard, styles.earnedCard]}>
        <Text style={styles.statLabel}>Today Earned</Text>
        <Text style={styles.statValue}>{earned}</Text>
        <Text style={styles.statUnit}>minutes</Text>
      </View>

      {/* Remaining Card */}
      <View style={[styles.statCard, styles.remainingCard]}>
        <Text style={styles.statLabel}>Remaining</Text>
        <Text style={styles.statValue}>{remaining}</Text>
        <Text style={styles.statUnit}>minutes</Text>
      </View>
    </View>
  );
};

export default DailyStatsGrid;

const styles = StyleSheet.create({
  gridContainer: {
    flexDirection: "row",
    gap: Spacing.md,
    marginBottom: Spacing.lg,
  },
  statCard: {
    flex: 1,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    alignItems: "center",
    justifyContent: "center",
  },
  earnedCard: {
    backgroundColor: Colors.success[100],
    borderWidth: 2,
    borderColor: Colors.success[500],
  },
  remainingCard: {
    backgroundColor: Colors.warning[100],
    borderWidth: 2,
    borderColor: Colors.warning[500],
  },
  statLabel: {
    fontFamily: Typography.fontFamily.brandMedium,
    fontSize: Typography.fontSize.sm,
    color: Colors.text.secondary,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: Spacing.sm,
  },
  statValue: {
    fontFamily: Typography.fontFamily.brandBold,
    fontSize: Typography.fontSize["4xl"],
    color: Colors.text.primary,
    marginBottom: Spacing.xs,
  },
  statUnit: {
    fontFamily: Typography.fontFamily.brand,
    fontSize: Typography.fontSize.sm,
    color: Colors.text.tertiary,
  },
});
