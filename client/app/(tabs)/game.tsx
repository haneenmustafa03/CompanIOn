import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { ImageBackground, StyleSheet, Text, View } from "react-native";

const API_BASE_URL = "http://localhost:5001/api";

interface Game {
  id: string;
  name: string;
  description: string;
  skills: string[];
  difficulty: string;
}

export default function GameScreen() {
  const { gameId } = useLocalSearchParams();
  const [game, setGame] = useState<Game | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (gameId) {
      fetchGame();
    }
  }, [gameId]);
  const fetchGame = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API_BASE_URL}/games/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log("Response:", response);
      console.log("gameId:", gameId);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();

      console.log("Game data:", data);

      if (data.success) {
        setGame(data.game);
      } else {
        throw new Error(data.message || "Failed to fetch game");
      }
    } catch (err) {
      console.error("Error fetching game:", err);
      setError(err instanceof Error ? err.message : "Failed to load game");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ImageBackground
      source={require("../../assets/backgroundImages/Game.png")}
      style={styles.background}
      resizeMode="stretch"
    >
      <View style={styles.titleContainer}>
        {/* {game?.name } */}
        <Text style={styles.title}>{game?.name || "Unknown Game"}</Text>
      </View>

      <View>
        <Text>Game here</Text>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    // justifyContent: "center",
    width: "100%",
    height: "100%",
  },
  titleContainer: {
    flex: 1,
    // justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    opacity: 0.6,
    margin: 20,
    borderRadius: 10,
    backgroundSize: "contain",
    backgroundPosition: "center",
    // width: "100%",
    height: "100%",
  },
  title: {
    fontSize: 48,
    paddingTop: 30,
    fontWeight: "bold",
    marginBottom: 10,
  },
});
