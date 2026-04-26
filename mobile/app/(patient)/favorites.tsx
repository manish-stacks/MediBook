// app/(patient)/favorites.tsx
import { View, Text, StyleSheet, FlatList, TouchableOpacity, RefreshControl, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';
import { favoritesApi } from '../../src/api/endpoints';
import { Colors, FontSize, Radius, Shadow } from '../../src/constants/theme';
import { formatCurrency } from '../../src/constants/utils';
import Avatar from '../../src/components/ui/Avatar';
import Card from '../../src/components/ui/Card';
import LoadingSpinner from '../../src/components/ui/LoadingSpinner';

export default function FavoritesScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const qc = useQueryClient();

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['favorites'],
    queryFn: () => favoritesApi.list().then(r => r.data.data),
  });

  const removeMutation = useMutation({
    mutationFn: (doctorId: string) => favoritesApi.toggle(doctorId),
    onSuccess: () => { Toast.show({ type: 'success', text1: 'Removed from favorites' }); qc.invalidateQueries({ queryKey: ['favorites'] }); },
  });

  const handleRemove = (doctorId: string, name: string) => {
    Alert.alert('Remove Favorite', `Remove Dr. ${name} from favorites?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Remove', style: 'destructive', onPress: () => removeMutation.mutate(doctorId) },
    ]);
  };

  const favorites = data || [];

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={22} color={Colors.slate[700]} />
        </TouchableOpacity>
        <View>
          <Text style={styles.headerTitle}>Favorite Doctors</Text>
          <Text style={styles.headerSub}>{favorites.length} saved doctors</Text>
        </View>
      </View>

      {isLoading ? <LoadingSpinner label="Loading favorites..." /> : (
        <FlatList
          data={favorites}
          keyExtractor={f => f.id}
          contentContainerStyle={{ padding: 14, gap: 12, paddingBottom: 60 }}
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={isLoading} onRefresh={refetch} />}
          renderItem={({ item: fav }) => {
            const doc = fav.doctor;
            const clinic = doc?.clinics?.[0]?.clinic;
            return (
              <Card elevated style={styles.favCard}>
                <View style={styles.favRow}>
                  <TouchableOpacity onPress={() => router.push(`/(patient)/doctor-detail?id=${doc.id}`)} style={{ flex: 1, flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                    <Avatar uri={doc?.user?.avatar} name={`${doc?.user?.firstName} ${doc?.user?.lastName}`} size={56} />
                    <View style={{ flex: 1 }}>
                      <Text style={styles.docName}>Dr. {doc?.user?.firstName} {doc?.user?.lastName}</Text>
                      <Text style={styles.docSpec}>{doc?.speciality?.name}</Text>
                      <View style={styles.metaRow}>
                        <Ionicons name="star" size={12} color="#f59e0b" />
                        <Text style={styles.rating}>{Number(doc?.rating).toFixed(1)}</Text>
                        <Text style={styles.dot}>·</Text>
                        <Text style={styles.exp}>{doc?.experience} yrs exp</Text>
                      </View>
                      {clinic && (
                        <View style={styles.clinicRow}>
                          <Ionicons name="location-outline" size={12} color={Colors.teal[500]} />
                          <Text style={styles.clinicText} numberOfLines={1}>{clinic.name}, {clinic.city}</Text>
                        </View>
                      )}
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleRemove(doc.id, `${doc?.user?.firstName} ${doc?.user?.lastName}`)} style={styles.removeBtn}>
                    <Ionicons name="heart-dislike-outline" size={18} color={Colors.rose[500]} />
                  </TouchableOpacity>
                </View>

                <View style={styles.cardActions}>
                  <Text style={styles.fee}>{formatCurrency(Number(doc?.consultationFee))}</Text>
                  <TouchableOpacity onPress={() => router.push(`/(patient)/doctor-detail?id=${doc.id}`)} style={styles.bookBtn}>
                    <Ionicons name="calendar-outline" size={15} color={Colors.white} />
                    <Text style={styles.bookBtnText}>Book Now</Text>
                  </TouchableOpacity>
                </View>
              </Card>
            );
          }}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Text style={{ fontSize: 64, marginBottom: 16 }}>❤️</Text>
              <Text style={styles.emptyTitle}>No favorites yet</Text>
              <Text style={styles.emptySubText}>Tap the heart icon on any doctor's profile to save them here</Text>
              <TouchableOpacity onPress={() => router.push('/(patient)/doctors')} style={styles.browseBtn}>
                <Text style={styles.browseBtnText}>Browse Doctors</Text>
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
  header: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 16, paddingVertical: 16, backgroundColor: Colors.white, borderBottomWidth: 1, borderBottomColor: Colors.slate[100] },
  backBtn: { width: 40, height: 40, borderRadius: 12, backgroundColor: Colors.slate[100], alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: FontSize['2xl'], fontWeight: '900', color: Colors.slate[900] },
  headerSub: { fontSize: FontSize.xs, color: Colors.slate[500], marginTop: 1 },

  favCard: { gap: 12 },
  favRow: { flexDirection: 'row', alignItems: 'center' },
  docName: { fontSize: FontSize.base, fontWeight: '800', color: Colors.slate[900] },
  docSpec: { fontSize: FontSize.xs, color: Colors.brand[600], fontWeight: '700', marginTop: 2 },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 4 },
  rating: { fontSize: FontSize.xs, fontWeight: '700', color: Colors.slate[800] },
  dot: { color: Colors.slate[300] },
  exp: { fontSize: FontSize.xs, color: Colors.slate[500] },
  clinicRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 },
  clinicText: { fontSize: FontSize.xs, color: Colors.slate[500], flex: 1 },
  removeBtn: { width: 38, height: 38, borderRadius: 12, backgroundColor: Colors.rose[50], alignItems: 'center', justifyContent: 'center' },

  cardActions: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: 10, borderTopWidth: 1, borderTopColor: Colors.slate[50] },
  fee: { fontSize: FontSize.xl, fontWeight: '900', color: Colors.slate[900] },
  bookBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: Colors.brand[600], paddingHorizontal: 16, paddingVertical: 9, borderRadius: Radius.xl, ...Shadow.brand },
  bookBtnText: { fontSize: FontSize.xs, fontWeight: '800', color: Colors.white },

  empty: { alignItems: 'center', paddingVertical: 60, paddingHorizontal: 32 },
  emptyTitle: { fontSize: FontSize['2xl'], fontWeight: '900', color: Colors.slate[900], marginBottom: 8 },
  emptySubText: { fontSize: FontSize.sm, color: Colors.slate[400], textAlign: 'center', lineHeight: 20, marginBottom: 20 },
  browseBtn: { backgroundColor: Colors.brand[600], paddingHorizontal: 24, paddingVertical: 12, borderRadius: Radius.xl },
  browseBtnText: { color: Colors.white, fontWeight: '700' },
});
