// src/components/ui/Badge.tsx
import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { Colors, FontSize, Radius } from '../../constants/theme';

interface BadgeProps {
  label: string;
  bg?: string;
  color?: string;
  size?: 'sm' | 'md';
  style?: ViewStyle;
  dot?: boolean;
  dotColor?: string;
}

export default function Badge({ label, bg = Colors.brand[50], color = Colors.brand[700], size = 'md', style, dot, dotColor }: BadgeProps) {
  return (
    <View style={[
      styles.badge,
      size === 'sm' && styles.sm,
      { backgroundColor: bg },
      style,
    ]}>
      {dot && <View style={[styles.dot, { backgroundColor: dotColor || color }]} />}
      <Text style={[styles.text, { color }, size === 'sm' && styles.smText]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    paddingHorizontal: 10, paddingVertical: 5,
    borderRadius: Radius.full,
  },
  sm: { paddingHorizontal: 7, paddingVertical: 3 },
  text: { fontSize: FontSize.xs, fontWeight: '700' },
  smText: { fontSize: 10 },
  dot: { width: 6, height: 6, borderRadius: 3 },
});
