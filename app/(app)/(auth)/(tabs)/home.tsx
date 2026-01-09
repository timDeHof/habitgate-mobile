import useUserStore from "@/hooks/use-userstore";
import { Button, Text, View, StyleSheet } from "react-native";
const Page = () => {
  const { setIsGuest } = useUserStore();

  return (
    <View style={styles.container}>
      <Text>MY inside page</Text>
      <Button title="Go login" onPress={() => setIsGuest(false)} />
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
});
