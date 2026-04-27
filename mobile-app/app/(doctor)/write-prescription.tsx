// app/(doctor)/write-prescription.tsx
import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, FlatList } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Toast from 'react-native-toast-message';
import { appointmentsApi, prescriptionsApi } from '../../src/api/endpoints';
import { Colors, FontSize, Radius, Shadow } from '../../src/constants/theme';
import { formatDate } from '../../src/constants/utils';
import LoadingSpinner from '../../src/components/ui/LoadingSpinner';

const FALLBACK_DRUGS = [
  'Paracetamol 500mg','Ibuprofen 400mg','Amoxicillin 500mg','Azithromycin 500mg',
  'Ciprofloxacin 500mg','Metformin 500mg','Atorvastatin 10mg','Amlodipine 5mg',
  'Omeprazole 20mg','Pantoprazole 40mg','Cetirizine 10mg','Montelukast 10mg',
  'Doxycycline 100mg','Metronidazole 400mg','Prednisolone 5mg','Tramadol 50mg',
  'Diclofenac 50mg','Vitamin B12','Vitamin D3','Calcium 500mg','Folic Acid 5mg',
  'ORS Sachets','Ranitidine 150mg','Domperidone 10mg','Ondansetron 4mg',
];

const DURATIONS = ['3 days','5 days','7 days','10 days','14 days','1 month','2 months','Ongoing'];
const DOSAGES = ['500mg','250mg','100mg','50mg','10mg','5mg','400mg','200mg','1g','25mg','75mg'];

interface Medicine {
  id: string; name: string; dosage: string;
  morning: boolean; afternoon: boolean; evening: boolean;
  duration: string; instructions: string;
  suggestions: string[]; showSugg: boolean;
}

function MedCard({ med, index, onChange, onDelete }: any) {
  const [searching, setSearching] = useState(false);

  const search = async (text: string) => {
    onChange(med.id, 'name', text);
    if (text.length < 2) { onChange(med.id, 'suggestions', []); onChange(med.id, 'showSugg', false); return; }
    const local = FALLBACK_DRUGS.filter(d => d.toLowerCase().includes(text.toLowerCase())).slice(0, 6);
    onChange(med.id, 'suggestions', local);
    onChange(med.id, 'showSugg', local.length > 0);
    setSearching(true);
    try {
      const res = await fetch(`https://rxnav.nlm.nih.gov/REST/drugs.json?name=${encodeURIComponent(text)}&expand=prescribable`, { signal: AbortSignal.timeout(2500) });
      const data = await res.json();
      const names: string[] = [];
      for (const group of data?.drugGroup?.conceptGroup || []) {
        for (const c of group.conceptProperties || []) { if (c.name && !names.includes(c.name)) names.push(c.name); if (names.length >= 8) break; }
        if (names.length >= 8) break;
      }
      if (names.length > 0) { onChange(med.id, 'suggestions', names); onChange(med.id, 'showSugg', true); }
    } catch { /* keep local suggestions */ }
    setSearching(false);
  };

  const selectDrug = (name: string) => {
    onChange(med.id, 'name', name);
    onChange(med.id, 'suggestions', []);
    onChange(med.id, 'showSugg', false);
    const match = name.match(/(\d+\s?(?:mg|mcg|g|ml|IU))/i);
    if (match) onChange(med.id, 'dosage', match[1]);
  };

  return (
    <View style={styles.medCard}>
      <View style={styles.medCardHeader}>
        <Text style={styles.medCardNum}>Medicine #{index + 1}</Text>
        <TouchableOpacity onPress={() => onDelete(med.id)} style={styles.deleteBtn}>
          <Ionicons name="trash-outline" size={16} color={Colors.red[500]} />
        </TouchableOpacity>
      </View>

      {/* Drug name search */}
      <View style={{ position: 'relative', zIndex: 10 - index }}>
        <Text style={styles.fieldLabel}>Drug Name *</Text>
        <View style={styles.drugSearch}>
          <Ionicons name="medical-outline" size={16} color={Colors.teal[500]} />
          <TextInput
            value={med.name}
            onChangeText={search}
            placeholder="Search drug name..."
            placeholderTextColor={Colors.slate[300]}
            style={styles.drugInput}
          />
          {searching && <View style={styles.loadingDot} />}
        </View>
        {med.showSugg && med.suggestions.length > 0 && (
          <View style={styles.suggestions}>
            {med.suggestions.map((s: string) => (
              <TouchableOpacity key={s} onPress={() => selectDrug(s)} style={styles.suggItem}>
                <Text style={styles.suggIcon}>💊</Text>
                <Text style={styles.suggText} numberOfLines={1}>{s}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>

      {/* Dosage */}
      <View>
        <Text style={styles.fieldLabel}>Dosage</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 6 }}>
          {DOSAGES.map(d => (
            <TouchableOpacity key={d} onPress={() => onChange(med.id, 'dosage', d)} style={[styles.pill, med.dosage === d && styles.pillActive]}>
              <Text style={[styles.pillText, med.dosage === d && styles.pillTextActive]}>{d}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Timing */}
      <View>
        <Text style={styles.fieldLabel}>Timing</Text>
        <View style={styles.timingRow}>
          {[['morning', '🌅 Morning'], ['afternoon', '☀️ Noon'], ['evening', '🌙 Evening']].map(([k, l]) => (
            <TouchableOpacity key={k} onPress={() => onChange(med.id, k, !(med as any)[k])}
              style={[styles.timingBtn, (med as any)[k] && styles.timingBtnActive]}>
              <Text style={[styles.timingText, (med as any)[k] && styles.timingTextActive]}>{l}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Duration */}
      <View>
        <Text style={styles.fieldLabel}>Duration</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 6 }}>
          {DURATIONS.map(d => (
            <TouchableOpacity key={d} onPress={() => onChange(med.id, 'duration', d)} style={[styles.pill, med.duration === d && styles.pillActive]}>
              <Text style={[styles.pillText, med.duration === d && styles.pillTextActive]}>{d}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Instructions */}
      <View>
        <Text style={styles.fieldLabel}>Instructions</Text>
        <TextInput
          value={med.instructions}
          onChangeText={v => onChange(med.id, 'instructions', v)}
          placeholder="After meals, with water..."
          placeholderTextColor={Colors.slate[300]}
          style={styles.instrInput}
        />
      </View>
    </View>
  );
}

export default function WritePrescriptionScreen() {
  const { appointmentId, patientId, edit } = useLocalSearchParams<{ appointmentId: string; patientId: string; edit?: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [diagnosis, setDiagnosis] = useState('');
  const [notes, setNotes] = useState('');
  const [followUpDate, setFollowUpDate] = useState('');
  const [medicines, setMedicines] = useState<Medicine[]>([]);

  const { data: apt } = useQuery({
    queryKey: ['appointment', appointmentId],
    queryFn: () => appointmentsApi.getById(appointmentId).then(r => r.data.data),
    enabled: !!appointmentId,
  });

  const { data: existingRx } = useQuery({
    queryKey: ['prescription', edit],
    queryFn: () => prescriptionsApi.getById(edit!).then(r => r.data.data),
    enabled: !!edit,
    onSuccess: (data: any) => {
      if (data) {
        setDiagnosis(data.diagnosis || '');
        setNotes(data.notes || '');
        setFollowUpDate(data.followUpDate ? data.followUpDate.split('T')[0] : '');
        setMedicines((data.medicines || []).map((m: any) => ({
          id: String(Date.now() + Math.random()), name: m.name, dosage: m.dosage || '',
          morning: m.morning, afternoon: m.afternoon, evening: m.evening,
          duration: m.duration ? `${m.duration} days` : '', instructions: m.instructions || '',
          suggestions: [], showSugg: false,
        })));
      }
    },
  } as any);

  const saveMutation = useMutation({
    mutationFn: (data: any) => edit ? prescriptionsApi.update(edit, data) : prescriptionsApi.create(data),
    onSuccess: () => {
      Toast.show({ type: 'success', text1: edit ? '✅ Prescription updated!' : '✅ Prescription saved!' });
      router.back();
    },
    onError: (e: any) => Toast.show({ type: 'error', text1: e.response?.data?.message || 'Failed to save' }),
  });

  const addMedicine = () => setMedicines(p => [...p, {
    id: String(Date.now()), name: '', dosage: '', morning: false, afternoon: false,
    evening: false, duration: '', instructions: '', suggestions: [], showSugg: false,
  }]);

  const updateMed = (id: string, field: string, value: any) => setMedicines(p => p.map(m => m.id === id ? { ...m, [field]: value } : m));
  const deleteMed = (id: string) => setMedicines(p => p.filter(m => m.id !== id));

  const handleSave = () => {
    if (!diagnosis.trim()) { Toast.show({ type: 'error', text1: 'Diagnosis is required' }); return; }
    if (medicines.length === 0) { Toast.show({ type: 'error', text1: 'Add at least one medicine' }); return; }
    if (medicines.some(m => !m.name.trim())) { Toast.show({ type: 'error', text1: 'All medicine names are required' }); return; }

    const parseDuration = (d: string) => { const m = d?.match(/(\d+)/); return m ? parseInt(m[1]) : 0; };
    saveMutation.mutate({
      appointmentId, diagnosis, notes,
      followUpDate: followUpDate || null,
      medicines: medicines.map(m => ({
        name: m.name, dosage: m.dosage,
        morning: m.morning, afternoon: m.afternoon, evening: m.evening,
        duration: parseDuration(m.duration), instructions: m.instructions,
      })),
    });
  };

  const vitals = apt?.patient?.vitals?.[0];

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <LinearGradient colors={['#0f172a', '#0d4f4f']} style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color={Colors.white} />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerTitle}>{edit ? 'Edit Prescription' : 'Write Prescription'}</Text>
          <Text style={styles.headerSub}>RxNorm API · Drug search</Text>
        </View>
      </LinearGradient>

      <ScrollView contentContainerStyle={{ padding: 14, gap: 14, paddingBottom: 120 }} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        {/* Patient summary */}
        {apt && (
          <View style={styles.patientCard}>
            <View style={styles.patientInfo}>
              <Text style={styles.patientName}>{apt.patient?.firstName} {apt.patient?.lastName}</Text>
              <Text style={styles.patientMeta}>{apt.clinic?.name} · {formatDate(apt.scheduledDate)}</Text>
            </View>
            {vitals && (
              <View style={styles.vitalsQuick}>
                {vitals.temperature && <Text style={styles.vitalBadge}>🌡️ {vitals.temperature}°C</Text>}
                {vitals.bloodPressure && <Text style={styles.vitalBadge}>❤️ {vitals.bloodPressure}</Text>}
                {vitals.weight && <Text style={styles.vitalBadge}>⚖️ {vitals.weight}kg</Text>}
              </View>
            )}
            {apt.notes && <Text style={styles.aptNote}>📌 {apt.notes}</Text>}
          </View>
        )}

        {/* Diagnosis */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📋 Diagnosis *</Text>
          <TextInput
            value={diagnosis}
            onChangeText={setDiagnosis}
            placeholder="e.g., Upper Respiratory Tract Infection, Hypertension..."
            placeholderTextColor={Colors.slate[300]}
            style={styles.diagInput}
          />
        </View>

        {/* Medicines */}
        <View style={styles.section}>
          <View style={styles.sectionRow}>
            <Text style={styles.sectionTitle}>💊 Medicines ({medicines.length})</Text>
            <TouchableOpacity onPress={addMedicine} style={styles.addMedBtn}>
              <Ionicons name="add" size={18} color={Colors.teal[600]} />
              <Text style={styles.addMedText}>Add</Text>
            </TouchableOpacity>
          </View>
          {medicines.length === 0 ? (
            <TouchableOpacity onPress={addMedicine} style={styles.emptyMed}>
              <Text style={{ fontSize: 40, marginBottom: 10 }}>💊</Text>
              <Text style={styles.emptyMedText}>Tap to add first medicine</Text>
            </TouchableOpacity>
          ) : (
            <View style={{ gap: 12 }}>
              {medicines.map((m, i) => <MedCard key={m.id} med={m} index={i} onChange={updateMed} onDelete={deleteMed} />)}
            </View>
          )}
        </View>

        {/* Notes */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📝 Doctor's Notes</Text>
          <TextInput
            value={notes}
            onChangeText={setNotes}
            placeholder="Lifestyle advice, precautions, diet instructions..."
            placeholderTextColor={Colors.slate[300]}
            multiline
            numberOfLines={3}
            style={[styles.diagInput, { minHeight: 80, textAlignVertical: 'top' }]}
          />
        </View>

        {/* Follow-up */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📅 Follow-up Date</Text>
          <TextInput
            value={followUpDate}
            onChangeText={setFollowUpDate}
            placeholder="YYYY-MM-DD (optional)"
            placeholderTextColor={Colors.slate[300]}
            style={styles.diagInput}
          />
        </View>
      </ScrollView>

      {/* Save button */}
      <View style={[styles.footer, { paddingBottom: insets.bottom + 8 }]}>
        <TouchableOpacity onPress={handleSave} disabled={saveMutation.isPending} activeOpacity={0.85}>
          <LinearGradient colors={['#02c9b3', '#1e6fe8']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.saveBtn}>
            <Ionicons name="save-outline" size={20} color={Colors.white} />
            <Text style={styles.saveBtnText}>{saveMutation.isPending ? 'Saving...' : edit ? 'Update Prescription' : 'Save & Notify Patient'}</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.slate[50] },
  header: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 16, paddingBottom: 16, paddingTop: 12 },
  backBtn: { width: 40, height: 40, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.12)', alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: FontSize.lg, fontWeight: '800', color: Colors.white },
  headerSub: { fontSize: FontSize.xs, color: 'rgba(255,255,255,0.5)', marginTop: 1 },

  patientCard: { backgroundColor: Colors.teal[400], borderRadius: Radius['2xl'], padding: 14, gap: 6, borderWidth: 1, borderColor: Colors.teal[400] },
  patientInfo: {},
  patientName: { fontSize: FontSize.lg, fontWeight: '800', color: Colors.teal[400] },
  patientMeta: { fontSize: FontSize.xs, color: Colors.teal[600], marginTop: 2 },
  vitalsQuick: { flexDirection: 'row', gap: 6, flexWrap: 'wrap' },
  vitalBadge: { fontSize: 12, backgroundColor: Colors.teal[400], paddingHorizontal: 8, paddingVertical: 3, borderRadius: Radius.full, color: Colors.teal[400], fontWeight: '600' },
  aptNote: { fontSize: FontSize.xs, color: Colors.teal[600], fontStyle: 'italic' },

  section: { gap: 10 },
  sectionTitle: { fontSize: FontSize.base, fontWeight: '800', color: Colors.slate[900] },
  sectionRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  diagInput: { backgroundColor: Colors.white, borderWidth: 1.5, borderColor: Colors.slate[200], borderRadius: Radius.xl, paddingHorizontal: 14, paddingVertical: 12, fontSize: FontSize.sm, color: Colors.slate[900] },

  addMedBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: Colors.teal[400], paddingHorizontal: 12, paddingVertical: 6, borderRadius: Radius.full },
  addMedText: { fontSize: FontSize.xs, fontWeight: '700', color: Colors.teal[600] },
  emptyMed: { alignItems: 'center', padding: 32, backgroundColor: Colors.white, borderRadius: Radius['2xl'], borderWidth: 2, borderStyle: 'dashed', borderColor: Colors.slate[200] },
  emptyMedText: { fontSize: FontSize.sm, color: Colors.slate[400], fontWeight: '600' },

  medCard: { backgroundColor: Colors.white, borderRadius: Radius['2xl'], padding: 14, gap: 12, ...Shadow.sm, borderWidth: 1, borderColor: Colors.slate[100] },
  medCardHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  medCardNum: { fontSize: FontSize.xs, fontWeight: '800', color: Colors.slate[400], textTransform: 'uppercase', letterSpacing: 0.5 },
  deleteBtn: { width: 32, height: 32, borderRadius: 10, backgroundColor: Colors.red[50], alignItems: 'center', justifyContent: 'center' },

  fieldLabel: { fontSize: FontSize.xs, fontWeight: '700', color: Colors.slate[500], marginBottom: 6 },
  drugSearch: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: Colors.slate[50], borderWidth: 1.5, borderColor: Colors.slate[200], borderRadius: Radius.xl, paddingHorizontal: 12, paddingVertical: 10 },
  drugInput: { flex: 1, fontSize: FontSize.sm, color: Colors.slate[900] },
  loadingDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.teal[500] },
  suggestions: { position: 'absolute', top: '100%', left: 0, right: 0, backgroundColor: Colors.white, borderRadius: Radius.xl, ...Shadow.md, zIndex: 100, overflow: 'hidden', marginTop: 4 },
  suggItem: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 14, paddingVertical: 11, borderBottomWidth: 1, borderBottomColor: Colors.slate[50] },
  suggIcon: { fontSize: 16 },
  suggText: { flex: 1, fontSize: FontSize.sm, color: Colors.slate[800], fontWeight: '500' },

  pill: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: Radius.full, backgroundColor: Colors.slate[100] },
  pillActive: { backgroundColor: Colors.teal[600] },
  pillText: { fontSize: FontSize.xs, fontWeight: '700', color: Colors.slate[600] },
  pillTextActive: { color: Colors.white },

  timingRow: { flexDirection: 'row', gap: 8 },
  timingBtn: { flex: 1, paddingVertical: 9, borderRadius: Radius.xl, backgroundColor: Colors.slate[100], alignItems: 'center' },
  timingBtnActive: { backgroundColor: Colors.brand[600] },
  timingText: { fontSize: FontSize.xs, fontWeight: '700', color: Colors.slate[600] },
  timingTextActive: { color: Colors.white },
  instrInput: { backgroundColor: Colors.slate[50], borderWidth: 1.5, borderColor: Colors.slate[200], borderRadius: Radius.xl, paddingHorizontal: 12, paddingVertical: 10, fontSize: FontSize.sm, color: Colors.slate[900] },

  footer: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 14, backgroundColor: Colors.white, borderTopWidth: 1, borderTopColor: Colors.slate[100] },
  saveBtn: { borderRadius: Radius['2xl'], paddingVertical: 15, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, ...Shadow.brand },
  saveBtnText: { fontSize: FontSize.lg, fontWeight: '900', color: Colors.white },
});
