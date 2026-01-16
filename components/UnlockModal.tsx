import React from "react";
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
import { useTimeBankStore } from "@/store/timeBankStore";

interface UnlockModalProps {
  visible: boolean;
  app: DistractingApp | null;
  onClose: () => void;
  onUnlock: (durationMinutes: number, cost: number) => void;
}

const DURATION_OPTIONS = [
  { label: "15 min", minutes: 15, cost: 15 },
  { label: "30 min", minutes: 30, cost: 30 },
  { label: "45 min", minutes: 45, cost: 45 },
  { label: "1 hour", minutes: 60, cost: 60 },
];

export const UnlockModal = ({
  visible,
  app,
  onClose,
  onUnlock,
}: UnlockModalProps) => {
  const { balance } = useTimeBankStore();

  if (!app) return null;

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
            <Text style={styles.title}>Unlock {app.name}</Text>
            <Text style={styles.subtitle}>
              Spend time credits to use this app
            </Text>
          </View>

          <View style={styles.balanceContainer}>
            <Text style={styles.balanceLabel}>Your Balance</Text>
            <Text style={styles.balanceValue}>{balance} TC</Text>
          </View>

          <View style={styles.optionsContainer}>
            {DURATION_OPTIONS.map((option) => {
                const canAfford = balance >= option.cost;
                return (
              <TouchableOpacity
                key={option.minutes}
                style={[
                    styles.optionButton,
                    !canAfford && styles.optionButtonDisabled
                ]}
                onPress={() => {
                    if(canAfford) onUnlock(option.minutes, option.cost)
                }}
                disabled={!canAfford}
              >
                <View>
                  <Text style={[styles.optionTime, !canAfford && styles.textDisabled]}>{option.label}</Text>
                  <Text style={[styles.optionCost, !canAfford && styles.textDisabled]}>{option.cost} credits</Text>
                </View>
                <Ionicons
                    name="chevron-forward"
                    size={20}
                    color={canAfford ? "#666" : "#ccc"}
                />
              </TouchableOpacity>
            )})}
          </View>

          {/* Emergency Unlock Section - Show if balance is low < 15 */}
          {balance < 15 && (
            <View style={styles.emergencyContainer}>
                <Text style={styles.emergencyTitle}>Emergency Unlock</Text>
                <Text style={styles.emergencySubtitle}>Out of credits? Get 15 mins instantly.</Text>

                <View style={styles.emergencyButtons}>
                    <TouchableOpacity
                        style={[styles.emergencyButton, { backgroundColor: '#E3F2FD' }]}
                        onPress={() => Alert.alert("Watch Ad", "Playing 30s ad... (Mock)")}
                    >
                        <Ionicons name="videocam" size={20} color="#1565C0" />
                        <Text style={[styles.emergencyBtnText, { color: '#1565C0' }]}>Watch Ad</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                         style={[styles.emergencyButton, { backgroundColor: '#FFF3E0' }]}
                         onPress={() => Alert.alert("Payment", "Cost: $0.99 for 15 mins. (Mock)")}
                    >
                        <Ionicons name="card" size={20} color="#E65100" />
                        <Text style={[styles.emergencyBtnText, { color: '#E65100' }]}>Pay $0.99</Text>
                    </TouchableOpacity>
                </View>
            </View>
          )}

          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Cancel</Text>
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
    shadowOffset: {
      width: 0,
      height: 2,
    },
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
  balanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 12,
    marginBottom: 16,
  },
  balanceLabel: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  balanceValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2E7D32',
  },
  optionsContainer: {
    width: "100%",
    marginBottom: 16,
    gap: 12,
  },
  optionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 12,
    backgroundColor: "white",
  },
  optionButtonDisabled: {
      backgroundColor: '#f5f5f5',
      borderColor: '#eee',
      opacity: 0.7,
  },
  textDisabled: {
      color: '#999',
  },
  optionTime: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1a1a1a",
    marginBottom: 2,
  },
  optionCost: {
    fontSize: 12,
    color: "#666",
  },
  closeButton: {
    padding: 12,
  },
  closeButtonText: {
    fontSize: 16,
    color: "#666",
    fontWeight: "500",
  },
  emergencyContainer: {
      width: '100%',
      paddingTop: 16,
      borderTopWidth: 1,
      borderTopColor: '#f0f0f0',
      marginBottom: 16,
  },
  emergencyTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: '#D32F2F',
      marginBottom: 4,
  },
  emergencySubtitle: {
      fontSize: 12,
      color: '#666',
      marginBottom: 12,
  },
  emergencyButtons: {
      flexDirection: 'row',
      gap: 12,
  },
  emergencyButton: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 12,
      borderRadius: 12,
      gap: 6,
  },
  emergencyBtnText: {
      fontWeight: '600',
      fontSize: 14,
  }
});
