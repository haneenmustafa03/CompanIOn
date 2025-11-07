import { useEffect, useRef } from "react";
import { Animated, Dimensions, StyleSheet, View } from "react-native";

const { width, height } = Dimensions.get("window");

interface SmallRobotProps {
  size?: "small" | "medium" | "large" | number; // number for custom scale factor
}

export default function SmallRobot({ size = "medium" }: SmallRobotProps) {
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

  useEffect(() => {
    // Float animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: -10 * scaleFactor,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Blink animation
    Animated.loop(
      Animated.sequence([
        Animated.delay(3800),
        Animated.timing(blinkAnim, {
          toValue: 0.1,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(blinkAnim, {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Wave left arm
    Animated.loop(
      Animated.sequence([
        Animated.timing(waveLeftAnim, {
          toValue: -12 * scaleFactor,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(waveLeftAnim, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Wave right arm (delayed)
    Animated.loop(
      Animated.sequence([
        Animated.delay(1000),
        Animated.timing(waveRightAnim, {
          toValue: 12 * scaleFactor,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(waveRightAnim, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Shadow pulse
    Animated.loop(
      Animated.sequence([
        Animated.timing(shadowAnim, {
          toValue: 0.8,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(shadowAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [
    scaleFactor,
    floatAnim,
    blinkAnim,
    waveLeftAnim,
    waveRightAnim,
    shadowAnim,
  ]);

  // Generate dynamic styles based on scale factor
  const dynamicStyles = StyleSheet.create({
    head: {
      width: 90 * scaleFactor,
      height: 70 * scaleFactor,
      backgroundColor: "#E5E5E5",
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
      backgroundColor: "#E5E5E5",
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
    shadow: {
      width: 60 * scaleFactor,
      height: 10 * scaleFactor,
      backgroundColor: "rgba(0, 0, 0, 0.2)",
      borderRadius: 30 * scaleFactor,
      marginTop: 5 * scaleFactor,
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

        {/* Body */}
        <View style={dynamicStyles.body}>
          {/* Left Arm */}
          <Animated.View
            style={[
              dynamicStyles.arm,
              dynamicStyles.armLeft,
              {
                transform: [
                  { translateY: -25 * scaleFactor },
                  {
                    rotate: waveLeftAnim.interpolate({
                      inputRange: [-12 * scaleFactor, 0],
                      outputRange: ["-25deg", "0deg"],
                    }),
                  },
                  { translateY: 25 * scaleFactor },
                ],
              },
            ]}
          />
          {/* Right Arm */}
          <Animated.View
            style={[
              dynamicStyles.arm,
              dynamicStyles.armRight,
              {
                transform: [
                  { translateY: -25 * scaleFactor },
                  {
                    rotate: waveRightAnim.interpolate({
                      inputRange: [0, 12 * scaleFactor],
                      outputRange: ["0deg", "25deg"],
                    }),
                  },
                  { translateY: 25 * scaleFactor },
                ],
              },
            ]}
          />
        </View>

        {/* Shadow */}
        <Animated.View
          style={[
            dynamicStyles.shadow,
            {
              transform: [{ scale: shadowAnim }],
            },
          ]}
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
  },
  robot: {
    alignItems: "center",
  },
});
