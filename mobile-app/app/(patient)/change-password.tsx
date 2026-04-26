// app/(patient)/change-password.tsx
import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useMutation } from '@tanstack/react-query';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';
import { authApi } from '../../src/api/endpoints';
import { Colors, FontSize, Radius } from '../../src/constants/theme';
import Input from '../../src/components/ui/Input';
import Button from '../../src/components/ui/Button';

export default function ChangePasswordScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [form, setForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const up = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  const mutation = useMutation({
    mutationFn: (data: any) => authApi.changePassword(data),
    onSuccess: () => {
      Toast.show({ type: 'success', text1: '🔒 Password changed successfully!' });
      router.back();
    },
    onError: (e: any) => Toast.show({ type: 'error', text1: e.response?.data?.message || 'Failed to change password' }),
  });

  const handleSubmit = () => {
    if (!form.currentPassword || !form.newPassword || !form.confirmPassword) {
      Toast.show({ type: 'error', text1: 'All fields are required' }); return;
    }
    if (form.newPassword !== form.confirmPassword) {
      Toast.show({ type: 'error', text1: 'New passwords do not match' }); return;
    }
    if (form.newPassword.length < 6) {
      Toast.show({ type: 'error', text1: 'Password must be at least 6 characters' }); return;
    }
    mutation.mutate({ currentPassword: form.currentPassword, newPassword: form.newPassword });
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={22} color={Colors.slate[700]} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Change Password</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={{ padding: 20, gap: 16 }} keyboardShouldPersistTaps="handled">
        <View style={styles.infoCard}>
          <Ionicons name="shield-checkmark-outline" size={20} color={Colors.brand[600]} />
          <Text style={styles.infoText}>Use a strong password with at least 6 characters including letters and numbers.</Text>
        </View>

        <Input label="Current Password" placeholder="••••••••" value={form.currentPassword} onChangeText={v => up('currentPassword', v)} secureTextEntry leftIcon="lock-closed-outline" />
        <Input label="New Password" placeholder="••••••••" value={form.newPassword} onChangeText={v => up('newPassword', v)} secureTextEntry leftIcon="lock-open-outline" />
        <Input label="Confirm New Password" placeholder="••••••••" value={form.confirmPassword} onChangeText={v => up('confirmPassword', v)} secureTextEntry leftIcon="checkmark-circle-outline" />

        <Button title="Update Password" onPress={handleSubmit} loading={mutation.isPending} fullWidth gradient={['#1e6fe8', '#02c9b3']} size="lg" style={{ marginTop: 8 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.white },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: Colors.slate[100] },
  backBtn: { width: 40, height: 40, borderRadius: 12, backgroundColor: Colors.slate[100], alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: FontSize['2xl'], fontWeight: '900', color: Colors.slate[900] },
  infoCard: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, backgroundColor: Colors.brand[50], borderRadius: Radius.xl, padding: 14, borderWidth: 1, borderColor: Colors.brand[100] },
  infoText: { flex: 1, fontSize: FontSize.sm, color: Colors.brand[700], lineHeight: 20 },
});
