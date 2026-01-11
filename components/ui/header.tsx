import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Spacing, Colors, Typography } from "../../constants";
import React from "react";
import { useRouter } from "expo-router";
import useUserStore from "@/hooks/use-userstore";
interface headerProps {
  title: string;
}

const Header = ({ title }: headerProps) => {
  const router = useRouter();
  const { user } = useUserStore();
  return (
    <View style={styles.header}>
      <Text style={styles.headerTitle}>{title}</Text>
      <TouchableOpacity
        style={styles.profileButton}
        onPress={() => router.push("/profile")}
      >
        <View style={styles.profileAvatar}>
          <Text style={styles.profileInitial}>
            {user?.name?.charAt(0) || "U"}
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.md,
  },
  headerTitle: {
    fontFamily: Typography.fontFamily.brandBold,
    fontSize: Typography.fontSize["3xl"],
    color: Colors.text.primary,
  },
  profileButton: {
    padding: 4,
  },
  profileAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary[100],
    alignItems: "center",
    justifyContent: "center",
  },
  profileInitial: {
    fontFamily: Typography.fontFamily.brandSemibold,
    fontSize: Typography.fontSize.lg,
    color: Colors.primary[600],
  },
});
