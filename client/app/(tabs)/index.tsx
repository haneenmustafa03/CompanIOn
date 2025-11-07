import { Audio, ResizeMode, Video } from 'expo-av';
import { useRef, useState } from 'react';
import { useAuth } from "../../contexts/AuthContext";
import { Alert, Image, ImageBackground, StyleSheet, TouchableOpacity, View } from 'react-native';
import SmallRobot from '../../components/smallRobot';

export default function Index() {
  const [isRecording, setIsRecording] = useState(false);
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const recordingTimeout = useRef<any>(null);

  const startRecording = async () => {
    try {
      console.log('Requesting permissions...');
      const permission = await Audio.requestPermissionsAsync();
      
      if (permission.status !== 'granted') {
        Alert.alert('Permission Required', 'Please grant microphone permission to record audio.');
        return;
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      console.log('Starting recording...');
      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      
      setRecording(recording);
      setIsRecording(true);
      console.log('Recording started');

      // Auto-stop after 10 seconds
      recordingTimeout.current = setTimeout(() => {
        stopRecording();
      }, 10000);

    } catch (err) {
      console.error('Failed to start recording', err);
      Alert.alert('Error', 'Failed to start recording. Please try again.');
    }
  };

  const stopRecording = async () => {
    if (!recording) return;

    console.log('Stopping recording...');
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
      console.log('Recording stopped and stored at', uri);
      
      setRecording(null);

      if (uri) {
        // TODO: Send audio to Python chatbot
        await sendAudioToChatbot(uri);
      }
    } catch (err) {
      console.error('Failed to stop recording', err);
    }
  };

  const sendAudioToChatbot = async (audioUri: string) => {
    try {
      console.log('📤 Sending audio to chatbot:', audioUri);
      
      // Create form data with the audio file
      const formData = new FormData();
      
      // For web, we need to fetch the blob and convert it to a file
      if (audioUri.startsWith('blob:')) {
        console.log('🌐 Web platform detected, converting blob to file...');
        const response = await fetch(audioUri);
        const blob = await response.blob();
        
        // Create a file from the blob
        const file = new File([blob], 'recording.m4a', { type: 'audio/m4a' });
        formData.append('audio', file);
      } else {
        // For mobile (React Native)
        const uriParts = audioUri.split('/');
        const fileName = uriParts[uriParts.length - 1];
        
        formData.append('audio', {
          uri: audioUri,
          type: 'audio/m4a',
          name: fileName || 'recording.m4a',
        } as any);
      }
      
      console.log('🌐 Sending request to server...');
      
      // Send to your Express server
      const response = await fetch('http://localhost:5001/api/chatbot/process-audio', {
        method: 'POST',
        body: formData,
        // Don't set Content-Type header - let the browser set it with boundary
      });
      
      console.log('📨 Response status:', response.status);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to process audio');
      }
      
      const result = await response.json();
      console.log('✅ Chatbot response:', result);
      
      if (result.success && result.text) {
        Alert.alert('Companion Says:', result.text);
        
        // Play the TTS audio response
        if (result.audioFile) {
          await playTTSResponse(result.audioFile, result.audioMimeType);
        }
      }
      
    } catch (err) {
      console.error('❌ Failed to send audio to chatbot', err);
      Alert.alert('Error', 'Failed to communicate with chatbot. Make sure the server is running.');
    }
  };

  const playTTSResponse = async (audioBase64: string, mimeType: string) => {
    try {
      console.log('🔊 Playing TTS response...');
      
      // Convert base64 to data URI
      const audioDataUri = `data:${mimeType};base64,${audioBase64}`;
      
      // Create and play the sound
      const { sound } = await Audio.Sound.createAsync(
        { uri: audioDataUri },
        { shouldPlay: true }
      );
      
      console.log('▶️ TTS audio playing...');
      
      // Clean up sound after it finishes
      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded && status.didJustFinish) {
          console.log('✅ TTS playback finished');
          sound.unloadAsync();
        }
      });
      
    } catch (err) {
      console.error('❌ Failed to play TTS audio', err);
      Alert.alert('Error', 'Received response but failed to play audio.');
    }
  };

  const handleMicrophonePress = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  return (
    <ImageBackground 
      source={require('../../assets/backgroundImages/Home.png')} 
      // source={({ uri: 'https://via.placeholder.com/800x1400.png?text=TEST+BACKGROUND' })}
      style={styles.container}
      resizeMode="stretch"
    >
      <View style={styles.animationContainer}>
        <Video
          // source={require('../../assets/animations/robotAnimation.mp4')}
          // style={styles.robotAnimation}
          resizeMode={ResizeMode.CONTAIN}
          shouldPlay
          isLooping
          isMuted
        />
      </View>

      {/* <Text style={{ color: 'white', fontSize: 24, marginBottom: 20 }}>
        hi there
      </Text> */}

      <SmallRobot size={2} />  
      
      {/* Recording Button */}
      <TouchableOpacity 
        onPress={handleMicrophonePress}
        activeOpacity={1}
        style={styles.microphoneButton}
      >
        <Image 
          source={require('../../assets/UIElements/microphone.png')} 
          style={[
            styles.image,
            { opacity: isRecording ? 0.5 : 1 }
          ]} 
        />
      </TouchableOpacity>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#25292e",
    alignItems: "center",
    backgroundSize: "contain",
    backgroundPosition: "center",
    width: "105%",
    height: "100%",
  },
  parentContainer: {
    flex: 1,
    backgroundColor: "#C0CFE0",
    alignItems: "center",
    backgroundSize: "contain",
    backgroundPosition: "center",
    width: "100%",
    height: "100%",
  },
  animationContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "60%",
  },
  robotAnimation: {
    width: 300,
    height: 300,
  },
  imageContainer: {
    flex: 1,
  },
  microphoneButton: {
    position: 'absolute',
    bottom: 10,
  },
  image: {
    width: 140,
    height: 140,
    position: "absolute",
    bottom: 10,
  },
  title: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 10,
    marginLeft: 10,
  },
  parentRobotWrapper: {
    flex: 1,
    bottom: -200,
    right: -100,
  },
});

export default function Index() {
  const { user } = useAuth();
  if (user?.accountType === "child") {
    return (
      <ImageBackground
        source={require("../../assets/backgroundImages/Home.png")}
        // source={({ uri: 'https://via.placeholder.com/800x1400.png?text=TEST+BACKGROUND' })}
        style={styles.container}
        resizeMode="stretch"
      >
        {/* <Text style={styles.title}>Welcome {user?.name || "User"}!!</Text> */}
        <View style={styles.animationContainer}>
          <Video
            // source={require('../../assets/animations/robotAnimation.mp4')}
            // style={styles.robotAnimation}
            resizeMode={ResizeMode.CONTAIN}
            shouldPlay
            isLooping
            isMuted
          />
        </View>
        <SmallRobot size={2} />

        <Image
          source={require("../../assets/UIElements/microphone.png")}
          style={styles.image}
        />
      </ImageBackground>
    );
  } else {
    return (
      <ImageBackground
        // source={require("../../assets/backgroundImages/parentHome.png")}
        style={styles.parentContainer}
        resizeMode="stretch"
      >
        <Text style={styles.title}>Welcome {user?.name || "User"}!!</Text>
        <View>
          <Text>Your children: </Text>
        </View>
        <View style={styles.parentRobotWrapper}>
          <SmallRobot size={1.3} />
        </View>
      </ImageBackground>
    );
  }
}
