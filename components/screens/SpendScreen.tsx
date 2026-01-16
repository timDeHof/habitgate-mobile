import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Alert,
  TouchableOpacity,
} from "react-native";
import { AppGrid } from "@/components/apps/AppGrid";
import { UnlockModal } from "@/components/UnlockModal";
import { AppSelectionModal } from "@/components/apps/AppSelectionModal";
import { AppDetailsModal } from "@/components/apps/AppDetailsModal";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTimeBankStore } from "@/store/timeBankStore";
import { useAppLockStore } from "@/store/appLockStore";
import { DistractingApp } from "@/data/apps";
import { Ionicons } from "@expo/vector-icons";

const Spend = () => {
  const { balance, deductBalance } = useTimeBankStore();
  const { unlockApp } = useAppLockStore();

  const [selectedApp, setSelectedApp] = useState<DistractingApp | null>(null);
  const [detailsApp, setDetailsApp] = useState<DistractingApp | null>(null);

  const [modalVisible, setModalVisible] = useState(false);
  const [selectionModalVisible, setSelectionModalVisible] = useState(false);
  const [detailsModalVisible, setDetailsModalVisible] = useState(false);

  const handleAppPress = (app: DistractingApp) => {
    setSelectedApp(app);
    setModalVisible(true);
  };

  const handleAppLongPress = (app: DistractingApp) => {
    setDetailsApp(app);
    setDetailsModalVisible(true);
  };

  const handleUnlock = (durationMinutes: number, cost: number) => {
    if (!selectedApp) return;

    if (balance < cost) {
      Alert.alert("Insufficient Funds", "You don't have enough time credits.");
      return;
    }

    const result = deductBalance(cost, "app_unlock", {
      appId: selectedApp.id,
      appName: selectedApp.name,
      duration: durationMinutes,
    });

    if (result.valid) {
      unlockApp(selectedApp.id, durationMinutes);
      setModalVisible(false);
      setSelectedApp(null);
    } else {
      Alert.alert("Error", result.error || "Transaction failed.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Time Bank</Text>
          <View style={styles.balanceCard}>
            <View>
              <Text style={styles.balanceLabel}>Available Balance</Text>
              <Text style={styles.balanceValue}>{balance} Credits</Text>
            </View>
            <View style={styles.iconContainer}>
              <Ionicons name="time" size={32} color="#2E7D32" />
            </View>
          </View>
        </View>

        <View style={styles.infoSection}>
          <Text style={styles.infoText}>
            Spend your earned time credits to unlock distracted apps. Each credit
            equals 1 minute of screen time.
          </Text>
        </View>

        <AppGrid
            onPressApp={handleAppPress}
            onLongPressApp={handleAppLongPress}
        />

        <TouchableOpacity
            style={styles.addAppButton}
            onPress={() => setSelectionModalVisible(true)}
        >
            <Ionicons name="add-circle" size={24} color="#2E7D32" />
            <Text style={styles.addAppText}>Add App to Vault</Text>
        </TouchableOpacity>

        <UnlockModal
          visible={modalVisible}
          app={selectedApp}
          onClose={() => {
            setModalVisible(false);
            setSelectedApp(null);
          }}
          onUnlock={handleUnlock}
        />

        <AppSelectionModal
            visible={selectionModalVisible}
            onClose={() => setSelectionModalVisible(false)}
        />

        <AppDetailsModal
            visible={detailsModalVisible}
            app={detailsApp}
            onClose={() => {
                setDetailsModalVisible(false);
                setDetailsApp(null);
            }}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FA",
  },
  content: {
    padding: 24,
    paddingBottom: 100,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#1a1a1a",
    marginBottom: 16,
  },
  balanceCard: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 24,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  balanceLabel: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
    fontWeight: "500",
  },
  balanceValue: {
    fontSize: 32,
    fontWeight: "800",
    color: "#2E7D32",
  },
  iconContainer: {
    width: 56,
    height: 56,
    backgroundColor: "#E8F5E9",
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
  },
  infoSection: {
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },
  addAppButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'white',
      padding: 16,
      borderRadius: 16,
      marginTop: 24,
      borderWidth: 1,
      borderColor: '#e0e0e0',
      borderStyle: 'dashed',
      gap: 8,
  },
  addAppText: {
      color: '#2E7D32',
      fontWeight: '600',
      fontSize: 16,
  }
});

export default Spend;
