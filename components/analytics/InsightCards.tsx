import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Colors, Typography, Spacing, BorderRadius } from "@/constants";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { withOpacity } from "@/utils/formatting/colors";

interface InsightCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  color: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

export const SummaryStatCard = ({
  title,
  value,
  subtitle,
  icon,
  color,
  trend,
}: InsightCardProps) => {
  return (
    <View style={styles.card}>
      <View style={[styles.iconContainer, { backgroundColor: withOpacity(color, 0.12) }]}>
        <MaterialCommunityIcons name={icon} size={24} color={color} />
      </View>
      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.value}>{value}</Text>
        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      </View>
      {trend && (
        <View style={styles.trendContainer}>
          <MaterialCommunityIcons
            name={trend.isPositive ? "trending-up" : "trending-down"}
            size={16}
            color={trend.isPositive ? Colors.success[500] : Colors.error[500]}
          />
          <Text
            style={[
              styles.trendText,
              { color: trend.isPositive ? Colors.success[500] : Colors.error[500] },
            ]}
          >
            {trend.value}%
          </Text>
        </View>
      )}
    </View>
  );
};

export const StreakInsightCard = ({
  currentStreak,
  longestStreak,
}: {
  currentStreak: number;
  longestStreak: number;
}) => {
  return (
    <View style={[styles.card, styles.streakCard]}>
      <View style={styles.streakHeader}>
        <MaterialCommunityIcons name="fire" size={32} color={Colors.warning[500]} />
        <View>
          <Text style={styles.streakTitle}>Streak Master</Text>
          <Text style={styles.streakSubtitle}>Consistency is your superpower</Text>
        </View>
      </View>
      <View style={styles.streakStats}>
        <View style={styles.streakStatItem}>
          <Text style={styles.streakStatLabel}>Current</Text>
          <Text style={styles.streakStatValue}>{currentStreak} Days</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.streakStatItem}>
          <Text style={styles.streakStatLabel}>Longest</Text>
          <Text style={styles.streakStatValue}>{longestStreak} Days</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.background.primary,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.border.light,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginRight: Spacing.md,
  },
  content: {
    flex: 1,
  },
  title: {
    fontFamily: Typography.fontFamily.brandMedium,
    fontSize: Typography.fontSize.sm,
    color: Colors.text.secondary,
  },
  value: {
    fontFamily: Typography.fontFamily.brandBold,
    fontSize: Typography.fontSize.xl,
    color: Colors.text.primary,
    marginTop: 2,
  },
  subtitle: {
    fontFamily: Typography.fontFamily.brand,
    fontSize: Typography.fontSize.xs,
    color: Colors.text.tertiary,
    marginTop: 2,
  },
  trendContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.background.secondary,
    paddingHorizontal: Spacing.xs,
    paddingVertical: 4,
    borderRadius: BorderRadius.sm,
    gap: 2,
  },
  trendText: {
    fontFamily: Typography.fontFamily.brandSemibold,
    fontSize: Typography.fontSize.xs,
  },
  streakCard: {
    flexDirection: "column",
    alignItems: "stretch",
    backgroundColor: Colors.accent[50],
    borderColor: Colors.accent[200],
  },
  streakHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
    marginBottom: Spacing.lg,
  },
  streakTitle: {
    fontFamily: Typography.fontFamily.brandBold,
    fontSize: Typography.fontSize.lg,
    color: Colors.text.primary,
  },
  streakSubtitle: {
    fontFamily: Typography.fontFamily.brand,
    fontSize: Typography.fontSize.sm,
    color: Colors.text.secondary,
  },
  streakStats: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingVertical: Spacing.sm,
  },
  streakStatItem: {
    alignItems: "center",
  },
  streakStatLabel: {
    fontFamily: Typography.fontFamily.brandMedium,
    fontSize: Typography.fontSize.xs,
    color: Colors.text.tertiary,
    textTransform: "uppercase",
  },
  streakStatValue: {
    fontFamily: Typography.fontFamily.brandBold,
    fontSize: Typography.fontSize.xl,
    color: Colors.text.primary,
    marginTop: 4,
  },
  divider: {
    width: 1,
    height: "100%",
    backgroundColor: Colors.accent[200],
  },
});
