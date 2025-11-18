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
import { useEffect, useState } from "react";

export default function ParentHomeScreen() {
  const router = useRouter();
  const { token } = useAuth();

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

  const [children, setChildren] = useState<any[]>([]);

  useEffect(() => {
    const fetchChildren = async () => {
      if (!token) {
        console.log("No token available");
        return;
      }

      try {
        const response = await fetch(
          "http://localhost:5001/api/parent/children",
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        if (data.success) {
          setChildren(data.children);
        }
      } catch (error) {
        console.error("Error fetching children:", error);
      }
    };
    fetchChildren();
  }, [token]);

  console.log("children", children);

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
            {children.length > 0 ? (
              children.map((child: any) => (
                <TouchableOpacity
                  key={child._id}
                  style={{
                    width: 150,
                    height: 200,
                    backgroundColor: "rgba(179, 141, 28, 0.3)",
                    borderRadius: 12,
                    marginRight: 16,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                  onPress={() => handleChildPress(child._id, child.name)}
                >
                  <View style={{ marginBottom: 20 }}>
                    <SmallRobotHead color="lightblue" />
                  </View>
                  <Text style={{ fontSize: 24, color: "white", marginTop: 8 }}>
                    {child.name}
                  </Text>
                </TouchableOpacity>
              ))
            ) : (
              <Text style={{ color: "white", fontSize: 16, padding: 20 }}>
                No children found
              </Text>
            )}
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
