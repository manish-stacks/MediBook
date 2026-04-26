// app/(patient)/family.tsx
import { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Toast from 'react-native-toast-message';
import { patientsApi } from '../../src/api/endpoints';
import { Colors, FontSize, Radius, Shadow } from '../../src/constants/theme';
import { getAgeFromDOB } from '../../src/constants/utils';
import Input from '../../src/components/ui/Input';
import Button from '../../src/components/ui/Button';
import Avatar from '../../src/components/ui/Avatar';
import LoadingSpinner from '../../src/components/ui/LoadingSpinner';

const RELATIONS = ['SELF','SPOUSE','CHILD','PARENT','SIBLING','OTHER'];
const GENDERS = ['MALE','FEMALE','OTHER'];
const BLOOD_GROUPS = ['A+','A-','B+','B-','AB+','AB-','O+','O-'];
const RELATION_ICONS: Record<string, string> = { SELF:'👤', SPOUSE:'💑', CHILD:'👶', PARENT:'👴', SIBLING:'👫', OTHER:'👥' };

function AddPatientModal({ onClose }: { onClose: () => void }) {
  const qc = useQueryClient();
  const [form, setForm] = useState({ firstName: '', lastName: '', dateOfBirth: '', gender: 'MALE', bloodGroup: '', relation: 'SPOUSE', phone: '' });
  const up = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  const mutation = useMutation({
    mutationFn: (data: any) => patientsApi.create(data),
    onSuccess: () => { Toast.show({ type: 'success', text1: '✅ Family member added!' }); qc.invalidateQueries({ queryKey: ['my-patients'] }); onClose(); },
    onError: (e: any) => Toast.show({ type: 'error', text1: e.response?.data?.message || 'Failed to add' }),
  });

  const handleSubmit = () => {
    if (!form.firstName || !form.dateOfBirth) {
      Toast.show({ type: 'error', text1: 'Name and date of birth are required' });
      return;
    }
    mutation.mutate(form);
  };

  return (
    <Modal visible animationType="slide" presentationStyle="pageSheet">
      <View style={styles.modal}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>Add Family Member</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
            <Ionicons name="close" size={22} color={Colors.slate[600]} />
          </TouchableOpacity>
        </View>
        <ScrollView contentContainerStyle={{ padding: 16, gap: 14 }} showsVerticalScrollIndicator={false}>
          <View style={styles.nameRow}>
            <View style={{ flex: 1 }}><Input label="First Name *" placeholder="John" value={form.firstName} onChangeText={v => up('firstName', v)} autoCapitalize="words" leftIcon="person-outline" /></View>
            <View style={{ flex: 1 }}><Input label="Last Name" placeholder="Doe" value={form.lastName} onChangeText={v => up('lastName', v)} autoCapitalize="words" leftIcon="person-outline" /></View>
          </View>

          <Input label="Date of Birth * (YYYY-MM-DD)" placeholder="1990-01-15" value={form.dateOfBirth} onChangeText={v => up('dateOfBirth', v)} leftIcon="calendar-outline" />
          <Input label="Phone (optional)" placeholder="+91 9876543210" value={form.phone} onChangeText={v => up('phone', v)} keyboardType="phone-pad" leftIcon="call-outline" />

          <View>
            <Text style={styles.fieldLabel}>Relation *</Text>
            <View style={styles.chipRow}>
              {RELATIONS.filter(r => r !== 'SELF').map(r => (
                <TouchableOpacity key={r} onPress={() => up('relation', r)} style={[styles.chip, form.relation === r && styles.chipActive]}>
                  <Text style={{ fontSize: 14 }}>{RELATION_ICONS[r]}</Text>
                  <Text style={[styles.chipText, form.relation === r && styles.chipTextActive]}>{r.charAt(0) + r.slice(1).toLowerCase()}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View>
            <Text style={styles.fieldLabel}>Gender *</Text>
            <View style={styles.chipRow}>
              {GENDERS.map(g => (
                <TouchableOpacity key={g} onPress={() => up('gender', g)} style={[styles.chip, form.gender === g && styles.chipActive]}>
                  <Text style={{ fontSize: 14 }}>{g === 'MALE' ? '👨' : g === 'FEMALE' ? '👩' : '🧑'}</Text>
                  <Text style={[styles.chipText, form.gender === g && styles.chipTextActive]}>{g.charAt(0) + g.slice(1).toLowerCase()}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View>
            <Text style={styles.fieldLabel}>Blood Group</Text>
            <View style={styles.chipRow}>
              {BLOOD_GROUPS.map(bg => (
                <TouchableOpacity key={bg} onPress={() => up('bloodGroup', bg)} style={[styles.chip, form.bloodGroup === bg && styles.chipActive]}>
                  <Text style={[styles.chipText, form.bloodGroup === bg && styles.chipTextActive]}>{bg}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <Button title="Add Family Member" onPress={handleSubmit} loading={mutation.isPending} fullWidth gradient={['#1e6fe8', '#02c9b3']} />
        </ScrollView>
      </View>
    </Modal>
  );
}

export default function FamilyScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const qc = useQueryClient();
  const [showAdd, setShowAdd] = useState(false);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['my-patients'],
    queryFn: () => patientsApi.list().then(r => r.data.data),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => patientsApi.delete(id),
    onSuccess: () => { Toast.show({ type: 'success', text1: 'Removed' }); qc.invalidateQueries({ queryKey: ['my-patients'] }); },
  });

  const handleDelete = (id: string, name: string) => {
    Alert.alert('Remove Member', `Remove ${name} from family?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Remove', style: 'destructive', onPress: () => deleteMutation.mutate(id) },
    ]);
  };

  const patients = data || [];

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={22} color={Colors.slate[700]} />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerTitle}>Family Members</Text>
          <Text style={styles.headerSub}>{patients.length} members registered</Text>
        </View>
        <TouchableOpacity onPress={() => setShowAdd(true)} style={styles.addBtn}>
          <Ionicons name="add" size={22} color={Colors.white} />
        </TouchableOpacity>
      </View>

      {isLoading ? <LoadingSpinner /> : (
        <FlatList
          data={patients}
          keyExtractor={p => p.id}
          contentContainerStyle={{ padding: 14, gap: 10, paddingBottom: 60 }}
          showsVerticalScrollIndicator={false}
          renderItem={({ item: p }) => (
            <View style={styles.memberCard}>
              <LinearGradient
                colors={p.relation === 'SELF' ? ['#1e6fe8', '#02c9b3'] : p.gender === 'FEMALE' ? ['#ec4899', '#f97316'] : ['#7c3aed', '#1e6fe8']}
                style={styles.memberIcon}
              >
                <Text style={{ fontSize: 26 }}>{RELATION_ICONS[p.relation] || '👥'}</Text>
              </LinearGradient>
              <View style={{ flex: 1 }}>
                <View style={styles.memberNameRow}>
                  <Text style={styles.memberName}>{p.firstName} {p.lastName}</Text>
                  {p.relation === 'SELF' && <View style={styles.selfBadge}><Text style={styles.selfBadgeText}>You</Text></View>}
                </View>
                <Text style={styles.memberMeta}>
                  {p.relation.charAt(0) + p.relation.slice(1).toLowerCase()}
                  {' · '}{p.gender?.toLowerCase()}
                  {p.dateOfBirth ? ` · ${getAgeFromDOB(p.dateOfBirth)} yrs` : ''}
                </Text>
                {p.bloodGroup && (
                  <View style={styles.bloodBadge}><Text style={styles.bloodText}>{p.bloodGroup}</Text></View>
                )}
              </View>
              {p.relation !== 'SELF' && (
                <TouchableOpacity onPress={() => handleDelete(p.id, `${p.firstName} ${p.lastName}`)} style={styles.deleteBtn}>
                  <Ionicons name="trash-outline" size={17} color={Colors.red[400]} />
                </TouchableOpacity>
              )}
            </View>
          )}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Text style={{ fontSize: 56, marginBottom: 16 }}>👨‍👩‍👧</Text>
              <Text style={styles.emptyTitle}>No family members yet</Text>
              <Text style={styles.emptySubText}>Add family members to book appointments on their behalf</Text>
              <TouchableOpacity onPress={() => setShowAdd(true)} style={styles.addEmptyBtn}>
                <Ionicons name="person-add-outline" size={18} color={Colors.white} />
                <Text style={styles.addEmptyText}>Add Member</Text>
              </TouchableOpacity>
            </View>
          }
        />
      )}

      {showAdd && <AddPatientModal onClose={() => setShowAdd(false)} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.slate[50] },
  header: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 16, paddingVertical: 16, backgroundColor: Colors.white, borderBottomWidth: 1, borderBottomColor: Colors.slate[100] },
  backBtn: { width: 40, height: 40, borderRadius: 12, backgroundColor: Colors.slate[100], alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: FontSize['2xl'], fontWeight: '900', color: Colors.slate[900] },
  headerSub: { fontSize: FontSize.xs, color: Colors.slate[500], marginTop: 1 },
  addBtn: { width: 40, height: 40, borderRadius: 12, backgroundColor: Colors.brand[600], alignItems: 'center', justifyContent: 'center' },

  memberCard: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: Colors.white, borderRadius: Radius['2xl'], padding: 14, ...Shadow.sm, borderWidth: 1, borderColor: Colors.slate[100] },
  memberIcon: { width: 52, height: 52, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  memberNameRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  memberName: { fontSize: FontSize.base, fontWeight: '800', color: Colors.slate[900] },
  selfBadge: { backgroundColor: Colors.brand[100], paddingHorizontal: 7, paddingVertical: 2, borderRadius: Radius.full },
  selfBadgeText: { fontSize: 10, color: Colors.brand[700], fontWeight: '700' },
  memberMeta: { fontSize: FontSize.xs, color: Colors.slate[500], marginTop: 3, textTransform: 'capitalize' },
  bloodBadge: { backgroundColor: Colors.red[50], paddingHorizontal: 7, paddingVertical: 2, borderRadius: Radius.full, alignSelf: 'flex-start', marginTop: 4 },
  bloodText: { fontSize: 10, color: Colors.red[600], fontWeight: '800' },
  deleteBtn: { width: 36, height: 36, borderRadius: 10, backgroundColor: Colors.red[50], alignItems: 'center', justifyContent: 'center' },

  empty: { alignItems: 'center', paddingVertical: 60, paddingHorizontal: 32 },
  emptyTitle: { fontSize: FontSize.xl, fontWeight: '800', color: Colors.slate[900], marginBottom: 8 },
  emptySubText: { fontSize: FontSize.sm, color: Colors.slate[400], textAlign: 'center', lineHeight: 20, marginBottom: 20 },
  addEmptyBtn: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: Colors.brand[600], paddingHorizontal: 20, paddingVertical: 12, borderRadius: Radius.xl },
  addEmptyText: { color: Colors.white, fontWeight: '700' },

  modal: { flex: 1, backgroundColor: Colors.white, paddingTop: 20 },
  modalHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: Colors.slate[100] },
  modalTitle: { fontSize: FontSize['2xl'], fontWeight: '900', color: Colors.slate[900] },
  closeBtn: { width: 36, height: 36, borderRadius: 10, backgroundColor: Colors.slate[100], alignItems: 'center', justifyContent: 'center' },
  nameRow: { flexDirection: 'row', gap: 10 },
  fieldLabel: { fontSize: FontSize.sm, fontWeight: '700', color: Colors.slate[700], marginBottom: 8 },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 12, paddingVertical: 8, borderRadius: Radius.full, backgroundColor: Colors.slate[100], borderWidth: 1.5, borderColor: Colors.slate[200] },
  chipActive: { backgroundColor: Colors.brand[600], borderColor: Colors.brand[600] },
  chipText: { fontSize: FontSize.xs, fontWeight: '700', color: Colors.slate[600] },
  chipTextActive: { color: Colors.white },
});
