// app/(patient)/_layout.tsx
import { Tabs } from 'expo-router';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Shadow } from '../../src/constants/theme';
import { BlurView } from 'expo-blur';

function TabIcon({ name, focused, label }: { name: keyof typeof Ionicons.glyphMap; focused: boolean; label: string }) {
  return (
    <View style={styles.tabItem}>
      <View style={[styles.iconWrap, focused && styles.iconWrapActive]}>
        <Ionicons name={name} size={22} color={focused ? Colors.white : Colors.slate[400]} />
      </View>
      <Text style={[styles.tabLabel, focused && styles.tabLabelActive]}>{label}</Text>
    </View>
  );
}

export default function PatientLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarShowLabel: false,
        tabBarBackground: () => (
          Platform.OS === 'ios'
            ? <BlurView intensity={80} tint="light" style={StyleSheet.absoluteFill} />
            : <View style={[StyleSheet.absoluteFill, { backgroundColor: Colors.white }]} />
        ),
      }}
    >
      <Tabs.Screen name="index" options={{ tabBarIcon: ({ focused }) => <TabIcon name={focused ? 'home' : 'home-outline'} focused={focused} label="Home" /> }} />
      <Tabs.Screen name="doctors" options={{ tabBarIcon: ({ focused }) => <TabIcon name={focused ? 'search' : 'search-outline'} focused={focused} label="Find" /> }} />
      <Tabs.Screen name="appointments" options={{ tabBarIcon: ({ focused }) => <TabIcon name={focused ? 'calendar' : 'calendar-outline'} focused={focused} label="Bookings" /> }} />
      <Tabs.Screen name="prescriptions" options={{ tabBarIcon: ({ focused }) => <TabIcon name={focused ? 'document-text' : 'document-text-outline'} focused={focused} label="Rx" /> }} />
      <Tabs.Screen name="profile" options={{ tabBarIcon: ({ focused }) => <TabIcon name={focused ? 'person' : 'person-outline'} focused={focused} label="Profile" /> }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    borderTopWidth: 0,
    height: Platform.OS === 'ios' ? 84 : 68,
    paddingBottom: Platform.OS === 'ios' ? 24 : 8,
    paddingTop: 8,
    backgroundColor: 'transparent',
    ...Shadow.lg,
  },
  tabItem:      { alignItems: 'center', gap: 4 },
  iconWrap:     { width: 44, height: 34, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  iconWrapActive:{ backgroundColor: Colors.brand[600], ...Shadow.brand },
  tabLabel:     { fontSize: 10, fontWeight: '600', color: Colors.slate[400] },
  tabLabelActive:{ color: Colors.brand[600] },
});
