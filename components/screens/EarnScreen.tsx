// app/(tabs)/earn.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useRouter } from "expo-router";
import { useHabitsStore } from "@/store/habitsStore";
import { HabitCard } from "@/components/habits/HabitCard";
import {
  Colors,
  Typography,
  Spacing,
  BorderRadius,
  Shadows,
} from "@/constants";

export default function EarnScreen() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const router = useRouter();
  const habits = useHabitsStore((state) => state.habits);

  const categories = [
    "all",
    "physical",
    "mental",
    "creative",
    "social",
    "productive",
  ];

  const filteredHabits =
    selectedCategory === "all"
      ? habits
      : habits.filter((h) => h.category === selectedCategory);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.title}>Earn Time</Text>
        </View>

        {/* Category Filter */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filterScroll}
        >
          {categories.map((category) => (
            <Pressable
              key={category}
              onPress={() => setSelectedCategory(category)}
              style={[
                styles.filterChip,
                selectedCategory === category && styles.filterChipActive,
              ]}
            >
              <Text
                style={[
                  styles.filterText,
                  selectedCategory === category && styles.filterTextActive,
                ]}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      {/* Habit List */}
      <ScrollView style={styles.content}>
        {filteredHabits.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>🎯</Text>
            <Text style={styles.emptyTitle}>No habits yet</Text>
            <Text style={styles.emptyDescription}>
              Create your first habit to start earning time credits!
            </Text>
            <Pressable
              style={styles.createButton}
              onPress={() => router.push("/(app)/(auth)/(modal)/habit/create")}
            >
              <Text style={styles.createButtonText}>Create Habit</Text>
            </Pressable>
          </View>
        ) : (
          filteredHabits.map((habit) => (
            <HabitCard
              key={habit.id}
              habit={habit}
              onPress={() => {
                // TODO: Implement navigation to HabitDetail screen - [GAM-123]
                // router.push(`/(app)/(auth)/(tabs)/habit/${habit.id}`);
              }}
            />
          ))
        )}
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity
        activeOpacity={0.8}
        style={styles.fab}
        onPress={() => router.push("/(app)/(auth)/(modal)/habit/create")}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.gray[50],
  },
  header: {
    paddingTop: 48,
    paddingBottom: Spacing.md,
    paddingHorizontal: Spacing.md,
    backgroundColor: Colors.background.primary,
  },
  headerTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: Spacing.md,
  },
  title: {
    fontSize: Typography.fontSize["2xl"],
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text.primary,
  },
  filterScroll: {
    marginHorizontal: -Spacing.md,
    paddingHorizontal: Spacing.md,
  },
  filterChip: {
    marginRight: Spacing.sm,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.gray[100],
  },
  filterChipActive: {
    backgroundColor: Colors.primary[500],
  },
  filterText: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text.secondary,
  },
  filterTextActive: {
    color: Colors.text.inverse,
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.md,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 48,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: Spacing.md,
  },
  emptyTitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text.primary,
    marginBottom: Spacing.sm,
  },
  emptyDescription: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text.secondary,
    textAlign: "center",
    marginBottom: Spacing.lg,
  },
  createButton: {
    backgroundColor: Colors.primary[500],
    borderRadius: BorderRadius.xl,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
  },
  createButtonText: {
    color: Colors.text.inverse,
    fontWeight: Typography.fontWeight.semibold,
  },
  fab: {
    position: "absolute",
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    backgroundColor: Colors.primary[500],
    borderRadius: BorderRadius.full,
    alignItems: "center",
    justifyContent: "center",
    ...Shadows.lg,
  },
  fabText: {
    fontSize: 32,
    color: Colors.text.inverse,
    fontWeight: Typography.fontWeight.bold,
  },
});
