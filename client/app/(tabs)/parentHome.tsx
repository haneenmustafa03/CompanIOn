import {
  ImageBackground,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Image,
} from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "../../contexts/AuthContext";
import Ionicons from "@expo/vector-icons/Ionicons";
import SmallRobot from "@/components/smallRobot";
import SmallRobotHead from "@/components/smallRobotHead";

export default function ParentHomeScreen() {
  const router = useRouter();

  const handleChildPress = (childId: string, childName: string) => {
    router.push({
      pathname: "/childDetail",
      params: {
        childId,
        childName,
        childColor: "#d6b3d6ff",
      },
    });
  };

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
          <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
            {/* Render child profiles here */}
            <TouchableOpacity
              style={{
                width: 150,
                height: 200,
                backgroundColor: "rgba(179, 141, 28, 0.3)",
                borderRadius: 12,
                marginRight: 16,
                justifyContent: "center",
                alignItems: "center",
              }}
              onPress={() => handleChildPress("olivia-001", "Olivia")}
            >
              {/* <Ionicons name="person-circle" size={80} color="white" /> */}
              {/* <Image source={require('@/assets')}/> */}
              <View style={{ marginBottom: 20 }}>
                <SmallRobotHead color="#d6b3d6ff" />
              </View>
              <Text style={{ fontSize: 24, color: "white", marginTop: 8 }}>
                Olivia
              </Text>
            </TouchableOpacity>
            {/* </ScrollView> */}

            <TouchableOpacity
              style={{
                width: 150,
                height: 200,
                backgroundColor: "rgba(179, 141, 28, 0.3)",
                borderRadius: 12,
                marginRight: 16,
                justifyContent: "center",
                alignItems: "center",
              }}
              onPress={() => handleChildPress("olivia-001", "Olivia")}
            >
              {/* <Ionicons name="person-circle" size={80} color="white" /> */}
              {/* <Image source={require('@/assets')}/> */}
              <View style={{ marginBottom: 20 }}>
                <SmallRobotHead color="#b3d6d6ff" />
              </View>
              <Text style={{ fontSize: 24, color: "white", marginTop: 8 }}>
                Eddy
              </Text>
            </TouchableOpacity>
          </ScrollView>
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
    // paddingBottom: 20,
  },
  scrollerWrapper: {
    marginTop: 100,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "white",
    marginBottom: 12,
  },
});
