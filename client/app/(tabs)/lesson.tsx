import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Image, ImageBackground, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import SmallRobot from "../../components/smallRobot";

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

export default function LessonScreen() {
  const { lessonId } = useLocalSearchParams();
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (lessonId) {
      fetchLesson();
    }
  }, [lessonId]);

  const fetchLesson = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`${API_BASE_URL}/lessons/${lessonId}`, {
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
        setLesson(data.lesson);
      } else {
        throw new Error(data.message || 'Failed to fetch lesson');
      }
    } catch (err) {
      console.error('Error fetching lesson:', err);
      setError(err instanceof Error ? err.message : 'Failed to load lesson');
    } finally {
      setLoading(false);
    }
  };
  if (loading) {
    return (
      <ImageBackground source={require('../../assets/backgroundImages/Lesson.png')} style={styles.container} resizeMode="stretch">
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#5d9f4e" />
          <Text style={styles.loadingText}>Loading lesson...</Text>
        </View>
      </ImageBackground>
    );
  }

  if (error || !lesson) {
    return (
      <ImageBackground source={require('../../assets/backgroundImages/Lesson.png')} style={styles.container} resizeMode="stretch">
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>⚠️ {error || 'Lesson not found'}</Text>
        </View>
      </ImageBackground>
    );
  }

  return (
    <ImageBackground source={require('../../assets/backgroundImages/Lesson.png')} style={styles.container} resizeMode="stretch">
      <View style={styles.lessonContainer}>
        <Text style={styles.lessonTitle}>{lesson.name}</Text>
        <Text style={styles.lessonDescription}>{lesson.description}</Text>
        <Text style={styles.lessonDuration}>Duration: {lesson.duration} minutes</Text>
        <Text style={styles.lessonSkills}>Skills: {lesson.skills.join(', ')}</Text>
        <Text style={styles.lessonDifficulty}>Difficulty: {lesson.difficulty}</Text>
        <Text style={styles.lessonCategory}>Category: {lesson.category}</Text>
      </View>
      <View style={styles.robotWrapper}>
        <SmallRobot size={1.7} />  
      </View>

      <View style={styles.buttonWrapper}>
        <TouchableOpacity style={styles.startButton}>
          <Image source={require('../../assets/UIElements/pillMic.png')} style={styles.startButtonImage} />
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        height: '100%',
      },
      lessonContainer: {
        position: 'absolute',
        // top: 100,
        backgroundColor: "#ffffff",
        opacity: 0.9,
        margin: '5%',
        borderRadius: 10,
        width: '93%',
        height: '93%',
      },
      lessonTitle: {
        textAlign: 'center',    
        fontSize: 24,
        fontFamily: 'Poppins-SemiBold',
        fontWeight: 'bold',
        color: '#5d9f4e',
        
        padding: 10,
      },
      lessonDescription: {
        textAlign: 'center',
        fontSize: 16,
        fontFamily: 'Quicksand',
        // font-family: "Nunito", "Quicksand", "Poppins", sans-serif;
        color: 'black',
        paddingLeft: 10,
        paddingRight: 10,
      },
      lessonDuration: {
        textAlign: 'center',
        fontSize: 16,
        fontFamily: 'Poppins-Regular',
        color: 'black',
        // marginBottom: 10,
        paddingLeft: 10,
        paddingRight: 10,
      },
      lessonSkills: {
        textAlign: 'center',
        fontSize: 16,
        fontFamily: 'Poppins-Regular',
        color: 'black',
        // marginBottom: 10,
        paddingLeft: 10,
        paddingRight: 10,
    },
      robotWrapper: {
        position: 'absolute',
        bottom: 170,
        left: 0,
        right: 0,
        alignItems: 'center',
        justifyContent: 'center',
      },
      buttonWrapper: {
        position: 'absolute',
        bottom: 50,
        left: '24%',
        alignItems: 'center',
        justifyContent: 'center',
      },
      startButton: {   
        width: 100,
        height: 100,
      },
      startButtonImage: {
        width: 200,
        height: 100,
      },
      lessonDifficulty: {
        textAlign: 'center',
        fontSize: 16,
        fontFamily: 'Poppins-Regular',
        color: 'black',
        paddingLeft: 10,
        paddingRight: 10,
      },
      lessonCategory: {
        textAlign: 'center',
        fontSize: 16,
        fontFamily: 'Poppins-Regular',
        color: 'black',
        paddingLeft: 10,
        paddingRight: 10,
      },
      loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      },
      loadingText: {
        color: '#5d9f4e',
        fontSize: 18,
        marginTop: 10,
        fontFamily: 'Poppins-Regular',
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
});