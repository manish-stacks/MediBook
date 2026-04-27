// src/components/ui/Avatar.tsx
import React from 'react';
import { View, Text, Image, StyleSheet, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, FontSize, Gradients } from '../../constants/theme';

interface AvatarProps {
  uri?: string;
  name: string;
  size?: number;
  style?: ViewStyle;
}

export default function Avatar({ uri, name, size = 48, style }: AvatarProps) {
  const safeName = name || '';
  const initials = safeName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
  const radius = size * 0.28;

  if (uri) {
    return (
      <Image
        source={{ uri }}
        style={[{ width: size, height: size, borderRadius: radius }, style]}
      />
    );
  }

  return (
    <LinearGradient
      colors={Gradients.brand}
      start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
      style={[{ width: size, height: size, borderRadius: radius, alignItems: 'center', justifyContent: 'center' }, style]}
    >
      <Text style={{ color: Colors.white, fontSize: size * 0.32, fontWeight: '800' }}>{initials}</Text>
    </LinearGradient>
  );
}
