import { useEffect } from "react";
import { Platform, StyleSheet, Text, View } from "react-native";
import Animated, {
  scrollTo,
  useAnimatedReaction,
  useAnimatedRef,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

const iconDataSets = {
  set1: [
    { emoji: "🧘", color: "#D7A8F0" },
    { emoji: "📚", color: "#2196F3" },
    { emoji: "🏃", color: "#FF9800" },
    { emoji: "🏋️", color: "#0097A7" },
    { emoji: "🚶", color: "#26A69A" },
  ],
  set2: [
    { emoji: "🥗", color: "#AFB42B" },
    { emoji: "💧", color: "#03A9F4" },
    { emoji: "🛏️", color: "#7B1FA2" },
    { emoji: "🧹", color: "#9E9E9E" },
    { emoji: "💻", color: "#3949AB" },
  ],
  set3: [
    { emoji: "✍️", color: "#6D4C41" },
    { emoji: "🎧", color: "#5E35B1" },
    { emoji: "🎨", color: "#C2185B" },
    { emoji: "💸", color: "#689F38" },
    { emoji: "☀️", color: "#FBC02D" },
  ],
};

const ITEM_HEIGHT = 160;
const SCROLL_SPEED = 20; // pixels per second
// GAP will be read dynamically from styles to maintain single source of truth

interface SmoothInfiniteScrollProps {
  scrollDirection?: "up" | "down";
  iconSet?: "set1" | "set2" | "set3";
}

const SmoothInfiniteScroll = ({
  scrollDirection = "down",
  iconSet = "set1",
}: SmoothInfiniteScrollProps) => {
  const scrollRef = useAnimatedRef<Animated.ScrollView>();
  const scrollY = useSharedValue(0);

  const iconData = iconDataSets[iconSet];
  const items = [...iconData, ...iconData];
  const totalContentHeight = iconData.length * ITEM_HEIGHT;

  // Read gap value dynamically from styles to maintain single source of truth
  const gap = styles.container.gap || 10;

  // Calculate total wrap height including gaps between items
  // Each item has a gap after it (except conceptually the last, but we're wrapping)
  const totalWrapHeight = totalContentHeight + iconData.length * gap;

  useEffect(() => {
    // Calculate duration based on SCROLL_SPEED and total distance
    const duration = (totalWrapHeight / SCROLL_SPEED) * 1000; // convert to milliseconds

    if (scrollDirection === "down") {
      // Start at 0, animate to totalWrapHeight
      scrollY.value = 0;
      scrollY.value = withRepeat(
        withTiming(totalWrapHeight, { duration }),
        -1, // infinite repeats
        false // don't reverse
      );
    } else {
      // Start at totalWrapHeight, animate to 0
      scrollY.value = totalWrapHeight;
      scrollY.value = withRepeat(
        withTiming(0, { duration }),
        -1, // infinite repeats
        false // don't reverse
      );
    }
  }, [scrollDirection, totalWrapHeight]);

  useAnimatedReaction(
    () => scrollY.value,
    (y) => {
      // Let withRepeat drive scrollY to loop seamlessly
      // Only sync the visual scroll position without modifying scrollY.value
      scrollTo(scrollRef, 0, y, false);
    }
  );

  return (
    <Animated.ScrollView
      contentContainerStyle={styles.container}
      ref={scrollRef}
      scrollEnabled={false}
      showsVerticalScrollIndicator={false}
      accessibilityElementsHidden={true}
      importantForAccessibility="no-hide-descendants"
    >
      {items.map((item, idx) => (
        <View
          key={idx}
          style={[styles.iconContainer, { backgroundColor: item.color }]}
        >
          <Text style={{ fontSize: 40 }}>{item.emoji}</Text>
        </View>
      ))}
    </Animated.ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 10,
    paddingVertical: 20,
  },
  iconContainer: {
    width: 160,
    height: ITEM_HEIGHT,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
    marginHorizontal: 5,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
});
export default SmoothInfiniteScroll;
