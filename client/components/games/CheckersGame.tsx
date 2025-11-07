import React from "react";
import { ImageBackground, StyleSheet, Text, View } from "react-native";

interface CheckersGameProps {
  onGameComplete?: (score: number) => void;
}

export default function CheckersGame({ onGameComplete }: CheckersGameProps) {
  return <div></div>;
}

const styles = StyleSheet.create({});
