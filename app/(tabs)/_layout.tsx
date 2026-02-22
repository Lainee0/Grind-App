// app/(tabs)/_layout.tsx
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Tabs } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

function CustomHeader({ title }: { title: string }) {
  return (
    <LinearGradient
      colors={['#0a0a0a', '#1a1a1a']}
      style={styles.header}
    >
      <View style={styles.headerContent}>
        <LinearGradient colors={['#00ff88', '#00cc66']} style={styles.headerIcon}>
          <MaterialIcons name="fitness-center" size={20} color="#0a0a0a" />
        </LinearGradient>
        <Text style={styles.headerTitle}>{title}</Text>
      </View>
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
        tabBarActiveTintColor: '#00ff88',
        tabBarInactiveTintColor: '#666',
        tabBarStyle: {
          paddingBottom: 5,
          paddingTop: 5,
          height: 60,
          backgroundColor: '#0a0a0a',
          borderTopWidth: 1,
          borderTopColor: '#00ff88',
          elevation: 0,
          shadowOpacity: 0,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '700',
          letterSpacing: 0.5,
        },
        header: ({ options }) => {
          const title = options.title || 
            (route.name === 'index' ? 'HOME' : 
             route.name === 'chat' ? 'COACH' :
             route.name === 'exercises' ? 'EXERCISES' : 'PROGRESS');
          return <CustomHeader title={title} />;
        },
      })}
    >
      <Tabs.Screen 
        name="index" 
        options={{ 
          title: 'HOME',
          headerShown: false,
        }} 
      />
      <Tabs.Screen 
        name="chat" 
        options={{ 
          title: 'AI COACH',
          headerShown: true,
        }} 
      />
      <Tabs.Screen 
        name="exercises" 
        options={{ 
          title: 'EXERCISES',
          headerShown: true,
        }} 
      />
      <Tabs.Screen 
        name="progress" 
        options={{ 
          title: 'PROGRESS',
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
    borderBottomWidth: 2,
    borderBottomColor: '#00ff88',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerIcon: {
    width: 30,
    height: 30,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#fff',
    letterSpacing: 1,
  },
});