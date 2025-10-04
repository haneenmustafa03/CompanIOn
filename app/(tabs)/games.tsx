import { ImageBackground, StyleSheet } from 'react-native';

export default function GamesScreen() {
  return (
    <ImageBackground 
      source={require('../../assets/backgroundImages/Kitchen.png')} 
      style={styles.container}
      resizeMode="stretch"
    >
      {/* <Text style={styles.text}>Games screen</Text> */}
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundSize: 'contain',
    backgroundPosition: 'center',
    width: '105%',
    height: '100%',
  },
  text: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
});