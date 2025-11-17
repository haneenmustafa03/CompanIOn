import {
  ImageBackground,
  Image,
  StyleSheet,
  ScrollView,
  View,
  Text,
} from "react-native";

export default function BadgesScreen() {
  // Example badge data - replace with your actual badge data
  const badges = [
    {
      id: 1,
      source: require("../../assets/UIElements/awards.png"),
      title: "First Steps",
      name: "Beginner",
    },
    {
      id: 2,
      source: require("../../assets/UIElements/awards.png"),
      title: "Week Warrior",
      name: "Consistency",
    },
    {
      id: 3,
      source: require("../../assets/UIElements/awards.png"),
      title: "Quick Learner",
      name: "Progress",
    },
    {
      id: 4,
      source: require("../../assets/UIElements/awards.png"),
      title: "Social Star",
      name: "Communication",
    },
    {
      id: 5,
      source: require("../../assets/UIElements/awards.png"),
      title: "Goal Achiever",
      name: "Success",
    },
    {
      id: 6,
      source: require("../../assets/UIElements/awards.png"),
      title: "Helper",
      name: "Kindness",
    },
    {
      id: 7,
      source: require("../../assets/UIElements/awards.png"),
      title: "Explorer",
      name: "Curiosity",
    },
    {
      id: 8,
      source: require("../../assets/UIElements/awards.png"),
      title: "Team Player",
      name: "Cooperation",
    },
    {
      id: 9,
      source: require("../../assets/UIElements/awards.png"),
      title: "Problem Solver",
      name: "Critical Thinking",
    },
    {
      id: 10,
      source: require("../../assets/UIElements/awards.png"),
      title: "Champion",
      name: "Excellence",
    },
    // Add more badges here as needed
  ];

  return (
    <ImageBackground
      source={require("../../assets/backgroundImages/Awards.png")}
      style={styles.container}
      resizeMode="stretch"
    >
      <View style={styles.content}>
        <Text style={styles.title}>Badges</Text>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.grid}>
            {badges.map((badge) => (
              <View key={badge.id} style={styles.badgeCard}>
                <Image
                  source={badge.source}
                  style={styles.badgeImage}
                  resizeMode="contain"
                />
                <Text style={styles.badgeTitle}>{badge.title}</Text>
                <Text style={styles.badgeName}>{badge.name}</Text>
              </View>
            ))}
          </View>
        </ScrollView>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#25292e",
    backgroundSize: "contain",
    backgroundPosition: "center",
    width: "100%",
    height: "100%",
  },
  content: {
    flex: 1,
    paddingTop: 50,
    paddingHorizontal: 16,
  },
  title: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    textShadowColor: "rgba(0,0,0,0.4)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  badgeCard: {
    width: "48%",
    backgroundColor: "rgba(255,255,255,0.75)",
    borderRadius: 12,
    padding: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
    marginBottom: 12,
  },
  badgeImage: {
    width: 80,
    height: 80,
    marginBottom: 8,
  },
  badgeTitle: {
    color: "black",
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 4,
  },
  badgeName: {
    color: "green",
    fontSize: 11,
    fontWeight: "bold",
    textAlign: "center",
  },
});
