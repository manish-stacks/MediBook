// src/components/ui/EmptyState.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, FontSize } from '../../constants/theme';
import Button from './Button';

interface EmptyStateProps {
  emoji?: string;
  title: string;
  subtitle?: string;
  action?: { label: string; onPress: () => void };
}

export default function EmptyState({ emoji = '🔍', title, subtitle, action }: EmptyStateProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.emoji}>{emoji}</Text>
      <Text style={styles.title}>{title}</Text>
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      {action && (
        <Button title={action.label} onPress={action.onPress} size="md" style={{ marginTop: 20, paddingHorizontal: 32 }} />
      )}
    </View>
  );
}

// ─────────────────────────────────────────

// src/components/ui/LoadingSpinner.tsx (same file for brevity)
export function LoadingSpinner({ label }: { label?: string }) {
  return (
    <View style={[styles.container, { minHeight: 200 }]}>
      <View style={styles.spinner}>
        <Text style={{ fontSize: 32 }}>⏳</Text>
      </View>
      {label && <Text style={[styles.subtitle, { marginTop: 12 }]}>{label}</Text>}
    </View>
  );
}

// ─────────────────────────────────────────

// src/components/ui/StatCard.tsx
interface StatCardProps {
  label: string;
  value: string | number;
  icon: string;
  bg?: string;
  color?: string;
}

export function StatCard({ label, value, icon, bg = '#eff8ff', color = '#1e6fe8' }: StatCardProps) {
  return (
    <View style={[statStyles.card, { backgroundColor: bg }]}>
      <Text style={statStyles.icon}>{icon}</Text>
      <Text style={[statStyles.value, { color }]}>{value}</Text>
      <Text style={statStyles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', justifyContent: 'center', paddingVertical: 40, paddingHorizontal: 32 },
  emoji:    { fontSize: 56, marginBottom: 16 },
  title:    { fontSize: FontSize['2xl'], fontWeight: '800', color: Colors.slate[900], textAlign: 'center' },
  subtitle: { fontSize: FontSize.sm, color: Colors.slate[500], textAlign: 'center', marginTop: 8, lineHeight: 20 },
  spinner:  { width: 64, height: 64, borderRadius: 32, backgroundColor: Colors.brand[50], alignItems: 'center', justifyContent: 'center' },
});

const statStyles = StyleSheet.create({
  card:  { borderRadius: 16, padding: 14, alignItems: 'center', flex: 1, minWidth: 76 },
  icon:  { fontSize: 24, marginBottom: 6 },
  value: { fontSize: 22, fontWeight: '900', lineHeight: 26 },
  label: { fontSize: 10, color: Colors.slate[500], fontWeight: '600', marginTop: 2, textAlign: 'center' },
});
