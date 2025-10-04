import { Tabs } from 'expo-router';

import Ionicons from '@expo/vector-icons/Ionicons';


export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#ffd33d',
        tabBarInactiveTintColor: '#fff',
        tabBarShowLabel:false,
        headerShown: false,
        tabBarStyle: {
          position: 'absolute',
          backgroundColor: 'rgba(129, 129, 129, 0.41)',
          borderRadius: 20,
          right: 100,
          left: 100,
          bottom: 20,
        //   left: 100,
        //   right: 100,
        // //   height: 40,
        //   borderRadius: 20,
        //   backgroundColor: 'rgba(129, 129, 129, 0.41)',
        //   borderTopWidth: 0,
        //   elevation: 5,
        //   shadowColor: '#000',
        //   shadowOffset: { width: 0, height: 2 },
        //   shadowOpacity: 0.5,
        //   shadowRadius: 3.84,
        //   padding: 10,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          color: '#fff',
        },
        tabBarIconStyle: {
          color: '#fff',
          fontSize: 40,
        },
      }}
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
