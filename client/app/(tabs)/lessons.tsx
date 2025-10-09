import { useEffect, useState } from 'react';
import { ActivityIndicator, Image, ImageBackground, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const API_BASE_URL = 'http://localhost:5001/api';

interface Lesson {
  id: string;
  name: string;
  description: string;
  skills: string[];
  difficulty: string;
  duration: number;
  category: string;
}

export default function LessonsScreen() {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchLessons();
  }, []);

  const fetchLessons = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`${API_BASE_URL}/lessons`, {
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
        setLessons(data.lessons);
      } else {
        throw new Error(data.message || 'Failed to fetch lessons');
      }
    } catch (err) {
      console.error('Error fetching lessons:', err);
      setError(err instanceof Error ? err.message : 'Failed to load lessons');
      
      // Fallback to mock data if API fails
      setLessons([
        {
          id: 'alphabet',
          name: 'Alphabet Learning',
          description: 'Learn the alphabet with fun activities',
          skills: ['Reading', 'Letter Recognition', 'Phonics'],
          difficulty: 'Easy',
          duration: 15,
          category: 'Language'
        },
        {
          id: 'numbers',
          name: 'Number Counting',
          description: 'Master counting from 1 to 20',
          skills: ['Math', 'Counting', 'Number Recognition'],
          difficulty: 'Easy',
          duration: 20,
          category: 'Math'
        },
        {
          id: 'colors',
          name: 'Color Recognition',
          description: 'Learn colors through interactive games',
          skills: ['Visual Learning', 'Color Theory', 'Memory'],
          difficulty: 'Easy',
          duration: 10,
          category: 'Art'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleLessonPress = (lesson: Lesson) => {
    console.log('Lesson pressed:', lesson.name);
    // TODO: Navigate to lesson or show lesson details
  };

  const completeLesson = async (lessonId: string, score?: number, timeSpent?: number) => {
    try {
      const response = await fetch(`${API_BASE_URL}/lessons/${lessonId}/complete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer mock-token' // This would be a real JWT token in production
        },
        body: JSON.stringify({
          score: score || 100,
          timeSpent: timeSpent || 15
        })
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Lesson completed:', data);
        // TODO: Show success message
      }
    } catch (error) {
      console.error('Error completing lesson:', error);
    }
  };

  return (
    <ImageBackground 
      source={require('../../assets/backgroundImages/Library.png')} 
      style={styles.container}
      resizeMode="stretch"
    >
      <View style={styles.scrollerWrapper}>
        <Text style={styles.sectionTitle}>Lessons: </Text>
        
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#fff" />
            <Text style={styles.loadingText}>Loading lessons...</Text>
          </View>
        ) : error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>⚠️ {error}</Text>
            <Text style={styles.fallbackText}>Showing offline lessons</Text>
          </View>
        ) : null}
        
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {lessons.map((lesson) => (
            <TouchableOpacity 
              key={lesson.id} 
              style={styles.card}
              onPress={() => handleLessonPress(lesson)}
              activeOpacity={0.7}
            >
              <Image
                source={require('../../assets/images/library/blueBook.png')}
                style={styles.cardImage}
                resizeMode="contain"
              />
              <Text style={styles.lessonName}>{lesson.name}</Text>
              <Text style={styles.lessonDifficulty}>{lesson.difficulty}</Text>
              <Text style={styles.lessonDuration}>{lesson.duration} min</Text>
              <View style={styles.skillsContainer}>
                {lesson.skills.slice(0, 2).map((skill, index) => (
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
  container: {
    flex: 1,
    alignItems: 'center',
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
  card: {
    width: 160,
    height: 180,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.15)',
    padding: 8,
    marginRight: 8,
    marginLeft: 4,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
  },
  cardImage: {
    width: 60,
    height: 60,
    marginBottom: 8,
  },
  lessonName: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 2,
  },
  lessonDifficulty: {
    color: '#FFD700',
    fontSize: 10,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 2,
  },
  lessonDuration: {
    color: '#87CEEB',
    fontSize: 9,
    textAlign: 'center',
    marginBottom: 6,
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 2,
  },
  skillTag: {
    color: '#87CEEB',
    fontSize: 7,
    backgroundColor: 'rgba(135, 206, 235, 0.2)',
    paddingHorizontal: 3,
    paddingVertical: 1,
    borderRadius: 3,
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
});
