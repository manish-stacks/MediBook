// app/(doctor)/earnings.tsx
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { doctorsApi } from '../../src/api/endpoints';
import { Colors, FontSize, Radius, Shadow } from '../../src/constants/theme';
import { formatCurrency, formatDate } from '../../src/constants/utils';
import LoadingSpinner from '../../src/components/ui/LoadingSpinner';

export default function DoctorEarningsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const { data, isLoading } = useQuery({
    queryKey: ['doctor-earnings'],
    queryFn: () => doctorsApi.getEarnings().then(r => r.data.data),
  });

  const { data: stats } = useQuery({
    queryKey: ['doctor-stats'],
    queryFn: () => doctorsApi.getStats().then(r => r.data.data),
  });

  const earnings = data?.earnings || [];
  const monthly = data?.monthly || [];

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <LinearGradient colors={['#0f172a', '#1e3a5f']} style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color={Colors.white} />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerTitle}>Earnings</Text>
          <Text style={styles.headerSub}>Your revenue overview</Text>
        </View>
      </LinearGradient>

      <ScrollView contentContainerStyle={{ padding: 14, gap: 14, paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
        {/* Stats */}
        <View style={styles.statsGrid}>
          {[
            { icon: '💰', label: 'Total Earned', value: formatCurrency(Number(stats?.totalRevenue || 0)), bg: ['#1e6fe8', '#02c9b3'] },
            { icon: '📅', label: 'This Month', value: formatCurrency(Number(stats?.monthRevenue || 0)), bg: ['#7c3aed', '#1e6fe8'] },
            { icon: '✅', label: 'Completed', value: stats?.completedAppointments || 0, bg: ['#16a34a', '#059669'] },
            { icon: '⏳', label: 'Pending', value: stats?.pendingAppointments || 0, bg: ['#d97706', '#b45309'] },
          ].map(s => (
            <LinearGradient key={s.label} colors={s.bg as any} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.statCard}>
              <Text style={{ fontSize: 26, marginBottom: 6 }}>{s.icon}</Text>
              <Text style={styles.statValue}>{s.value}</Text>
              <Text style={styles.statLabel}>{s.label}</Text>
            </LinearGradient>
          ))}
        </View>

        {/* Monthly chart (simple) */}
        {monthly.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Monthly Breakdown</Text>
            <View style={styles.monthList}>
              {monthly.slice(-6).map((m: any, i: number) => (
                <View key={i} style={styles.monthRow}>
                  <Text style={styles.monthLabel}>{m.month || `Month ${i + 1}`}</Text>
                  <View style={styles.monthBarBg}>
                    <View style={[styles.monthBar, { width: `${Math.min((Number(m.amount) / (Number(monthly[0]?.amount || 1))) * 100, 100)}%` }]} />
                  </View>
                  <Text style={styles.monthAmount}>{formatCurrency(Number(m.amount || 0))}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Recent earnings */}
        {isLoading ? <LoadingSpinner /> : (
          <View>
            <Text style={styles.sectionTitle}>Recent Transactions</Text>
            <View style={{ gap: 8 }}>
              {earnings.slice(0, 20).map((e: any) => (
                <View key={e.id} style={styles.earningRow}>
                  <View style={styles.earningIcon}>
                    <Text style={{ fontSize: 20 }}>{e.status === 'settled' ? '✅' : '⏳'}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.earningDate}>{formatDate(e.createdAt)}</Text>
                    <Text style={styles.earningStatus}>{e.status}</Text>
                  </View>
                  <View style={{ alignItems: 'flex-end' }}>
                    <Text style={styles.earningNet}>{formatCurrency(Number(e.netAmount))}</Text>
                    <Text style={styles.earningGross}>Gross: {formatCurrency(Number(e.amount))}</Text>
                  </View>
                </View>
              ))}
              {earnings.length === 0 && (
                <View style={styles.empty}>
                  <Text style={{ fontSize: 48, marginBottom: 12 }}>💰</Text>
                  <Text style={styles.emptyText}>No earnings yet</Text>
                  <Text style={styles.emptySubText}>Complete appointments to see your earnings here</Text>
                </View>
              )}
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.slate[50] },
  header: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 16, paddingBottom: 16, paddingTop: 12 },
  backBtn: { width: 40, height: 40, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.12)', alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: FontSize['2xl'], fontWeight: '900', color: Colors.white },
  headerSub: { fontSize: FontSize.xs, color: 'rgba(255,255,255,0.5)', marginTop: 2 },

  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  statCard: { flex: 1, minWidth: '45%', borderRadius: Radius['2xl'], padding: 16, ...Shadow.brand },
  statValue: { fontSize: FontSize['2xl'], fontWeight: '900', color: Colors.white, marginBottom: 3 },
  statLabel: { fontSize: FontSize.xs, color: 'rgba(255,255,255,0.7)', fontWeight: '600' },

  section: { gap: 12 },
  sectionTitle: { fontSize: FontSize.lg, fontWeight: '800', color: Colors.slate[900], marginBottom: 8 },
  monthList: { gap: 10 },
  monthRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  monthLabel: { width: 60, fontSize: FontSize.xs, color: Colors.slate[600], fontWeight: '600' },
  monthBarBg: { flex: 1, height: 8, backgroundColor: Colors.slate[100], borderRadius: 4 },
  monthBar: { height: 8, backgroundColor: Colors.teal[500], borderRadius: 4 },
  monthAmount: { width: 70, textAlign: 'right', fontSize: FontSize.xs, fontWeight: '700', color: Colors.slate[800] },

  earningRow: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: Colors.white, borderRadius: Radius.xl, padding: 14, ...Shadow.sm, borderWidth: 1, borderColor: Colors.slate[100] },
  earningIcon: { width: 42, height: 42, backgroundColor: Colors.slate[50], borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  earningDate: { fontSize: FontSize.sm, fontWeight: '700', color: Colors.slate[900] },
  earningStatus: { fontSize: FontSize.xs, color: Colors.slate[400], textTransform: 'capitalize', marginTop: 2 },
  earningNet: { fontSize: FontSize.lg, fontWeight: '900', color: Colors.green[700] },
  earningGross: { fontSize: FontSize.xs, color: Colors.slate[400], marginTop: 1 },

  empty: { alignItems: 'center', paddingVertical: 40 },
  emptyText: { fontSize: FontSize.xl, fontWeight: '800', color: Colors.slate[800], marginBottom: 6 },
  emptySubText: { fontSize: FontSize.sm, color: Colors.slate[400], textAlign: 'center' },
});
