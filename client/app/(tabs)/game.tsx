import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ImageBackground,
  StyleSheet,
  Text,
  View,
} from "react-native";
import {
  CheckersGame,
  MatchingGame,
  StorytellerGame,
} from "../../components/games";

const API_BASE_URL = "http://localhost:5001/api";

interface Game {
  id: string;
  name: string;
  description: string;
  skills: string[];
  difficulty: string;
}

// interface card {
//   image: string;
//   isFlipped: boolean;
// }

interface UserStats {
  timesPlayed: number;
  lastPlayed: string;
}

export default function GameScreen() {
  const { gameId } = useLocalSearchParams();
  const [game, setGame] = useState<Game | null>(null);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log("GameScreen mounted with gameId:", gameId);
    if (gameId) {
      fetchGame();
    }
  }, [gameId]);

  const fetchGame = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log("Fetching game with ID:", gameId);
      const response = await fetch(`${API_BASE_URL}/games/${gameId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log("Response status:", response.status);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Game data:", data);

      if (data.success) {
        setGame(data.game);
        setUserStats(data.userStats);
        console.log("Game set successfully:", data.game);
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

  const handlePlayGame = () => {
    console.log("Starting game:", game?.name);
    // TODO: Implement actual game logic or navigation to game play screen
    alert(`Starting ${game?.name}! Game functionality coming soon!`);
  };

  // Game completion handlers
  const handleGameComplete = (gameType: string, result: any) => {
    console.log(`${gameType} game completed:`, result);
    // TODO: Send completion data to server
  };

  const renderGameContent = () => {
    if (!game) return null;

    // Switch between different games based on gameId
    switch (gameId) {
      case "checkers":
        return (
          <CheckersGame
            onGameComplete={(score) => handleGameComplete("Checkers", score)}
          />
        );

      case "matching":
        return (
          <MatchingGame
            onGameComplete={(score) => handleGameComplete("Matching", score)}
          />
        );

      case "storyteller":
        return (
          <StorytellerGame
            onGameComplete={(story) => handleGameComplete("Storyteller", story)}
          />
        );

      default:
        return (
          <View style={styles.defaultGame}>
            <Text style={styles.gameInstructions}>🎮 {game.name}</Text>
            <Text style={styles.gameSubtext}>{game.description}</Text>
            <Text style={styles.placeholderText}>
              Game content coming soon!
            </Text>
          </View>
        );
    }
  };

  if (loading) {
    return (
      <ImageBackground
        source={require("../../assets/backgroundImages/Game.png")}
        style={styles.background}
        resizeMode="stretch"
      >
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#5d9f4e" />
          <Text style={styles.loadingText}>Loading game...</Text>
        </View>
      </ImageBackground>
    );
  }

  if (error || !game) {
    return (
      <ImageBackground
        source={require("../../assets/backgroundImages/Game.png")}
        style={styles.background}
        resizeMode="stretch"
      >
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>⚠️ {error || "Game not found"}</Text>
        </View>
      </ImageBackground>
    );
  }

  return (
    <ImageBackground
      source={require("../../assets/backgroundImages/Game.png")}
      style={styles.background}
      resizeMode="stretch"
    >
      <View style={styles.gameContainer}>
        <Text style={styles.gameTitle}>{game.name}</Text>
        <Text style={styles.gameDescription}>{game.description}</Text>
      </View>

      <View style={styles.gameWrapper}>{renderGameContent()}</View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  gameContainer: {
    position: "absolute",
    backgroundColor: "#ffffff",
    opacity: 0.9,
    margin: "5%",
    borderRadius: 10,
    width: "93%",
    height: "93%",
    padding: 20,
  },
  gameTitle: {
    textAlign: "center",
    fontSize: 28,
    fontFamily: "Poppins-SemiBold",
    fontWeight: "bold",
    color: "#302638",
    marginBottom: 5,
  },
  gameDescription: {
    textAlign: "center",
    fontSize: 16,
    fontFamily: "Quicksand",
    color: "black",
    marginBottom: 20,
    lineHeight: 24,
  },
  gameWrapper: {
    position: "absolute",
    paddingTop: 100,
    padding: 20,
    // top: 100,
    // bottom: 0,
    left: 0,
    right: 0,
    height: "50%",
  },
  // Game-specific styles moved to individual components
  defaultGame: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    margin: 10,
    borderRadius: 10,
    padding: 20,
  },
  gameInstructions: {
    fontSize: 24,
    fontFamily: "Poppins-SemiBold",
    color: "#5d9f4e",
    textAlign: "center",
    marginBottom: 10,
  },
  gameSubtext: {
    fontSize: 16,
    fontFamily: "Poppins-Regular",
    color: "#666",
    textAlign: "center",
    marginBottom: 20,
  },
  placeholderText: {
    fontSize: 16,
    fontFamily: "Poppins-Regular",
    color: "#888",
    textAlign: "center",
    fontStyle: "italic",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    color: "#FF6B6B",
    fontSize: 16,
    textAlign: "center",
    fontFamily: "Poppins-Regular",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    color: "#5d9f4e",
    fontSize: 16,
    fontFamily: "Poppins-Regular",
  },
});
