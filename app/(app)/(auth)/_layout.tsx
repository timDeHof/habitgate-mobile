import React from "react";
import { Stack } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import { TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { Colors } from "@/constants";

const Layout = () => {
  const router = useRouter();
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen
        name="(modal)/timeBankBalance"
        options={{
          presentation: "formSheet",
          sheetAllowedDetents: [0.69],
          title: "",
          headerShown: true,
          headerShadowVisible: false,
          sheetCornerRadius: 16,
          sheetGrabberVisible: true,
          contentStyle: {
            backgroundColor: "#fff",
          },
          headerRight: () => (
            <TouchableOpacity
              style={{
                padding: 4,
                borderRadius: 20,
                backgroundColor: Colors.background.secondary,
              }}
              onPress={() => {
                router.dismiss();
              }}
            >
              <Ionicons name="close-sharp" size={28} />
            </TouchableOpacity>
          ),
        }}
      />
    </Stack>
  );
};

export default Layout;
