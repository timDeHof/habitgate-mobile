import Ionicons from "@expo/vector-icons/Ionicons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

const AppleAuthButton = () => {
  return (
    <TouchableOpacity
      style={styles.AppleButton}
      onPress={() => {
        /* TODO: Implement Apple Sign In */
      }}
    >
      <Ionicons name="logo-apple" size={18} color={"#fff"} />
      <Text style={styles.AppleButtonText}>Sign in with Apple</Text>
    </TouchableOpacity>
  );
};

export default AppleAuthButton;

const styles = StyleSheet.create({
  AppleButton: {
    backgroundColor: "#000",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 17,
    borderRadius: 12,
    gap: 4,
  },
  AppleButtonText: {
    color: "#fff",
    fontSize: 18,
    textAlign: "center",
  },
});
