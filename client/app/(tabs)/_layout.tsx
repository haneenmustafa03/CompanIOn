import Ionicons from "@expo/vector-icons/Ionicons";
import { Tabs } from "expo-router";
import AuthGuard from "../../components/AuthGuard";
import { useAuth } from "@/contexts/AuthContext";

export default function TabLayout() {
  const { user } = useAuth();
  console.log(user?.accountType);
  if (user?.accountType === "parent") {
    return (
      <AuthGuard>
        <Tabs
          screenOptions={({ route }) => ({
            tabBarActiveTintColor: "#fff",
            tabBarInactiveTintColor: "#fff",
            headerShown: false,
            tabBarStyle: {
              backgroundColor:
                route.name === "parentHome" ? "#ea9307" : "#91cbdb",
            },
          })}
        >
          <Tabs.Screen
            name="parentHome"
            options={{
              title: "Home",
              tabBarIcon: ({ color, focused }) => (
                <Ionicons
                  name={focused ? "home-sharp" : "home-outline"}
                  color={color}
                  size={24}
                />
              ),
            }}
          />
          <Tabs.Screen
            name="parentSettings"
            options={{
              title: "Settings",
              tabBarIcon: ({ color, focused }) => (
                <Ionicons
                  name={focused ? "cog" : "cog-outline"}
                  color={color}
                  size={24}
                />
              ),
            }}
          />
          {/* Hide tabs that parents shouldn't see */}
          <Tabs.Screen
            name="index"
            options={{
              href: null,
            }}
          />
          <Tabs.Screen
            name="lessons"
            options={{
              href: null,
            }}
          />
          <Tabs.Screen
            name="games"
            options={{
              href: null,
            }}
          />
          <Tabs.Screen
            name="badges"
            options={{
              href: null,
            }}
          />
          <Tabs.Screen
            name="game"
            options={{
              href: null,
            }}
          />
          <Tabs.Screen
            name="lesson"
            options={{
              href: null,
            }}
          />
          <Tabs.Screen
            name="settings"
            options={{
              href: null,
            }}
          />
        </Tabs>
      </AuthGuard>
    );
    // } else if (user?.accountType === "child") {
  }
  return (
    <AuthGuard>
      <Tabs
        screenOptions={({ route }) => ({
          tabBarActiveTintColor: "#fff",
          tabBarInactiveTintColor: "#fff",
          headerShown: false,
          tabBarStyle: {
            backgroundColor:
              route.name === "game"
                ? "#2D62A6"
                : route.name === "games"
                ? "#2D62A6"
                : route.name === "lessons"
                ? "#508943"
                : route.name === "badges"
                ? "#812a39"
                : route.name === "settings"
                ? "#49092E"
                : route.name === "lesson"
                ? "#508943"
                : "#E9940C",
            height: 55,
            borderTopWidth: 0,
          },
        })}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Home",
            tabBarIcon: ({ color, focused }) => (
              <Ionicons
                name={focused ? "home-sharp" : "home-outline"}
                color={color}
                size={24}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="lessons"
          options={{
            title: "Lessons",
            tabBarIcon: ({ color, focused }) => (
              <Ionicons
                name={focused ? "book" : "book-outline"}
                color={color}
                size={24}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="games"
          options={{
            title: "Games",
            tabBarIcon: ({ color, focused }) => (
              <Ionicons
                name={focused ? "game-controller" : "game-controller-outline"}
                color={color}
                size={24}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="badges"
          options={{
            title: "Badges",
            tabBarIcon: ({ color, focused }) => (
              <Ionicons
                name={focused ? "trophy" : "trophy-outline"}
                color={color}
                size={24}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            title: "Settings",
            tabBarIcon: ({ color, focused }) => (
              <Ionicons
                name={focused ? "cog" : "cog-outline"}
                color={color}
                size={24}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="parentHome"
          options={{
            href: null, // This hides the tab from the bottom bar
          }}
        />
        <Tabs.Screen
          name="parentSettings"
          options={{
            href: null, // This hides the tab from the bottom bar
          }}
        />
        <Tabs.Screen
          name="game"
          options={{
            href: null, // This hides the tab from the bottom bar
          }}
        />
        <Tabs.Screen
          name="lesson"
          options={{
            href: null, // This hides the tab from the bottom bar
          }}
        />
      </Tabs>
    </AuthGuard>
  );
}
