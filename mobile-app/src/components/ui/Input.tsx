// src/components/ui/Input.tsx
import React, { useState } from 'react';
import { View, TextInput, Text, TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, FontSize, Radius } from '../../constants/theme';

interface InputProps {
  label?: string;
  placeholder?: string;
  value: string;
  onChangeText: (t: string) => void;
  secureTextEntry?: boolean;
  keyboardType?: any;
  autoCapitalize?: any;
  error?: string;
  leftIcon?: keyof typeof Ionicons.glyphMap;
  multiline?: boolean;
  numberOfLines?: number;
  style?: ViewStyle;
  editable?: boolean;
}

export default function Input({
  label, placeholder, value, onChangeText, secureTextEntry,
  keyboardType, autoCapitalize, error, leftIcon, multiline,
  numberOfLines, style, editable = true,
}: InputProps) {
  const [focused, setFocused] = useState(false);
  const [showPass, setShowPass] = useState(false);

  return (
    <View style={[styles.wrapper, style]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={[
        styles.container,
        focused && styles.focused,
        !!error && styles.error,
        !editable && styles.disabled,
      ]}>
        {leftIcon ? (
          <Ionicons name={leftIcon} size={18} color={focused ? Colors.brand[600] : Colors.slate[400]} style={styles.leftIcon} />
        ): null}
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={Colors.slate[400]}
          secureTextEntry={secureTextEntry && !showPass}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize || 'none'}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          multiline={multiline}
          numberOfLines={numberOfLines}
          editable={editable}
          style={[styles.input, multiline && { height: (numberOfLines || 3) * 22, textAlignVertical: 'top', paddingTop: 12 }]}
        />
        {secureTextEntry && (
          <TouchableOpacity onPress={() => setShowPass(!showPass)} style={styles.eye}>
            <Ionicons name={showPass ? 'eye-off' : 'eye'} size={18} color={Colors.slate[400]} />
          </TouchableOpacity>
        )}
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { gap: 6 },
  label: { fontSize: FontSize.sm, fontWeight: '600', color: Colors.slate[700] },
  container: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: Colors.slate[50],
    borderWidth: 1.5, borderColor: Colors.slate[200],
    borderRadius: Radius.xl, paddingHorizontal: 14, minHeight: 52,
  },
  focused: { borderColor: Colors.brand[500], backgroundColor: Colors.white },
  error:   { borderColor: Colors.red[500] },
  disabled:{ opacity: 0.6 },
  leftIcon:{ marginRight: 8 },
  input:   { flex: 1, fontSize: FontSize.base, color: Colors.slate[900], fontWeight: '400' },
  eye:     { padding: 4, marginLeft: 8 },
  errorText:{ fontSize: FontSize.xs, color: Colors.red[600], fontWeight: '500' },
});
