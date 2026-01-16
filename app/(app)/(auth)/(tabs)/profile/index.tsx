import useUserStore from "@/hooks/use-userstore";
import { Button, Text, View, StyleSheet, ScrollView } from "react-native";
import { useTimeBankStore } from "@/store/timeBankStore";
import { useShallow } from "zustand/react/shallow";
import { Colors, Spacing, Typography, BorderRadius, Shadows } from "@/constants";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

const StatItem = ({ label, value, icon, color }: { label: string; value: string | number; icon: keyof typeof MaterialCommunityIcons.glyphMap; color: string }) => (
  <View style={styles.statItem}>
    <View style={[styles.iconContainer, { backgroundColor: color + "20" }]}>
      <MaterialCommunityIcons name={icon} size={24} color={color} />
    </View>
    <View>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  </View>
);

const Page = () => {
  const { setIsGuest } = useUserStore();
  const { lifetimeEarned, lifetimeSpent } = useTimeBankStore(
    useShallow((state) => ({
      lifetimeEarned: state.lifetimeEarned,
      lifetimeSpent: state.lifetimeSpent,
    }))
  );

  const netBalance = lifetimeEarned - lifetimeSpent;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Profile</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Lifetime Statistics</Text>
        <View style={styles.statsCard}>
          <StatItem
            label="Total Earned"
            value={`${lifetimeEarned}m`}
            icon="clock-plus-outline"
            color={Colors.success[500]}
          />
          <View style={styles.divider} />
          <StatItem
            label="Total Spent"
            value={`${lifetimeSpent}m`}
            icon="clock-remove-outline"
            color={Colors.error[500]}
          />
          <View style={styles.divider} />
          <StatItem
            label="Net Balance"
            value={`${netBalance > 0 ? "+" : ""}${netBalance}m`}
            icon="scale-balance"
            color={Colors.primary[500]}
          />
        </View>
      </View>

      <View style={styles.logoutContainer}>
        <Button title="Logout" onPress={() => setIsGuest(false)} color={Colors.error[500]} />
      </View>
    </ScrollView>
  );
};
export default Page;

const styles = StyleSheet.create({
  container: {
    padding: Spacing.lg,
    paddingTop: 60,
  },
  title: {
    fontFamily: Typography.fontFamily.brandBold,
    fontSize: Typography.fontSize["3xl"],
    color: Colors.text.primary,
    marginBottom: Spacing.xl,
    textAlign: "center",
  },
  section: {
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    fontFamily: Typography.fontFamily.brandBold,
    fontSize: Typography.fontSize.lg,
    color: Colors.text.primary,
    marginBottom: Spacing.md,
    marginLeft: Spacing.xs,
  },
  statsCard: {
    backgroundColor: Colors.background.secondary,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    ...Shadows.sm,
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: Spacing.sm,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.full,
    alignItems: "center",
    justifyContent: "center",
    marginRight: Spacing.md,
  },
  statValue: {
    fontFamily: Typography.fontFamily.brandBold,
    fontSize: Typography.fontSize.xl,
    color: Colors.text.primary,
  },
  statLabel: {
    fontFamily: Typography.fontFamily.brandMedium,
    fontSize: Typography.fontSize.sm,
    color: Colors.text.secondary,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.gray[200],
    marginVertical: Spacing.sm,
  },
  logoutContainer: {
    marginTop: Spacing.xl,
  },
});
