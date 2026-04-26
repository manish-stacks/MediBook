// app/(patient)/index.tsx
import { ScrollView, View, Text, StyleSheet, TouchableOpacity, FlatList, RefreshControl, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '../../src/store/auth.store';
import { appointmentsApi, specialitiesApi, doctorsApi } from '../../src/api/endpoints';
import { Colors, FontSize, Radius, Shadow, Spacing } from '../../src/constants/theme';
import { formatDate, formatTime, getStatusColor, formatCurrency } from '../../src/constants/utils';
import Avatar from '../../src/components/ui/Avatar';
import Card from '../../src/components/ui/Card';
import Badge from '../../src/components/ui/Badge';
import StatCard from '../../src/components/ui/StatCard';

const { width } = Dimensions.get('window');

const SPECIALITY_ICONS: Record<string, string> = {
  cardiology: '🫀', dermatology: '🧴', neurology: '🧠', orthopedics: '🦴',
  pediatrics: '👶', gynecology: '🌸', psychiatry: '🧘', 'general-medicine': '🏥',
};

const QUICK_ACTIONS = [
  { icon: '🔍', label: 'Find Doctor', route: '/(patient)/doctors', bg: '#eff8ff' },
  { icon: '💊', label: 'Medicines', route: '/(patient)/prescriptions', bg: '#f0fdf4' },
  { icon: '👨‍👩‍👧', label: 'Family', route: '/(patient)/family', bg: '#fdf4ff' },
  { icon: '💳', label: 'Payments', route: '/(patient)/payments', bg: '#fffbeb' },
];

export default function PatientHome() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user } = useAuthStore();
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  const { data: stats, refetch: refetchStats } = useQuery({ queryKey: ['apt-stats'], queryFn: () => appointmentsApi.getStats().then(r => r.data.data) });
  const { data: upcomingApts, isLoading: aptsLoading, refetch: refetchApts } = useQuery({ queryKey: ['upcoming-apts'], queryFn: () => appointmentsApi.list({ status: 'CONFIRMED', limit: 3 }).then(r => r.data.data.appointments) });
  const { data: specialities } = useQuery({ queryKey: ['specialities'], queryFn: () => specialitiesApi.list().then(r => r.data.data) });
  const { data: topDoctors } = useQuery({ queryKey: ['top-doctors'], queryFn: () => doctorsApi.list({ limit: 4, sortBy: 'rating', sortOrder: 'desc' }).then(r => r.data.data.doctors) });

  const appointments = upcomingApts || [];
  const specs = specialities || [];
  const doctors = topDoctors || [];

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      refreshControl={<RefreshControl refreshing={false} onRefresh={() => { refetchStats(); refetchApts(); }} />}
    >
      {/* Hero Header */}
      <LinearGradient colors={['#0f172a', '#1e3a5f', '#1e6fe8']} style={[styles.hero, { paddingTop: insets.top + 16 }]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
        {/* Blobs */}
        <View style={[styles.blob, { top: -60, right: -40, backgroundColor: '#02c9b320' }]} />
        <View style={[styles.blob, { bottom: -40, left: -20, backgroundColor: '#1e6fe820', width: 200, height: 200, borderRadius: 100 }]} />

        {/* Top row */}
        <View style={styles.heroTop}>
          <View>
            <Text style={styles.greeting}>{greeting} 👋</Text>
            <Text style={styles.userName}>{user?.firstName} {user?.lastName}</Text>
          </View>
          <TouchableOpacity onPress={() => router.push('/(patient)/notifications')} style={styles.notifBtn}>
            <Ionicons name="notifications-outline" size={22} color={Colors.white} />
            <View style={styles.notifDot} />
          </TouchableOpacity>
        </View>

        {/* Stats row */}
        <View style={styles.statsRow}>
          {[
            { label: 'Total', value: stats?.total || 0, icon: '📅', bg: 'rgba(30,111,232,0.2)', color: '#93d0fc' },
            { label: 'Upcoming', value: stats?.confirmed || 0, icon: '⏰', bg: 'rgba(2,201,179,0.2)', color: '#50f5df' },
            { label: 'Completed', value: stats?.completed || 0, icon: '✅', bg: 'rgba(34,197,94,0.2)', color: '#86efac' },
          ].map(s => (
            <View key={s.label} style={[styles.statBox, { backgroundColor: s.bg }]}>
              <Text style={{ fontSize: 22 }}>{s.icon}</Text>
              <Text style={[styles.statValue, { color: s.color }]}>{s.value}</Text>
              <Text style={styles.statLabel}>{s.label}</Text>
            </View>
          ))}
        </View>

        {/* Search bar */}
        <TouchableOpacity onPress={() => router.push('/(patient)/doctors')} style={styles.searchBar} activeOpacity={0.85}>
          <Ionicons name="search" size={18} color="rgba(255,255,255,0.5)" />
          <Text style={styles.searchPlaceholder}>Search doctors, specialities...</Text>
          <Ionicons name="options-outline" size={18} color="rgba(255,255,255,0.5)" />
        </TouchableOpacity>
      </LinearGradient>

      <View style={styles.body}>
        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickGrid}>
            {QUICK_ACTIONS.map(action => (
              <TouchableOpacity key={action.label} style={[styles.quickItem, { backgroundColor: action.bg }]} onPress={() => router.push(action.route as any)} activeOpacity={0.75}>
                <Text style={styles.quickIcon}>{action.icon}</Text>
                <Text style={styles.quickLabel}>{action.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Upcoming Appointments */}
        <View style={styles.section}>
          <View style={styles.sectionRow}>
            <Text style={styles.sectionTitle}>Upcoming Appointments</Text>
            <TouchableOpacity onPress={() => router.push('/(patient)/appointments')}>
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>

          {appointments.length === 0 ? (
            <Card style={styles.emptyCard}>
              <Text style={styles.emptyEmoji}>📅</Text>
              <Text style={styles.emptyTitle}>No upcoming appointments</Text>
              <TouchableOpacity onPress={() => router.push('/(patient)/doctors')} style={styles.bookBtn}>
                <Text style={styles.bookBtnText}>Book Now</Text>
              </TouchableOpacity>
            </Card>
          ) : (
            <View style={{ gap: 10 }}>
              {appointments.map((apt: any) => {
                const sc = getStatusColor(apt.status);
                return (
                  <TouchableOpacity key={apt.id} onPress={() => router.push(`/(patient)/appointment-detail?id=${apt.id}`)} activeOpacity={0.85}>
                    <Card style={styles.aptCard}>
                      <View style={styles.aptRow}>
                        <Avatar uri={apt.doctor?.user?.avatar} name={`${apt.doctor?.user?.firstName} ${apt.doctor?.user?.lastName}`} size={52} />
                        <View style={{ flex: 1 }}>
                          <Text style={styles.aptDoctorName}>Dr. {apt.doctor?.user?.firstName} {apt.doctor?.user?.lastName}</Text>
                          <Text style={styles.aptSpec}>{apt.doctor?.speciality?.name}</Text>
                          <View style={styles.aptMeta}>
                            <Ionicons name="calendar-outline" size={13} color={Colors.slate[400]} />
                            <Text style={styles.aptMetaText}>{formatDate(apt.scheduledDate)}</Text>
                            <Ionicons name="time-outline" size={13} color={Colors.slate[400]} />
                            <Text style={styles.aptMetaText}>{formatTime(apt.scheduledTime)}</Text>
                          </View>
                        </View>
                        <Badge label={apt.status} bg={sc.bg} color={sc.text} size="sm" />
                      </View>
                    </Card>
                  </TouchableOpacity>
                );
              })}
            </View>
          )}
        </View>

        {/* Specialities */}
        {specs.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionRow}>
              <Text style={styles.sectionTitle}>Specialities</Text>
              <TouchableOpacity onPress={() => router.push('/(patient)/doctors')}>
                <Text style={styles.seeAll}>See All</Text>
              </TouchableOpacity>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 10, paddingRight: 4 }}>
              {specs.slice(0, 8).map((spec: any) => (
                <TouchableOpacity key={spec.id} style={styles.specCard} onPress={() => router.push(`/(patient)/doctors?specialityId=${spec.id}`)} activeOpacity={0.8}>
                  <Text style={styles.specIcon}>{spec.icon || SPECIALITY_ICONS[spec.slug] || '🏥'}</Text>
                  <Text style={styles.specName}>{spec.name}</Text>
                  <Text style={styles.specCount}>{spec._count?.doctors || 0} docs</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Top Doctors */}
        {doctors.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionRow}>
              <Text style={styles.sectionTitle}>Top Doctors</Text>
              <TouchableOpacity onPress={() => router.push('/(patient)/doctors')}>
                <Text style={styles.seeAll}>See All</Text>
              </TouchableOpacity>
            </View>
            <View style={{ gap: 10 }}>
              {doctors.map((doc: any) => (
                <TouchableOpacity key={doc.id} onPress={() => router.push(`/(patient)/doctor-detail?id=${doc.id}`)} activeOpacity={0.85}>
                  <Card style={styles.docCard}>
                    <Avatar uri={doc.user?.avatar} name={`${doc.user?.firstName} ${doc.user?.lastName}`} size={52} />
                    <View style={{ flex: 1 }}>
                      <Text style={styles.docName}>Dr. {doc.user?.firstName} {doc.user?.lastName}</Text>
                      <Text style={styles.docSpec}>{doc.speciality?.name}</Text>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4 }}>
                        <Ionicons name="star" size={12} color="#f59e0b" />
                        <Text style={styles.docRating}>{Number(doc.rating).toFixed(1)}</Text>
                        <Text style={styles.docReviews}>({doc.totalReviews})</Text>
                        <View style={styles.dot} />
                        <Text style={styles.docExp}>{doc.experience} yrs</Text>
                      </View>
                    </View>
                    <View style={{ alignItems: 'flex-end' }}>
                      <Text style={styles.docFee}>{formatCurrency(Number(doc.consultationFee))}</Text>
                      <Text style={styles.docFeeLabel}>fee</Text>
                    </View>
                  </Card>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        <View style={{ height: 100 }} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.slate[50] },
  hero: { paddingHorizontal: 20, paddingBottom: 24, overflow: 'hidden' },
  blob: { position: 'absolute', width: 250, height: 250, borderRadius: 125 },
  heroTop: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 20 },
  greeting: { fontSize: FontSize.sm, color: 'rgba(255,255,255,0.6)', fontWeight: '500', marginBottom: 2 },
  userName: { fontSize: FontSize['3xl'], fontWeight: '900', color: Colors.white, letterSpacing: -0.5 },
  notifBtn: { width: 44, height: 44, backgroundColor: 'rgba(255,255,255,0.12)', borderRadius: Radius.xl, alignItems: 'center', justifyContent: 'center' },
  notifDot: { position: 'absolute', top: 10, right: 10, width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.rose[500], borderWidth: 1.5, borderColor: Colors.white },
  statsRow: { flexDirection: 'row', gap: 10, marginBottom: 16 },
  statBox: { flex: 1, borderRadius: Radius.xl, padding: 12, alignItems: 'center', gap: 4 },
  statValue: { fontSize: FontSize['3xl'], fontWeight: '900', lineHeight: 28 },
  statLabel: { fontSize: 10, color: 'rgba(255,255,255,0.5)', fontWeight: '600' },
  searchBar: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: Radius.xl, paddingHorizontal: 14, paddingVertical: 12, borderWidth: 1, borderColor: 'rgba(255,255,255,0.15)' },
  searchPlaceholder: { flex: 1, fontSize: FontSize.base, color: 'rgba(255,255,255,0.4)' },

  body: { paddingHorizontal: 16, paddingTop: 20 },
  section: { marginBottom: 24 },
  sectionRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 },
  sectionTitle: { fontSize: FontSize.xl, fontWeight: '800', color: Colors.slate[900], letterSpacing: -0.3 },
  seeAll: { fontSize: FontSize.sm, color: Colors.brand[600], fontWeight: '700' },

  quickGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  quickItem: { width: (width - 52) / 4, borderRadius: Radius.xl, padding: 14, alignItems: 'center', gap: 6 },
  quickIcon: { fontSize: 28 },
  quickLabel: { fontSize: 11, fontWeight: '700', color: Colors.slate[700], textAlign: 'center' },

  emptyCard: { alignItems: 'center', padding: 32 },
  emptyEmoji: { fontSize: 48, marginBottom: 12 },
  emptyTitle: { fontSize: FontSize.base, color: Colors.slate[600], fontWeight: '600', marginBottom: 16 },
  bookBtn: { backgroundColor: Colors.brand[600], paddingHorizontal: 24, paddingVertical: 10, borderRadius: Radius.xl },
  bookBtnText: { color: Colors.white, fontWeight: '700', fontSize: FontSize.sm },

  aptCard: { padding: 14 },
  aptRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  aptDoctorName: { fontSize: FontSize.base, fontWeight: '700', color: Colors.slate[900] },
  aptSpec: { fontSize: FontSize.xs, color: Colors.brand[600], fontWeight: '600', marginTop: 2 },
  aptMeta: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 5 },
  aptMetaText: { fontSize: FontSize.xs, color: Colors.slate[500] },

  specCard: { backgroundColor: Colors.white, borderRadius: Radius.xl, padding: 14, alignItems: 'center', width: 90, ...Shadow.sm, borderWidth: 1, borderColor: Colors.slate[100] },
  specIcon: { fontSize: 30, marginBottom: 6 },
  specName: { fontSize: 11, fontWeight: '700', color: Colors.slate[800], textAlign: 'center', marginBottom: 2 },
  specCount: { fontSize: 10, color: Colors.slate[400], fontWeight: '500' },

  docCard: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14 },
  docName: { fontSize: FontSize.base, fontWeight: '700', color: Colors.slate[900] },
  docSpec: { fontSize: FontSize.xs, color: Colors.brand[600], fontWeight: '600', marginTop: 2 },
  docRating: { fontSize: FontSize.xs, fontWeight: '700', color: Colors.slate[800] },
  docReviews: { fontSize: FontSize.xs, color: Colors.slate[400] },
  docExp: { fontSize: FontSize.xs, color: Colors.slate[500] },
  docFee: { fontSize: FontSize.xl, fontWeight: '900', color: Colors.brand[600] },
  docFeeLabel: { fontSize: 10, color: Colors.slate[400], marginTop: 1 },
  dot: { width: 3, height: 3, borderRadius: 1.5, backgroundColor: Colors.slate[300] },
});
