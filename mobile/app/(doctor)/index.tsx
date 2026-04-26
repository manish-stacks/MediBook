// app/(doctor)/index.tsx
import { ScrollView, View, Text, StyleSheet, TouchableOpacity, RefreshControl, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '../../src/store/auth.store';
import { doctorsApi, appointmentsApi } from '../../src/api/endpoints';
import { Colors, FontSize, Radius, Shadow } from '../../src/constants/theme';
import { formatDate, formatTime, getStatusColor, formatCurrency } from '../../src/constants/utils';
import Avatar from '../../src/components/ui/Avatar';
import Card from '../../src/components/ui/Card';
import Badge from '../../src/components/ui/Badge';

const { width } = Dimensions.get('window');

export default function DoctorHome() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user } = useAuthStore();
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  const { data: stats, refetch: refetchStats } = useQuery({ queryKey: ['doctor-stats'], queryFn: () => doctorsApi.getStats().then(r => r.data.data) });
  const { data: todayApts, isLoading, refetch: refetchToday } = useQuery({ queryKey: ['doctor-today'], queryFn: () => doctorsApi.getToday().then(r => r.data.data) });

  const today = todayApts || [];

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      refreshControl={<RefreshControl refreshing={false} onRefresh={() => { refetchStats(); refetchToday(); }} />}
    >
      {/* Hero */}
      <LinearGradient colors={['#0f172a', '#0d4f4f', '#02c9b3']} style={[styles.hero, { paddingTop: insets.top + 16 }]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
        <View style={[styles.blob, { backgroundColor: '#1e6fe820', top: -60, right: -40 }]} />
        <View style={[styles.blob, { backgroundColor: '#02c9b315', bottom: -30, left: -20, width: 180, height: 180, borderRadius: 90 }]} />

        <View style={styles.heroTop}>
          <View>
            <Text style={styles.greeting}>{greeting}, Doctor 👨‍⚕️</Text>
            <Text style={styles.userName}>Dr. {user?.firstName} {user?.lastName}</Text>
          </View>
          <TouchableOpacity onPress={() => router.push('/(doctor)/notifications')} style={styles.notifBtn}>
            <Ionicons name="notifications-outline" size={22} color={Colors.white} />
          </TouchableOpacity>
        </View>

        {/* Stats */}
        <View style={styles.statsGrid}>
          {[
            { icon: '📅', label: "Today's Apts", val: stats?.todayAppointments || 0, color: '#7dd3fc' },
            { icon: '✅', label: 'Completed', val: stats?.completedAppointments || 0, color: '#86efac' },
            { icon: '👥', label: 'Total Patients', val: stats?.totalPatients || 0, color: '#c4b5fd' },
            { icon: '💰', label: 'This Month', val: stats?.monthRevenue ? formatCurrency(Number(stats.monthRevenue)) : '₹0', color: '#fde68a' },
          ].map(s => (
            <View key={s.label} style={styles.statBox}>
              <Text style={{ fontSize: 24 }}>{s.icon}</Text>
              <Text style={[styles.statVal, { color: s.color }]}>{s.val}</Text>
              <Text style={styles.statLabel}>{s.label}</Text>
            </View>
          ))}
        </View>

        {/* Rating chip */}
        {stats?.rating && (
          <View style={styles.ratingChip}>
            <Ionicons name="star" size={14} color="#fbbf24" />
            <Text style={styles.ratingText}>{Number(stats.rating).toFixed(1)} Rating</Text>
            <Text style={styles.ratingCount}>({stats.totalReviews} reviews)</Text>
          </View>
        )}
      </LinearGradient>

      <View style={styles.body}>
        {/* Quick Actions */}
        <View style={styles.quickRow}>
          {[
            { icon: '📝', label: 'Write Rx', onPress: () => router.push('/(doctor)/appointments'), bg: '#f0fdf4', color: Colors.green[600] },
            { icon: '🗓️', label: 'Manage Slots', onPress: () => router.push('/(doctor)/slots'), bg: '#eff8ff', color: Colors.brand[600] },
            { icon: '👥', label: 'Patients', onPress: () => router.push('/(doctor)/patients'), bg: '#fdf4ff', color: Colors.violet[600] },
            { icon: '💰', label: 'Earnings', onPress: () => router.push('/(doctor)/earnings'), bg: '#fffbeb', color: Colors.amber[600] },
          ].map(a => (
            <TouchableOpacity key={a.label} style={[styles.quickBtn, { backgroundColor: a.bg }]} onPress={a.onPress} activeOpacity={0.75}>
              <Text style={{ fontSize: 26 }}>{a.icon}</Text>
              <Text style={[styles.quickLabel, { color: a.color }]}>{a.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Today's Schedule */}
        <View style={styles.section}>
          <View style={styles.sectionRow}>
            <Text style={styles.sectionTitle}>Today's Schedule</Text>
            <TouchableOpacity onPress={() => router.push('/(doctor)/appointments')}>
              <Text style={styles.seeAll}>Full Schedule</Text>
            </TouchableOpacity>
          </View>

          {today.length === 0 ? (
            <Card style={styles.emptyCard}>
              <Text style={{ fontSize: 48, marginBottom: 12 }}>🗓️</Text>
              <Text style={styles.emptyTitle}>No appointments today</Text>
              <Text style={styles.emptySubText}>Enjoy your free day!</Text>
            </Card>
          ) : (
            <View style={{ gap: 10 }}>
              {today.map((apt: any) => {
                const sc = getStatusColor(apt?.status || 'pending');
                return (
                  <TouchableOpacity key={apt.id} onPress={() => router.push(`/(doctor)/appointment-detail?id=${apt.id}`)} activeOpacity={0.85}>
                    <Card style={styles.aptCard}>
                      <View style={styles.timeCol}>
                        <Text style={styles.timeHour}>{formatTime(apt.scheduledTime).split(' ')[0]}</Text>
                        <Text style={styles.timeAMPM}>{formatTime(apt.scheduledTime).split(' ')[1]}</Text>
                      </View>
                      <View style={styles.divider} />
                      <View style={{ flex: 1 }}>
                        <Text style={styles.patientName}>{apt.patient?.firstName} {apt.patient?.lastName}</Text>
                        <Text style={styles.patientMeta}>{apt.patient?.gender} · {apt.clinic?.name}</Text>
                        {apt.patient?.vitals?.length > 0 && (
                          <View style={styles.vitalsRow}>
                            {apt.patient.vitals[0]?.temperature && <Text style={styles.vitalChip}>🌡️ {apt.patient.vitals[0].temperature}°C</Text>}
                            {apt.patient.vitals[0]?.bloodPressure && <Text style={styles.vitalChip}>❤️ {apt.patient.vitals[0].bloodPressure}</Text>}
                          </View>
                        )}
                      </View>
                      <Badge label={apt.status} bg={sc.bg} color={sc.text} size="sm" />
                    </Card>
                  </TouchableOpacity>
                );
              })}
            </View>
          )}
        </View>
      </View>
      <View style={{ height: 100 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.slate[50] },
  hero: { paddingHorizontal: 20, paddingBottom: 28, overflow: 'hidden' },
  blob: { position: 'absolute', width: 250, height: 250, borderRadius: 125 },
  heroTop: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 20 },
  greeting: { fontSize: FontSize.sm, color: 'rgba(255,255,255,0.6)', fontWeight: '500', marginBottom: 2 },
  userName: { fontSize: FontSize['3xl'], fontWeight: '900', color: Colors.white, letterSpacing: -0.5 },
  notifBtn: { width: 44, height: 44, backgroundColor: 'rgba(255,255,255,0.12)', borderRadius: Radius.xl, alignItems: 'center', justifyContent: 'center' },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 16 },
  statBox: { flex: 1, minWidth: (width - 70) / 2, backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: Radius.xl, padding: 12, alignItems: 'center', gap: 4 },
  statVal: { fontSize: FontSize['2xl'], fontWeight: '900', lineHeight: 26 },
  statLabel: { fontSize: 10, color: 'rgba(255,255,255,0.5)', fontWeight: '600', textAlign: 'center' },
  ratingChip: { flexDirection: 'row', alignItems: 'center', gap: 6, alignSelf: 'flex-start', backgroundColor: 'rgba(255,255,255,0.12)', paddingHorizontal: 12, paddingVertical: 7, borderRadius: Radius.full },
  ratingText: { fontSize: FontSize.sm, color: Colors.white, fontWeight: '700' },
  ratingCount: { fontSize: FontSize.xs, color: 'rgba(255,255,255,0.5)' },

  body: { padding: 16 },
  quickRow: { flexDirection: 'row', gap: 10, marginBottom: 24 },
  quickBtn: { flex: 1, borderRadius: Radius.xl, padding: 12, alignItems: 'center', gap: 6 },
  quickLabel: { fontSize: 11, fontWeight: '700', textAlign: 'center' },

  section: { marginBottom: 24 },
  sectionRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 },
  sectionTitle: { fontSize: FontSize.xl, fontWeight: '800', color: Colors.slate[900] },
  seeAll: { fontSize: FontSize.sm, color: Colors.teal[600], fontWeight: '700' },

  emptyCard: { alignItems: 'center', padding: 40 },
  emptyTitle: { fontSize: FontSize.lg, fontWeight: '700', color: Colors.slate[700], marginBottom: 4 },
  emptySubText: { fontSize: FontSize.sm, color: Colors.slate[400] },

  aptCard: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14 },
  timeCol: { alignItems: 'center', width: 48 },
  timeHour: { fontSize: FontSize.lg, fontWeight: '900', color: Colors.teal[600] },
  timeAMPM: { fontSize: 10, color: Colors.teal[400], fontWeight: '700' },
  divider:  { width: 1, height: '100%', backgroundColor: Colors.slate[100] },
  patientName: { fontSize: FontSize.base, fontWeight: '700', color: Colors.slate[900] },
  patientMeta: { fontSize: FontSize.xs, color: Colors.slate[400], marginTop: 2, textTransform: 'capitalize' },
  vitalsRow:   { flexDirection: 'row', gap: 6, marginTop: 5, flexWrap: 'wrap' },
  vitalChip:   { fontSize: 11, backgroundColor: Colors.brand[100] || '#fff7ed', paddingHorizontal: 7, paddingVertical: 2, borderRadius: Radius.full, color: Colors.amber[600] },
});
