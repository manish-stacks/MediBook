// app/(doctor)/patient-detail.tsx
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { appointmentsApi } from '../../src/api/endpoints';
import { API_BASE } from '../../src/api/client';
import { Colors, FontSize, Radius, Shadow } from '../../src/constants/theme';
import { formatDate, formatTime, getStatusColor, getAgeFromDOB } from '../../src/constants/utils';
import Avatar from '../../src/components/ui/Avatar';
import Card from '../../src/components/ui/Card';
import Badge from '../../src/components/ui/Badge';
import LoadingSpinner from '../../src/components/ui/LoadingSpinner';

export default function DoctorPatientDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const { data, isLoading } = useQuery({
    queryKey: ['doctor-patient', id],
    queryFn: async () => {
      const res = await appointmentsApi.list({ limit: 200 });
      const all = res.data.data.appointments;
      const patientApts = all.filter((a: any) => a.patientId === id || a.patient?.id === id);
      const patient = patientApts[0]?.patient || null;
      return { patient, appointments: patientApts };
    },
    enabled: !!id,
  });

  if (isLoading) return <LoadingSpinner fullScreen />;
  const { patient, appointments = [] } = data || {};
  const vitals = patient?.vitals || [];

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <LinearGradient colors={['#0f172a', '#0d4f4f']} style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color={Colors.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Patient Profile</Text>
        <View style={{ width: 40 }} />
      </LinearGradient>

      {!patient ? (
        <View style={styles.empty}><Text style={{ fontSize: 40 }}>😕</Text><Text style={styles.emptyText}>Patient not found</Text></View>
      ) : (
        <ScrollView contentContainerStyle={{ padding: 14, gap: 12, paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
          {/* Patient card */}
          <Card elevated>
            <View style={styles.patientRow}>
              <Avatar name={`${patient.firstName} ${patient.lastName}`} size={64} style={{ borderRadius: 18 }} />
              <View style={{ flex: 1 }}>
                <Text style={styles.patientName}>{patient.firstName} {patient.lastName}</Text>
                <Text style={styles.patientMeta}>
                  {patient.dateOfBirth ? `${getAgeFromDOB(patient.dateOfBirth)} yrs · ` : ''}
                  {patient.gender?.toLowerCase()}
                </Text>
                {patient.bloodGroup && (
                  <View style={styles.bloodBadge}><Text style={styles.bloodText}>{patient.bloodGroup}</Text></View>
                )}
              </View>
            </View>
            <View style={styles.contactRow}>
              {patient.phone && (
                <TouchableOpacity style={styles.contactBtn} onPress={() => Linking.openURL(`tel:${patient.phone}`)}>
                  <Ionicons name="call-outline" size={15} color={Colors.teal[700]} />
                  <Text style={styles.contactBtnText}>{patient.phone}</Text>
                </TouchableOpacity>
              )}
              {patient.email && (
                <TouchableOpacity style={styles.contactBtn} onPress={() => Linking.openURL(`mailto:${patient.email}`)}>
                  <Ionicons name="mail-outline" size={15} color={Colors.brand[700]} />
                  <Text style={styles.contactBtnText}>{patient.email}</Text>
                </TouchableOpacity>
              )}
            </View>
          </Card>

          {/* Latest Vitals */}
          {vitals.length > 0 && (
            <Card elevated>
              <Text style={styles.cardTitle}>🩺 Latest Vitals <Text style={styles.cardTitleSub}>({formatDate(vitals[0].recordedAt)})</Text></Text>
              <View style={styles.vitalsGrid}>
                {[
                  { l: '🌡️ Temp', v: vitals[0].temperature ? `${vitals[0].temperature}°C` : '—' },
                  { l: '❤️ BP', v: vitals[0].bloodPressure || '—' },
                  { l: '💓 HR', v: vitals[0].heartRate ? `${vitals[0].heartRate}bpm` : '—' },
                  { l: '⚖️ Weight', v: vitals[0].weight ? `${vitals[0].weight}kg` : '—' },
                  { l: '📏 Height', v: vitals[0].height ? `${vitals[0].height}cm` : '—' },
                  { l: '💨 SpO2', v: vitals[0].oxygenSaturation ? `${vitals[0].oxygenSaturation}%` : '—' },
                ].map(v => (
                  <View key={v.l} style={styles.vitalBox}>
                    <Text style={styles.vitalLabel}>{v.l}</Text>
                    <Text style={styles.vitalValue}>{v.v}</Text>
                  </View>
                ))}
              </View>
            </Card>
          )}

          {/* Appointments history */}
          <View>
            <Text style={styles.cardTitle}>📋 Appointment History ({appointments.length})</Text>
            <View style={{ gap: 10 }}>
              {appointments.map((apt: any) => {
                const sc = getStatusColor(apt.status);
                return (
                  <TouchableOpacity key={apt.id} onPress={() => router.push(`/(doctor)/appointment-detail?id=${apt.id}`)} activeOpacity={0.85}>
                    <Card style={styles.aptCard}>
                      <View style={styles.aptRow}>
                        <View style={{ flex: 1 }}>
                          <Text style={styles.aptDate}>{formatDate(apt.scheduledDate)}</Text>
                          <Text style={styles.aptTime}>{formatTime(apt.scheduledTime)}</Text>
                          <Text style={styles.aptClinic}>{apt.clinic?.name}</Text>
                        </View>
                        <Badge label={apt.status} bg={sc.bg} color={sc.text} size="sm" />
                      </View>

                      {apt.prescription && (
                        <View style={styles.rxPreview}>
                          <Text style={styles.rxDiag}>📋 {apt.prescription.diagnosis || 'Prescription available'}</Text>
                          <View style={styles.rxMeds}>
                            {apt.prescription.medicines?.slice(0, 3).map((m: any, j: number) => (
                              <Text key={j} style={styles.rxMed}>💊 {m.name}</Text>
                            ))}
                            {(apt.prescription.medicines?.length || 0) > 3 && (
                              <Text style={styles.rxMore}>+{apt.prescription.medicines.length - 3} more</Text>
                            )}
                          </View>
                          <TouchableOpacity
                            onPress={() => Linking.openURL(`${API_BASE}/prescriptions/${apt.prescription.id}/pdf`)}
                            style={styles.pdfBtn}
                          >
                            <Ionicons name="document-text-outline" size={13} color={Colors.brand[600]} />
                            <Text style={styles.pdfBtnText}>View PDF</Text>
                          </TouchableOpacity>
                        </View>
                      )}
                    </Card>
                  </TouchableOpacity>
                );
              })}
              {appointments.length === 0 && (
                <View style={styles.empty}><Text style={styles.emptyText}>No appointments yet</Text></View>
              )}
            </View>
          </View>
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.slate[50] },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingBottom: 16, paddingTop: 12 },
  backBtn: { width: 40, height: 40, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.12)', alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: FontSize.xl, fontWeight: '800', color: Colors.white },

  patientRow: { flexDirection: 'row', gap: 12, alignItems: 'center', marginBottom: 12 },
  patientName: { fontSize: FontSize.xl, fontWeight: '900', color: Colors.slate[900] },
  patientMeta: { fontSize: FontSize.xs, color: Colors.slate[400], textTransform: 'capitalize', marginTop: 2 },
  bloodBadge: { backgroundColor: Colors.red[50], paddingHorizontal: 7, paddingVertical: 2, borderRadius: Radius.full, alignSelf: 'flex-start', marginTop: 4 },
  bloodText: { fontSize: 11, color: Colors.red[600], fontWeight: '800' },
  contactRow: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  contactBtn: { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: Colors.slate[50], borderRadius: Radius.full, paddingHorizontal: 10, paddingVertical: 6 },
  contactBtnText: { fontSize: FontSize.xs, color: Colors.slate[600], fontWeight: '600' },

  cardTitle: { fontSize: FontSize.base, fontWeight: '800', color: Colors.slate[900], marginBottom: 10 },
  cardTitleSub: { fontSize: FontSize.xs, color: Colors.slate[400], fontWeight: '400' },
  vitalsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  vitalBox: { width: '30%', flex: 1, backgroundColor: Colors.slate[50], borderRadius: Radius.lg, padding: 10 },
  vitalLabel: { fontSize: 10, color: Colors.slate[400], fontWeight: '600', marginBottom: 3 },
  vitalValue: { fontSize: FontSize.sm, fontWeight: '800', color: Colors.slate[900] },

  aptCard: { padding: 12, gap: 8 },
  aptRow: { flexDirection: 'row', alignItems: 'center' },
  aptDate: { fontSize: FontSize.sm, fontWeight: '800', color: Colors.slate[900] },
  aptTime: { fontSize: FontSize.xs, color: Colors.teal[600], fontWeight: '600', marginTop: 2 },
  aptClinic: { fontSize: FontSize.xs, color: Colors.slate[400], marginTop: 1 },
  rxPreview: { backgroundColor: Colors.slate[50], borderRadius: Radius.lg, padding: 10, gap: 6 },
  rxDiag: { fontSize: FontSize.xs, fontWeight: '700', color: Colors.brand[700] },
  rxMeds: { flexDirection: 'row', flexWrap: 'wrap', gap: 4 },
  rxMed: { fontSize: 11, backgroundColor: Colors.teal[50], paddingHorizontal: 7, paddingVertical: 2, borderRadius: Radius.full, color: Colors.teal[700] },
  rxMore: { fontSize: 11, color: Colors.slate[400] },
  pdfBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, alignSelf: 'flex-start' },
  pdfBtnText: { fontSize: FontSize.xs, color: Colors.brand[600], fontWeight: '700' },

  empty: { alignItems: 'center', padding: 40 },
  emptyText: { fontSize: FontSize.base, color: Colors.slate[400], marginTop: 8 },
});
