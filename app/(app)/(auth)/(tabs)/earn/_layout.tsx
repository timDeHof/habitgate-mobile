import { Stack } from "expo-router";
const Layout = () => {
  return (
    <Stack screenOptions={{ contentStyle: { backgroundColor: "#fff" } }}>
      <Stack.Screen
        name="index"
        options={{
          title: "Earn",
          headerLargeTitle: true,
          headerTransparent: true,
        }}
      />
    </Stack>
  );
};
export default Layout;
