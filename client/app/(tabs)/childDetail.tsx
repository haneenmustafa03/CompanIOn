import { useLocalSearchParams, useRouter } from "expo-router";
import {
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import SmallRobotHead from "@/components/smallRobotHead";

export default function ChildDetailScreen() {
  const router = useRouter();
  const { childId, childName, childColor } = useLocalSearchParams();

  return (
    <ImageBackground
      source={require("../../assets/backgroundImages/parentHome.png")}
      style={styles.container}
      resizeMode="stretch"
    >
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{childName}</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.profileCard}>
          <SmallRobotHead color={childColor as string} />
          <Text style={styles.childName}>{childName}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Progress</Text>
          <View style={styles.statCard}>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Level</Text>
              <Text style={styles.statValue}>5</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Streak</Text>
              <Text style={styles.statValue}>12 days</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Badges</Text>
              <Text style={styles.statValue}>8</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Lessons Completed</Text>
          <View style={styles.itemList}>
            <View style={styles.listItem}>
              <Ionicons name="book" size={20} color="#E9940C" />
              <Text style={styles.listItemText}>Speech Training</Text>
              <Text style={styles.listItemStat}>12/15</Text>
            </View>
            <View style={styles.listItem}>
              <Ionicons name="book" size={20} color="#E9940C" />
              <Text style={styles.listItemText}>Shoe Tying</Text>
              <Text style={styles.listItemStat}>8/10</Text>
            </View>
            <View style={styles.listItem}>
              <Ionicons name="book" size={20} color="#E9940C" />
              <Text style={styles.listItemText}>Conversation Skills</Text>
              <Text style={styles.listItemStat}>10/12</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Games Played</Text>
          <View style={styles.itemList}>
            <View style={styles.listItem}>
              <Ionicons name="game-controller" size={20} color="#2D62A6" />
              <Text style={styles.listItemText}>Checkers</Text>
              <Text style={styles.listItemStat}>24 plays</Text>
            </View>
            <View style={styles.listItem}>
              <Ionicons name="game-controller" size={20} color="#2D62A6" />
              <Text style={styles.listItemText}>Matching</Text>
              <Text style={styles.listItemStat}>18 plays</Text>
            </View>
            <View style={styles.listItem}>
              <Ionicons name="game-controller" size={20} color="#2D62A6" />
              <Text style={styles.listItemText}>Storyteller</Text>
              <Text style={styles.listItemStat}>15 plays</Text>
            </View>
          </View>
        </View>

        <TouchableOpacity
          style={styles.convoHistoryButton}
          onPress={() =>
            router.push({
              pathname: "/childConvoHistory",
              params: {
                childId: childId as string,
                childName: childName as string,
              },
            })
          }
        >
          <Ionicons name="chatbubbles" size={20} color="white" />
          <Text style={styles.settingsButtonText}>Conversation History</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.settingsButton}
          onPress={() =>
            router.push({
              pathname: "/settings",
              params: {
                childId: childId as string,
                childName: childName as string,
              },
            })
          }
        >
          <Ionicons name="cog" size={20} color="white" />
          <Text style={styles.settingsButtonText}>Parental Controls</Text>
        </TouchableOpacity>
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#C0CFE0",
    width: "100%",
    height: "100%",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "rgba(0, 0, 0, 0.2)",
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
  content: {
    flex: 1,
    padding: 16,
  },
  profileCard: {
    alignItems: "center",
    paddingVertical: 24,
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderRadius: 12,
    marginBottom: 20,
  },
  childName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1a1a1a",
    marginTop: 12,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1a1a1a",
    marginBottom: 12,
  },
  statCard: {
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderRadius: 12,
    flexDirection: "row",
    padding: 16,
    justifyContent: "space-around",
  },
  statItem: {
    alignItems: "center",
  },
  statLabel: {
    fontSize: 12,
    color: "#666",
    marginBottom: 4,
  },
  statValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#2D62A6",
  },
  itemList: {
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderRadius: 12,
    overflow: "hidden",
  },
  listItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
    gap: 12,
  },
  listItemText: {
    flex: 1,
    fontSize: 16,
    color: "#1a1a1a",
    fontWeight: "500",
  },
  listItemStat: {
    fontSize: 14,
    color: "#666",
  },
  convoHistoryButton: {
    backgroundColor: "#2D62A6",
    borderRadius: 12,
    paddingVertical: 14,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    marginBottom: 24,
  },
  settingsButton: {
    backgroundColor: "red",
    borderRadius: 12,
    paddingVertical: 14,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    marginBottom: 24,
  },
  settingsButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});
