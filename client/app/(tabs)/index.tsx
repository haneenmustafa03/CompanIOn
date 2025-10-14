import { ResizeMode, Video } from 'expo-av';
import { Image, ImageBackground, StyleSheet, View } from 'react-native';
import SmallRobot from '../../components/smallRobot';

export default function Index() {
  return (
    <ImageBackground 
      source={require('../../assets/backgroundImages/Home.png')} 
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

      <SmallRobot />  
      
      <Image source={require('../../assets/UIElements/microphone.png')} style={styles.image} />
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#25292e',
    alignItems: 'center',
    backgroundSize: 'contain',
    backgroundPosition: 'center',
    width: '105%',
    height: '100%',
  },
  animationContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '60%',
  },
  robotAnimation: {
    width: 300,
    height: 300,
  },
  imageContainer: {
    flex: 1,
  },
  image: {
    width: 140,
    height: 140,
    position: 'absolute',
    bottom: 10,
  },
});
