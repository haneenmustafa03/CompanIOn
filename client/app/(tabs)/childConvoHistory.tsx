import {
  ImageBackground,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Image,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useAuth } from "../../contexts/AuthContext";
import Ionicons from "@expo/vector-icons/Ionicons";
import SmallRobot from "@/components/smallRobot";
import SmallRobotHead from "@/components/smallRobotHead";

export default function ChildConvoHistoryScreen() {
  const router = useRouter();
  const { childId, childName } = useLocalSearchParams();
  return (
    <ImageBackground
      source={require("../../assets/backgroundImages/parentHome.png")}
      style={styles.container}
      resizeMode="stretch"
    >
      <Text style={styles.title}>Child Convo History</Text>
      <View style={styles.content}>
        <Text>{childName}</Text>
        <Text>{childId}</Text>
        <Text>Conversation History</Text>
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
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "black",
    marginBottom: 20,
    textAlign: "center",
  },
  content: {
    flex: 1,
    padding: 20,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 12,
    marginBottom: 20,
  },
});
