// app/(doctor)/patients.tsx
import { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { appointmentsApi } from '../../src/api/endpoints';
import { Colors, FontSize, Radius, Shadow } from '../../src/constants/theme';
import { getInitials, getAgeFromDOB } from '../../src/constants/utils';
import Avatar from '../../src/components/ui/Avatar';
import LoadingSpinner from '../../src/components/ui/LoadingSpinner';

export default function DoctorPatientsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [search, setSearch] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['doctor-all-apts'],
    queryFn: () => appointmentsApi.list({ limit: 200 }).then(r => {
      const apts = r.data.data.appointments;
      const seen = new Set();
      return apts.filter((a: any) => {
        if (seen.has(a.patientId)) return false;
        seen.add(a.patientId);
        return true;
      }).map((a: any) => ({ ...a.patient, aptId: a.id }));
    }),
  });

  const patients = (data || []).filter((p: any) =>
    !search || `${p.firstName} ${p.lastName}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Patients</Text>
        <Text style={styles.headerSub}>{patients.length} unique patients</Text>
      </View>

      <View style={styles.searchContainer}>
        <Ionicons name="search" size={16} color={Colors.slate[400]} />
        <TextInput value={search} onChangeText={setSearch} placeholder="Search patients..." placeholderTextColor={Colors.slate[400]} style={styles.searchInput} />
      </View>

      {isLoading ? <LoadingSpinner label="Loading patients..." /> : (
        <FlatList
          data={patients}
          keyExtractor={p => p.id}
          contentContainerStyle={{ padding: 14, gap: 10, paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}
          numColumns={2}
          columnWrapperStyle={{ gap: 10 }}
          renderItem={({ item: patient }) => (
            <TouchableOpacity style={styles.patientCard} onPress={() => router.push(`/(doctor)/patient-detail?id=${patient.id}`)} activeOpacity={0.8}>
              <Avatar uri={patient.avatar} name={`${patient.firstName} ${patient.lastName}`} size={52} />
              <Text style={styles.patientName} numberOfLines={1}>{patient.firstName} {patient.lastName}</Text>
              <Text style={styles.patientMeta}>{patient.dateOfBirth ? `${getAgeFromDOB(patient.dateOfBirth)} yrs` : '—'} · {patient.gender?.toLowerCase()}</Text>
              {patient.bloodGroup && <View style={styles.bloodBadge}><Text style={styles.bloodText}>{patient.bloodGroup}</Text></View>}
              <View style={styles.viewBtn}>
                <Text style={styles.viewBtnText}>View History</Text>
                <Ionicons name="chevron-forward" size={12} color={Colors.teal[600]} />
              </View>
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Text style={{ fontSize: 48, marginBottom: 16 }}>👥</Text>
              <Text style={styles.emptyText}>No patients yet</Text>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.slate[50] },
  header: { backgroundColor: Colors.white, paddingHorizontal: 16, paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: Colors.slate[100] },
  headerTitle: { fontSize: FontSize['3xl'], fontWeight: '900', color: Colors.slate[900] },
  headerSub: { fontSize: FontSize.sm, color: Colors.slate[500], marginTop: 2 },
  searchContainer: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: Colors.white, paddingHorizontal: 14, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: Colors.slate[100] },
  searchInput: { flex: 1, fontSize: FontSize.sm, color: Colors.slate[900] },

  patientCard: {
    flex: 1, backgroundColor: Colors.white, borderRadius: Radius['2xl'],
    padding: 14, alignItems: 'center', gap: 6,
    ...Shadow.sm, borderWidth: 1, borderColor: Colors.slate[100],
  },
  patientName: { fontSize: FontSize.sm, fontWeight: '800', color: Colors.slate[900], textAlign: 'center' },
  patientMeta: { fontSize: FontSize.xs, color: Colors.slate[400], textTransform: 'capitalize' },
  bloodBadge: { backgroundColor: '#fef2f2', paddingHorizontal: 8, paddingVertical: 3, borderRadius: Radius.full },
  bloodText: { fontSize: 11, color: Colors.red[600], fontWeight: '700' },
  viewBtn: { flexDirection: 'row', alignItems: 'center', gap: 3, marginTop: 4 },
  viewBtnText: { fontSize: 11, color: Colors.teal[600], fontWeight: '700' },

  empty: { alignItems: 'center', paddingVertical: 60 },
  emptyText: { fontSize: FontSize.xl, fontWeight: '800', color: Colors.slate[700] },
});
