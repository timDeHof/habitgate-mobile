import AppleAuthButton from "@/components/auth/AppleAuthButton";
import GoogleAuthButton from "@/components/auth/GoogleAuthButton";
import { Typography, Colors } from "@/constants";
import useUserStore from "@/hooks/use-userstore";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

const Page = () => {
  const router = useRouter();
  const { setIsGuest } = useUserStore();
  const continueAsGuest = () => {
    setIsGuest(true);
    router.replace("/(auth)" as any);
  };
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.closeBtn}
        onPress={() => router.dismiss()}
      >
        <Ionicons name="close" size={24} />
      </TouchableOpacity>
      <Text style={styles.title}>Log in or create a HabitGate account</Text>
      <View style={styles.buttonContainer}>
        <Animated.View entering={FadeInDown.delay(100)}>
          {/* Apple auth */}
          <AppleAuthButton />
        </Animated.View>
        <Animated.View entering={FadeInDown.delay(200)}>
          {/* Google auth */}
          <GoogleAuthButton />
        </Animated.View>
        <Animated.View entering={FadeInDown.delay(300)}>
          <TouchableOpacity
            style={styles.facebookButton}
            onPress={() => {
              /* TODO: Implement Facebook Sign In */
            }}
          >
            <FontAwesome5 name="facebook" size={18} color="#000000" />
            <Text style={styles.facebookButtonText}>
              Continue with Facebook
            </Text>
          </TouchableOpacity>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(400)}>
          <TouchableOpacity
            style={styles.otherButton}
            onPress={continueAsGuest}
          >
            <Text style={styles.otherButtonText}>Continue as guest</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 14,
  },
  closeBtn: {
    backgroundColor: Colors.background.light,
    borderRadius: 40,
    padding: 8,
    alignSelf: "flex-end",
  },
  title: {
    fontSize: 30,
    fontFamily: Typography.fontFamily.brandBold,
    marginVertical: 22,
  },
  buttonContainer: {
    width: "100%",
    paddingHorizontal: 20,
    gap: 12,
  },
  otherButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 17,
    borderRadius: 12,
    gap: 4,
  },
  otherButtonText: {
    color: Colors.primary[500],
    fontSize: 18,
    fontWeight: "600",
  },
  facebookButton: {
    backgroundColor: Colors.background.light,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 17,
    borderRadius: 12,
    gap: 4,
  },
  facebookButtonText: {
    color: Colors.background.dark,
    fontSize: 18,
    fontWeight: "600",
  },
});

export default Page;
