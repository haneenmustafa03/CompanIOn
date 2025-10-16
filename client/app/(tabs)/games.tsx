import SmallRobot from '@/components/smallRobot';
import { useEffect, useState } from 'react';
import { ActivityIndicator, ImageBackground, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const API_BASE_URL = 'http://localhost:5001/api';

interface Game {
  id: string;
  name: string;
  description: string;
  skills: string[];
  difficulty: string;
}

export default function GamesScreen() {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchGames();
  }, []);

  const fetchGames = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`${API_BASE_URL}/games`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success) {
        setGames(data.games);
      } else {
        throw new Error(data.message || 'Failed to fetch games');
      }
    } catch (err) {
      console.error('Error fetching games:', err);
      setError(err instanceof Error ? err.message : 'Failed to load games');
      
      // Fallback to mock data if API fails
      setGames([
        {
          id: 'checkers',
          name: 'Checkers',
          description: 'Play checkers and practice thinking ahead',
          skills: ['Strategy', 'Planning', 'Turn-taking'],
          difficulty: 'Medium'
        },
        {
          id: 'matching',
          name: 'Matching Game',
          description: 'Match pairs of cards to practice memory',
          skills: ['Memory', 'Concentration', 'Pattern recognition'],
          difficulty: 'Easy'
        },
        {
          id: 'storyteller',
          name: 'Story Teller',
          description: 'Create stories and practice creativity',
          skills: ['Creativity', 'Language', 'Sequencing'],
          difficulty: 'Easy'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleGamePress = (game: Game) => {
    console.log('Game pressed:', game.name);
    // TODO: Navigate to game or show game details
  };

  const completeGame = async (gameId: string, score?: number, duration?: number) => {
    try {
      const response = await fetch(`${API_BASE_URL}/games/${gameId}/complete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer mock-token' // This would be a real JWT token in production
        },
        body: JSON.stringify({
          score: score || 100,
          duration: duration || 300 // 5 minutes default
        })
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Game completed:', data);
        // TODO: Show success message and any new badges earned
      }
    } catch (error) {
      console.error('Error completing game:', error);
    }
  };

  return (
    <ImageBackground 
      source={require('../../assets/backgroundImages/Games.png')} 
      style={styles.container}
      resizeMode="stretch"
    >


      <View style={styles.robotWrapper}>  
        <SmallRobot size={1.2} />  
      </View>
      
      
      <View style={styles.scrollerWrapper}>
        <Text style={styles.sectionTitle}>Games: </Text>
        
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#fff" />
            <Text style={styles.loadingText}>Loading games...</Text>
          </View>
        ) : error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>⚠️ {error}</Text>
            <Text style={styles.fallbackText}>Showing offline games</Text>
          </View>
        ) : null}
        
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {games.map((game) => (
            <TouchableOpacity 
              key={game.id} 
              style={styles.card}
              onPress={() => handleGamePress(game)}
              activeOpacity={0.7}
            >
              <Text style={styles.gameName}>{game.name}</Text>
              <Text style={styles.gameDifficulty}>{game.difficulty}</Text>
              <Text style={styles.gameDescription} numberOfLines={2}>
                {game.description}
              </Text>
              <View style={styles.skillsContainer}>
                {game.skills.slice(0, 2).map((skill, index) => (
                  <Text key={index} style={styles.skillTag}>
                    {skill}
                  </Text>
                ))}
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 160,
    height: 140,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.15)',
    padding: 8,
    marginRight: 8,
    marginLeft: 4,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundSize: 'contain',
    backgroundPosition: 'center',
    width: '100%',
    height: '100%',
  },
  scrollerWrapper: {
    position: 'absolute',
    bottom: 30,
    left: 0,
    right: 0,
  },
  scrollContent: {
    paddingHorizontal: 12,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    marginLeft: 16,
    marginBottom: 8,
    textShadowColor: 'rgba(0,0,0,0.4)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  gameName: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 2,
    textAlign: 'center',
  },
  gameDifficulty: {
    color: '#FFD700',
    fontSize: 10,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 4,
  },
  gameDescription: {
    color: '#fff',
    fontSize: 10,
    textAlign: 'center',
    marginBottom: 6,
    opacity: 0.9,
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 2,
  },
  skillTag: {
    color: '#87CEEB',
    fontSize: 8,
    backgroundColor: 'rgba(135, 206, 235, 0.2)',
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 4,
    marginRight: 2,
    marginBottom: 2,
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  loadingText: {
    color: '#fff',
    fontSize: 14,
    marginTop: 8,
  },
  errorContainer: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  errorText: {
    color: '#FFB6C1',
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 4,
  },
  fallbackText: {
    color: '#fff',
    fontSize: 10,
    opacity: 0.7,
  },
  text: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  robotWrapper: {
    position: 'absolute',
    top: 160,
    left: 80,
    width: 100,
    height: 150,
  },
});