import { useEffect, useRef } from 'react';
import { Animated, Dimensions, StyleSheet, View } from 'react-native';

const { width, height } = Dimensions.get('window');

export default function SmallRobot() {
  const floatAnim = useRef(new Animated.Value(0)).current;
  const blinkAnim = useRef(new Animated.Value(1)).current;
  const waveLeftAnim = useRef(new Animated.Value(0)).current;
  const waveRightAnim = useRef(new Animated.Value(0)).current;
  const shadowAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Float animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: -20,
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
          toValue: -25,
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
          toValue: 25,
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
  }, []);

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
        <View style={styles.head}>
          {/* Visor */}
          <View style={styles.visor}>
            {/* Left Eye */}
            <Animated.View
              style={[
                styles.eye,
                styles.eyeLeft,
                {
                  transform: [{ scaleY: blinkAnim }],
                },
              ]}
            />
            {/* Right Eye */}
            <Animated.View
              style={[
                styles.eye,
                styles.eyeRight,
                {
                  transform: [{ scaleY: blinkAnim }],
                },
              ]}
            />
          </View>
          {/* Antenna */}
          {/* <View style={styles.antenna} /> */}
        </View>

        {/* Body */}
        <View style={styles.body}>
          {/* Left Arm */}
          <Animated.View
            style={[
              styles.arm,
              styles.armLeft,
              {
                transform: [
                  { translateY: -50 },
                  { rotate: waveLeftAnim.interpolate({
                      inputRange: [-25, 0],
                      outputRange: ['-25deg', '0deg'],
                    })
                  },
                  { translateY: 50 },
                ],
              },
            ]}
          />
          {/* Right Arm */}
          <Animated.View
            style={[
              styles.arm,
              styles.armRight,
              {
                transform: [
                  { translateY: -50 },
                  { rotate: waveRightAnim.interpolate({
                      inputRange: [0, 25],
                      outputRange: ['0deg', '25deg'],
                    })
                  },
                  { translateY: 50 },
                ],
              },
            ]}
          />
        </View>

        {/* Shadow */}
        <Animated.View
          style={[
            styles.shadow,
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
  //   flex: 1,
  //   backgroundColor: '#8B0000',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
  robot: {
    alignItems: 'center',
  },
  head: {
    width: 180,
    height: 140,
    backgroundColor: '#E5E5E5',
    borderTopLeftRadius: 90,
    borderTopRightRadius: 90,
    borderBottomLeftRadius: 60,
    borderBottomRightRadius: 60,
    marginBottom: -20,
    position: 'relative',
  },
  visor: {
    width: 140,
    height: 60,
    backgroundColor: '#2C3E50',
    borderRadius: 30,
    position: 'absolute',
    top: 50,
    left: 20,
    overflow: 'hidden',
  },
  eye: {
    width: 20,
    height: 35,
    backgroundColor: '#7B93DB',
    borderRadius: 10,
    position: 'absolute',
    top: 12,
  },
  eyeLeft: {
    left: 30,
  },
  eyeRight: {
    right: 30,
  },
  antenna: {
    width: 50,
    height: 50,
    backgroundColor: '#D0D0D0',
    borderTopRightRadius: 25,
    borderBottomRightRadius: 25,
    position: 'absolute',
    right: -25,
    top: 60,
  },
  body: {
    width: 160,
    height: 130,
    backgroundColor: '#E5E5E5',
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    borderBottomLeftRadius: 60,
    borderBottomRightRadius: 60,
    position: 'relative',
  },
  arm: {
    width: 30,
    height: 100,
    backgroundColor: '#E5E5E5',
    borderRadius: 15,
    position: 'absolute',
    top: 20,
  },
  armLeft: {
    left: -25,
  },
  armRight: {
    right: -25,
  },
  shadow: {
    width: 120,
    height: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: 60,
    marginTop: 10,
  },
});