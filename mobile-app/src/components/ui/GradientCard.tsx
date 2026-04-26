// src/components/ui/GradientCard.tsx
import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Radius, Shadow } from '../../constants/theme';

interface GradientCardProps {
  children: React.ReactNode;
  colors: readonly [string, string, ...string[]];
  style?: ViewStyle;
  start?: { x: number; y: number };
  end?: { x: number; y: number };
  noPad?: boolean;
}

export default function GradientCard({ children, colors, style, start = { x: 0, y: 0 }, end = { x: 1, y: 1 }, noPad }: GradientCardProps) {
  return (
    <LinearGradient
      colors={colors}
      start={start}
      end={end}
      style={[styles.card, noPad && styles.noPad, style]}
    >
      {children}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  card: { borderRadius: Radius['2xl'], padding: 20, ...Shadow.brand },
  noPad: { padding: 0 },
});
