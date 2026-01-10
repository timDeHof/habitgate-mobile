import useUserStore from "@/hooks/use-userstore";
import { Button, Text, View, StyleSheet } from "react-native";

const Page = () => {
  const { setIsGuest } = useUserStore();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>
      <Button title="Logout" onPress={() => setIsGuest(false)} />
    </View>
  );
};
export default Page;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
});
