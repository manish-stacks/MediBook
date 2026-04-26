// app/(doctor)/change-password.tsx
// Same as patient change password, just in doctor folder
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

export default function DoctorChangePasswordScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [form, setForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const up = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  const mutation = useMutation({
    mutationFn: (data: any) => authApi.changePassword(data),
    onSuccess: () => { Toast.show({ type: 'success', text1: '🔒 Password changed!' }); router.back(); },
    onError: (e: any) => Toast.show({ type: 'error', text1: e.response?.data?.message || 'Failed' }),
  });

  const handleSubmit = () => {
    if (!form.currentPassword || !form.newPassword) { Toast.show({ type: 'error', text1: 'All fields required' }); return; }
    if (form.newPassword !== form.confirmPassword) { Toast.show({ type: 'error', text1: 'Passwords do not match' }); return; }
    if (form.newPassword.length < 6) { Toast.show({ type: 'error', text1: 'Password min 6 characters' }); return; }
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
          <Ionicons name="shield-checkmark-outline" size={20} color={Colors.teal[600]} />
          <Text style={styles.infoText}>Use a strong password with at least 6 characters including letters and numbers.</Text>
        </View>
        <Input label="Current Password" placeholder="••••••••" value={form.currentPassword} onChangeText={v => up('currentPassword', v)} secureTextEntry leftIcon="lock-closed-outline" />
        <Input label="New Password" placeholder="••••••••" value={form.newPassword} onChangeText={v => up('newPassword', v)} secureTextEntry leftIcon="lock-open-outline" />
        <Input label="Confirm New Password" placeholder="••••••••" value={form.confirmPassword} onChangeText={v => up('confirmPassword', v)} secureTextEntry leftIcon="checkmark-circle-outline" />
        <Button title="Update Password" onPress={handleSubmit} loading={mutation.isPending} fullWidth gradient={['#02c9b3', '#1e6fe8']} size="lg" />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.white },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: Colors.slate[100] },
  backBtn: { width: 40, height: 40, borderRadius: 12, backgroundColor: Colors.slate[100], alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: FontSize['2xl'], fontWeight: '900', color: Colors.slate[900] },
  infoCard: { flexDirection: 'row', gap: 10, backgroundColor: Colors.teal[50], borderRadius: Radius.xl, padding: 14 },
  infoText: { flex: 1, fontSize: FontSize.sm, color: Colors.teal[700], lineHeight: 20 },
});
