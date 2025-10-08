import { Tabs } from 'expo-router';

import Ionicons from '@expo/vector-icons/Ionicons';


export default function TabLayout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        tabBarActiveTintColor: '#fff',
        tabBarInactiveTintColor: '#fff',
        headerShown: false,
        tabBarStyle: {
          backgroundColor:
            route.name === 'games' ? '#2D62A6' :
            route.name === 'about' ? '#508943' :
            route.name === 'badges' ? '#be814b' :
            route.name === 'settings' ? '#2E7D32' :
            '#E9940C',
          height: 55,
          borderTopWidth: 0,
        },
      })}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'home-sharp' : 'home-outline'} color={color} size={24} />
          ),
        }}
      />
      <Tabs.Screen
        name="about"
        options={{
          title: 'Lessons',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'book' : 'book-outline'} color={color} size={24}/>
          ),
        }}
      />
      <Tabs.Screen
        name="games"
        options={{
          title: 'Games',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'game-controller' : 'game-controller-outline'} color={color} size={24}/>
          ),
        }}
      />
      <Tabs.Screen
        name="badges"
        options={{
          title: 'Badges',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'trophy' : 'trophy-outline'} color={color} size={24}/>
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'cog' : 'cog-outline'} color={color} size={24}/>
          ),
        }}
      />
    </Tabs>
  );
}
