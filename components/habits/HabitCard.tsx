// components/habits/HabitCard.tsx
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Link } from "expo-router";
import {
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
  FontAwesome5,
} from "@expo/vector-icons";
import { Habit, IconSpec, VectorIconLibrary } from "@/data/habits";
import {
  Colors,
  Typography,
  Spacing,
  BorderRadius,
  Shadows,
} from "@/constants";

interface HabitCardProps {
  habit: Habit;
  onPress?: () => void;
  onCompletePress?: () => void;
}

/**
 * Get the appropriate Expo vector icon component based on library name
 */
export function getIconComponent(library: VectorIconLibrary) {
  switch (library) {
    case "Ionicons":
      return Ionicons;
    case "MaterialCommunityIcons":
      return MaterialCommunityIcons;
    case "MaterialIcons":
      return MaterialIcons;
    case "FontAwesome5":
      return FontAwesome5;
    // Add more cases as needed for other libraries
    default:
      return Ionicons; // Default fallback
  }
}

export function renderIcon(iconSpec: IconSpec, size: number = 24) {
  if (iconSpec.type === "vector") {
    // Render vector icon using appropriate Expo icon library
    const IconComponent = getIconComponent(iconSpec.library);
    return (
      <IconComponent
        name={iconSpec.name}
        size={iconSpec.size || size}
        color={iconSpec.color || Colors.text.primary}
      />
    );
  } else {
    // For SVG icons, we'll use a fallback approach
    // In a real implementation, you would have a custom SVG component
    return (
      <Ionicons
        name="help-circle"
        size={iconSpec.size || size}
        color={iconSpec.color || Colors.text.primary}
      />
    );
  }
}

export function HabitCard({ habit, onPress, onCompletePress }: HabitCardProps) {
  const canComplete = !habit.completedToday && habit.completionCountToday < 3;

  return (
    <Link
      href={{
        pathname: "/(app)/(auth)/(modal)/habit/detail",
        params: { habitId: habit.id },
      }}
      asChild
    >
      <TouchableOpacity activeOpacity={0.7} style={styles.container}>
        <View style={styles.content}>
          {/* Left: Icon and Info */}
          <View style={styles.leftSection}>
            <View style={styles.iconContainer}>
              {renderIcon(habit.icon, 24)}
            </View>

            <View style={styles.infoContainer}>
              <Text style={styles.habitName}>{habit.name}</Text>
              <View style={styles.metaContainer}>
                <Text style={styles.category}>{habit.category}</Text>
                {habit.currentStreak > 0 && (
                  <View style={styles.streakContainer}>
                    <MaterialCommunityIcons
                      name="fire"
                      size={14}
                      color={Colors.accent[500]}
                      accessibilityLabel={`${habit.currentStreak} day streak`}
                    />
                    <Text style={styles.streakText}>
                      {habit.currentStreak} day streak
                    </Text>
                  </View>
                )}
              </View>
            </View>
          </View>

          {/* Right: Reward and Button */}
          <View style={styles.rightSection}>
            <Text style={styles.reward}>+{habit.rewardAmount} min</Text>

{canComplete ? (
  <TouchableOpacity
    onPress={() => {
      onCompletePress?.();
      router.push({
        pathname: "/(app)/(auth)/(modal)/habit/complete",
        params: { habitId: habit.id },
      });
    }}
    activeOpacity={0.8}
    style={styles.completeButton}
  >
    <Text style={styles.completeButtonText}>Complete</Text>
  </TouchableOpacity>
            ) : (
              <View style={styles.doneButton}>
                <Text style={styles.doneButtonText}>
                  {habit.completionCountToday >= 3 ? "Max reached" : "Done"}
                </Text>
              </View>
            )}
          </View>
        </View>
      </TouchableOpacity>
    </Link>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.background.primary,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    borderLeftWidth: 4,
    borderLeftColor: Colors.success[500],
    ...Shadows.md,
  },

  containerPressed: {
    opacity: 0.7,
  },

  content: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  leftSection: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },

  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.primary[100],
    justifyContent: "center",
    alignItems: "center",
    marginRight: Spacing.sm,
  },

  icon: {
    fontSize: 24,
  },

  infoContainer: {
    flex: 1,
  },

  habitName: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text.primary,
  },

  metaContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: Spacing.xs,
  },

  category: {
    fontSize: Typography.fontSize.xs,
    color: Colors.text.tertiary,
    marginRight: Spacing.sm,
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

  rightSection: {
    alignItems: "flex-end",
  },

  reward: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.success[500],
    marginBottom: Spacing.sm,
  },

  completeButton: {
    backgroundColor: Colors.success[500],
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },

  completeButtonText: {
    color: Colors.text.inverse,
    fontSize: Typography.fontSize.xs,
    fontWeight: Typography.fontWeight.semibold,
  },

  doneButton: {
    backgroundColor: Colors.gray[200],
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },

  doneButtonText: {
    color: Colors.text.tertiary,
    fontSize: Typography.fontSize.xs,
    fontWeight: Typography.fontWeight.semibold,
  },
});
