import React, { useMemo } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors, Typography, Spacing, BorderRadius } from "@/constants";
import { useTimeBankStore } from "@/store/timeBankStore";
import { useHabitsStore } from "@/store/habitsStore";
import {
  getDailyActivity,
  getCategoryBreakdown,
  getBalanceTrend,
  getSummaryStats,
} from "@/utils/calculations/analytics";
import {
  ActivityBarChart,
  BalanceLineChart,
  CategoryPieChart,
} from "@/components/analytics/AnalyticsCharts";
import {
  SummaryStatCard,
  StreakInsightCard,
} from "@/components/analytics/InsightCards";
const LOOKBACK_DAYS = 7;

const AnalysisScreen = () => {
  const { transactions, balance, currentStreak, longestStreak } = useTimeBankStore();
  const { completions, habits } = useHabitsStore();

  const stats = useMemo(() => getSummaryStats(transactions), [transactions]);
  const dailyActivity = useMemo(
    () => getDailyActivity(transactions, LOOKBACK_DAYS),
    [transactions]
  );
  const categoryBreakdown = useMemo(
    () => getCategoryBreakdown(completions, habits),
    [completions, habits]
  );
  const balanceTrend = useMemo(
    () => getBalanceTrend(transactions, balance, LOOKBACK_DAYS),
    [transactions, balance]
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={styles.container}
        contentContainerStyle={styles.content}
      >
        <Text style={styles.header}>User Insights</Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Overview</Text>
          <View style={styles.statsGrid}>
            <SummaryStatCard
              title="Total Earned"
              value={`${stats.totalEarned} min`}
              icon="cash-plus"
              color={Colors.success[500]}
              trend={{ value: 12, isPositive: true }}
            />
            <SummaryStatCard
              title="Total Spent"
              value={`${stats.totalSpent} min`}
              icon="cash-minus"
              color={Colors.error[500]}
            />
            <SummaryStatCard
              title="Avg. Daily"
              value={`${stats.avgDailyEarning} min`}
              icon="chart-line"
              color={Colors.primary[500]}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Activity Trends</Text>
          <ActivityBarChart
            data={dailyActivity}
            title={`Daily Activity (Last ${LOOKBACK_DAYS} Days)`}
          />
          <BalanceLineChart data={balanceTrend} title="Balance Trend" />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Habit Breakdown</Text>
          <CategoryPieChart data={categoryBreakdown} title="Completions by Category" />
          <StreakInsightCard
            currentStreak={currentStreak}
            longestStreak={longestStreak}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background.secondary,
  },
  container: {
    flex: 1,
  },
  content: {
    padding: Spacing.md,
    paddingBottom: Spacing.xl * 2,
  },
  header: {
    fontFamily: Typography.fontFamily.brandBold,
    fontSize: Typography.fontSize["3xl"],
    color: Colors.text.primary,
    marginBottom: Spacing.xl,
  },
  section: {
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    fontFamily: Typography.fontFamily.brandSemibold,
    fontSize: Typography.fontSize.xl,
    color: Colors.text.primary,
    marginBottom: Spacing.md,
  },
  statsGrid: {
    gap: Spacing.sm,
  },
});

export default AnalysisScreen;
