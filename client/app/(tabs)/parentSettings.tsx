import {
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  Alert,
  Switch,
} from "react-native";
import { useAuth } from "../../contexts/AuthContext";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useState } from "react";

export default function ParentSettingsScreen() {
  const { user, logout } = useAuth();
  const [notifications, setNotifications] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [weeklyReports, setWeeklyReports] = useState(true);

  const handleLogout = async () => {
    Alert.alert("Log Out", "Are you sure you want to log out?", [
      { text: "Cancel", onPress: () => {}, style: "cancel" },
      {
        text: "Log Out",
        onPress: async () => {
          await logout();
        },
        style: "destructive",
      },
    ]);
  };

  const handleEditProfile = () => {
    Alert.alert("Edit Profile", "Feature coming soon");
    // TODO: Navigate to edit profile
  };

  const handleManageChildren = () => {
    Alert.alert("Manage Children", "Feature coming soon");
    // TODO: Navigate to manage children
  };

  const handleChangePassword = () => {
    Alert.alert("Change Password", "Feature coming soon");
    // TODO: Implement change password flow
  };

  const handleContactSupport = () => {
    Alert.alert("Contact Support", "Feature coming soon");
    // TODO: Implement contact support
  };

  return (
    <ImageBackground
      source={require("../../assets/backgroundImages/Settings.png")}
      style={styles.container}
      resizeMode="stretch"
    >
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Settings</Text>

        {/* Profile Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Profile</Text>
          <View style={styles.profileCard}>
            <View style={styles.profileHeader}>
              <View style={styles.avatarPlaceholder}>
                <Ionicons name="person" size={32} color="#fff" />
              </View>
              <View style={styles.profileInfo}>
                <Text style={styles.profileName}>{user?.name || "Parent"}</Text>
                <Text style={styles.profileEmail}>{user?.email || "N/A"}</Text>
              </View>
            </View>
          </View>

          <TouchableOpacity style={styles.menuItem} onPress={handleEditProfile}>
            <View style={styles.menuItemLeft}>
              <Ionicons name="pencil" size={20} color="#2D62A6" />
              <Text style={styles.menuItemText}>Edit Profile</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#ccc" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={handleManageChildren}
          >
            <View style={styles.menuItemLeft}>
              <Ionicons name="people" size={20} color="#2D62A6" />
              <Text style={styles.menuItemText}>Manage Children</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#ccc" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={handleChangePassword}
          >
            <View style={styles.menuItemLeft}>
              <Ionicons name="lock-closed" size={20} color="#2D62A6" />
              <Text style={styles.menuItemText}>Change Password</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#ccc" />
          </TouchableOpacity>
        </View>

        {/* Notifications Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notifications</Text>

          <View style={styles.toggleItem}>
            <View style={styles.toggleItemLeft}>
              <Ionicons name="notifications" size={20} color="#2D62A6" />
              <Text style={styles.toggleItemText}>Push Notifications</Text>
            </View>
            <Switch
              value={notifications}
              onValueChange={setNotifications}
              trackColor={{ false: "#e0e0e0", true: "#B8D4E8" }}
              thumbColor={notifications ? "#2D62A6" : "#999"}
            />
          </View>

          <View style={styles.toggleItem}>
            <View style={styles.toggleItemLeft}>
              <Ionicons name="mail" size={20} color="#2D62A6" />
              <Text style={styles.toggleItemText}>Email Alerts</Text>
            </View>
            <Switch
              value={emailAlerts}
              onValueChange={setEmailAlerts}
              trackColor={{ false: "#e0e0e0", true: "#B8D4E8" }}
              thumbColor={emailAlerts ? "#2D62A6" : "#999"}
            />
          </View>

          <View style={styles.toggleItem}>
            <View style={styles.toggleItemLeft}>
              <Ionicons name="document" size={20} color="#2D62A6" />
              <Text style={styles.toggleItemText}>Weekly Reports</Text>
            </View>
            <Switch
              value={weeklyReports}
              onValueChange={setWeeklyReports}
              trackColor={{ false: "#e0e0e0", true: "#B8D4E8" }}
              thumbColor={weeklyReports ? "#2D62A6" : "#999"}
            />
          </View>
        </View>

        {/* Help & Support Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Help & Support</Text>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={handleContactSupport}
          >
            <View style={styles.menuItemLeft}>
              <Ionicons name="help-circle" size={20} color="#2D62A6" />
              <Text style={styles.menuItemText}>Contact Support</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#ccc" />
          </TouchableOpacity>

          <View style={styles.infoBox}>
            <Ionicons name="information-circle" size={20} color="#2D62A6" />
            <View style={styles.infoBoxText}>
              <Text style={styles.infoBoxTitle}>App Version</Text>
              <Text style={styles.infoBoxValue}>1.0.0</Text>
            </View>
          </View>
        </View>

        {/* Logout Section */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out" size={20} color="#fff" />
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>

        <View style={styles.spacer} />
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#C0CFE0",
    backgroundSize: "contain",
    backgroundPosition: "center",
    width: "100%",
    height: "100%",
  },
  content: {
    flex: 1,
    padding: 16,
  },
  title: {
    color: "#1a1a1a",
    fontSize: 28,
    fontWeight: "bold",
    marginTop: 12,
    marginBottom: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1a1a1a",
    marginBottom: 12,
  },
  profileCard: {
    backgroundColor: "rgba(45, 98, 166, 0.1)",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "rgba(45, 98, 166, 0.2)",
  },
  profileHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  avatarPlaceholder: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#2D62A6",
    justifyContent: "center",
    alignItems: "center",
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1a1a1a",
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 13,
    color: "#666",
  },
  menuItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 14,
    marginBottom: 8,
  },
  menuItemLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  menuItemText: {
    fontSize: 15,
    color: "#1a1a1a",
    fontWeight: "500",
  },
  toggleItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 14,
    marginBottom: 8,
  },
  toggleItemLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  toggleItemText: {
    fontSize: 15,
    color: "#1a1a1a",
    fontWeight: "500",
  },
  infoBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(45, 98, 166, 0.1)",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 14,
    gap: 12,
    borderWidth: 1,
    borderColor: "rgba(45, 98, 166, 0.2)",
  },
  infoBoxText: {
    flex: 1,
  },
  infoBoxTitle: {
    fontSize: 13,
    color: "#666",
    marginBottom: 2,
  },
  infoBoxValue: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1a1a1a",
  },
  logoutButton: {
    backgroundColor: "#E94C4C",
    borderRadius: 8,
    paddingVertical: 14,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    marginTop: 24,
  },
  logoutText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  spacer: {
    height: 20,
  },
});
