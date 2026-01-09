import React from "react";
import { Stack } from "expo-router";

const Authlayout = () => {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: "Feed" }} />
    </Stack>
  );
};

export default Authlayout;
