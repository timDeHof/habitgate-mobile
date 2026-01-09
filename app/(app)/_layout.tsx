import { useEffect } from "react";
import { useRouter, usePathname, Stack } from "expo-router";
import useUserStore from "@/hooks/use-userstore";

export default function RootNav() {
  const router = useRouter();
  const pathname = usePathname();
  const { isGuest, user } = useUserStore();
  console.debug("🚀 ~ RootNav ~ isGuest:", isGuest);

  // Redirect based on authentication state
  useEffect(() => {
    const isAuthenticated = isGuest || user;
    const isUnauthenticated = !isGuest && !user;

    if (isAuthenticated) {
      // Authenticated users access the main app in (auth) route group
      if (!pathname.includes("(auth)")) {
        router.replace("/(auth)" as any);
      }
    } else if (isUnauthenticated) {
      // Unauthenticated users access the login page in (public) route group
      if (!pathname.includes("(public)")) {
        router.replace("/(public)" as any);
      }
    }
  }, [isGuest, user, pathname]);

  return (
    <Stack>
      <Stack.Screen
        name="(auth)"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen name="(public)" options={{ headerShown: false }} />
    </Stack>
  );
}
