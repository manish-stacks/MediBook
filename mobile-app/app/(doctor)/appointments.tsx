// app/(doctor)/appointments.tsx
import { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { appointmentsApi } from '../../src/api/endpoints';
import { Colors, FontSize, Radius } from '../../src/constants/theme';
import { formatDate, formatTime, getStatusColor } from '../../src/constants/utils';
import Avatar from '../../src/components/ui/Avatar';
import Card from '../../src/components/ui/Card';
import Badge from '../../src/components/ui/Badge';
import LoadingSpinner from '../../src/components/ui/LoadingSpinner';

const STATUS_TABS = ['ALL', 'PENDING', 'CONFIRMED', 'COMPLETED'];

export default function DoctorAppointmentsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState('ALL');
  const [search, setSearch] = useState('');
  const [dateFilter, setDateFilter] = useState('');

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['doctor-apts', activeTab, dateFilter],
    queryFn: () => appointmentsApi.list({ status: activeTab === 'ALL' ? undefined : activeTab, limit: 50 }).then(r => r.data.data),
  });

  const appointments = (data?.appointments || []).filter((a: any) =>
    !search || `${a.patient?.firstName} ${a.patient?.lastName}`.toLowerCase().includes(search.toLowerCase())
  );

  const todayStr = new Date().toISOString().split('T')[0];

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Appointments</Text>
        <TouchableOpacity onPress={() => setDateFilter(prev => prev === todayStr ? '' : todayStr)} style={[styles.todayBtn, dateFilter === todayStr && styles.todayBtnActive]}>
          <Ionicons name="today-outline" size={16} color={dateFilter === todayStr ? Colors.white : Colors.teal[600]} />
          <Text style={[styles.todayBtnText, dateFilter === todayStr && { color: Colors.white }]}>Today</Text>
        </TouchableOpacity>
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={16} color={Colors.slate[400]} />
          <TextInput value={search} onChangeText={setSearch} placeholder="Search patient..." placeholderTextColor={Colors.slate[400]} style={styles.searchInput} />
          {search ? <TouchableOpacity onPress={() => setSearch('')}><Ionicons name="close-circle" size={16} color={Colors.slate[400]} /></TouchableOpacity> : null}
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.tabRow}>
        {STATUS_TABS.map(tab => (
          <TouchableOpacity key={tab} onPress={() => setActiveTab(tab)} style={[styles.tab, activeTab === tab && styles.tabActive]}>
            <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
              {tab === 'ALL' ? 'All' : tab.charAt(0) + tab.slice(1).toLowerCase()}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {isLoading ? <LoadingSpinner label="Loading..." /> : (
        <FlatList
          data={appointments}
          keyExtractor={a => a.id}
          contentContainerStyle={{ padding: 14, gap: 10, paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={isLoading} onRefresh={refetch} />}
          renderItem={({ item: apt }) => {
            const sc = getStatusColor(apt.status);
            return (
              <TouchableOpacity onPress={() => router.push(`/(doctor)/appointment-detail?id=${apt.id}`)} activeOpacity={0.85}>
                <Card style={styles.card}>
                  <View style={styles.cardTop}>
                    <Avatar uri={apt.patient?.avatar} name={`${apt.patient?.firstName} ${apt.patient?.lastName}`} size={48} style={{ borderRadius: 14 }} />
                    <View style={{ flex: 1 }}>
                      <Text style={styles.patientName}>{apt.patient?.firstName} {apt.patient?.lastName}</Text>
                      <Text style={styles.patientMeta} numberOfLines={1}>{apt.clinic?.name} · {formatDate(apt.scheduledDate)}</Text>
                      <View style={styles.timeRow}>
                        <Ionicons name="time-outline" size={12} color={Colors.teal[600]} />
                        <Text style={styles.timeText}>{formatTime(apt.scheduledTime)}</Text>
                      </View>
                    </View>
                    <Badge label={apt.status} bg={sc.bg} color={sc.text} size="sm" />
                  </View>

                  {apt.notes && (
                    <View style={styles.noteRow}>
                      <Ionicons name="chatbubble-outline" size={12} color={Colors.slate[400]} />
                      <Text style={styles.noteText} numberOfLines={1}>{apt.notes}</Text>
                    </View>
                  )}

                  <View style={styles.actions}>
                    <TouchableOpacity style={styles.actionBtn} onPress={() => router.push(`/(doctor)/appointment-detail?id=${apt.id}`)}>
                      <Ionicons name="eye-outline" size={15} color={Colors.brand[600]} />
                      <Text style={styles.actionText}>Details</Text>
                    </TouchableOpacity>
                    {['PENDING', 'CONFIRMED', 'COMPLETED'].includes(apt.status) && (
                      <TouchableOpacity style={[styles.actionBtn, styles.rxBtn]} onPress={() => router.push(`/(doctor)/write-prescription?appointmentId=${apt.id}&patientId=${apt.patientId}`)}>
                        <Ionicons name="document-text-outline" size={15} color={Colors.teal[600]} />
                        <Text style={[styles.actionText, { color: Colors.teal[700] }]}>
                          {apt.prescription ? 'Edit Rx' : 'Write Rx'}
                        </Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </Card>
              </TouchableOpacity>
            );
          }}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Text style={{ fontSize: 48, marginBottom: 12 }}>📅</Text>
              <Text style={styles.emptyText}>No appointments found</Text>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.slate[50] },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 14, backgroundColor: Colors.white, borderBottomWidth: 1, borderBottomColor: Colors.slate[100] },
  headerTitle: { fontSize: FontSize['3xl'], fontWeight: '900', color: Colors.slate[900] },
  todayBtn: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 12, paddingVertical: 8, borderRadius: Radius.full, borderWidth: 1.5, borderColor: Colors.teal[500] },
  todayBtnActive: { backgroundColor: Colors.teal[600], borderColor: Colors.teal[600] },
  todayBtnText: { fontSize: FontSize.xs, fontWeight: '700', color: Colors.teal[600] },
  searchContainer: { backgroundColor: Colors.white, paddingHorizontal: 14, paddingVertical: 10 },
  searchBar: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: Colors.slate[50], borderRadius: Radius.lg, paddingHorizontal: 12, paddingVertical: 10, borderWidth: 1.5, borderColor: Colors.slate[200] },
  searchInput: { flex: 1, fontSize: FontSize.sm, color: Colors.slate[900] },
  tabRow: { flexDirection: 'row', backgroundColor: Colors.white, borderBottomWidth: 1, borderBottomColor: Colors.slate[100], paddingHorizontal: 14, paddingVertical: 8, gap: 8 },
  tab: { paddingHorizontal: 14, paddingVertical: 7, borderRadius: Radius.full, backgroundColor: Colors.slate[100] },
  tabActive: { backgroundColor: Colors.teal[600] },
  tabText: { fontSize: FontSize.xs, fontWeight: '700', color: Colors.slate[600] },
  tabTextActive: { color: Colors.white },

  card: { gap: 10 },
  cardTop: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  patientName: { fontSize: FontSize.base, fontWeight: '700', color: Colors.slate[900] },
  patientMeta: { fontSize: FontSize.xs, color: Colors.slate[400], marginTop: 2 },
  timeRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 },
  timeText: { fontSize: FontSize.xs, color: Colors.teal[600], fontWeight: '600' },
  noteRow: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: Colors.slate[50], borderRadius: Radius.lg, paddingHorizontal: 10, paddingVertical: 6 },
  noteText: { flex: 1, fontSize: FontSize.xs, color: Colors.slate[500] },
  actions: { flexDirection: 'row', gap: 8, borderTopWidth: 1, borderTopColor: Colors.slate[50], paddingTop: 10 },
  actionBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 5, backgroundColor: Colors.brand[50], borderRadius: Radius.lg, paddingVertical: 8 },
  rxBtn: { backgroundColor: Colors.teal[50] },
  actionText: { fontSize: FontSize.xs, fontWeight: '700', color: Colors.brand[700] },
  empty: { alignItems: 'center', paddingVertical: 60 },
  emptyText: { fontSize: FontSize.xl, fontWeight: '800', color: Colors.slate[700] },
});
