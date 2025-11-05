import { ResizeMode, Video } from "expo-av";
import { useAuth } from "../../contexts/AuthContext";
import { Image, ImageBackground, StyleSheet, View, Text } from "react-native";
import SmallRobot from "../../components/smallRobot";

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
