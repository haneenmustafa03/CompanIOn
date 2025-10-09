import { ImageBackground, StyleSheet, Text } from "react-native";

export default function SettingsScreen() {
  return (
    <ImageBackground 
      source={require('../../assets/backgroundImages/Settings.png')} 
      style={styles.container}
      resizeMode="stretch"
    >
      <Text style={styles.text}>Settings</Text>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: "center",
    // alignItems: "center",
    // backgroundImage: require('../../assets/images/background.png'),
    backgroundColor: "#25292e",
    backgroundSize: 'contain',
    backgroundPosition: 'center',
    width: '100%',
    height: '100%',
  },
  text: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 10,
    marginLeft: 10,
  },
});
