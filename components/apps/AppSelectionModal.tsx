import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Pressable,
  TextInput,
  FlatList,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { DistractingApp } from "@/data/apps";
import { useAppLockStore } from "@/store/appLockStore";

interface AppSelectionModalProps {
  visible: boolean;
  onClose: () => void;
}

export const AppSelectionModal = ({ visible, onClose }: AppSelectionModalProps) => {
  const { availableApps, monitoredApps, addMonitoredApp, isPremium, setPremium } = useAppLockStore();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredApps = availableApps.filter((app) =>
    app.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAdd = (app: DistractingApp) => {
    const result = addMonitoredApp(app.id);
    if (!result.success) {
      if (result.error?.includes("Premium")) {
        Alert.alert(
          "Limit Reached",
          "You can only lock 5 apps on the free tier.",
          [
            { text: "Cancel", style: "cancel" },
            { text: "Upgrade to Premium", onPress: () => {
                setPremium(true);
                Alert.alert("Success", "You are now a Premium user!");
            }}
          ]
        );
      } else {
        Alert.alert("Error", result.error || "Failed to add app");
      }
    }
  };

  const renderItem = ({ item }: { item: DistractingApp }) => {
    const isAdded = monitoredApps.some((a) => a.id === item.id);

    return (
      <View style={styles.appRow}>
        <View style={styles.appInfo}>
          <View style={[styles.iconContainer, { backgroundColor: item.color }]}>
             <Ionicons name={item.iconName as any} size={20} color="white" />
          </View>
          <Text style={styles.appName}>{item.name}</Text>
        </View>

        {isAdded ? (
          <View style={styles.addedBadge}>
            <Text style={styles.addedText}>Added</Text>
            <Ionicons name="checkmark" size={16} color="#2E7D32" />
          </View>
        ) : (
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => handleAdd(item)}
          >
            <Text style={styles.addButtonText}>Add</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  return (
    <Modal
      animationType="slide"
      presentationStyle="pageSheet"
      visible={visible}
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
            <Text style={styles.title}>Add Apps to Vault</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <Ionicons name="close-circle" size={30} color="#ccc" />
            </TouchableOpacity>
        </View>

        <View style={styles.searchContainer}>
            <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
            <TextInput
                style={styles.searchInput}
                placeholder="Search apps..."
                value={searchQuery}
                onChangeText={setSearchQuery}
                autoCorrect={false}
            />
        </View>

        <View style={styles.statusSection}>
            <Text style={styles.limitText}>
                {monitoredApps.length} / {isPremium ? "∞" : "5"} Apps Used
            </Text>
            {!isPremium && (
                <TouchableOpacity onPress={() => setPremium(true)}>
                    <Text style={styles.upgradeText}>Upgrade to Premium</Text>
                </TouchableOpacity>
            )}
        </View>

        <FlatList
          data={filteredApps}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          keyboardShouldPersistTaps="handled"
        />
      </SafeAreaView>
    </Modal>
  );
};
import { SafeAreaView } from "react-native-safe-area-context";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FA",
  },
  header: {
    padding: 24,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1a1a1a",
  },
  closeButton: {
      padding: 4,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    marginHorizontal: 24,
    paddingHorizontal: 16,
    height: 50,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  searchIcon: {
      marginRight: 12,
  },
  searchInput: {
      flex: 1,
      fontSize: 16,
      height: "100%",
  },
  statusSection: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingHorizontal: 24,
      marginBottom: 16,
  },
  limitText: {
      color: '#666',
      fontWeight: '500',
  },
  upgradeText: {
      color: '#2E7D32',
      fontWeight: '600',
  },
  listContent: {
      paddingHorizontal: 24,
      paddingBottom: 40,
  },
  appRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "white",
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  appInfo: {
      flexDirection: 'row',
      alignItems: 'center',
  },
  iconContainer: {
      width: 40,
      height: 40,
      borderRadius: 10,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 12,
  },
  appName: {
      fontSize: 16,
      fontWeight: '600',
      color: '#1a1a1a',
  },
  addButton: {
      backgroundColor: '#f0f0f0',
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 20,
  },
  addButtonText: {
      color: '#1a1a1a',
      fontWeight: '600',
      fontSize: 14,
  },
  addedBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
  },
  addedText: {
      color: '#2E7D32',
      fontWeight: '500',
      fontSize: 14,
  }
});
