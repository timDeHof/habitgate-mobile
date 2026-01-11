// components/dashboard/RecentActivity.tsx
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useTimeBankStore } from "@/store/timeBankStore";
import { TRANSACTIONS, Transaction } from "@/data/timebank";
import { Colors, Typography, Spacing } from "@/constants";
import { formatTimestamp } from "@/utils/formatting/time";

const getTransactionIcon = (type: string) => {
  switch (type) {
    case "earn":
      return "💚"; // Green heart for earning time
    case "bonus":
      return "⭐"; // Star for bonus time
    case "spend":
      return "⏰"; // Clock for spending time
    case "penalty":
      return "⚠️"; // Warning for penalty
    default:
      return "📌"; // Default pin for unknown types
  }
};

const getTransactionDescription = (tx: Transaction) => {
  switch (tx.type) {
    case "earn":
      if (tx.sourceType === "habit" && tx.metadata?.habitName) {
        return `Completed: ${tx.metadata.habitName}`;
      }
      return "Time earned";
    case "bonus":
      if (tx.metadata?.habitName) {
        return `Bonus: ${tx.metadata.habitName}`;
      }
      return "Bonus earned";
    case "spend":
      if (tx.sourceType === "app_unlock" && tx.metadata?.appName) {
        return `Unlocked: ${tx.metadata.appName}`;
      }
      return "Time spent";
    case "penalty":
      return "Penalty applied";
    default:
      return "Transaction";
  }
};

interface ActivityItemProps {
  transaction: Transaction;
}

const ActivityItem = ({ transaction }: ActivityItemProps) => {
  const isEarn = transaction.type === "earn" || transaction.type === "bonus";
  return (
    <View style={styles.transactionItem}>
      <View style={styles.transactionLeft}>
        <View
          style={[
            styles.transactionIcon,
            {
              backgroundColor: isEarn ? Colors.success[100] : Colors.error[100],
            },
          ]}
        >
          <Text style={styles.transactionEmoji}>
            {getTransactionIcon(transaction.type)}
          </Text>
        </View>
        <View style={styles.transactionInfo}>
          <Text style={styles.transactionDescription}>
            {getTransactionDescription(transaction)}
          </Text>
          <Text style={styles.transactionTime}>
            {formatTimestamp(transaction.timestamp)}
          </Text>
        </View>
      </View>
      <Text
        style={[
          styles.transactionAmount,
          isEarn ? styles.amountEarn : styles.amountSpend,
        ]}
      >
        {`${isEarn ? "+" : "-"}${Math.abs(transaction.amount)}`}
      </Text>
    </View>
  );
};

const RecentActivity = () => {
  const transactions = useTimeBankStore((state) => state.transactions);

  // Use dummy data for development/testing when store is empty
  const displayTransactions =
    transactions.length > 0 ? transactions : TRANSACTIONS;

  // Sort by timestamp (newest first) and take the 5 most recent
  const recentTransactions = [...displayTransactions]
    .sort((a, b) => b.timestamp - a.timestamp)
    .slice(0, 5);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Recent Activity</Text>
      {recentTransactions.length > 0 ? (
        <View style={styles.contentContainer}>
          {recentTransactions.map((tx) => (
            <ActivityItem key={tx.id} transaction={tx} />
          ))}
        </View>
      ) : (
        <Text style={styles.emptyText}>No recent activity</Text>
      )}
    </View>
  );
};

export default RecentActivity;

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.xl,
  },
  title: {
    fontFamily: Typography.fontFamily.brandBold,
    fontSize: Typography.fontSize.xl,
    color: Colors.text.primary,
    marginBottom: Spacing.md,
  },
  contentContainer: {
    gap: Spacing.sm,
  },
  emptyText: {
    color: Colors.text.secondary,
    textAlign: "center",
    paddingVertical: Spacing.xl,
  },
  transactionItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.light,
  },
  transactionLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  transactionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginRight: Spacing.sm,
  },
  transactionEmoji: {
    fontSize: 20,
  },
  transactionInfo: {
    flex: 1,
  },
  transactionDescription: {
    fontSize: Typography.fontSize.base,
    fontFamily: Typography.fontFamily.brandMedium,
    color: Colors.text.primary,
    marginBottom: Spacing.xs,
  },
  transactionTime: {
    fontFamily: Typography.fontFamily.brandMedium,
    fontSize: Typography.fontSize.sm,
    color: Colors.text.tertiary,
  },
  transactionAmount: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.bold,
  },
  amountEarn: {
    color: Colors.success[500],
  },
  amountSpend: {
    color: Colors.error[500],
  },
});
