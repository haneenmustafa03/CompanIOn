import { ImageBackground, StyleSheet } from "react-native";

export default function BadgesScreen() {
  return (
    <ImageBackground
      source={require("../../assets/backgroundImages/Awards.png")}
      style={styles.container}
      resizeMode="stretch"
    >
      {/* <Image source={require('../../assets/UIElements/microphone.png')} style={styles.image} /> */}
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  scrollerWrapper: {
    position: "absolute",
    bottom: 30,
    left: 0,
    right: 0,
  },

  container: {
    flex: 1,
    backgroundColor: "#25292e",
    justifyContent: "center",
    alignItems: "center",
    backgroundSize: "contain",
    backgroundPosition: "center",
    width: "100%",
    height: "100%",
  },
  text: {
    color: "#fff",
  },
});
