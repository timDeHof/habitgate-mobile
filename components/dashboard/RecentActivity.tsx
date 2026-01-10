// components/dashboard/RecentActivity.tsx
import React from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { useTimeBankStore } from "@/store/timeBankStore";
import { TRANSACTIONS } from "@/data/timebank";
import {
  Colors,
  Typography,
  Spacing,
  BorderRadius,
  Shadows,
} from "@/constants";
import { formatDistanceToNow } from "date-fns";

/**
 * Safely formats a timestamp to a relative time string.
 * Handles null, undefined, invalid dates, and various timestamp formats.
 */
function formatTimestamp(
  timestamp: string | number | Date | null | undefined
): string {
  // Handle null/undefined
  if (timestamp == null) {
    return "";
  }

  let date: Date;

  // Handle different timestamp formats
  try {
    if (timestamp instanceof Date) {
      date = timestamp;
    } else if (typeof timestamp === "number") {
      // Treat as milliseconds (Unix timestamp)
      date = new Date(timestamp);
    } else if (typeof timestamp === "string") {
      // Try parsing as ISO string or standard date format
      date = new Date(timestamp);
    } else {
      return "";
    }

    // Validate the date
    if (isNaN(date.getTime())) {
      return "";
    }

    // Use formatDistanceToNow with error handling
    return formatDistanceToNow(date, { addSuffix: true });
  } catch {
    // Return empty string for any parsing/formatting errors
    return "";
  }
}

const RecentActivity = () => {
  const transactions = useTimeBankStore((state) => state.transactions);

  // Use dummy data for development/testing when store is empty
  const displayTransactions =
    transactions.length > 0 ? transactions : TRANSACTIONS;

  // Sort by timestamp (newest first) and take the 5 most recent
  const recentTransactions = [...displayTransactions]
    .sort((a, b) => b.timestamp - a.timestamp)
    .slice(0, 5);

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

  const getTransactionDescription = (tx: (typeof recentTransactions)[0]) => {
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

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Recent Activity</Text>

      <ScrollView style={styles.scrollView}>
        {recentTransactions.length === 0 ? (
          <Text style={styles.emptyText}>
            No activity yet. Complete your first habit!
          </Text>
        ) : (
          recentTransactions.map((tx) => (
            <View key={tx.id} style={styles.transactionItem}>
              <View style={styles.transactionLeft}>
                <Text style={styles.transactionIcon}>
                  {getTransactionIcon(tx.type)}
                </Text>
                <View style={styles.transactionInfo}>
                  <Text style={styles.transactionDescription}>
                    {getTransactionDescription(tx)}
                  </Text>
                  <Text style={styles.transactionTime}>
                    {formatTimestamp(tx.timestamp)}
                  </Text>
                </View>
              </View>
              <Text
                style={[
                  styles.transactionAmount,
                  tx.type === "earn" || tx.type === "bonus"
                    ? styles.amountEarn
                    : styles.amountSpend,
                ]}
              >
                {tx.amount >= 0 ? "+" : ""}
                {tx.amount}
              </Text>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
};
export default RecentActivity;

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.background.light,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    marginHorizontal: Spacing.md,
    marginTop: Spacing.md,
    ...Shadows.lg,
  },
  title: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text.primary,
    marginBottom: Spacing.md,
  },
  scrollView: {
    maxHeight: 256,
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
    borderBottomColor: Colors.gray[100],
  },
  transactionLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  transactionIcon: {
    fontSize: 24,
    marginRight: Spacing.sm,
  },
  transactionInfo: {
    flex: 1,
  },
  transactionDescription: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text.primary,
  },
  transactionTime: {
    fontSize: Typography.fontSize.xs,
    color: Colors.text.secondary,
  },
  transactionAmount: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.bold,
  },
  amountEarn: {
    color: Colors.success[500],
  },
  amountSpend: {
    color: Colors.warning[500],
  },
});
