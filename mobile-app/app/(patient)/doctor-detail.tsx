// app/(patient)/doctor-detail.tsx
import { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Modal, FlatList } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { format, addDays } from 'date-fns';
import Toast from 'react-native-toast-message';
import { doctorsApi, slotsApi, appointmentsApi, patientsApi, favoritesApi } from '../../src/api/endpoints';
import { Colors, FontSize, Radius, Shadow } from '../../src/constants/theme';
import { formatCurrency, formatDate } from '../../src/constants/utils';
import { useAuthStore } from '../../src/store/auth.store';
import Avatar from '../../src/components/ui/Avatar';
import Card from '../../src/components/ui/Card';
import Badge from '../../src/components/ui/Badge';
import LoadingSpinner from '../../src/components/ui/LoadingSpinner';

const NEXT_7_DAYS = Array.from({ length: 7 }, (_, i) => {
  const d = addDays(new Date(), i);
  return { date: format(d, 'yyyy-MM-dd'), label: i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : format(d, 'EEE'), day: format(d, 'dd'), month: format(d, 'MMM') };
});

export default function DoctorDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const qc = useQueryClient();
  const { user, isAuthenticated } = useAuthStore();

  const [selectedDate, setSelectedDate] = useState(NEXT_7_DAYS[0].date);
  const [selectedTime, setSelectedTime] = useState('');
  const [showBookModal, setShowBookModal] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  const [notes, setNotes] = useState('');
  const [activeTab, setActiveTab] = useState<'about' | 'slots'>('about');

  const { data: doctor, isLoading } = useQuery({
    queryKey: ['doctor', id],
    queryFn: () => doctorsApi.getById(id).then(r => r.data.data),
    enabled: !!id,
  });

  const { data: slots, isLoading: slotsLoading } = useQuery({
    queryKey: ['slots', id, selectedDate],
    queryFn: () => slotsApi.getAvailable(id, selectedDate).then(r => r.data.data),
    enabled: !!id && !!selectedDate,
  });

  const { data: favData, refetch: refetchFav } = useQuery({
    queryKey: ['fav-check', id],
    queryFn: () => favoritesApi.check(id).then(r => r.data.data),
    enabled: !!id && isAuthenticated,
  });

  const { data: myPatients } = useQuery({
    queryKey: ['my-patients'],
    queryFn: () => patientsApi.list().then(r => r.data.data),
    enabled: showBookModal,
  });

  const favMutation = useMutation({
    mutationFn: () => favoritesApi.toggle(id),
    onSuccess: (res) => {
      refetchFav();
      Toast.show({ type: 'success', text1: res.data.data.isFavorite ? '❤️ Added to favorites' : 'Removed from favorites' });
    },
  });

  const bookMutation = useMutation({
    mutationFn: (data: any) => appointmentsApi.create(data),
    onSuccess: () => {
      Toast.show({ type: 'success', text1: '🎉 Appointment Booked!', text2: 'You will receive a confirmation shortly.' });
      qc.invalidateQueries({ queryKey: ['appointments'] });
      setShowBookModal(false);
      router.push('/(patient)/appointments');
    },
    onError: (e: any) => Toast.show({ type: 'error', text1: e.response?.data?.message || 'Booking failed' }),
  });

  const handleBook = () => {
    if (!isAuthenticated) { router.push('/(auth)/login'); return; }
    if (!selectedTime) { Toast.show({ type: 'error', text1: 'Please select a time slot' }); return; }
    setShowBookModal(true);
  };

  const confirmBook = () => {
    if (!selectedPatient) { Toast.show({ type: 'error', text1: 'Please select a patient' }); return; }
    bookMutation.mutate({
      doctorId: id,
      patientId: selectedPatient.id,
      clinicId: doctor?.clinics?.[0]?.clinicId || doctor?.clinics?.[0]?.clinic?.id,
      scheduledDate: selectedDate,
      scheduledTime: selectedTime,
      paymentMode: 'PAY_AT_CLINIC',
      notes: notes || undefined,
    });
  };

  if (isLoading) return <LoadingSpinner fullScreen label="Loading doctor profile..." />;
  if (!doctor) return null;

  const isFavorite = favData?.isFavorite;
  const availableSlots = slots?.filter((s: any) => s.isAvailable) || [];

  const getSlotPeriod = (time: string) => {
    const hour = parseInt(time.split(':')[0], 10);

    if (hour < 12) return 'Morning';
    if (hour < 17) return 'Afternoon';
    return 'Evening';
  };
  const groupedSlots = {
    Morning: [] as any[],
    Afternoon: [] as any[],
    Evening: [] as any[],
  };

  availableSlots.forEach((slot: any) => {
    const period = getSlotPeriod(slot.time);
    groupedSlots[period].push(slot);
  });
  const educationData =
    typeof doctor.education === "string"
      ? JSON.parse(doctor.education)
      : doctor.education;
  const languagesData =
    typeof doctor.languages === "string"
      ? JSON.parse(doctor.languages)
      : doctor.languages;


  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <LinearGradient colors={['#0f172a', '#1e3a5f']} style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color={Colors.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Doctor Profile</Text>
        <TouchableOpacity onPress={() => favMutation.mutate()} style={styles.heartBtn}>
          <Ionicons name={isFavorite ? 'heart' : 'heart-outline'} size={22} color={isFavorite ? Colors.rose[400] : Colors.white} />
        </TouchableOpacity>
      </LinearGradient>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Doctor Hero Card */}
        <LinearGradient colors={['#1e3a5f', '#0f172a']} style={styles.doctorHero}>
          <View style={styles.doctorHeroRow}>
            <View style={styles.avatarWrapper}>
              <Avatar uri={doctor.user?.avatar} name={`${doctor.user?.firstName} ${doctor.user?.lastName}`} size={80} />
              {doctor.isVerified && (
                <View style={styles.verifiedBadge}>
                  <Ionicons name="checkmark-circle" size={18} color={Colors.teal[400]} />
                </View>
              )}
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.docName}>Dr. {doctor.user?.firstName} {doctor.user?.lastName}</Text>
              <Text style={styles.docSpec}>{doctor.speciality?.name}</Text>
              <View style={styles.docMeta}>
                <View style={styles.metaPill}>
                  <Ionicons name="star" size={12} color="#fbbf24" />
                  <Text style={styles.metaPillText}>{Number(doctor.rating).toFixed(1)} ({doctor.totalReviews})</Text>
                </View>
                <View style={styles.metaPill}>
                  <Ionicons name="briefcase-outline" size={12} color={Colors.teal[400]} />
                  <Text style={styles.metaPillText}>{doctor.experience} yrs</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Fee + Clinic */}
          <View style={styles.feeRow}>
            <View style={styles.feeBox}>
              <Text style={styles.feeLabel}>Consultation</Text>
              <Text style={styles.feeValue}>{formatCurrency(Number(doctor.consultationFee))}</Text>
            </View>
            {doctor.followUpFee > 0 && (
              <View style={styles.feeBox}>
                <Text style={styles.feeLabel}>Follow-up</Text>
                <Text style={styles.feeValue}>{formatCurrency(Number(doctor.followUpFee))}</Text>
              </View>
            )}
            {doctor.clinics?.[0]?.clinic && (
              <View style={styles.feeBox}>
                <Text style={styles.feeLabel}>Clinic</Text>
                <Text style={[styles.feeValue, { fontSize: FontSize.xs }]} numberOfLines={1}>{doctor.clinics[0].clinic.name}</Text>
              </View>
            )}
          </View>
        </LinearGradient>

        {/* Tabs */}
        <View style={styles.tabs}>
          <TouchableOpacity onPress={() => setActiveTab('about')} style={[styles.tab, activeTab === 'about' && styles.tabActive]}>
            <Text style={[styles.tabText, activeTab === 'about' && styles.tabTextActive]}>About</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setActiveTab('slots')} style={[styles.tab, activeTab === 'slots' && styles.tabActive]}>
            <Text style={[styles.tabText, activeTab === 'slots' && styles.tabTextActive]}>Book Slot</Text>
          </TouchableOpacity>
        </View>

        <View style={{ padding: 16, gap: 14 }}>
          {activeTab === 'about' ? (
            <>
              {doctor.about && (
                <Card elevated>
                  <Text style={styles.cardTitle}>About</Text>
                  <Text style={styles.aboutText}>{doctor.about}</Text>
                </Card>
              )}



              {educationData?.length > 0 && (
                <Card elevated>
                  <Text style={styles.cardTitle}>Education</Text>
                  <View style={{ gap: 8 }}>
                    {educationData.map((edu: any, i: number) => (
                      <View key={i} style={styles.eduRow}>
                        <View style={styles.eduIcon}>
                          <Text style={{ fontSize: 16 }}>🎓</Text>
                        </View>
                        <View>
                          <Text style={styles.eduDegree}>{edu.degree}</Text>
                          <Text style={styles.eduInst}>
                            {edu.institution} · {edu.year}
                          </Text>
                        </View>
                      </View>
                    ))}
                  </View>
                </Card>
              )}

              {languagesData?.length > 0 && (
                <Card elevated>
                  <Text style={styles.cardTitle}>Languages</Text>
                  <View style={styles.langRow}>
                    {languagesData.map((lang: string) => (
                      <Badge
                        key={lang}
                        label={`🗣️ ${lang}`}
                        bg={Colors.teal[50] || '#f0fdfa'}
                        color={Colors.teal[700]}
                      />
                    ))}
                  </View>
                </Card>
              )}

              <Card elevated>
                <Text style={styles.cardTitle}>Clinic</Text>
                {doctor.clinics?.map((dc: any) => (
                  <View key={dc.id} style={styles.clinicRow}>
                    <Ionicons name="business-outline" size={18} color={Colors.brand[600]} />
                    <View>
                      <Text style={styles.clinicName}>{dc.clinic?.name}</Text>
                      <Text style={styles.clinicAddr}>{dc.clinic?.address}, {dc.clinic?.city}</Text>
                    </View>
                  </View>
                ))}
              </Card>
            </>
          ) : (
            <>
              {/* Date picker */}
              <View>
                <Text style={styles.cardTitle}>Select Date</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, paddingVertical: 4 }}>
                  {NEXT_7_DAYS.map(d => (
                    <TouchableOpacity key={d.date} onPress={() => { setSelectedDate(d.date); setSelectedTime(''); }}
                      style={[styles.dateBtn, selectedDate === d.date && styles.dateBtnActive]}>
                      <Text style={[styles.dateBtnLabel, selectedDate === d.date && styles.dateBtnTextActive]}>{d.label}</Text>
                      <Text style={[styles.dateBtnDay, selectedDate === d.date && styles.dateBtnTextActive]}>{d.day}</Text>
                      <Text style={[styles.dateBtnMonth, selectedDate === d.date && { color: 'rgba(255,255,255,0.7)' }]}>{d.month}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>

              {/* Slots */}
              <View>
                <Text style={styles.cardTitle}>Available Slots</Text>
                {slotsLoading ? (
                  <LoadingSpinner />
                ) : availableSlots.length === 0 ? (
                  <View style={styles.noSlots}>
                    <Text style={{ fontSize: 36, marginBottom: 8 }}>😔</Text>
                    <Text style={styles.noSlotsText}>No slots available on this day</Text>
                    <Text style={styles.noSlotsSubText}>Try another date</Text>
                  </View>
                ) : (
                  <View style={styles.slotsGrid}>

                    {Object.entries(groupedSlots).map(([period, slots]) => {
                      if (slots.length === 0) return null;

                      return (
                        <View key={period} style={{ marginBottom: 16 }}>
                          <Text style={styles.cardTitle}>{period}</Text>

                          <View style={styles.slotsGrid}>
                            {slots.map((slot: any, index: number) => (
                              <TouchableOpacity
                                key={index}
                                onPress={() => setSelectedTime(slot.time)}
                                style={[
                                  styles.slotBtn,
                                  selectedTime === slot.time && styles.slotBtnActive
                                ]}
                              >
                                <Text
                                  style={[
                                    styles.slotTime,
                                    selectedTime === slot.time && styles.slotTimeActive
                                  ]}
                                >
                                  {slot.time}
                                </Text>
                              </TouchableOpacity>
                            ))}
                          </View>
                        </View>
                      );
                    })}

                  </View>
                )}
              </View>

              {selectedTime && (
                <Card style={styles.selectedSummary}>
                  <Text style={styles.summaryTitle}>📋 Booking Summary</Text>
                  <Text style={styles.summaryText}>Dr. {doctor.user?.firstName} {doctor.user?.lastName}</Text>
                  <Text style={styles.summaryText}>{formatDate(selectedDate)} at {selectedTime}</Text>
                  <Text style={styles.summaryFee}>Fee: {formatCurrency(Number(doctor.consultationFee))}</Text>
                </Card>
              )}
            </>
          )}
          <View style={{ height: 120 }} />
        </View>
      </ScrollView>

      {/* Book Button */}
      {activeTab === 'slots' && (
        <View style={[styles.bookBar, { paddingBottom: insets.bottom + 75 }]}>
          <TouchableOpacity onPress={handleBook} activeOpacity={0.85} disabled={!selectedTime}>
            <LinearGradient
              colors={selectedTime ? ['#1e6fe8', '#02c9b3'] : ['#cbd5e1', '#94a3b8']}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
              style={styles.bookBtn}
            >
              <Ionicons name="calendar" size={20} color={Colors.white} />
              <Text style={styles.bookBtnText}>{selectedTime ? `Book ${selectedTime}` : 'Select a Time Slot'}</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      )}

      {/* Booking Modal */}
      <Modal visible={showBookModal} animationType="slide" presentationStyle="pageSheet">
        <View style={[styles.modal, { paddingTop: insets.top + 16 }]}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Confirm Booking</Text>
            <TouchableOpacity onPress={() => setShowBookModal(false)} style={styles.closeBtn}>
              <Ionicons name="close" size={22} color={Colors.slate[600]} />
            </TouchableOpacity>
          </View>

          <ScrollView contentContainerStyle={{ padding: 16, gap: 14 }}>
            {/* Summary */}
            <LinearGradient colors={['#eff8ff', '#f0fdf4']} style={styles.bookSummary}>
              <Text style={styles.bookSummaryDoc}>Dr. {doctor.user?.firstName} {doctor.user?.lastName}</Text>
              <Text style={styles.bookSummarySpec}>{doctor.speciality?.name}</Text>
              <View style={styles.bookSummaryMeta}>
                <View style={styles.bookSummaryItem}>
                  <Ionicons name="calendar-outline" size={14} color={Colors.brand[600]} />
                  <Text style={styles.bookSummaryText}>{formatDate(selectedDate)}</Text>
                </View>
                <View style={styles.bookSummaryItem}>
                  <Ionicons name="time-outline" size={14} color={Colors.brand[600]} />
                  <Text style={styles.bookSummaryText}>{selectedTime}</Text>
                </View>
                <View style={styles.bookSummaryItem}>
                  <Ionicons name="cash-outline" size={14} color={Colors.green[600]} />
                  <Text style={styles.bookSummaryText}>{formatCurrency(Number(doctor.consultationFee))}</Text>
                </View>
              </View>
            </LinearGradient>

            {/* Patient selection */}
            <View>
              <Text style={styles.modalLabel}>Select Patient *</Text>
              <View style={{ gap: 8 }}>
                {(myPatients || []).map((p: any) => (
                  <TouchableOpacity key={p.id} onPress={() => setSelectedPatient(p)}
                    style={[styles.patientOption, selectedPatient?.id === p.id && styles.patientOptionActive]}>
                    <View style={[styles.patientOptionIcon, { backgroundColor: selectedPatient?.id === p.id ? Colors.brand[600] : Colors.slate[100] }]}>
                      <Text style={{ fontSize: 16 }}>👤</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.patientOptionName, selectedPatient?.id === p.id && { color: Colors.brand[700] }]}>
                        {p.firstName} {p.lastName}
                      </Text>
                      <Text style={styles.patientOptionMeta}>{p.relation} · {p.gender?.toLowerCase()}</Text>
                    </View>
                    {selectedPatient?.id === p.id && <Ionicons name="checkmark-circle" size={20} color={Colors.brand[600]} />}
                  </TouchableOpacity>
                ))}
                {(!myPatients || myPatients.length === 0) && (
                  <Text style={{ color: Colors.slate[400], fontSize: FontSize.sm, textAlign: 'center' }}>No patients found. Add family members first.</Text>
                )}
              </View>
            </View>

            {/* Notes */}
            <View>
              <Text style={styles.modalLabel}>Notes (optional)</Text>
              <NativeTextInput
                value={notes}
                onChangeText={setNotes}
                placeholder="Describe symptoms or reason for visit..."
                multiline
                numberOfLines={3}
                style={styles.notesInput}
              />
            </View>

            {/* Pay mode */}
            <View style={styles.payModeBox}>
              <Ionicons name="cash-outline" size={18} color={Colors.green[600]} />
              <Text style={styles.payModeText}>Pay at Clinic · {formatCurrency(Number(doctor.consultationFee))}</Text>
            </View>

            <TouchableOpacity onPress={confirmBook} disabled={bookMutation.isPending} activeOpacity={0.85}>
              <LinearGradient colors={['#1e6fe8', '#02c9b3']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.confirmBtn}>
                {bookMutation.isPending ? (
                  <Text style={styles.confirmBtnText}>Booking...</Text>
                ) : (
                  <>
                    <Ionicons name="checkmark-circle" size={20} color={Colors.white} />
                    <Text style={styles.confirmBtnText}>Confirm Appointment</Text>
                  </>
                )}
              </LinearGradient>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
}

function NativeTextInput({ value, onChangeText, placeholder, multiline, numberOfLines, style }: any) {
  const { TextInput } = require('react-native');
  return <TextInput value={value} onChangeText={onChangeText} placeholder={placeholder} placeholderTextColor={Colors.slate[400]} multiline={multiline} numberOfLines={numberOfLines} style={style} textAlignVertical="top" />;
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.slate[50] },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingBottom: 16, paddingTop: 12 },
  backBtn: { width: 40, height: 40, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.12)', alignItems: 'center', justifyContent: 'center', marginRight: 10 },
  headerTitle: { flex: 1, fontSize: FontSize.lg, fontWeight: '800', color: Colors.white },
  heartBtn: { width: 40, height: 40, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.12)', alignItems: 'center', justifyContent: 'center' },

  doctorHero: { padding: 20, gap: 16 },
  doctorHeroRow: { flexDirection: 'row', gap: 14, alignItems: 'center' },
  avatarWrapper: { position: 'relative' },
  verifiedBadge: { position: 'absolute', bottom: -4, right: -4, backgroundColor: Colors.slate[900], borderRadius: 10, padding: 1 },
  docName: { fontSize: FontSize['2xl'], fontWeight: '900', color: Colors.white, letterSpacing: -0.3 },
  docSpec: { fontSize: FontSize.sm, color: Colors.teal[400], fontWeight: '700', marginTop: 2 },
  docMeta: { flexDirection: 'row', gap: 8, marginTop: 6 },
  metaPill: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: 'rgba(255,255,255,0.1)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: Radius.full },
  metaPillText: { fontSize: FontSize.xs, color: Colors.white, fontWeight: '600' },
  feeRow: { flexDirection: 'row', gap: 10 },
  feeBox: { flex: 1, backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: Radius.xl, padding: 12, alignItems: 'center' },
  feeLabel: { fontSize: 10, color: 'rgba(255,255,255,0.5)', fontWeight: '600', marginBottom: 4 },
  feeValue: { fontSize: FontSize.lg, fontWeight: '900', color: Colors.white },

  tabs: { flexDirection: 'row', backgroundColor: Colors.white, borderBottomWidth: 1, borderBottomColor: Colors.slate[100] },
  tab: { flex: 1, paddingVertical: 14, alignItems: 'center' },
  tabActive: { borderBottomWidth: 2.5, borderBottomColor: Colors.brand[600] },
  tabText: { fontSize: FontSize.sm, fontWeight: '700', color: Colors.slate[400] },
  tabTextActive: { color: Colors.brand[600] },

  cardTitle: { fontSize: FontSize.base, fontWeight: '800', color: Colors.slate[900], marginBottom: 10 },
  aboutText: { fontSize: FontSize.sm, color: Colors.slate[600], lineHeight: 22 },
  eduRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  eduIcon: { width: 36, height: 36, borderRadius: 10, backgroundColor: Colors.brand[50], alignItems: 'center', justifyContent: 'center' },
  eduDegree: { fontSize: FontSize.sm, fontWeight: '700', color: Colors.slate[900] },
  eduInst: { fontSize: FontSize.xs, color: Colors.slate[500], marginTop: 1 },
  langRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  clinicRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  clinicName: { fontSize: FontSize.sm, fontWeight: '700', color: Colors.slate[900] },
  clinicAddr: { fontSize: FontSize.xs, color: Colors.slate[500], marginTop: 1 },

  dateBtn: { alignItems: 'center', paddingVertical: 10, paddingHorizontal: 14, backgroundColor: Colors.slate[100], borderRadius: Radius.xl, minWidth: 64 },
  dateBtnActive: { backgroundColor: Colors.brand[600] },
  dateBtnLabel: { fontSize: 10, fontWeight: '700', color: Colors.slate[400] },
  dateBtnDay: { fontSize: FontSize.xl, fontWeight: '900', color: Colors.slate[900] },
  dateBtnMonth: { fontSize: 10, color: Colors.slate[400], fontWeight: '600' },
  dateBtnTextActive: { color: Colors.white },

  slotsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  slotBtn: { paddingHorizontal: 16, paddingVertical: 10, backgroundColor: Colors.white, borderRadius: Radius.xl, borderWidth: 1.5, borderColor: Colors.slate[200], minWidth: 90, alignItems: 'center', ...Shadow.sm },
  slotBtnActive: { backgroundColor: Colors.brand[600], borderColor: Colors.brand[600] },
  slotTime: { fontSize: FontSize.sm, fontWeight: '700', color: Colors.slate[700] },
  slotTimeActive: { color: Colors.white },
  noSlots: { alignItems: 'center', padding: 32, backgroundColor: Colors.slate[50], borderRadius: Radius['2xl'] },
  noSlotsText: { fontSize: FontSize.base, fontWeight: '700', color: Colors.slate[700], marginBottom: 4 },
  noSlotsSubText: { fontSize: FontSize.sm, color: Colors.slate[400] },

  selectedSummary: { backgroundColor: Colors.brand[50], borderWidth: 1, borderColor: Colors.brand[200] },
  summaryTitle: { fontSize: FontSize.sm, fontWeight: '800', color: Colors.brand[700], marginBottom: 4 },
  summaryText: { fontSize: FontSize.sm, color: Colors.brand[600] },
  summaryFee: { fontSize: FontSize.lg, fontWeight: '900', color: Colors.brand[700], marginTop: 4 },

  bookBar: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 16, borderTopWidth: 1, borderTopColor: Colors.slate[100] },
  bookBtn: { borderRadius: Radius['2xl'], paddingVertical: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, ...Shadow.brand },
  bookBtnText: { fontSize: FontSize.lg, fontWeight: '900', color: Colors.white },

  modal: { flex: 1, backgroundColor: Colors.white },
  modalHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: Colors.slate[100] },
  modalTitle: { fontSize: FontSize['2xl'], fontWeight: '900', color: Colors.slate[900] },
  closeBtn: { width: 36, height: 36, borderRadius: 10, backgroundColor: Colors.slate[100], alignItems: 'center', justifyContent: 'center' },

  bookSummary: { borderRadius: Radius['2xl'], padding: 16, gap: 6 },
  bookSummaryDoc: { fontSize: FontSize.lg, fontWeight: '800', color: Colors.brand[800] },
  bookSummarySpec: { fontSize: FontSize.sm, color: Colors.brand[600] },
  bookSummaryMeta: { flexDirection: 'row', gap: 12, marginTop: 6, flexWrap: 'wrap' },
  bookSummaryItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  bookSummaryText: { fontSize: FontSize.xs, color: Colors.slate[600], fontWeight: '600' },

  modalLabel: { fontSize: FontSize.sm, fontWeight: '700', color: Colors.slate[700], marginBottom: 8 },
  patientOption: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14, backgroundColor: Colors.slate[50], borderRadius: Radius.xl, borderWidth: 1.5, borderColor: Colors.slate[200] },
  patientOptionActive: { borderColor: Colors.brand[400], backgroundColor: Colors.brand[50] },
  patientOptionIcon: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  patientOptionName: { fontSize: FontSize.sm, fontWeight: '700', color: Colors.slate[900] },
  patientOptionMeta: { fontSize: FontSize.xs, color: Colors.slate[500], marginTop: 2, textTransform: 'capitalize' },

  notesInput: { backgroundColor: Colors.slate[50], borderWidth: 1.5, borderColor: Colors.slate[200], borderRadius: Radius.xl, padding: 14, fontSize: FontSize.sm, color: Colors.slate[900], minHeight: 80 },
  payModeBox: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: Colors.green[50], borderRadius: Radius.xl, padding: 12 },
  payModeText: { fontSize: FontSize.sm, color: Colors.green[700], fontWeight: '600' },
  confirmBtn: { borderRadius: Radius['2xl'], paddingVertical: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, ...Shadow.brand },
  confirmBtnText: { fontSize: FontSize.lg, fontWeight: '900', color: Colors.white },
});
