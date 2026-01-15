import React, { useEffect, useState } from "react";
import { Text, StyleSheet, Dimensions } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  withDelay,
  Easing,
  runOnJS,
} from "react-native-reanimated";

interface ConfettiCelebrationProps {
  visible: boolean;
}

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

const confettiEmojis = ["🎉", "✨", "🎊", "⭐", "🌟", "💫", "🎈"];

export function ConfettiCelebration({ visible }: ConfettiCelebrationProps) {
  const opacity = useSharedValue(0);
  const [isMounted, setIsMounted] = useState(visible);

  useEffect(() => {
    if (visible) {
      // When becoming visible, immediately mount and fade in
      setIsMounted(true);
      opacity.value = withTiming(1, { duration: 100 });
    } else {
      // When hiding, start fade-out animation
      opacity.value = withTiming(0, { duration: 300 }, () => {
        // After fade-out completes, unmount the component
        runOnJS(setIsMounted)(false);
      });
    }
  }, [visible]);

  const containerStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  if (!isMounted) return null;

  return (
    <Animated.View style={[styles.container, containerStyle]}>
      {confettiEmojis.map((emoji, index) => (
        <ConfettiPiece
          key={`${emoji}-${index}`}
          emoji={emoji}
          index={index}
          visible={visible}
        />
      ))}
    </Animated.View>
  );
}

interface ConfettiPieceProps {
  emoji: string;
  index: number;
  visible: boolean;
}

function ConfettiPiece({ emoji, index, visible }: ConfettiPieceProps) {
  const translateY = useSharedValue(-100);
  const translateX = useSharedValue(0);
  const rotate = useSharedValue(0);
  const scale = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      const delay = index * 50;
      const randomX = (Math.random() - 0.5) * screenWidth * 0.6;

      // Initial appearance
      scale.value = withDelay(delay, withSpring(1, { damping: 10 }));

      // Fall animation
      translateY.value = withDelay(
        delay,
        withTiming(screenHeight + 50, {
          duration: 2000,
          easing: Easing.out(Easing.quad),
        })
      );

      // Horizontal drift
      translateX.value = withDelay(
        delay,
        withTiming(randomX, {
          duration: 2000,
          easing: Easing.inOut(Easing.quad),
        })
      );

      // Rotation
      rotate.value = withDelay(
        delay,
        withTiming(360, {
          duration: 2000,
          easing: Easing.linear,
        })
      );
    } else {
      scale.value = 0;
      translateY.value = -100;
      translateX.value = 0;
      rotate.value = 0;
    }
  }, [visible, index]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { rotate: `${rotate.value}deg` },
      { scale: scale.value },
    ],
  }));

  return (
    <Animated.View style={[styles.confettiPiece, animatedStyle]}>
      <Text style={styles.emoji}>{emoji}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    pointerEvents: "none",
    zIndex: 1000,
  },
  confettiPiece: {
    position: "absolute",
    top: 50,
    left: screenWidth * 0.5,
  },
  emoji: {
    fontSize: 32,
    textAlign: "center",
  },
});
