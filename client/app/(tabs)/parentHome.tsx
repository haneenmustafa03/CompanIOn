import {
  ImageBackground,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { useAuth } from "../../contexts/AuthContext";
import Ionicons from "@expo/vector-icons/Ionicons";
import SmallRobot from "@/components/smallRobot";

export default function ParentHomeScreen() {
  return (
    <ImageBackground
      source={require("../../assets/backgroundImages/parentHome.png")}
      style={styles.container}
      resizeMode="stretch"
    >
      <View style={styles.robotContainer}>
        <SmallRobot size={1.8} />
        <SmallRobot size={1.3} />
      </View>

      <View>
        <View style={styles.scrollerWrapper}>
          <Text style={styles.sectionTitle}>Your Children: </Text>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,

    backgroundSize: "contain",
    backgroundPosition: "center",
    width: "100%",
    height: "100%",
  },
  robotContainer: {
    top: "15%",
    flexDirection: "row",
    justifyContent: "space-around",
  },
  scrollerWrapper: {
    marginTop: 100,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1a1a1a",
    marginBottom: 12,
  },
});
