import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { DistractingApp } from "@/data/apps";
import { useAppLockStore } from "@/store/appLockStore";

interface AppGridProps {
  onPressApp: (app: DistractingApp) => void;
  onLongPressApp?: (app: DistractingApp) => void;
}

export const AppGrid = ({ onPressApp, onLongPressApp }: AppGridProps) => {
  const { monitoredApps, getRemainingTime, cleanupExpiredSessions } = useAppLockStore();
  const [now, setNow] = useState(Date.now());

  // Update timer every second
  useEffect(() => {
    const interval = setInterval(() => {
      setNow(Date.now());
      cleanupExpiredSessions();
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (seconds: number) => {
    if (seconds <= 0) return "";
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const renderItem = ({ item }: { item: DistractingApp }) => {
    const remainingSeconds = getRemainingTime(item.id);
    const isUnlocked = remainingSeconds > 0;

    return (
      <TouchableOpacity
        style={styles.itemContainer}
        onPress={() => onPressApp(item)}
        onLongPress={() => onLongPressApp?.(item)}
        delayLongPress={500}
      >
        <View style={styles.iconWrapper}>
          <View style={[styles.iconBg, { backgroundColor: item.color }]}>
            <Ionicons name={item.iconName as any} size={32} color="white" />
          </View>
          {!isUnlocked && (
            <View style={styles.lockBadge}>
              <Ionicons name="lock-closed" size={12} color="white" />
            </View>
          )}
        </View>
        <Text style={styles.appName} numberOfLines={1}>
          {item.name}
        </Text>
        <Text
          style={[
            styles.statusText,
            isUnlocked ? styles.unlockedText : styles.lockedText,
          ]}
        >
          {isUnlocked ? formatTime(remainingSeconds) : "Locked"}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Blocked Apps</Text>
      <FlatList
        data={monitoredApps}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        numColumns={3}
        scrollEnabled={false}
        columnWrapperStyle={styles.row}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
    color: "#1a1a1a",
  },
  row: {
    justifyContent: "flex-start",
    gap: 16,
    marginBottom: 16,
  },
  itemContainer: {
    width: "30%", // approx 3 columns
    alignItems: "center",
  },
  iconWrapper: {
    position: "relative",
    marginBottom: 8,
  },
  iconBg: {
    width: 64,
    height: 64,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  lockBadge: {
    position: "absolute",
    bottom: -4,
    right: -4,
    backgroundColor: "#FF5252",
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "white",
  },
  appName: {
    fontSize: 14,
    fontWeight: "500",
    color: "#1a1a1a",
    marginBottom: 2,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
  },
  lockedText: {
    color: "#999",
  },
  unlockedText: {
    color: "#2E7D32", // Green
    fontVariant: ["tabular-nums"],
  },
});
