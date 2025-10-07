import { Image, ImageBackground, StyleSheet } from 'react-native';


const PlaceholderImage = require('@/assets/images/background-image.png');

export default function Index() {
  return (
    <ImageBackground 
      source={require('../../assets/backgroundImages/Home.png')} 
      style={styles.container}
      resizeMode="stretch"
    >
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
