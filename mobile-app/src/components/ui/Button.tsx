// src/components/ui/Button.tsx
import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, ViewStyle, TextStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Radius, FontSize, Shadow } from '../../constants/theme';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
  gradient?: readonly [string, string];
  fullWidth?: boolean;
}

export default function Button({
  title, onPress, variant = 'primary', size = 'md',
  loading, disabled, icon, style, textStyle, gradient, fullWidth,
}: ButtonProps) {
  const heights = { sm: 40, md: 52, lg: 58 };
  const fontSizes = { sm: FontSize.sm, md: FontSize.md, lg: FontSize.lg };

  const isDisabled = disabled || loading;

  const getVariantStyle = () => {
    switch (variant) {
      case 'secondary': return { backgroundColor: Colors.brand[50], borderWidth: 0 };
      case 'outline':   return { backgroundColor: 'transparent', borderWidth: 1.5, borderColor: Colors.brand[600] };
      case 'ghost':     return { backgroundColor: 'transparent', borderWidth: 0 };
      case 'danger':    return { backgroundColor: Colors.red[600], borderWidth: 0 };
      default:          return {};
    }
  };

  const getTextColor = () => {
    switch (variant) {
      case 'secondary': return Colors.brand[700];
      case 'outline':   return Colors.brand[600];
      case 'ghost':     return Colors.slate[600];
      case 'danger':    return Colors.white;
      default:          return Colors.white;
    }
  };

  if (variant === 'primary' && !gradient) {
    return (
      <TouchableOpacity
        onPress={onPress}
        disabled={isDisabled}
        activeOpacity={0.8}
        style={[{ width: fullWidth ? '100%' : undefined }, style]}
      >
        <LinearGradient
          colors={['#1e6fe8', '#0ea5e9']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[
            styles.base,
            { height: heights[size], borderRadius: Radius.xl },
            isDisabled && styles.disabled,
          ]}
        >
          {loading
            ? <ActivityIndicator color="#fff" size="small" />
            : <>{icon && <>{icon}</>}<Text style={[styles.text, { fontSize: fontSizes[size], color: Colors.white }, textStyle]}>{title}</Text></>
          }
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  if (gradient) {
    return (
      <TouchableOpacity onPress={onPress} disabled={isDisabled} activeOpacity={0.8} style={[{ width: fullWidth ? '100%' : undefined }, style]}>
        <LinearGradient colors={gradient as any} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
          style={[styles.base, { height: heights[size], borderRadius: Radius.xl }, isDisabled && styles.disabled]}>
          {loading
            ? <ActivityIndicator color="#fff" size="small" />
            : <>{icon && <>{icon}</>}<Text style={[styles.text, { fontSize: fontSizes[size], color: Colors.white }, textStyle]}>{title}</Text></>
          }
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.75}
      style={[
        styles.base,
        { height: heights[size], borderRadius: Radius.xl, width: fullWidth ? '100%' : undefined },
        getVariantStyle(),
        isDisabled && styles.disabled,
        style,
      ]}
    >
      {loading
        ? <ActivityIndicator color={Colors.brand[600]} size="small" />
        : <>{icon && <>{icon}</>}<Text style={[styles.text, { fontSize: fontSizes[size], color: getTextColor() }, textStyle]}>{title}</Text></>
      }
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    gap: 8,
    ...Shadow.brand,
  },
  text: {
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  disabled: { opacity: 0.5, ...Shadow.sm },
});
