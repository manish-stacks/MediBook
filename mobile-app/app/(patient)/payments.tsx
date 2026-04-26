// app/(patient)/payments.tsx
import { View, Text, StyleSheet, FlatList, TouchableOpacity, RefreshControl, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Linking from 'expo-linking';
import { paymentsApi } from '../../src/api/endpoints';
import { Colors, FontSize, Radius, Shadow } from '../../src/constants/theme';
import { formatDate, formatCurrency, getPaymentStatusColor } from '../../src/constants/utils';
import Avatar from '../../src/components/ui/Avatar';
import Card from '../../src/components/ui/Card';
import LoadingSpinner from '../../src/components/ui/LoadingSpinner';

export default function PaymentsScreen() {
  const insets = useSafeAreaInsets();

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['payments'],
    queryFn: () => paymentsApi.history().then(r => r.data.data),
  });

  const payments = data?.payments || [];
  const totalPaid = payments.filter((p: any) => p.status === 'PAID').reduce((acc: number, p: any) => acc + Number(p.amount), 0);

  const showReceipt = (pay: any) => {
    Alert.alert(
      '🧾 Receipt Details',
      `Receipt No: ${pay.id?.slice(-8).toUpperCase()}\n\nDoctor: Dr. ${pay.appointment?.doctor?.user?.firstName || ''} ${pay.appointment?.doctor?.user?.lastName || ''}\n\nDate: ${pay.paidAt ? formatDate(pay.paidAt) : formatDate(pay.createdAt)}\n\nAmount: ${formatCurrency(Number(pay.amount))}\n\nMode: ${pay.paymentMode?.replace('_', ' ')}\n\nStatus: PAID ✅\n\n${pay.razorpayPaymentId ? `TxnID: ${pay.razorpayPaymentId}` : ''}`,
      [{ text: 'Close', style: 'cancel' }]
    );
  };

  const STATUS_ICONS: Record<string, { icon: string; color: string }> = {
    PAID: { icon: '✅', color: Colors.green[600] },
    PENDING: { icon: '⏳', color: Colors.amber[600] },
    FAILED: { icon: '❌', color: Colors.red[600] },
    REFUNDED: { icon: '↩️', color: Colors.violet[600] },
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <LinearGradient colors={['#0f172a', '#1e3a5f']} style={styles.header}>
        <Text style={styles.headerTitle}>Payment History</Text>
        <Text style={styles.headerSub}>All your consultation payments</Text>
        {/* Stats */}
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{formatCurrency(totalPaid)}</Text>
            <Text style={styles.statLabel}>Total Spent</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{data?.total || 0}</Text>
            <Text style={styles.statLabel}>Transactions</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{payments.filter((p: any) => p.status === 'PAID').length}</Text>
            <Text style={styles.statLabel}>Paid</Text>
          </View>
        </View>
      </LinearGradient>

      {isLoading ? <LoadingSpinner label="Loading payments..." /> : (
        <FlatList
          data={payments}
          keyExtractor={p => p.id}
          contentContainerStyle={{ padding: 14, gap: 10, paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={isLoading} onRefresh={refetch} />}
          renderItem={({ item: pay }) => {
            const ps = getPaymentStatusColor(pay.status);
            const si = STATUS_ICONS[pay.status] || STATUS_ICONS.PENDING;
            return (
              <Card elevated style={styles.payCard}>
                <View style={styles.payRow}>
                  <View style={styles.payIconBox}>
                    <Text style={{ fontSize: 26 }}>{si.icon}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.payDoctor}>
                      {pay.appointment?.doctor
                        ? `Dr. ${pay.appointment.doctor.user?.firstName} ${pay.appointment.doctor.user?.lastName}`
                        : 'Consultation'}
                    </Text>
                    <Text style={styles.payDate}>{formatDate(pay.paidAt || pay.createdAt)}</Text>
                    <Text style={styles.payMode}>{pay.paymentMode?.replace('_', ' ')}</Text>
                  </View>
                  <View style={styles.payRight}>
                    <Text style={styles.payAmount}>{formatCurrency(Number(pay.amount))}</Text>
                    <View style={[styles.payStatus, { backgroundColor: ps.bg }]}>
                      <Text style={[styles.payStatusText, { color: ps.text }]}>{pay.status}</Text>
                    </View>
                  </View>
                </View>

                {pay.status === 'PAID' && (
                  <TouchableOpacity style={styles.receiptBtn} onPress={() => showReceipt(pay)}>
                    <Ionicons name="document-text-outline" size={14} color={Colors.brand[600]} />
                    <Text style={styles.receiptBtnText}>View Receipt</Text>
                  </TouchableOpacity>
                )}
              </Card>
            );
          }}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Text style={{ fontSize: 56, marginBottom: 16 }}>💳</Text>
              <Text style={styles.emptyTitle}>No payments yet</Text>
              <Text style={styles.emptySubText}>Your payment history will appear here after booking appointments</Text>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.slate[50] },
  header: { padding: 20, paddingBottom: 24 },
  headerTitle: { fontSize: FontSize['3xl'], fontWeight: '900', color: Colors.white, letterSpacing: -0.5 },
  headerSub: { fontSize: FontSize.sm, color: 'rgba(255,255,255,0.5)', marginTop: 4, marginBottom: 16 },
  statsRow: { flexDirection: 'row', backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: Radius.xl, padding: 16 },
  statBox: { flex: 1, alignItems: 'center' },
  statDivider: { width: 1, backgroundColor: 'rgba(255,255,255,0.1)', marginHorizontal: 8 },
  statValue: { fontSize: FontSize['2xl'], fontWeight: '900', color: Colors.white },
  statLabel: { fontSize: 11, color: 'rgba(255,255,255,0.5)', fontWeight: '600', marginTop: 2 },

  payCard: { padding: 14, gap: 10 },
  payRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  payIconBox: { width: 48, height: 48, backgroundColor: Colors.slate[50], borderRadius: Radius.xl, alignItems: 'center', justifyContent: 'center' },
  payDoctor: { fontSize: FontSize.sm, fontWeight: '700', color: Colors.slate[900] },
  payDate: { fontSize: FontSize.xs, color: Colors.slate[400], marginTop: 2 },
  payMode: { fontSize: FontSize.xs, color: Colors.slate[400], marginTop: 1, textTransform: 'capitalize' },
  payRight: { alignItems: 'flex-end', gap: 4 },
  payAmount: { fontSize: FontSize.xl, fontWeight: '900', color: Colors.slate[900] },
  payStatus: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: Radius.full },
  payStatusText: { fontSize: 10, fontWeight: '800' },

  receiptBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, backgroundColor: Colors.brand[50], borderRadius: Radius.xl, paddingVertical: 8, borderWidth: 1, borderColor: Colors.brand[100] },
  receiptBtnText: { fontSize: FontSize.xs, fontWeight: '700', color: Colors.brand[700] },

  empty: { alignItems: 'center', paddingVertical: 60, paddingHorizontal: 32 },
  emptyTitle: { fontSize: FontSize.xl, fontWeight: '800', color: Colors.slate[900], marginBottom: 8 },
  emptySubText: { fontSize: FontSize.sm, color: Colors.slate[400], textAlign: 'center', lineHeight: 20 },
});
