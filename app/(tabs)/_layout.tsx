// Powered by OnSpace.AI
import { Tabs } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Platform, View } from 'react-native';
import { useApp } from '@/hooks/useApp';

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  const { currentTheme } = useApp();

  const tabBarStyle = {
    height: Platform.select({ ios: insets.bottom + 64, android: insets.bottom + 64, default: 72 }),
    paddingTop: 8,
    paddingBottom: Platform.select({ ios: insets.bottom + 6, android: insets.bottom + 6, default: 8 }),
    // Bright luminous tab bar
    backgroundColor: 'rgba(255,255,255,0.97)',
    borderTopWidth: 2,
    borderTopColor: `${currentTheme.accent}55`,
    // Glow effect
    shadowColor: currentTheme.accent,
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 20,
  };

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle,
        tabBarActiveTintColor: currentTheme.accent,
        tabBarInactiveTintColor: 'rgba(60,40,120,0.40)',
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '700',
          letterSpacing: 0.2,
        },
        tabBarIconStyle: { marginTop: 2 },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'کی بورڈ',
          tabBarIcon: ({ color, size, focused }) => (
            <MaterialIcons name="keyboard" size={size} color={color}
              style={focused ? { textShadowColor: color, textShadowRadius: 8 } : undefined}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="notepad"
        options={{
          title: 'نوٹ پیڈ',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="note-alt" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="templates"
        options={{
          title: 'ٹیمپلیٹس',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="library-books" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="clipboard"
        options={{
          title: 'کلپ بورڈ',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="content-paste" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="audio"
        options={{
          title: 'آڈیو',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="audio-file" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="themes"
        options={{
          title: 'تھیمز',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="palette" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="about"
        options={{
          title: 'بارے میں',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="info-outline" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
