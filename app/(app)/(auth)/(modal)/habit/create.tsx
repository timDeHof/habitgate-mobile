import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { Colors, Typography, Spacing, BorderRadius } from "@/constants";
import { useHabitsStore } from "@/store/habitsStore";

const categories = ["physical", "mental", "creative", "social", "productive"];

export default function CreateHabitModal() {
  const router = useRouter();
  const { addHabit } = useHabitsStore();

  const [name, setName] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("physical");
  const [rewardAmount, setRewardAmount] = useState("15");
  const [isCreating, setIsCreating] = useState(false);

  // Animation values
  const modalScale = useSharedValue(0.8);
  const modalOpacity = useSharedValue(0);

  useEffect(() => {
    // Entrance animation
    modalScale.value = withSpring(1, { damping: 15, stiffness: 150 });
    modalOpacity.value = withTiming(1, { duration: 200 });
  }, []);

  const modalAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: modalScale.value }],
    opacity: modalOpacity.value,
  }));

  const handleCreate = async () => {
    if (!name.trim()) return;

    setIsCreating(true);

    // Simulate creation process
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Create habit
    addHabit({
      name: name.trim(),
      category: selectedCategory as any,
      rewardAmount: parseInt(rewardAmount) || 15,
      difficulty: "medium",
      verificationMethod: "manual",
      frequencyType: "daily",
      icon: {
        type: "vector",
        library: "Ionicons",
        name: "checkmark-circle",
        size: 24,
        color: Colors.primary[500],
      },
      isActive: true,
    });

    setIsCreating(false);
    router.back();
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.modalContainer, modalAnimatedStyle]}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={handleCancel}
            style={styles.closeButton}
            accessibilityLabel="Close"
            accessibilityRole="button"
            accessible={true}
          >
            <Ionicons name="close" size={24} color={Colors.text.secondary} />
          </TouchableOpacity>
          <Text style={styles.title}>Create Habit</Text>
          <View style={styles.placeholder} />
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Habit Name */}
          <View style={styles.section}>
            <Text style={styles.label}>Habit Name</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="e.g., Morning workout, Read for 30 minutes"
              placeholderTextColor={Colors.text.tertiary}
            />
          </View>

          {/* Category */}
          <View style={styles.section}>
            <Text style={styles.label}>Category</Text>
            <View style={styles.categoryGrid}>
              {categories.map((category) => (
                <TouchableOpacity
                  key={category}
                  style={[
                    styles.categoryButton,
                    selectedCategory === category &&
                      styles.categoryButtonSelected,
                  ]}
                  onPress={() => setSelectedCategory(category)}
                >
                  <Text
                    style={[
                      styles.categoryText,
                      selectedCategory === category &&
                        styles.categoryTextSelected,
                    ]}
                  >
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Reward Amount */}
          <View style={styles.section}>
            <Text style={styles.label}>Time Reward (minutes)</Text>
            <TextInput
              style={styles.input}
              value={rewardAmount}
              onChangeText={setRewardAmount}
              placeholder="15"
              keyboardType="numeric"
              placeholderTextColor={Colors.text.tertiary}
            />
          </View>
        </ScrollView>

        {/* Create Button */}
        <TouchableOpacity
          style={[
            styles.createButton,
            isCreating && styles.createButtonDisabled,
            !name.trim() && styles.createButtonDisabled,
          ]}
          onPress={handleCreate}
          disabled={isCreating || !name.trim()}
        >
          <Text style={styles.createButtonText}>
            {isCreating ? "Creating..." : "Create Habit"}
          </Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.primary,
  },
  modalContainer: {
    flex: 1,
    padding: Spacing.lg,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: Spacing.lg,
    paddingTop: Spacing.md,
  },
  closeButton: {
    padding: Spacing.xs,
  },
  title: {
    fontFamily: Typography.fontFamily.brandBold,
    fontSize: Typography.fontSize["2xl"],
    color: Colors.text.primary,
  },
  placeholder: {
    width: 32,
  },
  content: {
    flex: 1,
  },
  section: {
    marginBottom: Spacing.xl,
  },
  label: {
    fontFamily: Typography.fontFamily.brandSemibold,
    fontSize: Typography.fontSize.base,
    color: Colors.text.primary,
    marginBottom: Spacing.sm,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.gray[300],
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    fontSize: Typography.fontSize.base,
    color: Colors.text.primary,
    backgroundColor: Colors.background.primary,
  },
  categoryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.sm,
  },
  categoryButton: {
    backgroundColor: Colors.background.secondary,
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderWidth: 2,
    borderColor: "transparent",
  },
  categoryButtonSelected: {
    backgroundColor: Colors.primary[100],
    borderColor: Colors.primary[600],
  },
  categoryText: {
    fontFamily: Typography.fontFamily.brandMedium,
    fontSize: Typography.fontSize.sm,
    color: Colors.text.secondary,
  },
  categoryTextSelected: {
    color: Colors.primary[700],
    fontFamily: Typography.fontFamily.brandSemibold,
  },
  createButton: {
    backgroundColor: Colors.primary[600],
    borderRadius: BorderRadius.lg,
    paddingVertical: Spacing.md,
    alignItems: "center",
    marginBottom: Spacing["3xl"],
  },
  createButtonDisabled: {
    opacity: 0.6,
  },
  createButtonText: {
    fontFamily: Typography.fontFamily.brandBold,
    fontSize: Typography.fontSize.lg,
    color: Colors.text.inverse,
  },
});
