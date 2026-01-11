import React, { useState, useCallback } from "react";
import { StyleSheet, RefreshControl, Alert } from "react-native";
import TimeBankCard from "@/components/dashboard/TimeBankCard";
import { SafeAreaView } from "react-native-safe-area-context";
import RecentActivity from "@/components/dashboard/RecentActivity";
import Header from "@/components/ui/header";
import { Colors, Spacing } from "@/constants";
import Animated from "react-native-reanimated";
import QuickStats from "../dashboard/QuickStats";

export default function DashboardScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Handles pull-to-refresh action with proper error handling
   * Fetches latest dashboard data and updates state accordingly
   */
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    setError(null);

    try {
      // Simulate data fetch - in a real app, this would call actual API/services
      await fetchDashboardData();

      // If successful, you might want to show a success message
      // For now, we'll just log it
      console.log("Dashboard data refreshed successfully");
    } catch (err) {
      console.error("Failed to refresh dashboard data:", err);

      // Update error state for UI display
      setError("Failed to refresh data. Please try again.");

      // Show user-friendly error notification
      Alert.alert(
        "Refresh Failed",
        "Unable to fetch latest data. Please check your connection and try again.",
        [{ text: "OK" }]
      );
    } finally {
      // Always dismiss the refresh spinner regardless of outcome
      setRefreshing(false);
    }
  }, [setRefreshing]);

  /**
   * Mock function simulating dashboard data fetch
   * In a real implementation, this would call actual API endpoints or services
   */
  const fetchDashboardData = async () => {
    // Simulate network request with random failure for testing
    const shouldFail = Math.random() < 0.2; // 20% chance of failure for demo

    if (shouldFail) {
      throw new Error("Network request failed");
    }

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // In a real app, this would fetch actual data from:
    // - timeBankService.getBalance()
    // - timeBankService.getTransactions()
    // - habitsService.getRecentHabits()
    // - etc.
  };
  return (
    <SafeAreaView style={styles.container}>
      <Header title="Dashboard" />
      <Animated.ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <TimeBankCard />
        <QuickStats />
        <RecentActivity />
      </Animated.ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.primary,
  },
  scrollContent: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing["3xl"],
  },
});
