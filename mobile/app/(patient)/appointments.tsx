// app/(patient)/appointments.tsx
import { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, RefreshControl, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';
import { appointmentsApi } from '../../src/api/endpoints';
import { Colors, FontSize, Radius, Shadow } from '../../src/constants/theme';
import { formatDate, formatTime, getStatusColor, formatCurrency } from '../../src/constants/utils';
import Avatar from '../../src/components/ui/Avatar';
import Card from '../../src/components/ui/Card';
import Badge from '../../src/components/ui/Badge';
import LoadingSpinner from '../../src/components/ui/LoadingSpinner';

const TABS = ['ALL', 'CONFIRMED', 'COMPLETED', 'CANCELLED'];

export default function AppointmentsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const qc = useQueryClient();
  const [activeTab, setActiveTab] = useState('ALL');

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['appointments', activeTab],
    queryFn: () => appointmentsApi.list({ status: activeTab === 'ALL' ? undefined : activeTab, limit: 30 }).then(r => r.data.data),
  });

  const cancelMutation = useMutation({
    mutationFn: (id: string) => appointmentsApi.updateStatus(id, { status: 'CANCELLED' }),
    onSuccess: () => { Toast.show({ type: 'success', text1: 'Appointment cancelled' }); qc.invalidateQueries({ queryKey: ['appointments'] }); },
    onError: (e: any) => Toast.show({ type: 'error', text1: e.response?.data?.message || 'Failed to cancel' }),
  });

  const handleCancel = (id: string) => {
    Alert.alert('Cancel Appointment', 'Are you sure you want to cancel this appointment?', [
      { text: 'No', style: 'cancel' },
      { text: 'Yes, Cancel', style: 'destructive', onPress: () => cancelMutation.mutate(id) },
    ]);
  };

  const appointments = data?.appointments || [];

  const AptCard = ({ item }: { item: any }) => {
    const sc = getStatusColor(item.status);
    const canCancel = ['PENDING', 'CONFIRMED'].includes(item.status);
    return (
      <TouchableOpacity onPress={() => router.push(`/(patient)/appointment-detail?id=${item.id}`)} activeOpacity={0.85}>
        <Card style={styles.card} elevated>
          {/* Status bar */}
          <View style={[styles.statusBar, { backgroundColor: sc.bg }]}>
            <View style={[styles.statusDot, { backgroundColor: sc.text }]} />
            <Text style={[styles.statusText, { color: sc.text }]}>{item.status}</Text>
            <Text style={styles.aptNo}>#{item.appointmentNo}</Text>
          </View>

          {/* Doctor row */}
          <View style={styles.docRow}>
            <Avatar uri={item.doctor?.user?.avatar} name={`${item.doctor?.user?.firstName} ${item.doctor?.user?.lastName}`} size={52} />
            <View style={{ flex: 1 }}>
              <Text style={styles.docName}>Dr. {item.doctor?.user?.firstName} {item.doctor?.user?.lastName}</Text>
              <Text style={styles.docSpec}>{item.doctor?.speciality?.name}</Text>
            </View>
            {item.payment && <Text style={styles.amount}>{formatCurrency(Number(item.payment.amount))}</Text>}
          </View>

          {/* Meta */}
          <View style={styles.metaGrid}>
            <View style={styles.metaItem}>
              <Ionicons name="calendar-outline" size={14} color={Colors.brand[500]} />
              <Text style={styles.metaText}>{formatDate(item.scheduledDate)}</Text>
            </View>
            <View style={styles.metaItem}>
              <Ionicons name="time-outline" size={14} color={Colors.brand[500]} />
              <Text style={styles.metaText}>{formatTime(item.scheduledTime)}</Text>
            </View>
            {item.clinic && (
              <View style={styles.metaItem}>
                <Ionicons name="location-outline" size={14} color={Colors.teal[500]} />
                <Text style={styles.metaText} numberOfLines={1}>{item.clinic.name}</Text>
              </View>
            )}
          </View>

          {/* Actions */}
          {canCancel && (
            <TouchableOpacity style={styles.cancelBtn} onPress={() => handleCancel(item.id)}>
              <Ionicons name="close-circle-outline" size={15} color={Colors.red[600]} />
              <Text style={styles.cancelText}>Cancel Appointment</Text>
            </TouchableOpacity>
          )}
        </Card>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Appointments</Text>
        <TouchableOpacity onPress={() => router.push('/(patient)/doctors')} style={styles.addBtn}>
          <Ionicons name="add" size={22} color={Colors.white} />
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <FlatList
          data={TABS}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={t => t}
          contentContainerStyle={{ gap: 8, paddingHorizontal: 16, paddingVertical: 12 }}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => setActiveTab(item)} style={[styles.tab, activeTab === item && styles.tabActive]}>
              <Text style={[styles.tabText, activeTab === item && styles.tabTextActive]}>
                {item === 'ALL' ? 'All' : item.charAt(0) + item.slice(1).toLowerCase()}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>

      {isLoading ? <LoadingSpinner label="Loading appointments..." /> : (
        <FlatList
          data={appointments}
          keyExtractor={a => a.id}
          renderItem={({ item }) => <AptCard item={item} />}
          contentContainerStyle={{ padding: 16, gap: 12, paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={isLoading} onRefresh={refetch} />}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Text style={{ fontSize: 56, marginBottom: 16 }}>📅</Text>
              <Text style={styles.emptyTitle}>No appointments found</Text>
              <TouchableOpacity onPress={() => router.push('/(patient)/doctors')} style={styles.bookBtn}>
                <Text style={styles.bookBtnText}>Book Your First Appointment</Text>
              </TouchableOpacity>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.slate[50] },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 16, backgroundColor: Colors.white, borderBottomWidth: 1, borderBottomColor: Colors.slate[100] },
  headerTitle: { fontSize: FontSize['3xl'], fontWeight: '900', color: Colors.slate[900], letterSpacing: -0.5 },
  addBtn: { width: 40, height: 40, borderRadius: 12, backgroundColor: Colors.brand[600], alignItems: 'center', justifyContent: 'center' },

  tabsContainer: { backgroundColor: Colors.white, borderBottomWidth: 1, borderBottomColor: Colors.slate[100] },
  tab: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: Radius.full, backgroundColor: Colors.slate[100] },
  tabActive: { backgroundColor: Colors.brand[600] },
  tabText: { fontSize: FontSize.xs, fontWeight: '700', color: Colors.slate[600] },
  tabTextActive: { color: Colors.white },

  card: { padding: 0, overflow: 'hidden' },
  statusBar: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 14, paddingVertical: 8 },
  statusDot: { width: 7, height: 7, borderRadius: 4 },
  statusText: { fontSize: FontSize.xs, fontWeight: '700', flex: 1 },
  aptNo: { fontSize: FontSize.xs, color: Colors.slate[400] },
  docRow: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14, paddingTop: 10 },
  docName: { fontSize: FontSize.base, fontWeight: '700', color: Colors.slate[900] },
  docSpec: { fontSize: FontSize.xs, color: Colors.brand[600], fontWeight: '600', marginTop: 2 },
  amount: { fontSize: FontSize.xl, fontWeight: '900', color: Colors.slate[900] },
  metaGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, paddingHorizontal: 14, paddingBottom: 12 },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  metaText: { fontSize: FontSize.xs, color: Colors.slate[600], fontWeight: '500' },
  cancelBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 5, padding: 10, borderTopWidth: 1, borderTopColor: Colors.red[100], backgroundColor: Colors.red[50] },
  cancelText: { fontSize: FontSize.xs, color: Colors.red[600], fontWeight: '700' },

  empty: { alignItems: 'center', paddingVertical: 60 },
  emptyTitle: { fontSize: FontSize.xl, fontWeight: '800', color: Colors.slate[700], marginBottom: 20 },
  bookBtn: { backgroundColor: Colors.brand[600], paddingHorizontal: 24, paddingVertical: 12, borderRadius: Radius.xl },
  bookBtnText: { color: Colors.white, fontWeight: '700', fontSize: FontSize.sm },
});
