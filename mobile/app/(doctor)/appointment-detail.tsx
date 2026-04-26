// app/(doctor)/appointment-detail.tsx
import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, TextInput, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Toast from 'react-native-toast-message';
import { appointmentsApi, patientsApi, prescriptionsApi } from '../../src/api/endpoints';
import { Colors, FontSize, Radius, Shadow } from '../../src/constants/theme';
import { formatDate, formatTime, getStatusColor, formatCurrency, getPaymentStatusColor } from '../../src/constants/utils';
import Avatar from '../../src/components/ui/Avatar';
import Card from '../../src/components/ui/Card';
import Badge from '../../src/components/ui/Badge';
import LoadingSpinner from '../../src/components/ui/LoadingSpinner';

function VitalsModal({ patient, onClose }: { patient: any; onClose: () => void }) {
  const qc = useQueryClient();
  const latest = patient?.vitals?.[0];
  const [form, setForm] = useState({
    temperature: latest?.temperature?.toString() || '',
    bloodPressure: latest?.bloodPressure || '',
    heartRate: latest?.heartRate?.toString() || '',
    weight: latest?.weight?.toString() || '',
    height: latest?.height?.toString() || '',
    oxygenSaturation: latest?.oxygenSaturation?.toString() || '',
    notes: '',
  });

  const mutation = useMutation({
    mutationFn: (data: any) => patientsApi.addVitals(patient.id, data),
    onSuccess: () => { Toast.show({ type: 'success', text1: '✅ Vitals saved!' }); qc.invalidateQueries({ queryKey: ['appointment'] }); onClose(); },
    onError: (e: any) => Toast.show({ type: 'error', text1: e.response?.data?.message || 'Failed' }),
  });

  const FIELDS = [
    { key: 'temperature', label: 'Temperature (°C)', icon: '🌡️', placeholder: '98.6', kbd: 'decimal-pad' },
    { key: 'bloodPressure', label: 'Blood Pressure', icon: '❤️', placeholder: '120/80', kbd: 'default' },
    { key: 'heartRate', label: 'Heart Rate (bpm)', icon: '💓', placeholder: '72', kbd: 'number-pad' },
    { key: 'weight', label: 'Weight (kg)', icon: '⚖️', placeholder: '70', kbd: 'decimal-pad' },
    { key: 'height', label: 'Height (cm)', icon: '📏', placeholder: '170', kbd: 'decimal-pad' },
    { key: 'oxygenSaturation', label: 'SpO2 (%)', icon: '💨', placeholder: '98', kbd: 'decimal-pad' },
  ];

  return (
    <Modal visible animationType="slide" presentationStyle="pageSheet">
      <View style={styles.modal}>
        <View style={styles.modalHeader}>
          <View>
            <Text style={styles.modalTitle}>Record Vitals</Text>
            <Text style={styles.modalSub}>{patient.firstName} {patient.lastName}</Text>
          </View>
          <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
            <Ionicons name="close" size={22} color={Colors.slate[600]} />
          </TouchableOpacity>
        </View>
        <ScrollView contentContainerStyle={{ padding: 16, gap: 12 }}>
          {latest && (
            <View style={styles.prevVitals}>
              <Text style={styles.prevLabel}>Previous Vitals — {formatDate(latest.recordedAt)}</Text>
              <Text style={styles.prevText}>
                Temp: {latest.temperature || '—'} · BP: {latest.bloodPressure || '—'} · HR: {latest.heartRate || '—'} bpm
              </Text>
            </View>
          )}
          <View style={styles.vitalsGrid}>
            {FIELDS.map(f => (
              <View key={f.key} style={styles.vitalField}>
                <Text style={styles.vitalFieldLabel}>{f.icon} {f.label}</Text>
                <TextInput
                  value={(form as any)[f.key]}
                  onChangeText={v => setForm(prev => ({ ...prev, [f.key]: v }))}
                  placeholder={f.placeholder}
                  placeholderTextColor={Colors.slate[300]}
                  keyboardType={f.kbd as any}
                  style={styles.vitalInput}
                />
              </View>
            ))}
          </View>
          <View>
            <Text style={styles.vitalFieldLabel}>📝 Clinical Notes</Text>
            <TextInput
              value={form.notes}
              onChangeText={v => setForm(f => ({ ...f, notes: v }))}
              placeholder="Additional observations..."
              placeholderTextColor={Colors.slate[300]}
              multiline
              numberOfLines={3}
              style={[styles.vitalInput, { height: 80, textAlignVertical: 'top' }]}
            />
          </View>
          <TouchableOpacity onPress={() => mutation.mutate(form)} disabled={mutation.isPending} activeOpacity={0.85}>
            <LinearGradient colors={['#02c9b3', '#1e6fe8']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.saveBtn}>
              <Ionicons name="checkmark-circle-outline" size={20} color={Colors.white} />
              <Text style={styles.saveBtnText}>{mutation.isPending ? 'Saving...' : 'Save Vitals'}</Text>
            </LinearGradient>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </Modal>
  );
}

export default function DoctorAppointmentDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const qc = useQueryClient();
  const [showVitals, setShowVitals] = useState(false);

  const { data: apt, isLoading } = useQuery({
    queryKey: ['appointment', id],
    queryFn: () => appointmentsApi.getById(id).then(r => r.data.data),
    enabled: !!id,
  });

  const statusMutation = useMutation({
    mutationFn: (status: string) => appointmentsApi.updateStatus(id, { status }),
    onSuccess: () => { Toast.show({ type: 'success', text1: 'Status updated' }); qc.invalidateQueries({ queryKey: ['appointment', id] }); },
  });

  if (isLoading) return <LoadingSpinner fullScreen />;
  if (!apt) return null;

  const sc = getStatusColor(apt.status);
  const vitals = apt.patient?.vitals?.[0];

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <LinearGradient colors={['#0f172a', '#0d4f4f']} style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color={Colors.white} />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerTitle}>Appointment</Text>
          <Text style={styles.headerSub}>#{apt.appointmentNo}</Text>
        </View>
        <View style={[styles.statusPill, { backgroundColor: sc.bg }]}>
          <Text style={[styles.statusTxt, { color: sc.text }]}>{apt.status}</Text>
        </View>
      </LinearGradient>

      <ScrollView contentContainerStyle={{ padding: 14, gap: 12, paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
        {/* Patient */}
        <Card elevated>
          <View style={styles.patientRow}>
            <Avatar name={`${apt.patient?.firstName} ${apt.patient?.lastName}`} size={56} style={{ borderRadius: 16 }} />
            <View style={{ flex: 1 }}>
              <Text style={styles.patientName}>{apt.patient?.firstName} {apt.patient?.lastName}</Text>
              <Text style={styles.patientMeta}>{apt.patient?.gender?.toLowerCase()} · {apt.patient?.relation?.toLowerCase()}</Text>
              {apt.patient?.bloodGroup && (
                <View style={styles.bloodBadge}><Text style={styles.bloodText}>{apt.patient.bloodGroup}</Text></View>
              )}
            </View>
          </View>
          <View style={styles.scheduleRow}>
            <View style={styles.scheduleItem}>
              <Ionicons name="calendar-outline" size={14} color={Colors.teal[600]} />
              <Text style={styles.scheduleText}>{formatDate(apt.scheduledDate)}</Text>
            </View>
            <View style={styles.scheduleItem}>
              <Ionicons name="time-outline" size={14} color={Colors.teal[600]} />
              <Text style={styles.scheduleText}>{formatTime(apt.scheduledTime)}</Text>
            </View>
            {apt.clinic && (
              <View style={styles.scheduleItem}>
                <Ionicons name="location-outline" size={14} color={Colors.teal[600]} />
                <Text style={styles.scheduleText} numberOfLines={1}>{apt.clinic.name}</Text>
              </View>
            )}
          </View>
          {apt.notes && (
            <View style={styles.noteBox}>
              <Ionicons name="chatbubble-outline" size={14} color={Colors.amber[600]} />
              <Text style={styles.noteText}>{apt.notes}</Text>
            </View>
          )}
        </Card>

        {/* Vitals */}
        <Card elevated>
          <View style={styles.cardTopRow}>
            <Text style={styles.cardTitle}>🩺 Vitals</Text>
            <TouchableOpacity onPress={() => setShowVitals(true)} style={styles.editVitalsBtn}>
              <Ionicons name={vitals ? 'pencil-outline' : 'add-outline'} size={15} color={Colors.teal[700]} />
              <Text style={styles.editVitalsBtnText}>{vitals ? 'Update' : 'Record'}</Text>
            </TouchableOpacity>
          </View>
          {vitals ? (
            <View style={styles.vitalsGrid2}>
              {[
                { l: '🌡️ Temp', v: vitals.temperature ? `${vitals.temperature}°C` : '—' },
                { l: '❤️ BP', v: vitals.bloodPressure || '—' },
                { l: '💓 HR', v: vitals.heartRate ? `${vitals.heartRate}bpm` : '—' },
                { l: '⚖️ Weight', v: vitals.weight ? `${vitals.weight}kg` : '—' },
                { l: '📏 Height', v: vitals.height ? `${vitals.height}cm` : '—' },
                { l: '💨 SpO2', v: vitals.oxygenSaturation ? `${vitals.oxygenSaturation}%` : '—' },
              ].map(v => (
                <View key={v.l} style={styles.vitalChipBox}>
                  <Text style={styles.vitalChipLabel}>{v.l}</Text>
                  <Text style={styles.vitalChipValue}>{v.v}</Text>
                </View>
              ))}
            </View>
          ) : (
            <Text style={styles.noVitals}>Vitals not recorded yet. Tap "Record" to add.</Text>
          )}
        </Card>

        {/* Payment */}
        {apt.payment && (
          <Card elevated>
            <Text style={styles.cardTitle}>💳 Payment</Text>
            <View style={styles.payRow}>
              <Text style={styles.payAmount}>{formatCurrency(Number(apt.payment.amount))}</Text>
              <Badge label={apt.payment.status} bg={getPaymentStatusColor(apt.payment.status).bg} color={getPaymentStatusColor(apt.payment.status).text} />
            </View>
            <Text style={styles.payMode}>{apt.payment.paymentMode?.replace('_', ' ')}</Text>
          </Card>
        )}

        {/* Prescription */}
        <Card elevated>
          <View style={styles.cardTopRow}>
            <Text style={styles.cardTitle}>💊 Prescription</Text>
            <TouchableOpacity
              onPress={() => router.push(`/(doctor)/write-prescription?appointmentId=${apt.id}&patientId=${apt.patientId}${apt.prescription ? '&edit=' + apt.prescription.id : ''}`)}
              style={styles.editVitalsBtn}
            >
              <Ionicons name={apt.prescription ? 'pencil-outline' : 'add-outline'} size={15} color={Colors.teal[700]} />
              <Text style={styles.editVitalsBtnText}>{apt.prescription ? 'Edit Rx' : 'Write Rx'}</Text>
            </TouchableOpacity>
          </View>
          {apt.prescription ? (
            <View style={{ gap: 8 }}>
              <Text style={styles.diagText}>{apt.prescription.diagnosis || 'General Consultation'}</Text>
              {apt.prescription.medicines?.map((m: any, i: number) => (
                <View key={i} style={styles.medRow}>
                  <Text style={styles.medName}>💊 {m.name}</Text>
                  <Text style={styles.medInfo}>{m.dosage} · {m.duration ? `${m.duration}d` : ''}</Text>
                </View>
              ))}
            </View>
          ) : <Text style={styles.noVitals}>No prescription written yet.</Text>}
        </Card>

        {/* Status Actions */}
        {apt.status === 'PENDING' && (
          <TouchableOpacity onPress={() => statusMutation.mutate('CONFIRMED')} style={styles.confirmBtn} activeOpacity={0.85}>
            <LinearGradient colors={['#02c9b3', '#1e6fe8']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.confirmBtnGrad}>
              <Ionicons name="checkmark-circle-outline" size={20} color={Colors.white} />
              <Text style={styles.confirmBtnText}>Confirm Appointment</Text>
            </LinearGradient>
          </TouchableOpacity>
        )}
        {apt.status === 'CONFIRMED' && (
          <TouchableOpacity onPress={() => statusMutation.mutate('COMPLETED')} activeOpacity={0.85}>
            <LinearGradient colors={['#22c55e', '#16a34a']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.confirmBtnGrad}>
              <Ionicons name="checkmark-done-circle-outline" size={20} color={Colors.white} />
              <Text style={styles.confirmBtnText}>Mark as Completed</Text>
            </LinearGradient>
          </TouchableOpacity>
        )}
      </ScrollView>

      {showVitals && apt.patient && (
        <VitalsModal patient={apt.patient} onClose={() => setShowVitals(false)} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.slate[50] },
  header: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 16, paddingBottom: 16, paddingTop: 12 },
  backBtn: { width: 40, height: 40, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.12)', alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: FontSize.lg, fontWeight: '800', color: Colors.white },
  headerSub: { fontSize: FontSize.xs, color: 'rgba(255,255,255,0.5)', marginTop: 1 },
  statusPill: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: Radius.full },
  statusTxt: { fontSize: FontSize.xs, fontWeight: '800' },

  patientRow: { flexDirection: 'row', gap: 12, alignItems: 'center', marginBottom: 12 },
  patientName: { fontSize: FontSize.lg, fontWeight: '800', color: Colors.slate[900] },
  patientMeta: { fontSize: FontSize.xs, color: Colors.slate[400], textTransform: 'capitalize', marginTop: 2 },
  bloodBadge: { backgroundColor: Colors.red[50], paddingHorizontal: 7, paddingVertical: 2, borderRadius: Radius.full, alignSelf: 'flex-start', marginTop: 4 },
  bloodText: { fontSize: 11, color: Colors.red[600], fontWeight: '800' },
  scheduleRow: { flexDirection: 'row', gap: 12, flexWrap: 'wrap' },
  scheduleItem: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  scheduleText: { fontSize: FontSize.xs, color: Colors.slate[600], fontWeight: '600' },
  noteBox: { flexDirection: 'row', gap: 6, marginTop: 10, backgroundColor: Colors.amber[50], borderRadius: Radius.lg, padding: 10 },
  noteText: { flex: 1, fontSize: FontSize.xs, color: Colors.amber[800] },

  cardTopRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 },
  cardTitle: { fontSize: FontSize.base, fontWeight: '800', color: Colors.slate[900] },
  editVitalsBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: Colors.teal[50], paddingHorizontal: 10, paddingVertical: 5, borderRadius: Radius.full },
  editVitalsBtnText: { fontSize: FontSize.xs, fontWeight: '700', color: Colors.teal[700] },

  vitalsGrid2: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  vitalChipBox: { backgroundColor: Colors.slate[50], borderRadius: Radius.lg, paddingHorizontal: 10, paddingVertical: 8, minWidth: '30%' },
  vitalChipLabel: { fontSize: 10, color: Colors.slate[400], fontWeight: '600', marginBottom: 2 },
  vitalChipValue: { fontSize: FontSize.sm, fontWeight: '800', color: Colors.slate[900] },
  noVitals: { fontSize: FontSize.xs, color: Colors.slate[400], fontStyle: 'italic' },

  payRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  payAmount: { fontSize: FontSize['3xl'], fontWeight: '900', color: Colors.slate[900] },
  payMode: { fontSize: FontSize.xs, color: Colors.slate[400], marginTop: 4, textTransform: 'capitalize' },

  diagText: { fontSize: FontSize.sm, fontWeight: '700', color: Colors.slate[700] },
  medRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: Colors.slate[50], borderRadius: Radius.lg, paddingHorizontal: 10, paddingVertical: 7 },
  medName: { fontSize: FontSize.xs, fontWeight: '700', color: Colors.slate[900] },
  medInfo: { fontSize: FontSize.xs, color: Colors.slate[400] },

  confirmBtn: {},
  confirmBtnGrad: { borderRadius: Radius['2xl'], paddingVertical: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10 },
  confirmBtnText: { fontSize: FontSize.base, fontWeight: '800', color: Colors.white },

  modal: { flex: 1, backgroundColor: Colors.white, paddingTop: 20 },
  modalHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: Colors.slate[100] },
  modalTitle: { fontSize: FontSize['2xl'], fontWeight: '900', color: Colors.slate[900] },
  modalSub: { fontSize: FontSize.sm, color: Colors.slate[500], marginTop: 2 },
  closeBtn: { width: 36, height: 36, borderRadius: 10, backgroundColor: Colors.slate[100], alignItems: 'center', justifyContent: 'center' },
  prevVitals: { backgroundColor: Colors.amber[50], borderRadius: Radius.xl, padding: 12 },
  prevLabel: { fontSize: FontSize.xs, fontWeight: '700', color: Colors.amber[700], marginBottom: 4 },
  prevText: { fontSize: FontSize.xs, color: Colors.amber[800] },
  vitalsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  vitalField: { width: '47%' },
  vitalFieldLabel: { fontSize: FontSize.xs, fontWeight: '600', color: Colors.slate[600], marginBottom: 5 },
  vitalInput: { backgroundColor: Colors.slate[50], borderWidth: 1.5, borderColor: Colors.slate[200], borderRadius: Radius.xl, paddingHorizontal: 12, paddingVertical: 10, fontSize: FontSize.base, color: Colors.slate[900] },
  saveBtn: { borderRadius: Radius['2xl'], paddingVertical: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, marginTop: 8 },
  saveBtnText: { fontSize: FontSize.lg, fontWeight: '800', color: Colors.white },
});
