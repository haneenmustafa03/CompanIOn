import { useLocalSearchParams } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { Audio } from "expo-av";
import {
  Alert,
  ActivityIndicator,
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import SmallRobot from "../../components/smallRobot";
import SmallRobotHead from "@/components/smallRobotHead";

const API_BASE_URL = "http://localhost:5001/api";

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
  const { user } = useAuth();
  const [isRecording, setIsRecording] = useState(false);
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const recordingTimeout = useRef<any>(null);
  const { lessonId } = useLocalSearchParams();
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (lessonId) {
      fetchLesson();
    }
  }, [lessonId]);

  const startRecording = async () => {
    try {
      console.log("Requesting permissions...");
      const permission = await Audio.requestPermissionsAsync();

      if (permission.status !== "granted") {
        Alert.alert(
          "Permission Required",
          "Please grant microphone permission to record audio."
        );
        return;
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      console.log("Starting recording...");
      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );

      setRecording(recording);
      setIsRecording(true);
      console.log("Recording started");

      // Auto-stop after 10 seconds
      recordingTimeout.current = setTimeout(() => {
        stopRecording();
      }, 10000);
    } catch (err) {
      console.error("Failed to start recording", err);
      Alert.alert("Error", "Failed to start recording. Please try again.");
    }
  };

  const stopRecording = async () => {
    if (!recording) return;

    console.log("Stopping recording...");
    setIsRecording(false);

    // Clear auto-stop timeout
    if (recordingTimeout.current) {
      clearTimeout(recordingTimeout.current);
      recordingTimeout.current = null;
    }

    try {
      await recording.stopAndUnloadAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
      });

      const uri = recording.getURI();
      console.log("Recording stopped and stored at", uri);

      setRecording(null);

      if (uri) {
        // TODO: Send audio to Python chatbot
        await sendAudioToChatbot(uri);
      }
    } catch (err) {
      console.error("Failed to stop recording", err);
    }
  };

  const sendAudioToChatbot = async (audioUri: string) => {
    try {
      console.log("📤 Sending audio to chatbot:", audioUri);

      // Create form data with the audio file
      const formData = new FormData();

      // For web, we need to fetch the blob and convert it to a file
      if (audioUri.startsWith("blob:")) {
        console.log("🌐 Web platform detected, converting blob to file...");
        const response = await fetch(audioUri);
        const blob = await response.blob();

        // Create a file from the blob
        const file = new File([blob], "recording.m4a", { type: "audio/m4a" });
        formData.append("audio", file);
      } else {
        // For mobile (React Native)
        const uriParts = audioUri.split("/");
        const fileName = uriParts[uriParts.length - 1];

        formData.append("audio", {
          uri: audioUri,
          type: "audio/m4a",
          name: fileName || "recording.m4a",
        } as any);
      }

      // Safely append lesson data if available
      if (lesson) {
        formData.append(
          "lessonData",
          JSON.stringify({
            lessonId: lessonId,
            lessonName: lesson.name,
            lessonDescription: lesson.description,
            lessonSkills: lesson.skills,
            lessonDifficulty: lesson.difficulty,
            lessonCategory: lesson.category,
          })
        );
      } else {
        console.warn("No lesson data available to append to formData.");
      }

      console.log("🌐 Sending request to server...");
      formData.forEach((value, key) => {
        console.log("Key: ", key, "Value: ", value);
      });

      // Send to your Express server
      const response = await fetch(
        "http://localhost:5001/api/chatbot/process-audio",
        {
          method: "POST",
          body: formData,
          // Don't set Content-Type header - let the browser set it with boundary
        }
      );

      console.log("📨 Response status:", response.status);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to process audio");
      }

      const result = await response.json();
      console.log("✅ Chatbot response:", result);

      if (result.success && result.text) {
        Alert.alert("Companion Says:", result.text);

        // Play the TTS audio response
        if (result.audioFile) {
          await playTTSResponse(result.audioFile, result.audioMimeType);
        }
      }
    } catch (err) {
      console.error("❌ Failed to send audio to chatbot", err);
      Alert.alert(
        "Error",
        "Failed to communicate with chatbot. Make sure the server is running."
      );
    }
  };

  const playTTSResponse = async (audioBase64: string, mimeType: string) => {
    try {
      console.log("🔊 Playing TTS response...");

      // Convert base64 to data URI
      const audioDataUri = `data:${mimeType};base64,${audioBase64}`;

      // Create and play the sound
      const { sound } = await Audio.Sound.createAsync(
        { uri: audioDataUri },
        { shouldPlay: true }
      );

      console.log("▶️ TTS audio playing...");

      // Clean up sound after it finishes
      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded && status.didJustFinish) {
          console.log("✅ TTS playback finished");
          sound.unloadAsync();
        }
      });
    } catch (err) {
      console.error("❌ Failed to play TTS audio", err);
      Alert.alert("Error", "Received response but failed to play audio.");
    }
  };

  const handleMicrophonePress = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const fetchLesson = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${API_BASE_URL}/lessons/${lessonId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        setLesson(data.lesson);
      } else {
        throw new Error(data.message || "Failed to fetch lesson");
      }
    } catch (err) {
      console.error("Error fetching lesson:", err);
      setError(err instanceof Error ? err.message : "Failed to load lesson");
    } finally {
      setLoading(false);
    }
  };
  if (loading) {
    return (
      <ImageBackground
        source={require("../../assets/backgroundImages/Lesson.png")}
        style={styles.container}
        resizeMode="cover"
      >
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#5d9f4e" />
          <Text style={styles.loadingText}>Loading lesson...</Text>
        </View>
      </ImageBackground>
    );
  }

  if (error || !lesson) {
    return (
      <ImageBackground
        source={require("../../assets/backgroundImages/Lesson.png")}
        style={styles.container}
        resizeMode="cover"
      >
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>⚠️ {error || "Lesson not found"}</Text>
        </View>
      </ImageBackground>
    );
  }

  return (
    <ImageBackground
      source={require("../../assets/backgroundImages/Lesson.png")}
      style={styles.container}
      resizeMode="cover"
    >
      <View style={styles.lessonContainer}>
        <Text style={styles.lessonTitle}>{lesson.name}</Text>
        <Text style={styles.lessonDescription}>{lesson.description}</Text>
        <Text style={styles.lessonDuration}>
          Duration: {lesson.duration} minutes
        </Text>
        <Text style={styles.lessonSkills}>
          Skills: {lesson.skills.join(", ")}
        </Text>
        <Text style={styles.lessonDifficulty}>
          Difficulty: {lesson.difficulty}
        </Text>
        <Text style={styles.lessonCategory}>Category: {lesson.category}</Text>
      </View>
      <View style={styles.robotWrapper}>
        <SmallRobot size={1.7} color="lightblue" />
        {/* <SmallRobotHead size={1.7} color="#5d9f4e" /> */}
      </View>

      <View style={styles.buttonWrapper}>
        <TouchableOpacity
          style={styles.startButton}
          onPress={handleMicrophonePress}
        >
          <Image
            source={require("../../assets/UIElements/pillMic.png")}
            style={[
              styles.startButtonImage,
              { opacity: isRecording ? 0.5 : 1 },
            ]}
          />
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  lessonContainer: {
    position: "absolute",
    // top: 100,
    backgroundColor: "#ffffff",
    opacity: 0.9,
    margin: "5%",
    borderRadius: 10,
    width: "93%",
    height: "93%",
  },
  lessonTitle: {
    textAlign: "center",
    fontSize: 24,
    fontFamily: "Poppins-SemiBold",
    fontWeight: "bold",
    color: "#5d9f4e",

    padding: 10,
  },
  lessonDescription: {
    textAlign: "center",
    fontSize: 16,
    fontFamily: "Quicksand",
    // font-family: "Nunito", "Quicksand", "Poppins", sans-serif;
    color: "black",
    paddingLeft: 10,
    paddingRight: 10,
  },
  lessonDuration: {
    textAlign: "center",
    fontSize: 16,
    fontFamily: "Poppins-Regular",
    color: "black",
    // marginBottom: 10,
    paddingLeft: 10,
    paddingRight: 10,
  },
  lessonSkills: {
    textAlign: "center",
    fontSize: 16,
    fontFamily: "Poppins-Regular",
    color: "black",
    // marginBottom: 10,
    paddingLeft: 10,
    paddingRight: 10,
  },
  robotWrapper: {
    position: "absolute",
    bottom: 170,
    left: 0,
    right: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonWrapper: {
    position: "absolute",
    bottom: 50,
    left: "24%",
    alignItems: "center",
    justifyContent: "center",
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
    textAlign: "center",
    fontSize: 16,
    fontFamily: "Poppins-Regular",
    color: "black",
    paddingLeft: 10,
    paddingRight: 10,
  },
  lessonCategory: {
    textAlign: "center",
    fontSize: 16,
    fontFamily: "Poppins-Regular",
    color: "black",
    paddingLeft: 10,
    paddingRight: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    color: "#5d9f4e",
    fontSize: 18,
    marginTop: 10,
    fontFamily: "Poppins-Regular",
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
});
