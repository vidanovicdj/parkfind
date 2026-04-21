import { Ionicons } from '@expo/vector-icons';
import { Link, Tabs } from 'expo-router';
import { Pressable, Text } from 'react-native';

export default function TabLayout() {

  return (
    <Tabs 
      screenOptions={{
        tabBarActiveTintColor: "#27AE60",
        headerShown: true,
      }}>
      {/* POČETNA */}
      <Tabs.Screen
        name="index"
        options={{
          title: 'Početna',
          tabBarIcon: ({ color }) => (
            <Ionicons name="home" size={24} color={color} />
          ),
          headerRight: () => (
            <Link href="/modal" asChild>
              <Pressable style={{ marginRight: 15 }}>
                <Text style={{ color: "blue" }}>Tablice</Text>
              </Pressable>
            </Link>
          ),
        }}
      />

      {/* SCANNER */}
      <Tabs.Screen
        name="scanner"
        options={{
          title: "Kamera",
          tabBarIcon: ({ color }) => (
            <Ionicons name="camera" size={24} color={color} />
          ),
        }}
      />

    </Tabs>
  );
}
