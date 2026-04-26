// src/components/ui/StatCard.tsx
import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { Colors, FontSize, Radius } from '../../constants/theme';

interface StatCardProps {
  label: string;
  value: string | number;
  icon: string;
  bg?: string;
  color?: string;
  style?: ViewStyle;
}

export default function StatCard({ label, value, icon, bg = '#eff8ff', color = '#1e6fe8', style }: StatCardProps) {
  return (
    <View style={[styles.card, { backgroundColor: bg }, style]}>
      <Text style={styles.icon}>{icon}</Text>
      <Text style={[styles.value, { color }]}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: Radius.xl,
    padding: 14,
    alignItems: 'center',
    flex: 1,
    minWidth: 76,
  },
  icon:  { fontSize: 26, marginBottom: 6 },
  value: { fontSize: FontSize['3xl'], fontWeight: '900', lineHeight: 28 },
  label: { fontSize: FontSize.xs, color: Colors.slate[500], fontWeight: '600', marginTop: 3, textAlign: 'center' },
});
