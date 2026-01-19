import React from "react";
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  Switch,
  Pressable,
  Alert,
} from "react-native";
import { useSettingsStore } from "@/store/settingsStore";
import { useTimeBankStore } from "@/store/timeBankStore";
import { Colors, Spacing, Typography, BorderRadius, Shadows } from "@/constants";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useShallow } from "zustand/react/shallow";
import { clearAllStorage } from "@/store/zustandStorage";
import * as Updates from "expo-updates";
import Constants from "expo-constants";
import { withOpacity } from "@/utils/formatting/colors";

const SettingRow = ({
  label,
  icon,
  value,
  onValueChange,
  type = "toggle",
  color = Colors.primary[500],
}: {
  label: string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  value?: boolean;
  onValueChange?: (value: boolean) => void;
  type?: "toggle" | "link" | "danger";
  color?: string;
}) => (
  <View style={styles.settingRow}>
    <View style={[styles.iconContainer, { backgroundColor: withOpacity(color, 0.12) }]}>
      <MaterialCommunityIcons name={icon} size={22} color={color} />
    </View>
    <Text style={[styles.settingLabel, type === "danger" && { color: Colors.error[500] }]}>
      {label}
    </Text>
    {type === "toggle" && (
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: Colors.gray[200], true: Colors.primary[500] }}
        thumbColor={value ? Colors.primary[500] : Colors.gray[400]}
      />
    )}
    {(type === "link" || type === "danger") && (
      <MaterialCommunityIcons
        name="chevron-right"
        size={24}
        color={type === "danger" ? Colors.error[500] : Colors.gray[400]}
      />
    )}
  </View>
);

const SettingsScreen = () => {
  const { preferences, setPreference } = useSettingsStore(
    useShallow((state) => ({
      preferences: state.preferences,
      setPreference: state.setPreference,
    }))
  );

  const { resetAll } = useTimeBankStore(
    useShallow((state) => ({
      resetAll: state.resetAll,
    }))
  );

  const appName = Constants.expoConfig?.name ?? "HabitGate";
  const appVersion = Constants.expoConfig?.version ? `v${Constants.expoConfig.version}` : "";
  const appSlug = Constants.expoConfig?.slug ?? "";

  const handleResetTimeBank = () => {
    Alert.alert(
      "Reset Time Bank",
      "This will reset your daily counters and balances. This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Reset",
          style: "destructive",
          onPress: () => {
            resetAll();
            Alert.alert("Success", "Time bank has been reset.");
          },
        },
      ]
    );
  };

  const handleClearAllData = () => {
    Alert.alert(
      "Clear All Data",
      "This will permanently delete all your data and settings. The app will restart.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Clear All",
          style: "destructive",
          onPress: async () => {
            try {
              await clearAllStorage();
              if (Updates.isEnabled) {
                await Updates.reloadAsync();
              } else {
                Alert.alert("Success", "Data cleared. Please restart the app manually to see changes.");
              }
            } catch (e) {
              console.error("Failed to clear data:", e);
              Alert.alert("Error", "Failed to clear some data. Please restart the app manually.");
            }
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>General</Text>
        <View style={styles.card}>
          <SettingRow
            label="Push Notifications"
            icon="bell-outline"
            value={preferences.notifications}
            onValueChange={(v) => setPreference("notifications", v)}
          />
          <View style={styles.divider} />
          <SettingRow
            label="Sound Effects"
            icon="volume-high"
            value={preferences.sound}
            onValueChange={(v) => setPreference("sound", v)}
          />
          <View style={styles.divider} />
          <SettingRow
            label="Vibration"
            icon="vibrate"
            value={preferences.vibration}
            onValueChange={(v) => setPreference("vibration", v)}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Mode</Text>
        <View style={styles.card}>
          <SettingRow
            label="Strict Mode"
            icon="lock-outline"
            value={preferences.strictMode}
            onValueChange={(v) => setPreference("strictMode", v)}
            color={Colors.error[500]}
          />
          <Text style={styles.description}>
            When strict mode is on, habit enforcement is more rigorous.
          </Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Data Management</Text>
        <View style={styles.card}>
          <Pressable
            onPress={handleResetTimeBank}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel="Reset Time Bank"
            accessibilityHint="Resets your daily counters and balances. This action is irreversible."
          >
            <SettingRow
              label="Reset Time Bank"
              icon="refresh"
              type="link"
              color={Colors.warning[500]}
            />
          </Pressable>
          <View style={styles.divider} />
          <Pressable
            onPress={handleClearAllData}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel="Clear All Data"
            accessibilityHint="Permanently deletes all your data and settings and restarts the app. This action is irreversible."
          >
            <SettingRow
              label="Clear All Data"
              icon="delete-outline"
              type="link"
              color={Colors.error[500]}
            />
          </Pressable>
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={styles.versionText}>
          {appName} {appVersion}
        </Text>
        {!!appSlug && <Text style={styles.slugText}>{appSlug}</Text>}
      </View>
    </ScrollView>
  );
};

export default SettingsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.primary,
  },
  content: {
    padding: Spacing.lg,
    paddingTop: Spacing.md,
  },
  section: {
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    fontFamily: Typography.fontFamily.brandBold,
    fontSize: Typography.fontSize.sm,
    color: Colors.text.secondary,
    textTransform: "uppercase",
    letterSpacing: 1.2,
    marginBottom: Spacing.sm,
    marginLeft: Spacing.xs,
  },
  card: {
    backgroundColor: Colors.background.secondary,
    borderRadius: BorderRadius.xl,
    overflow: "hidden",
    ...Shadows.sm,
  },
  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.md,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: BorderRadius.lg,
    alignItems: "center",
    justifyContent: "center",
    marginRight: Spacing.md,
  },
  settingLabel: {
    flex: 1,
    fontFamily: Typography.fontFamily.brandMedium,
    fontSize: Typography.fontSize.lg,
    color: Colors.text.primary,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.gray[200],
    marginLeft: Spacing.md + 36 + Spacing.md,
  },
  description: {
    padding: Spacing.md,
    paddingTop: 0,
    fontFamily: Typography.fontFamily.brandMedium,
    fontSize: Typography.fontSize.xs,
    color: Colors.text.secondary,
    lineHeight: 16,
  },
  footer: {
    alignItems: "center",
    marginTop: Spacing.xl,
    marginBottom: Spacing["2xl"],
  },
  versionText: {
    fontFamily: Typography.fontFamily.brandBold,
    fontSize: Typography.fontSize.sm,
    color: Colors.text.secondary,
  },
  slugText: {
    fontFamily: Typography.fontFamily.brandMedium,
    fontSize: Typography.fontSize.xs,
    color: Colors.text.tertiary,
  },
});
