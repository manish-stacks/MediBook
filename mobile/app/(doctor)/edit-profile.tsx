// app/(doctor)/edit-profile.tsx
import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';
import { doctorsApi, usersApi } from '../../src/api/endpoints';
import { useAuthStore } from '../../src/store/auth.store';
import { Colors, FontSize, Radius } from '../../src/constants/theme';
import Input from '../../src/components/ui/Input';
import Button from '../../src/components/ui/Button';
import Avatar from '../../src/components/ui/Avatar';

const DURATIONS = [15, 20, 30, 45, 60];

export default function DoctorEditProfileScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user, updateUser } = useAuthStore();
  const qc = useQueryClient();

  const [basicForm, setBasicForm] = useState({ firstName: user?.firstName || '', lastName: user?.lastName || '', phone: user?.phone || '' });
  const [docForm, setDocForm] = useState({ experience: '', about: '', consultationFee: '', followUpFee: '', slotDuration: 30 });
  const upB = (k: string, v: string) => setBasicForm(f => ({ ...f, [k]: v }));
  const upD = (k: string, v: any) => setDocForm(f => ({ ...f, [k]: v }));

  const userMutation = useMutation({
    mutationFn: (data: any) => usersApi.updateProfile(data),
    onSuccess: (res) => { updateUser(res.data.data); Toast.show({ type: 'success', text1: '✅ Profile updated!' }); router.back(); },
    onError: (e: any) => Toast.show({ type: 'error', text1: e.response?.data?.message || 'Failed' }),
  });

  const doctorMutation = useMutation({
    mutationFn: (data: any) => doctorsApi.updateProfile(data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['doctor-stats'] }); },
  });

  const handleSave = async () => {
    await Promise.all([
      userMutation.mutateAsync(basicForm),
      docForm.experience || docForm.consultationFee ? doctorMutation.mutateAsync(docForm) : Promise.resolve(),
    ]);
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={22} color={Colors.slate[700]} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Profile</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={{ padding: 20, gap: 16 }} keyboardShouldPersistTaps="handled">
        {/* Avatar */}
        <View style={styles.avatarSection}>
          <View style={{ position: 'relative' }}>
            <Avatar uri={user?.avatar} name={`${user?.firstName} ${user?.lastName}`} size={90} />
            <View style={styles.verifiedBadge}>
              <Ionicons name="checkmark-circle" size={20} color={Colors.teal[500]} />
            </View>
          </View>
          <Text style={styles.docLabel}>Dr. {user?.firstName} {user?.lastName}</Text>
          <Text style={styles.docEmail}>{user?.email}</Text>
        </View>

        <Text style={styles.sectionLabel}>Personal Information</Text>
        <View style={styles.nameRow}>
          <View style={{ flex: 1 }}><Input label="First Name" value={basicForm.firstName} onChangeText={v => upB('firstName', v)} autoCapitalize="words" leftIcon="person-outline" /></View>
          <View style={{ flex: 1 }}><Input label="Last Name" value={basicForm.lastName} onChangeText={v => upB('lastName', v)} autoCapitalize="words" leftIcon="person-outline" /></View>
        </View>
        <Input label="Phone" value={basicForm.phone} onChangeText={v => upB('phone', v)} keyboardType="phone-pad" leftIcon="call-outline" />

        <Text style={styles.sectionLabel}>Professional Details</Text>
        <View style={styles.nameRow}>
          <View style={{ flex: 1 }}><Input label="Experience (years)" value={docForm.experience} onChangeText={v => upD('experience', v)} keyboardType="number-pad" leftIcon="briefcase-outline" /></View>
          <View style={{ flex: 1 }}><Input label="Consultation Fee ₹" value={docForm.consultationFee} onChangeText={v => upD('consultationFee', v)} keyboardType="number-pad" leftIcon="cash-outline" /></View>
        </View>
        <Input label="Follow-up Fee ₹ (optional)" value={docForm.followUpFee} onChangeText={v => upD('followUpFee', v)} keyboardType="number-pad" leftIcon="cash-outline" />
        <Input label="About / Bio" value={docForm.about} onChangeText={v => upD('about', v)} multiline numberOfLines={4} leftIcon="document-text-outline" />

        <View>
          <Text style={styles.fieldLabel}>Default Slot Duration</Text>
          <View style={styles.durRow}>
            {DURATIONS.map(d => (
              <TouchableOpacity key={d} onPress={() => upD('slotDuration', d)} style={[styles.durBtn, docForm.slotDuration === d && styles.durBtnActive]}>
                <Text style={[styles.durText, docForm.slotDuration === d && styles.durTextActive]}>{d}m</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <Button title="Save All Changes" onPress={handleSave} loading={userMutation.isPending || doctorMutation.isPending} fullWidth gradient={['#02c9b3', '#1e6fe8']} size="lg" style={{ marginTop: 8 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.white },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: Colors.slate[100] },
  backBtn: { width: 40, height: 40, borderRadius: 12, backgroundColor: Colors.slate[100], alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: FontSize['2xl'], fontWeight: '900', color: Colors.slate[900] },
  avatarSection: { alignItems: 'center', gap: 8, paddingVertical: 8 },
  verifiedBadge: { position: 'absolute', bottom: -4, right: -4, backgroundColor: Colors.white, borderRadius: 12, padding: 1 },
  docLabel: { fontSize: FontSize.xl, fontWeight: '900', color: Colors.slate[900] },
  docEmail: { fontSize: FontSize.sm, color: Colors.slate[400] },
  sectionLabel: { fontSize: FontSize.sm, fontWeight: '800', color: Colors.slate[500], textTransform: 'uppercase', letterSpacing: 0.8 },
  nameRow: { flexDirection: 'row', gap: 12 },
  fieldLabel: { fontSize: FontSize.sm, fontWeight: '700', color: Colors.slate[700], marginBottom: 8 },
  durRow: { flexDirection: 'row', gap: 8 },
  durBtn: { flex: 1, paddingVertical: 10, backgroundColor: Colors.slate[100], borderRadius: Radius.xl, alignItems: 'center' },
  durBtnActive: { backgroundColor: Colors.teal[600] },
  durText: { fontSize: FontSize.sm, fontWeight: '700', color: Colors.slate[600] },
  durTextActive: { color: Colors.white },
});
