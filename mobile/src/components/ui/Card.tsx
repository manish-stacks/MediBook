// src/components/ui/Card.tsx
import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { Colors, Radius, Shadow } from '../../constants/theme';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  elevated?: boolean;
  noPad?: boolean;
}

export default function Card({ children, style, elevated, noPad }: CardProps) {
  return (
    <View style={[styles.card, elevated && Shadow.md, noPad && styles.noPad, style]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.white,
    borderRadius: Radius['2xl'],
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.slate[100],
    ...Shadow.sm,
  },
  noPad: { padding: 0 },
});
