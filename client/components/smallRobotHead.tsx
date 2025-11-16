import { useEffect, useRef } from "react";
import { Animated, Dimensions, StyleSheet, View } from "react-native";

const { width, height } = Dimensions.get("window");

interface SmallRobotProps {
  size?: "small" | "medium" | "large" | number; // number for custom scale factor
  color?: string;
}

export default function SmallRobotHead({
  size = "medium",
  color,
}: SmallRobotProps) {
  const floatAnim = useRef(new Animated.Value(0)).current;
  const blinkAnim = useRef(new Animated.Value(1)).current;
  const waveLeftAnim = useRef(new Animated.Value(0)).current;
  const waveRightAnim = useRef(new Animated.Value(0)).current;
  const shadowAnim = useRef(new Animated.Value(1)).current;

  // Calculate scale factor based on size prop
  const getScaleFactor = () => {
    if (typeof size === "number") {
      return size;
    }
    switch (size) {
      case "small":
        return 0.5;
      case "medium":
        return 0.75;
      case "large":
        return 1;
      default:
        return 0.75;
    }
  };

  const scaleFactor = getScaleFactor();

  // Generate dynamic styles based on scale factor
  const dynamicStyles = StyleSheet.create({
    head: {
      width: 90 * scaleFactor,
      height: 70 * scaleFactor,
      backgroundColor: color || "#E5E5E5",
      borderTopLeftRadius: 45 * scaleFactor,
      borderTopRightRadius: 45 * scaleFactor,
      borderBottomLeftRadius: 30 * scaleFactor,
      borderBottomRightRadius: 30 * scaleFactor,
      marginBottom: -10 * scaleFactor,
      position: "relative" as const,
    },
    visor: {
      width: 70 * scaleFactor,
      height: 30 * scaleFactor,
      backgroundColor: "#2C3E50",
      borderRadius: 15 * scaleFactor,
      position: "absolute" as const,
      top: 25 * scaleFactor,
      left: 10 * scaleFactor,
      overflow: "hidden" as const,
    },
    eye: {
      width: 10 * scaleFactor,
      height: 18 * scaleFactor,
      backgroundColor: "#7B93DB",
      borderRadius: 5 * scaleFactor,
      position: "absolute" as const,
      top: 6 * scaleFactor,
    },
    eyeLeft: {
      left: 15 * scaleFactor,
    },
    eyeRight: {
      right: 15 * scaleFactor,
    },
    body: {
      width: 80 * scaleFactor,
      height: 65 * scaleFactor,
      backgroundColor: "white",
      borderTopLeftRadius: 20 * scaleFactor,
      borderTopRightRadius: 20 * scaleFactor,
      borderBottomLeftRadius: 30 * scaleFactor,
      borderBottomRightRadius: 30 * scaleFactor,
      position: "relative" as const,
    },
    arm: {
      width: 15 * scaleFactor,
      height: 50 * scaleFactor,
      backgroundColor: "#264653",
      borderRadius: 8 * scaleFactor,
      position: "absolute" as const,
      top: 10 * scaleFactor,
    },
    armLeft: {
      left: -12 * scaleFactor,
    },
    armRight: {
      right: -12 * scaleFactor,
    },
  });

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.robot,
          {
            transform: [{ translateY: floatAnim }],
          },
        ]}
      >
        {/* Head */}
        <View style={dynamicStyles.head}>
          {/* Visor */}
          <View style={dynamicStyles.visor}>
            {/* Left Eye */}
            <Animated.View
              style={[
                dynamicStyles.eye,
                dynamicStyles.eyeLeft,
                {
                  transform: [{ scaleY: blinkAnim }],
                },
              ]}
            />
            {/* Right Eye */}
            <Animated.View
              style={[
                dynamicStyles.eye,
                dynamicStyles.eyeRight,
                {
                  transform: [{ scaleY: blinkAnim }],
                },
              ]}
            />
          </View>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
  },
  robot: {
    alignItems: "center",
  },
});
