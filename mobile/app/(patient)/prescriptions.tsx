// app/(patient)/prescriptions.tsx
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Linking, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { appointmentsApi, prescriptionsApi } from '../../src/api/endpoints';
import { API_BASE } from '../../src/api/client';
import { Colors, FontSize, Radius, Shadow } from '../../src/constants/theme';
import { formatDate, formatTime } from '../../src/constants/utils';
import Avatar from '../../src/components/ui/Avatar';
import Card from '../../src/components/ui/Card';
import LoadingSpinner from '../../src/components/ui/LoadingSpinner';

function PrescriptionCard({ apt }: { apt: any }) {
  const { data: rx } = useQuery({
    queryKey: ['rx-by-apt', apt.id],
    queryFn: () => prescriptionsApi.getByApt(apt.id).then(r => r.data.data).catch(() => null),
  });
  if (!rx) return null;

  const openPdf = () => {
    Linking.openURL(`${API_BASE}/prescriptions/${rx.id}/pdf`);
  };

  return (
    <Card style={styles.card} elevated>
      <View style={styles.doctorRow}>
        <Avatar uri={apt.doctor?.user?.avatar} name={`${apt.doctor?.user?.firstName} ${apt.doctor?.user?.lastName}`} size={48} />
        <View style={{ flex: 1 }}>
          <Text style={styles.doctorName}>Dr. {apt.doctor?.user?.firstName} {apt.doctor?.user?.lastName}</Text>
          <Text style={styles.spec}>{apt.doctor?.speciality?.name}</Text>
          <Text style={styles.date}>{formatDate(apt.scheduledDate)}</Text>
        </View>
        <TouchableOpacity onPress={openPdf} style={styles.pdfBtn}>
          <Ionicons name="document-text" size={18} color={Colors.white} />
          <Text style={styles.pdfBtnText}>PDF</Text>
        </TouchableOpacity>
      </View>

      {rx.diagnosis && (
        <View style={styles.diagnosis}>
          <Text style={styles.diagnosisLabel}>Diagnosis</Text>
          <Text style={styles.diagnosisText}>{rx.diagnosis}</Text>
        </View>
      )}

      {rx.medicines?.length > 0 && (
        <View style={styles.medicinesSection}>
          <Text style={styles.medicinesLabel}>Medicines ({rx.medicines.length})</Text>
          <View style={styles.medicinesList}>
            {rx.medicines.map((med: any, i: number) => (
              <View key={i} style={styles.medicineItem}>
                <Text style={styles.medicineIcon}>💊</Text>
                <View style={{ flex: 1 }}>
                  <Text style={styles.medicineName}>{med.name}</Text>
                  <Text style={styles.medicineDosage}>
                    {med.dosage}
                    {[med.morning && 'Morning', med.afternoon && 'Afternoon', med.evening && 'Evening'].filter(Boolean).length > 0
                      ? ` · ${[med.morning && 'Morning', med.afternoon && 'Afternoon', med.evening && 'Evening'].filter(Boolean).join(', ')}`
                      : ''}
                    {med.duration ? ` · ${med.duration} days` : ''}
                  </Text>
                  {med.instructions && <Text style={styles.medicineInstructions}>{med.instructions}</Text>}
                </View>
              </View>
            ))}
          </View>
        </View>
      )}

      {rx.notes && (
        <View style={styles.notes}>
          <Ionicons name="information-circle-outline" size={14} color={Colors.brand[600]} />
          <Text style={styles.notesText}>{rx.notes}</Text>
        </View>
      )}

      {rx.followUpDate && (
        <View style={styles.followUp}>
          <Ionicons name="calendar" size={13} color={Colors.teal[600]} />
          <Text style={styles.followUpText}>Follow-up: {formatDate(rx.followUpDate)}</Text>
        </View>
      )}
    </Card>
  );
}

export default function PrescriptionsScreen() {
  const insets = useSafeAreaInsets();

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['completed-apts'],
    queryFn: () => appointmentsApi.list({ status: 'COMPLETED', limit: 50 }).then(r => r.data.data.appointments),
  });

  const appointments = data || [];

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Prescriptions</Text>
        <Text style={styles.headerSub}>Your digital medical records</Text>
      </View>

      {isLoading ? <LoadingSpinner label="Loading prescriptions..." /> : (
        <FlatList
          data={appointments}
          keyExtractor={a => a.id}
          renderItem={({ item }) => <PrescriptionCard apt={item} />}
          contentContainerStyle={{ padding: 16, gap: 14, paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={isLoading} onRefresh={refetch} />}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Text style={{ fontSize: 56, marginBottom: 16 }}>💊</Text>
              <Text style={styles.emptyTitle}>No prescriptions yet</Text>
              <Text style={styles.emptySubText}>Prescriptions from completed appointments will appear here</Text>
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
  headerTitle: { fontSize: FontSize['3xl'], fontWeight: '900', color: Colors.slate[900], letterSpacing: -0.5 },
  headerSub: { fontSize: FontSize.sm, color: Colors.slate[500], marginTop: 2 },

  card: { gap: 12 },
  doctorRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  doctorName: { fontSize: FontSize.base, fontWeight: '700', color: Colors.slate[900] },
  spec: { fontSize: FontSize.xs, color: Colors.brand[600], fontWeight: '600', marginTop: 1 },
  date: { fontSize: FontSize.xs, color: Colors.slate[400], marginTop: 2 },
  pdfBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: Colors.brand[600], paddingHorizontal: 12, paddingVertical: 8, borderRadius: Radius.xl },
  pdfBtnText: { color: Colors.white, fontSize: FontSize.xs, fontWeight: '700' },

  diagnosis: { backgroundColor: Colors.brand[50] || '#eff8ff', borderRadius: Radius.lg, padding: 10 },
  diagnosisLabel: { fontSize: FontSize.xs, fontWeight: '700', color: Colors.brand[600], marginBottom: 3 },
  diagnosisText: { fontSize: FontSize.sm, color: Colors.slate[700], fontWeight: '500' },

  medicinesSection: { gap: 8 },
  medicinesLabel: { fontSize: FontSize.xs, fontWeight: '700', color: Colors.slate[500], textTransform: 'uppercase', letterSpacing: 0.5 },
  medicinesList: { gap: 8 },
  medicineItem: { flexDirection: 'row', gap: 10, backgroundColor: Colors.slate[50], borderRadius: Radius.lg, padding: 10 },
  medicineIcon: { fontSize: 20 },
  medicineName: { fontSize: FontSize.sm, fontWeight: '700', color: Colors.slate[900] },
  medicineDosage: { fontSize: FontSize.xs, color: Colors.slate[500], marginTop: 2 },
  medicineInstructions: { fontSize: FontSize.xs, color: Colors.teal[600], marginTop: 2, fontStyle: 'italic' },

  notes: { flexDirection: 'row', gap: 6, alignItems: 'flex-start', backgroundColor: Colors.brand[50], borderRadius: Radius.lg, padding: 10 },
  notesText: { flex: 1, fontSize: FontSize.xs, color: Colors.brand[700], lineHeight: 18 },

  followUp: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  followUpText: { fontSize: FontSize.xs, color: Colors.teal[700], fontWeight: '600' },

  empty: { alignItems: 'center', paddingVertical: 60 },
  emptyTitle: { fontSize: FontSize.xl, fontWeight: '800', color: Colors.slate[900], marginBottom: 8 },
  emptySubText: { fontSize: FontSize.sm, color: Colors.slate[500], textAlign: 'center', paddingHorizontal: 32 },
});
