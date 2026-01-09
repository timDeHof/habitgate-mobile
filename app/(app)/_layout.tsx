import { useEffect, useRef } from "react";
import { useRouter, usePathname, Stack } from "expo-router";
import useUserStore from "@/hooks/use-userstore";

export default function RootNav() {
  const router = useRouter();
  const pathname = usePathname();
  const { isGuest, user } = useUserStore();
  const navigationInProgress = useRef(false);

  // Redirect based on authentication state
  useEffect(() => {
    // Prevent multiple redirects
    if (navigationInProgress.current) return;

    const isAuthenticated = isGuest || user;
    const isUnauthenticated = !isGuest && !user;

    // Defer navigation to ensure navigator is mounted
    const timer = setTimeout(() => {
      if (isAuthenticated) {
        // Authenticated users access the main app in (auth) route group
        if (!pathname.includes("(auth)")) {
          navigationInProgress.current = true;
          router.replace("/(auth)" as any);
        }
      } else if (isUnauthenticated) {
        // Unauthenticated users access the login page in (public) route group
        if (!pathname.includes("(public)")) {
          navigationInProgress.current = true;
          router.replace("/(public)" as any);
        }
      }
    }, 100);

    return () => clearTimeout(timer);
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
