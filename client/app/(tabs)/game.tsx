import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Image, ImageBackground, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const API_BASE_URL = "http://localhost:5001/api";

interface Game {
  id: string;
  name: string;
  description: string;
  skills: string[];
  difficulty: string;
}

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
    console.log('GameScreen mounted with gameId:', gameId);
    if (gameId) {
      fetchGame();
    }
  }, [gameId]);

  const fetchGame = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Fetching game with ID:', gameId);
      const response = await fetch(`${API_BASE_URL}/games/${gameId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
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
        console.log('Game set successfully:', data.game);
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
    console.log('Starting game:', game?.name);
    // TODO: Implement actual game logic or navigation to game play screen
    alert(`Starting ${game?.name}! Game functionality coming soon!`);
  };

  const handleImageClick = (imageNumber: number) => {
    console.log(`Clicked on image ${imageNumber}`);
    // TODO: Add your matching game logic here
    alert(`You clicked on image ${imageNumber}!`);

    if (imageNumber === 1) {
      
    }
  };

  const renderGameContent = () => {
    if (!game) return null;

    // Switch between different games based on gameId
    if (gameId === 'checkers') {
      return (
        <View style={styles.checkersGame}>
          <Text>Checkers</Text>
        </View>
      );
      } else if (gameId === 'matching') {
        return (
          <View style={styles.matchingGame}>
            <TouchableOpacity 
              onPress={() => handleImageClick(1)}
              style={styles.clickableImage}
              activeOpacity={0.7}
            >
              <Image source={require("../../assets/gameAssets/matching/1.png")} style={styles.matchingGameImage} />
            </TouchableOpacity>
            {/* <TouchableOpacity onPress={() => handleImageClick(2)}>
              <Image source={require("../../assets/gameAssets/matching/2.png")} style={styles.matchingGameImage} />
            </TouchableOpacity> */}
          </View>
        );
    } else if (gameId === 'storyteller') {
      return (
        <View style={styles.storytellerGame}>
          
        </View>
      );
    } else {
      // Default case for unknown games
      return (
        <View style={styles.defaultGame}>
          <Text style={styles.gameInstructions}>🎮 {game.name}</Text>
          <Text style={styles.gameSubtext}>{game.description}</Text>
          <Text style={styles.placeholderText}>Game content coming soon!</Text>
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
          <Text style={styles.errorText}>⚠️ {error || 'Game not found'}</Text>
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
      
      
      <View style={styles.gameWrapper}>
        {renderGameContent()}
      </View>
      
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
    position: 'absolute',
    backgroundColor: "#ffffff",
    opacity: 0.9,
    margin: '5%',
    borderRadius: 10,
    width: '93%',
    height: '93%',
    padding: 20,
  },
  gameTitle: {
    textAlign: 'center',    
    fontSize: 28,
    fontFamily: 'Poppins-SemiBold',
    fontWeight: 'bold',
    color: '#5d9f4e',
    marginBottom: 15,
  },
  gameDescription: {
    textAlign: 'center',
    fontSize: 16,
    fontFamily: 'Quicksand',
    color: 'black',
    marginBottom: 20,
    lineHeight: 24,
  },
  gameWrapper: {
    position: 'absolute',
    padding: 20,
    top: 100,
    // bottom: 0,
    left: 0,
    right: 0,
    height: '50%',
  },
  //  gameWrapperImage: {
  //    width: '100%',
  //    height: '100%',
  //  },
   // Game-specific styles
   checkersGame: {
    //  flex: 1,
    //  justifyContent: 'center',
    //  alignItems: 'center',
     backgroundColor: 'rgba(255, 255, 255, 0.9)',
     margin: 10,
     borderRadius: 10,
     padding: 20,
   },
    matchingGameImage: {
      width: 100,
      height: 100,
      borderRadius: 8,
    },
    clickableImage: {
      margin: 5,
      borderRadius: 8,
      borderWidth: 2,
      borderColor: 'transparent',
    },
    clickableImagePressed: {
      borderColor: '#5d9f4e',
      opacity: 0.8,
    },
   matchingGame: {
     flex: 1,
     justifyContent: 'center',
     alignItems: 'center',
     backgroundColor: 'rgba(255, 255, 255, 0.9)',
     margin: 10,
     borderRadius: 10,
     padding: 20,
   },
   storytellerGame: {
     flex: 1,
     justifyContent: 'center',
     alignItems: 'center',
     backgroundColor: 'rgba(255, 255, 255, 0.9)',
     margin: 10,
     borderRadius: 10,
     padding: 20,
   },
   defaultGame: {
     flex: 1,
     justifyContent: 'center',
     alignItems: 'center',
     backgroundColor: 'rgba(255, 255, 255, 0.9)',
     margin: 10,
     borderRadius: 10,
     padding: 20,
   },
   gameInstructions: {
     fontSize: 24,
     fontFamily: 'Poppins-SemiBold',
     color: '#5d9f4e',
     textAlign: 'center',
     marginBottom: 10,
   },
   gameSubtext: {
     fontSize: 16,
     fontFamily: 'Poppins-Regular',
     color: '#666',
     textAlign: 'center',
     marginBottom: 20,
   },
   checkersBoard: {
     width: 200,
     height: 200,
     backgroundColor: '#8B4513',
     borderRadius: 10,
     justifyContent: 'center',
     alignItems: 'center',
     borderWidth: 2,
     borderColor: '#654321',
   },
   matchingGrid: {
     width: 250,
     height: 200,
     backgroundColor: '#E6E6FA',
     borderRadius: 10,
     justifyContent: 'center',
     alignItems: 'center',
     borderWidth: 2,
     borderColor: '#9370DB',
   },
   storyArea: {
     width: 250,
     height: 200,
     backgroundColor: '#F0F8FF',
     borderRadius: 10,
     justifyContent: 'center',
     alignItems: 'center',
     borderWidth: 2,
     borderColor: '#4169E1',
   },
   placeholderText: {
     fontSize: 16,
     fontFamily: 'Poppins-Regular',
     color: '#888',
     textAlign: 'center',
     fontStyle: 'italic',
   },
   errorContainer: {
     flex: 1,
     justifyContent: 'center',
     alignItems: 'center',
   },
   errorText: {
     color: '#FF6B6B',
     fontSize: 16,
     textAlign: 'center',
     fontFamily: 'Poppins-Regular',
   },
   loadingContainer: {
     flex: 1,
     justifyContent: 'center',
     alignItems: 'center',
   },
   loadingText: {
     color: '#5d9f4e',
     fontSize: 16,
     fontFamily: 'Poppins-Regular',
   },
});
