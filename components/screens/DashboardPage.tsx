import React from "react";
import { View, Text, StyleSheet } from "react-native";
import TimeBankCard from "@/components/dashboard/TimeBankCard";
import { SafeAreaView } from "react-native-safe-area-context";
import RecentActivity from "@/components/dashboard/RecentActivity";
import { Colors, Typography, Spacing } from "@/constants";
import Animated from "react-native-reanimated";

export default function DashboardScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Dashboard</Text>
      </View>
      <Animated.ScrollView>
        <TimeBankCard />
        <RecentActivity />
      </Animated.ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.primary,
    paddingTop: Spacing.lg + 24,
  },
  header: {
    paddingTop: 0,
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.md,
  },
  title: {
    fontSize: Typography.fontSize["2xl"],
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text.primary,
  },
});
