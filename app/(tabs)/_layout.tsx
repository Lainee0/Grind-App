// app/(tabs)/_layout.tsx
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Tabs } from 'expo-router';
import { StyleSheet, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

function CustomHeader({ title }: { title: string }) {
  return (
    <LinearGradient
      colors={['#667eea', '#764ba2']}
      style={styles.header}
    >
      <Text style={styles.headerTitle}>{title}</Text>
    </LinearGradient>
  );
}

export default function TabsLayout() {
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof MaterialIcons.glyphMap = 'home';

          if (route.name === 'index') {
            iconName = 'home';
          } else if (route.name === 'chat') {
            iconName = 'chat';
          } else if (route.name === 'exercises') {
            iconName = 'fitness-center';
          } else if (route.name === 'progress') {
            iconName = 'trending-up';
          }

          return <MaterialIcons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#667eea',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {
          paddingBottom: 5,
          paddingTop: 5,
          height: 60,
          backgroundColor: '#fff',
          borderTopWidth: 1,
          borderTopColor: '#e0e0e0',
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
        header: ({ options }) => {
          const title = options.title || 
            (route.name === 'index' ? 'Home' : 
             route.name === 'chat' ? 'Chat' :
             route.name === 'exercises' ? 'Exercises' : 'Progress');
          return <CustomHeader title={title} />;
        },
      })}
    >
      <Tabs.Screen 
        name="index" 
        options={{ 
          title: 'Home',
          headerShown: true,
        }} 
      />
      <Tabs.Screen 
        name="chat" 
        options={{ 
          title: 'Chat',
          headerShown: true,
        }} 
      />
      <Tabs.Screen 
        name="exercises" 
        options={{ 
          title: 'Exercises',
          headerShown: true,
        }} 
      />
      <Tabs.Screen 
        name="progress" 
        options={{ 
          title: 'Progress',
          headerShown: true,
        }} 
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  header: {
    padding: 20,
    paddingTop: 50,
    // borderBottomLeftRadius: 20,
    // borderBottomRightRadius: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
});