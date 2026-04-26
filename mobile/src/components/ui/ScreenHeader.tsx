// src/components/ui/ScreenHeader.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, FontSize, Shadow } from '../../constants/theme';

interface ScreenHeaderProps {
  title: string;
  subtitle?: string;
  showBack?: boolean;
  rightAction?: { icon: keyof typeof Ionicons.glyphMap; onPress: () => void };
  dark?: boolean;
  transparent?: boolean;
}

export default function ScreenHeader({ title, subtitle, showBack = true, rightAction, dark, transparent }: ScreenHeaderProps) {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const textColor = dark ? Colors.white : Colors.slate[900];
  const bgColor   = transparent ? 'transparent' : dark ? Colors.slate[900] : Colors.white;
  const iconColor = dark ? Colors.white : Colors.slate[700];

  return (
    <View style={[styles.container, { backgroundColor: bgColor, paddingTop: insets.top + 8 }, !transparent && Shadow.sm]}>
      <StatusBar barStyle={dark ? 'light-content' : 'dark-content'} />
      <View style={styles.row}>
        {showBack ? (
          <TouchableOpacity onPress={() => router.back()} style={[styles.iconBtn, { backgroundColor: dark ? 'rgba(255,255,255,0.12)' : Colors.slate[100] }]}>
            <Ionicons name="chevron-back" size={22} color={iconColor} />
          </TouchableOpacity>
        ) : <View style={styles.iconBtn} />}

        <View style={styles.center}>
          <Text style={[styles.title, { color: textColor }]}>{title}</Text>
          {subtitle && <Text style={[styles.subtitle, { color: dark ? 'rgba(255,255,255,0.6)' : Colors.slate[500] }]}>{subtitle}</Text>}
        </View>

        {rightAction ? (
          <TouchableOpacity onPress={rightAction.onPress} style={[styles.iconBtn, { backgroundColor: dark ? 'rgba(255,255,255,0.12)' : Colors.slate[100] }]}>
            <Ionicons name={rightAction.icon} size={22} color={iconColor} />
          </TouchableOpacity>
        ) : <View style={styles.iconBtn} />}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: 16, paddingBottom: 12 },
  row:   { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  center:{ flex: 1, alignItems: 'center' },
  title: { fontSize: FontSize.xl, fontWeight: '800', letterSpacing: -0.3 },
  subtitle: { fontSize: FontSize.xs, marginTop: 2 },
  iconBtn: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
});
