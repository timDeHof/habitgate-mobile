import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Pressable,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { DistractingApp } from "@/data/apps";
import { useAppLockStore } from "@/store/appLockStore";

interface AppDetailsModalProps {
  visible: boolean;
  app: DistractingApp | null;
  onClose: () => void;
}

export const AppDetailsModal = ({ visible, app, onClose }: AppDetailsModalProps) => {
  const { appUsageStats, removeMonitoredApp } = useAppLockStore();

  if (!app) return null;

  const stats = appUsageStats[app.id] || { unlockCount: 0, minutesUnlocked: 0 };

  const handleRemove = () => {
    Alert.alert(
      "Remove App",
      `Are you sure you want to remove ${app.name} from your vault?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: () => {
            removeMonitoredApp(app.id);
            onClose();
          }
        }
      ]
    );
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={styles.content}>
          <View style={styles.header}>
            <View style={[styles.iconContainer, { backgroundColor: app.color }]}>
              <Ionicons name={app.iconName as any} size={32} color="white" />
            </View>
            <Text style={styles.title}>{app.name}</Text>
            <Text style={styles.subtitle}>App Settings & Stats</Text>
          </View>

          <View style={styles.statsContainer}>
             <View style={styles.statBox}>
                <Ionicons name="key" size={24} color="#666" style={{ marginBottom: 4 }}/>
                <Text style={styles.statValue}>{stats.unlockCount}</Text>
                <Text style={styles.statLabel}>Unlocks</Text>
             </View>
             <View style={styles.statDivider} />
             <View style={styles.statBox}>
                <Ionicons name="hourglass" size={24} color="#666" style={{ marginBottom: 4 }}/>
                <Text style={styles.statValue}>{stats.minutesUnlocked}m</Text>
                <Text style={styles.statLabel}>Time Spent</Text>
             </View>
          </View>

          <View style={styles.configSection}>
             <Text style={styles.sectionHeader}>Configuration</Text>

             <View style={styles.configRow}>
                 <Text style={styles.configLabel}>Unlock Cost</Text>
                 <Text style={styles.configValue}>{app.unlockCost} credits</Text>
             </View>

             <View style={styles.configRow}>
                 <Text style={styles.configLabel}>Unlock Duration</Text>
                 <Text style={styles.configValue}>{app.unlockDuration} mins</Text>
             </View>

             <View style={styles.configRow}>
                 <Text style={styles.configLabel}>Strict Mode</Text>
                 <Text style={styles.configValue}>{app.isStrict ? "On" : "Off"}</Text>
             </View>
          </View>

          <View style={styles.actions}>
            <TouchableOpacity style={styles.removeButton} onPress={handleRemove}>
               <Ionicons name="trash-outline" size={20} color="#D32F2F" />
               <Text style={styles.removeButtonText}>Remove from Vault</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  content: {
    backgroundColor: "white",
    borderRadius: 24,
    padding: 24,
    width: "100%",
    maxWidth: 340,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  header: {
    alignItems: "center",
    marginBottom: 24,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1a1a1a",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
  },
  statsContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
      backgroundColor: '#f8f9fa',
      borderRadius: 16,
      padding: 16,
      marginBottom: 24,
  },
  statBox: {
      flex: 1,
      alignItems: 'center',
  },
  statDivider: {
      width: 1,
      height: 40,
      backgroundColor: '#e0e0e0',
      marginHorizontal: 16,
  },
  statValue: {
      fontSize: 20,
      fontWeight: 'bold',
      color: '#1a1a1a',
      marginBottom: 2,
  },
  statLabel: {
      fontSize: 12,
      color: '#666',
  },
  configSection: {
      width: '100%',
      marginBottom: 24,
  },
  sectionHeader: {
      fontSize: 14,
      fontWeight: '600',
      color: '#666',
      marginBottom: 12,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
  },
  configRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: '#f0f0f0',
  },
  configLabel: {
      fontSize: 16,
      color: '#1a1a1a',
  },
  configValue: {
      fontSize: 16,
      color: '#666',
      fontWeight: '500',
  },
  actions: {
      width: '100%',
      marginBottom: 16,
  },
  removeButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 16,
      borderRadius: 12,
      backgroundColor: '#FFEBEE',
      gap: 8,
  },
  removeButtonText: {
      color: '#D32F2F',
      fontWeight: '600',
      fontSize: 16,
  },
  closeButton: {
    padding: 12,
  },
  closeButtonText: {
    fontSize: 16,
    color: "#666",
    fontWeight: "500",
  },
});
