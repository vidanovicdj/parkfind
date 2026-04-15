import { Link, Tabs } from 'expo-router';
import { Pressable, Text } from 'react-native';

export default function TabLayout() {

  return (
    <Tabs>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Početna',
          headerRight: () => (
            <Link href="/modal" asChild>
              <Pressable style={{ marginRight: 15 }}>
                <Text style={{ color: "blue" }}>Tablice</Text>
              </Pressable>
            </Link>
          ),
        }}
      />
    </Tabs>
  );
}
