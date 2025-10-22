import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface CheckersGameProps {
  onGameComplete?: (score: number) => void;
}

export default function CheckersGame({ onGameComplete }: CheckersGameProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Checkers Game</Text>
      <Text style={styles.subtitle}>Start building your game here!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    margin: 10,
    borderRadius: 10,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontFamily: "Poppins-SemiBold",
    color: "#5d9f4e",
    textAlign: "center",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: "Poppins-Regular",
    color: "#666",
    textAlign: "center",
    marginBottom: 20,
  },
});
