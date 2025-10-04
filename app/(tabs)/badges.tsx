import { StyleSheet } from 'react-native';

export default function BadgesScreen() {
  return (
    <ImageBackground
      source={require('../../assets/backgroundImages/Badges.png')} 
      style={styles.container}
      resizeMode="stretch"
    >
      {/* <Text style={styles.text}>Badges screen</Text> */}
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#25292e',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: '#fff',
  },
});