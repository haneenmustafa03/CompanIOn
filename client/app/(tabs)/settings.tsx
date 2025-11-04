import { ImageBackground, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useAuth } from "../../contexts/AuthContext";

export default function SettingsScreen() {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <ImageBackground 
      source={require('../../assets/backgroundImages/Settings.png')} 
      style={styles.container}
      resizeMode="stretch"
    >
      <View style={styles.content}>
        <Text style={styles.text}>Settings</Text>
        {user && (
          <View style={styles.userInfo}>
            <Text style={styles.userText}>Logged in as: {user.name}</Text>
            <Text style={styles.userText}>Account Type: {user.accountType}</Text>
          </View>
        )}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
      </View>
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
  content: {
    padding: 20,
  },
  userInfo: {
    marginTop: 20,
    padding: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  userText: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 8,
  },
  logoutButton: {
    marginTop: 30,
    backgroundColor: '#E94C4C',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  logoutText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
