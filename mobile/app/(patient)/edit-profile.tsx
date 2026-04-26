// app/(patient)/edit-profile.tsx
import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Toast from 'react-native-toast-message';
import { usersApi } from '../../src/api/endpoints';
import { useAuthStore } from '../../src/store/auth.store';
import { Colors, FontSize, Radius, Shadow } from '../../src/constants/theme';
import Input from '../../src/components/ui/Input';
import Button from '../../src/components/ui/Button';
import Avatar from '../../src/components/ui/Avatar';

export default function EditProfileScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user, updateUser } = useAuthStore();
  const qc = useQueryClient();

  const [form, setForm] = useState({
    firstName: user?.firstName || '',
    lastName:  user?.lastName  || '',
    phone:     user?.phone     || '',
    avatar:    user?.avatar    || '',
  });
  const up = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  const mutation = useMutation({
    mutationFn: (data: any) => usersApi.updateProfile(data),
    onSuccess: (res) => {
      updateUser(res.data.data);
      Toast.show({ type: 'success', text1: '✅ Profile updated!' });
      router.back();
    },
    onError: (e: any) => Toast.show({ type: 'error', text1: e.response?.data?.message || 'Failed' }),
  });

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={22} color={Colors.slate[700]} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Profile</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={{ padding: 20, gap: 20 }} keyboardShouldPersistTaps="handled">
        {/* Avatar */}
        <View style={styles.avatarSection}>
          <View style={styles.avatarWrapper}>
            <Avatar uri={form.avatar || user?.avatar} name={`${user?.firstName} ${user?.lastName}`} size={90} />
            <TouchableOpacity style={styles.avatarEdit}>
              <Ionicons name="camera-outline" size={16} color={Colors.white} />
            </TouchableOpacity>
          </View>
          <Text style={styles.avatarHint}>Tap to change photo</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.nameRow}>
            <View style={{ flex: 1 }}>
              <Input label="First Name" placeholder="John" value={form.firstName} onChangeText={v => up('firstName', v)} autoCapitalize="words" leftIcon="person-outline" />
            </View>
            <View style={{ flex: 1 }}>
              <Input label="Last Name" placeholder="Doe" value={form.lastName} onChangeText={v => up('lastName', v)} autoCapitalize="words" leftIcon="person-outline" />
            </View>
          </View>

          <Input label="Phone Number" placeholder="+91 9876543210" value={form.phone} onChangeText={v => up('phone', v)} keyboardType="phone-pad" leftIcon="call-outline" />
          <Input label="Avatar URL" placeholder="https://..." value={form.avatar} onChangeText={v => up('avatar', v)} leftIcon="image-outline" />

          {/* Non-editable */}
          <View style={styles.lockedField}>
            <Ionicons name="mail-outline" size={16} color={Colors.slate[400]} />
            <View style={{ flex: 1 }}>
              <Text style={styles.lockedLabel}>Email Address</Text>
              <Text style={styles.lockedValue}>{user?.email}</Text>
            </View>
            <Ionicons name="lock-closed-outline" size={14} color={Colors.slate[300]} />
          </View>
        </View>

        <Button title="Save Changes" onPress={() => mutation.mutate(form)} loading={mutation.isPending} fullWidth gradient={['#1e6fe8', '#02c9b3']} size="lg" />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.white },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: Colors.slate[100] },
  backBtn: { width: 40, height: 40, borderRadius: 12, backgroundColor: Colors.slate[100], alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: FontSize['2xl'], fontWeight: '900', color: Colors.slate[900] },

  avatarSection: { alignItems: 'center', gap: 10 },
  avatarWrapper: { position: 'relative' },
  avatarEdit: { position: 'absolute', bottom: -4, right: -4, width: 32, height: 32, borderRadius: 10, backgroundColor: Colors.brand[600], alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: Colors.white },
  avatarHint: { fontSize: FontSize.xs, color: Colors.slate[400] },

  form: { gap: 14 },
  nameRow: { flexDirection: 'row', gap: 12 },
  lockedField: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: Colors.slate[50], borderRadius: Radius.xl, padding: 14, borderWidth: 1, borderColor: Colors.slate[100] },
  lockedLabel: { fontSize: FontSize.xs, color: Colors.slate[400], fontWeight: '600' },
  lockedValue: { fontSize: FontSize.sm, color: Colors.slate[600], fontWeight: '600', marginTop: 2 },
});
