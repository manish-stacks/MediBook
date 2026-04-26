// app/(patient)/appointment-detail.tsx
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Linking } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Toast from 'react-native-toast-message';
import { appointmentsApi, prescriptionsApi } from '../../src/api/endpoints';
import { API_BASE } from '../../src/api/client';
import { Colors, FontSize, Radius, Shadow } from '../../src/constants/theme';
import { formatDate, formatTime, getStatusColor, getPaymentStatusColor, formatCurrency } from '../../src/constants/utils';
import Avatar from '../../src/components/ui/Avatar';
import Card from '../../src/components/ui/Card';
import Badge from '../../src/components/ui/Badge';
import LoadingSpinner from '../../src/components/ui/LoadingSpinner';

function InfoRow({ icon, label, value, color }: any) {
  return (
    <View style={styles.infoRow}>
      <View style={[styles.infoIcon, { backgroundColor: (color || Colors.brand[600]) + '18' }]}>
        <Ionicons name={icon} size={15} color={color || Colors.brand[600]} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={styles.infoValue}>{value}</Text>
      </View>
    </View>
  );
}

export default function AppointmentDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const qc = useQueryClient();

  const { data: apt, isLoading } = useQuery({
    queryKey: ['appointment', id],
    queryFn: () => appointmentsApi.getById(id).then(r => r.data.data),
    enabled: !!id,
  });

  const { data: rx } = useQuery({
    queryKey: ['rx-apt', id],
    queryFn: () => apt?.prescription?.id
      ? prescriptionsApi.getById(apt.prescription.id).then(r => r.data.data)
      : prescriptionsApi.getByApt(id).then(r => r.data.data).catch(() => null),
    enabled: !!apt,
  });

  const cancelMutation = useMutation({
    mutationFn: () => appointmentsApi.updateStatus(id, { status: 'CANCELLED' }),
    onSuccess: () => {
      Toast.show({ type: 'success', text1: 'Appointment cancelled' });
      qc.invalidateQueries({ queryKey: ['appointments'] });
      router.back();
    },
    onError: (e: any) => Toast.show({ type: 'error', text1: e.response?.data?.message || 'Failed' }),
  });

  const handleCancel = () => {
    Alert.alert('Cancel Appointment', 'Are you sure you want to cancel?', [
      { text: 'No', style: 'cancel' },
      { text: 'Yes, Cancel', style: 'destructive', onPress: () => cancelMutation.mutate() },
    ]);
  };

  if (isLoading) return <LoadingSpinner fullScreen label="Loading..." />;
  if (!apt) return (
    <View style={[styles.container, { paddingTop: insets.top, alignItems: 'center', justifyContent: 'center' }]}>
      <Text style={{ fontSize: 48 }}>😕</Text>
      <Text style={{ color: Colors.slate[600], marginTop: 12 }}>Appointment not found</Text>
      <TouchableOpacity onPress={() => router.back()} style={{ marginTop: 16 }}>
        <Text style={{ color: Colors.brand[600], fontWeight: '700' }}>← Go Back</Text>
      </TouchableOpacity>
    </View>
  );

  const sc = getStatusColor(apt.status);
  const canCancel = ['PENDING', 'CONFIRMED'].includes(apt.status);
  const vitals = apt.patient?.vitals?.[0];

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <LinearGradient colors={['#0f172a', '#1e3a5f']} style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color={Colors.white} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Appointment Details</Text>
          <Text style={styles.headerSub}>#{apt.appointmentNo}</Text>
        </View>
        <View style={[styles.statusPill, { backgroundColor: sc.bg }]}>
          <Text style={[styles.statusText, { color: sc.text }]}>{apt.status}</Text>
        </View>
      </LinearGradient>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 16, gap: 14, paddingBottom: 40 }}>
        {/* Doctor card */}
        <Card elevated>
          <View style={styles.doctorRow}>
            <Avatar uri={apt.doctor?.user?.avatar} name={`${apt.doctor?.user?.firstName} ${apt.doctor?.user?.lastName}`} size={60} />
            <View style={{ flex: 1 }}>
              <Text style={styles.doctorName}>Dr. {apt.doctor?.user?.firstName} {apt.doctor?.user?.lastName}</Text>
              <Text style={styles.doctorSpec}>{apt.doctor?.speciality?.name}</Text>
              <View style={styles.ratingRow}>
                <Ionicons name="star" size={12} color="#f59e0b" />
                <Text style={styles.ratingText}>{Number(apt.doctor?.rating || 0).toFixed(1)}</Text>
                <Text style={styles.ratingCount}>({apt.doctor?.totalReviews || 0} reviews)</Text>
              </View>
            </View>
          </View>
        </Card>

        {/* Schedule */}
        <Card elevated>
          <Text style={styles.sectionTitle}>📅 Schedule</Text>
          <View style={styles.infoList}>
            <InfoRow icon="calendar-outline" label="Date" value={formatDate(apt.scheduledDate)} color={Colors.brand[600]} />
            <InfoRow icon="time-outline" label="Time" value={formatTime(apt.scheduledTime)} color={Colors.teal[600]} />
            {apt.clinic && <InfoRow icon="location-outline" label="Clinic" value={`${apt.clinic.name}, ${apt.clinic.city}`} color={Colors.violet[500]} />}
            {apt.notes && <InfoRow icon="chatbubble-outline" label="Your Note" value={apt.notes} color={Colors.amber[600]} />}
          </View>
          {apt.isRescheduled && (
            <View style={styles.rescheduledBadge}>
              <Ionicons name="refresh-outline" size={12} color={Colors.violet[600]} />
              <Text style={styles.rescheduledText}>Appointment was rescheduled</Text>
            </View>
          )}
        </Card>

        {/* Patient */}
        <Card elevated>
          <Text style={styles.sectionTitle}>👤 Patient</Text>
          <View style={styles.infoList}>
            <InfoRow icon="person-outline" label="Name" value={`${apt.patient?.firstName} ${apt.patient?.lastName}`} />
            <InfoRow icon="male-female-outline" label="Gender" value={apt.patient?.gender?.toLowerCase()} />
            {apt.patient?.bloodGroup && <InfoRow icon="water-outline" label="Blood Group" value={apt.patient.bloodGroup} color={Colors.red[600]} />}
            {apt.patient?.dateOfBirth && <InfoRow icon="calendar-outline" label="Date of Birth" value={formatDate(apt.patient.dateOfBirth)} />}
          </View>
        </Card>

        {/* Vitals */}
        {vitals && (
          <Card elevated>
            <Text style={styles.sectionTitle}>🩺 Vitals Recorded</Text>
            <View style={styles.vitalsGrid}>
              {[
                { l: 'Temperature', v: vitals.temperature ? `${vitals.temperature}°C` : '—', icon: '🌡️' },
                { l: 'Blood Pressure', v: vitals.bloodPressure || '—', icon: '❤️' },
                { l: 'Heart Rate', v: vitals.heartRate ? `${vitals.heartRate} bpm` : '—', icon: '💓' },
                { l: 'Weight', v: vitals.weight ? `${vitals.weight} kg` : '—', icon: '⚖️' },
                { l: 'Height', v: vitals.height ? `${vitals.height} cm` : '—', icon: '📏' },
                { l: 'SpO2', v: vitals.oxygenSaturation ? `${vitals.oxygenSaturation}%` : '—', icon: '💨' },
              ].map(v => (
                <View key={v.l} style={styles.vitalBox}>
                  <Text style={styles.vitalIcon}>{v.icon}</Text>
                  <Text style={styles.vitalValue}>{v.v}</Text>
                  <Text style={styles.vitalLabel}>{v.l}</Text>
                </View>
              ))}
            </View>
            {vitals.notes && <Text style={styles.vitalsNote}>📝 {vitals.notes}</Text>}
          </Card>
        )}

        {/* Payment */}
        {apt.payment && (
          <Card elevated>
            <Text style={styles.sectionTitle}>💳 Payment</Text>
            <View style={styles.paymentRow}>
              <View>
                <Text style={styles.paymentAmount}>{formatCurrency(Number(apt.payment.amount))}</Text>
                <Text style={styles.paymentMode}>{apt.payment.paymentMode?.replace('_', ' ')}</Text>
              </View>
              <Badge
                label={apt.payment.status}
                bg={getPaymentStatusColor(apt.payment.status).bg}
                color={getPaymentStatusColor(apt.payment.status).text}
              />
            </View>
            {apt.payment.paidAt && (
              <Text style={styles.paidAt}>Paid on {formatDate(apt.payment.paidAt)}</Text>
            )}
          </Card>
        )}

        {/* Prescription */}
        {rx && (
          <Card elevated>
            <View style={styles.rxHeader}>
              <Text style={styles.sectionTitle}>💊 Prescription</Text>
              <TouchableOpacity
                style={styles.downloadBtn}
                onPress={() => Linking.openURL(`${API_BASE}/prescriptions/${rx.id}/pdf`)}
              >
                <Ionicons name="download-outline" size={15} color={Colors.brand[700]} />
                <Text style={styles.downloadText}>PDF</Text>
              </TouchableOpacity>
            </View>

            {rx.diagnosis && (
              <View style={styles.diagnosisBox}>
                <Text style={styles.diagLabel}>Diagnosis</Text>
                <Text style={styles.diagText}>{rx.diagnosis}</Text>
              </View>
            )}

            {rx.medicines?.length > 0 && (
              <View style={styles.medicineList}>
                {rx.medicines.map((med: any, i: number) => (
                  <View key={i} style={styles.medicineCard}>
                    <Text style={styles.medIcon}>💊</Text>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.medName}>{med.name}</Text>
                      <Text style={styles.medDosage}>{med.dosage}</Text>
                      <View style={styles.medTimingRow}>
                        {med.morning && <View style={styles.timingPill}><Text style={styles.timingText}>🌅 Morning</Text></View>}
                        {med.afternoon && <View style={styles.timingPill}><Text style={styles.timingText}>☀️ Afternoon</Text></View>}
                        {med.evening && <View style={styles.timingPill}><Text style={styles.timingText}>🌙 Evening</Text></View>}
                      </View>
                      {med.duration && <Text style={styles.medDuration}>📆 {med.duration} days</Text>}
                      {med.instructions && <Text style={styles.medInstructions}>📌 {med.instructions}</Text>}
                    </View>
                  </View>
                ))}
              </View>
            )}

            {rx.notes && (
              <View style={styles.rxNotes}>
                <Ionicons name="information-circle-outline" size={15} color={Colors.brand[600]} />
                <Text style={styles.rxNotesText}>{rx.notes}</Text>
              </View>
            )}

            {rx.followUpDate && (
              <View style={styles.followUp}>
                <Ionicons name="calendar" size={14} color={Colors.teal[600]} />
                <Text style={styles.followUpText}>Follow-up: {formatDate(rx.followUpDate)}</Text>
              </View>
            )}
          </Card>
        )}

        {/* Actions */}
        {canCancel && (
          <TouchableOpacity style={styles.cancelBtn} onPress={handleCancel}>
            <Ionicons name="close-circle-outline" size={18} color={Colors.red[600]} />
            <Text style={styles.cancelText}>Cancel Appointment</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.slate[50] },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingBottom: 16, paddingTop: 12, gap: 10 },
  backBtn: { width: 40, height: 40, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.12)', alignItems: 'center', justifyContent: 'center' },
  headerCenter: { flex: 1 },
  headerTitle: { fontSize: FontSize.lg, fontWeight: '800', color: Colors.white },
  headerSub: { fontSize: FontSize.xs, color: 'rgba(255,255,255,0.5)', marginTop: 2 },
  statusPill: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: Radius.full },
  statusText: { fontSize: FontSize.xs, fontWeight: '800' },

  doctorRow: { flexDirection: 'row', gap: 12, alignItems: 'center' },
  doctorName: { fontSize: FontSize.lg, fontWeight: '800', color: Colors.slate[900] },
  doctorSpec: { fontSize: FontSize.sm, color: Colors.brand[600], fontWeight: '600', marginTop: 2 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 },
  ratingText: { fontSize: FontSize.xs, fontWeight: '700', color: Colors.slate[800] },
  ratingCount: { fontSize: FontSize.xs, color: Colors.slate[400] },

  sectionTitle: { fontSize: FontSize.base, fontWeight: '800', color: Colors.slate[900], marginBottom: 12 },
  infoList: { gap: 10 },
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  infoIcon: { width: 34, height: 34, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  infoLabel: { fontSize: FontSize.xs, color: Colors.slate[400], fontWeight: '600' },
  infoValue: { fontSize: FontSize.sm, color: Colors.slate[800], fontWeight: '600', marginTop: 1, textTransform: 'capitalize' },

  rescheduledBadge: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 10, backgroundColor: Colors.violet[50], padding: 8, borderRadius: Radius.lg },
  rescheduledText: { fontSize: FontSize.xs, color: Colors.violet[600], fontWeight: '600' },

  vitalsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  vitalBox: { width: '30%', flex: 1, backgroundColor: Colors.slate[50], borderRadius: Radius.lg, padding: 10, alignItems: 'center', gap: 3 },
  vitalIcon: { fontSize: 20 },
  vitalValue: { fontSize: FontSize.base, fontWeight: '800', color: Colors.slate[900] },
  vitalLabel: { fontSize: 10, color: Colors.slate[400], textAlign: 'center' },
  vitalsNote: { marginTop: 10, fontSize: FontSize.xs, color: Colors.slate[500], backgroundColor: Colors.slate[50], padding: 8, borderRadius: Radius.lg },

  paymentRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  paymentAmount: { fontSize: FontSize['3xl'], fontWeight: '900', color: Colors.slate[900] },
  paymentMode: { fontSize: FontSize.xs, color: Colors.slate[400], textTransform: 'capitalize', marginTop: 2 },
  paidAt: { fontSize: FontSize.xs, color: Colors.green[600], fontWeight: '600', marginTop: 8 },

  rxHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
  downloadBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: Colors.brand[50], paddingHorizontal: 12, paddingVertical: 6, borderRadius: Radius.full },
  downloadText: { fontSize: FontSize.xs, fontWeight: '700', color: Colors.brand[700] },
  diagnosisBox: { backgroundColor: Colors.brand[50] || '#eff8ff', borderRadius: Radius.lg, padding: 10, marginBottom: 12 },
  diagLabel: { fontSize: FontSize.xs, fontWeight: '700', color: Colors.brand[600], marginBottom: 3 },
  diagText: { fontSize: FontSize.sm, color: Colors.slate[700], fontWeight: '600' },
  medicineList: { gap: 8 },
  medicineCard: { flexDirection: 'row', gap: 10, backgroundColor: Colors.slate[50], borderRadius: Radius.lg, padding: 12 },
  medIcon: { fontSize: 22, marginTop: 2 },
  medName: { fontSize: FontSize.sm, fontWeight: '800', color: Colors.slate[900] },
  medDosage: { fontSize: FontSize.xs, color: Colors.slate[500], marginTop: 2 },
  medTimingRow: { flexDirection: 'row', gap: 6, marginTop: 5, flexWrap: 'wrap' },
  timingPill: { backgroundColor: Colors.brand[50], paddingHorizontal: 8, paddingVertical: 3, borderRadius: Radius.full },
  timingText: { fontSize: 10, color: Colors.brand[700], fontWeight: '600' },
  medDuration: { fontSize: FontSize.xs, color: Colors.teal[600], marginTop: 4, fontWeight: '600' },
  medInstructions: { fontSize: FontSize.xs, color: Colors.amber[600], marginTop: 2 },
  rxNotes: { flexDirection: 'row', gap: 6, marginTop: 12, backgroundColor: Colors.brand[50], borderRadius: Radius.lg, padding: 10 },
  rxNotesText: { flex: 1, fontSize: FontSize.xs, color: Colors.brand[700], lineHeight: 18 },
  followUp: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 8 },
  followUpText: { fontSize: FontSize.xs, color: Colors.teal[600], fontWeight: '700' },

  cancelBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: Colors.red[50], borderWidth: 1.5, borderColor: Colors.red[100], borderRadius: Radius['2xl'], padding: 14 },
  cancelText: { fontSize: FontSize.base, fontWeight: '700', color: Colors.red[600] },
});
