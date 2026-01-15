import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SectionListData,
} from "react-native";
import { useHabitsStore } from "@/store/habitsStore";
import {
  Colors,
  Typography,
  Spacing,
  BorderRadius,
  Shadows,
} from "@/constants";
import Ionicons from "@expo/vector-icons/Ionicons";
import { HabitCard } from "../habits/HabitCard";
import { Habit } from "@/data/habits";

interface HabitSection {
  title: string;
  data: Habit[];
}

const TodayHabits = () => {
  const [showAll, setShowAll] = useState(false);
  const { habits, completeHabit, addHabit } = useHabitsStore();

  // Show only 2 habits initially, or all habits if showAll is true
  const displayedHabits = showAll ? habits : habits.slice(0, 2);

  // Structure data for SectionList
  const sections: HabitSection[] = [
    {
      title: "Today's Habits",
      data: displayedHabits,
    },
  ];

  const renderHabit = ({ item }: { item: Habit }) => (
    <HabitCard habit={item} />
  );

  const renderSectionHeader = ({
    section: { title },
  }: {
    section: SectionListData<Habit, HabitSection>;
  }) => (
    <View style={styles.header}>
      <Text style={styles.title}>{title}</Text>
      <TouchableOpacity
        style={styles.seeAllButton}
        accessibilityLabel={
          showAll ? "Collapse habits list" : "View all habits"
        }
        accessibilityRole="button"
        accessibilityHint={
          showAll ? "Show fewer habits" : "Navigate to the complete habits list"
        }
        onPress={() => setShowAll(!showAll)}
      >
        <Text style={styles.seeAll}>{showAll ? "Show less" : "See all"}</Text>
        <Ionicons
          name={showAll ? "chevron-down" : "chevron-forward"}
          color={Colors.success[600]}
          size={20}
        />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {sections.map((section, sectionIndex) => (
        <View key={sectionIndex}>
          {renderSectionHeader({ section })}
          {section.data.map((item) => (
            <View key={item.id}>{renderHabit({ item })}</View>
          ))}
        </View>
      ))}
    </View>
  );
};

export default TodayHabits;
const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.md,
    paddingHorizontal: Spacing.xs,
    backgroundColor: Colors.background.primary,
  },
  title: {
    fontFamily: Typography.fontFamily.brandBold,
    fontSize: Typography.fontSize["2xl"],
    color: Colors.text.primary,
  },
  seeAll: {
    fontSize: 14,
    color: Colors.success[600],
    fontFamily: Typography.fontFamily.brand,
    fontWeight: "bold",
  },
  seeAllButton: {
    padding: Spacing.xs,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.sm,
    backgroundColor: Colors.success[100],
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  habitCard: {
    width: "100%",
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#fff",
    marginVertical: 8,
    elevation: 2,
    ...Shadows.md,
  },
  habitsList: {
    paddingHorizontal: Spacing.xs,
    gap: Spacing.lg,
  },
  sectionHeaderContainer: {
    backgroundColor: Colors.background.primary,
    paddingTop: Spacing.md,
  },
  cardHeader: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.md,
  },
  metaDataContainer: {
    flexDirection: "column",
    alignItems: "flex-start",
    flex: 1,
    marginLeft: Spacing.sm,
  },
  category: {
    fontSize: Typography.fontSize.xs,
    color: Colors.text.secondary,
  },
  habitIcon: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.primary[100],
    justifyContent: "center",
    alignItems: "center",
    marginRight: Spacing.md,
  },
  habitInfo: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.md,
  },
  habitName: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text.primary,
  },
  habitReward: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.success[500],
  },
  streakContainer: {
    flexDirection: "row",
    alignItems: "center",
  },

  streakText: {
    fontSize: Typography.fontSize.xs,
    color: Colors.accent[500],
    marginLeft: Spacing.xs,
  },
});
