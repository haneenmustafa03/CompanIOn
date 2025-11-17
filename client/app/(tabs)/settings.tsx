import {
  Alert,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useAuth } from "../../contexts/AuthContext";

export default function SettingsScreen() {
  const { user, logout } = useAuth();
  const API_BASE_URL =
    process.env.EXPO_PUBLIC_API_BASE_URL ?? "http://localhost:5001";

  const clearConversationHistory = async () => {
    if (!API_BASE_URL) {
      Alert.alert("Error", "API base URL is not configured.");
      console.error("API_BASE_URL is not defined");
      return;
    }

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/chatbot/clear-conversation-history`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }

      const data = await response.json();
      if (data.success) {
        Alert.alert("Success", "Conversation history cleared.");
        console.log("Conversation history cleared");
      } else {
        throw new Error(data.message || "Unknown error from server");
      }
    } catch (error) {
      console.error("Failed to clear conversation history", error);
      Alert.alert(
        "Error",
        "Failed to clear conversation history. Please try again."
      );
    }
  };
  const handleLogout = async () => {
    await logout();
  };

  return (
    <ImageBackground
      source={require("../../assets/backgroundImages/childSettings.png")}
      style={styles.container}
      resizeMode="stretch"
    >
      <View style={styles.content}>
        <Text style={styles.text}>Settings</Text>
        {user && (
          <View style={styles.userInfo}>
            <Text style={styles.userText}>Logged in as: {user.name}</Text>
            <Text style={styles.userText}>
              Account Type: {user.accountType}
            </Text>
          </View>
        )}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <Text style={styles.text}>Debug Settings and Logs</Text>
        <TouchableOpacity
          style={styles.debugButton}
          onPress={clearConversationHistory}
        >
          <Text style={styles.debugText}>Clear Conversation History</Text>
        </TouchableOpacity>
        {/* <Text style={styles.debugText}>
          {JSON.stringify(user || "No user found")}
        </Text> */}
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#25292e",
    width: "100%",
    height: "100%",
  },
  text: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 10,
    marginLeft: 10,
  },
  debugButton: {
    marginTop: 10,
    backgroundColor: "#E94C4C",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
  },
  debugText: {
    color: "#fff",
    fontSize: 16,
    marginBottom: 8,
  },
  content: {
    padding: 20,
  },
  userInfo: {
    marginTop: 20,
    padding: 16,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  userText: {
    color: "#fff",
    fontSize: 16,
    marginBottom: 8,
  },
  logoutButton: {
    marginTop: 30,
    backgroundColor: "#E94C4C",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
  },
  logoutText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
