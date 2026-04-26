// app/(doctor)/notifications.tsx
// Reuse same pattern as patient notifications
import { View, Text, StyleSheet, FlatList, TouchableOpacity, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { notificationsApi } from '../../src/api/endpoints';
import { Colors, FontSize, Radius } from '../../src/constants/theme';
import { formatDate } from '../../src/constants/utils';
import LoadingSpinner from '../../src/components/ui/LoadingSpinner';

const TYPE_CONFIG: Record<string, { icon: string; bg: string }> = {
  appointment: { icon: '📅', bg: '#eff8ff' },
  payment:     { icon: '💳', bg: '#f0fdf4' },
  system:      { icon: '🔔', bg: '#f8fafc' },
  promo:       { icon: '🎁', bg: '#fdf4ff' },
};

export default function DoctorNotificationsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const qc = useQueryClient();

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['notifications'],
    queryFn: () => notificationsApi.list().then(r => r.data.data),
  });

  const readAllMutation = useMutation({
    mutationFn: () => notificationsApi.readAll(),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['notifications'] }),
  });

  const readOneMutation = useMutation({
    mutationFn: (id: string) => notificationsApi.readOne(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['notifications'] }),
  });

  const notifications = data || [];
  const unreadCount = notifications.filter((n: any) => !n.isRead).length;

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={22} color={Colors.slate[700]} />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>Notifications</Text>
          {unreadCount > 0 && <Text style={styles.sub}>{unreadCount} unread</Text>}
        </View>
        {unreadCount > 0 && (
          <TouchableOpacity onPress={() => readAllMutation.mutate()} style={styles.readAllBtn}>
            <Text style={styles.readAllText}>Mark All Read</Text>
          </TouchableOpacity>
        )}
      </View>

      {isLoading ? <LoadingSpinner /> : (
        <FlatList
          data={notifications}
          keyExtractor={n => n.id}
          contentContainerStyle={{ paddingBottom: 40 }}
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={isLoading} onRefresh={refetch} />}
          renderItem={({ item: n }) => {
            const cfg = TYPE_CONFIG[n.type] || TYPE_CONFIG.system;
            return (
              <TouchableOpacity
                onPress={() => { if (!n.isRead) readOneMutation.mutate(n.id); }}
                style={[styles.item, !n.isRead && styles.itemUnread]}
              >
                <View style={[styles.icon, { backgroundColor: cfg.bg }]}>
                  <Text style={{ fontSize: 22 }}>{cfg.icon}</Text>
                </View>
                <View style={{ flex: 1, gap: 2 }}>
                  <Text style={styles.itemTitle}>{n.title}</Text>
                  <Text style={styles.itemMsg} numberOfLines={2}>{n.message}</Text>
                  <Text style={styles.itemDate}>{formatDate(n.createdAt)}</Text>
                </View>
                {!n.isRead && <View style={styles.unreadDot} />}
              </TouchableOpacity>
            );
          }}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Text style={{ fontSize: 56, marginBottom: 12 }}>🔔</Text>
              <Text style={styles.emptyTitle}>No notifications</Text>
              <Text style={styles.emptySub}>You're all caught up!</Text>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.slate[50] },
  header: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 16, paddingVertical: 16, backgroundColor: Colors.white, borderBottomWidth: 1, borderBottomColor: Colors.slate[100] },
  backBtn: { width: 40, height: 40, borderRadius: 12, backgroundColor: Colors.slate[100], alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: FontSize['2xl'], fontWeight: '900', color: Colors.slate[900] },
  sub: { fontSize: FontSize.xs, color: Colors.teal[600], fontWeight: '700', marginTop: 1 },
  readAllBtn: { paddingHorizontal: 12, paddingVertical: 6, backgroundColor: Colors.teal[50], borderRadius: Radius.full },
  readAllText: { fontSize: FontSize.xs, color: Colors.teal[700], fontWeight: '700' },
  item: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, padding: 16, backgroundColor: Colors.white, borderBottomWidth: 1, borderBottomColor: Colors.slate[50] },
  itemUnread: { backgroundColor: '#f0fffe' },
  icon: { width: 46, height: 46, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  itemTitle: { fontSize: FontSize.sm, fontWeight: '800', color: Colors.slate[900] },
  itemMsg: { fontSize: FontSize.xs, color: Colors.slate[500], lineHeight: 18 },
  itemDate: { fontSize: 11, color: Colors.slate[300], fontWeight: '500' },
  unreadDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.teal[600], marginTop: 4 },
  empty: { alignItems: 'center', paddingVertical: 80 },
  emptyTitle: { fontSize: FontSize.xl, fontWeight: '800', color: Colors.slate[900], marginBottom: 6 },
  emptySub: { fontSize: FontSize.sm, color: Colors.slate[400] },
});
