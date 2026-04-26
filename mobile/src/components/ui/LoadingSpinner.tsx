// src/components/ui/LoadingSpinner.tsx
import React from 'react';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';
import { Colors, FontSize } from '../../constants/theme';

export default function LoadingSpinner({ label, fullScreen }: { label?: string; fullScreen?: boolean }) {
  return (
    <View style={[styles.container, fullScreen && styles.fullScreen]}>
      <ActivityIndicator size="large" color={Colors.brand[600]} />
      {label && <Text style={styles.label}>{label}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', justifyContent: 'center', padding: 32 },
  fullScreen: { flex: 1, backgroundColor: Colors.white },
  label: { fontSize: FontSize.sm, color: Colors.slate[500], marginTop: 12, fontWeight: '500' },
});
