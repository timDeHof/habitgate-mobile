import { Stack } from "expo-router";
import { TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants";
import { useRouter } from "expo-router";

const Layout = () => {
  const router = useRouter();
  return (
    <Stack
      screenOptions={{
        contentStyle: { backgroundColor: Colors.background.primary },
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: "",
          headerLargeTitle: true,
          headerTransparent: true,
        }}
      />
    </Stack>
  );
};
export default Layout;
