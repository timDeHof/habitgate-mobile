import React from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import { Transaction } from "@/data/timebank";
import { Colors, Spacing, Typography, BorderRadius } from "@/constants";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

interface TransactionHistoryListProps {
  transactions: Transaction[];
}

const TransactionHistoryList = ({
  transactions,
}: TransactionHistoryListProps) => {
  const renderItem = ({ item }: { item: Transaction }) => {
    const isEarn =
      item.type === "earn" || item.type === "bonus" || item.sourceType === "emergency";
    const isSpend = item.type === "spend" || item.type === "penalty";

    // Determine icon and color
    let iconName: keyof typeof MaterialCommunityIcons.glyphMap = "circle-outline";
    let iconColor = Colors.text.primary;
    let amountColor = Colors.text.primary;
    let description = "Transaction";

    if (item.sourceType === "habit") {
      iconName = "check-circle-outline";
      iconColor = Colors.success[500];
      amountColor = Colors.success[500];
      description = item.metadata?.habitName || "Habit Completed";
    } else if (item.sourceType === "app_unlock") {
      iconName = "lock-open-outline";
      iconColor = Colors.primary[500];
      amountColor = Colors.text.primary;
      description = item.metadata?.appName ? `Unlocked ${item.metadata.appName}` : "App Unlocked";
    } else if (item.sourceType === "emergency") {
      iconName = "alert-circle-outline";
      iconColor = Colors.warning[500];
      amountColor = Colors.warning[500];
      description = "Emergency Unlock";
    } else if (item.sourceType === "bonus") {
      iconName = "star-outline";
      iconColor = Colors.accent[500];
      amountColor = Colors.success[500];
      description = "Bonus";
    } else if (item.sourceType === "streak") {
      iconName = "fire";
      iconColor = Colors.error[500];
      amountColor = Colors.success[500];
      description = "Streak Bonus";
    }

    const formattedDate = new Date(item.timestamp).toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });

    return (
      <View style={styles.transactionItem}>
        <View style={styles.iconContainer}>
            <MaterialCommunityIcons name={iconName} size={24} color={iconColor} />
        </View>
        <View style={styles.detailsContainer}>
          <Text style={styles.description}>{description}</Text>
          <Text style={styles.date}>{formattedDate}</Text>
        </View>
        <View style={styles.amountContainer}>
          <Text
            style={[
              styles.amount,
              { color: isEarn ? Colors.success[600] : Colors.text.primary },
            ]}
          >
            {isEarn ? "+" : ""}
            {item.amount} min
          </Text>
        </View>
      </View>
    );
  };

  if (!transactions || transactions.length === 0) {
    return (
        <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No recent transactions</Text>
        </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Recent Activity</Text>
      <FlatList
        data={transactions}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        scrollEnabled={false} // Assuming it's inside a ScrollView
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: Spacing.xl,
    paddingHorizontal: Spacing.sm,
  },
  header: {
    fontFamily: Typography.fontFamily.brandBold,
    fontSize: Typography.fontSize.xl,
    color: Colors.text.primary,
    marginBottom: Spacing.md,
    marginLeft: Spacing.xs,
  },
  listContent: {
    gap: Spacing.md,
  },
  transactionItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.background.secondary, // Light gray/white depending on theme
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
  },
  iconContainer: {
    marginRight: Spacing.md,
    width: 32,
    alignItems: 'center',
  },
  detailsContainer: {
    flex: 1,
  },
  description: {
    fontFamily: Typography.fontFamily.brandMedium,
    fontSize: Typography.fontSize.base,
    color: Colors.text.primary,
    marginBottom: 2,
  },
  date: {
    fontFamily: Typography.fontFamily.brand,
    fontSize: Typography.fontSize.xs,
    color: Colors.text.tertiary,
  },
  amountContainer: {
    alignItems: "flex-end",
  },
  amount: {
    fontFamily: Typography.fontFamily.brandBold,
    fontSize: Typography.fontSize.base,
  },
  emptyContainer: {
      padding: Spacing.xl,
      alignItems: 'center',
  },
  emptyText: {
      color: Colors.text.tertiary,
      fontFamily: Typography.fontFamily.brand,
  }
});

export default TransactionHistoryList;
