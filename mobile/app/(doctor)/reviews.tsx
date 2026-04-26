// app/(doctor)/reviews.tsx
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import api from '../../src/api/client';
import { Colors, FontSize, Radius, Shadow } from '../../src/constants/theme';
import { formatDate } from '../../src/constants/utils';
import Avatar from '../../src/components/ui/Avatar';
import LoadingSpinner from '../../src/components/ui/LoadingSpinner';

function StarRow({ rating }: { rating: number }) {
  return (
    <View style={styles.starRow}>
      {[1, 2, 3, 4, 5].map(i => (
        <Ionicons key={i} name={i <= rating ? 'star' : 'star-outline'} size={13} color={i <= rating ? '#f59e0b' : Colors.slate[300]} />
      ))}
    </View>
  );
}

export default function DoctorReviewsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const { data, isLoading } = useQuery({
    queryKey: ['doctor-reviews'],
    queryFn: () => api.get('/doctors/me/reviews').then(r => r.data.data),
  });

  const reviews = data?.reviews || [];
  const avgRating = data?.avgRating || 0;
  const total = data?.total || 0;

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={22} color={Colors.slate[700]} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Reviews</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Rating summary */}
      <View style={styles.ratingSummary}>
        <Text style={styles.avgRating}>{Number(avgRating).toFixed(1)}</Text>
        <StarRow rating={Math.round(Number(avgRating))} />
        <Text style={styles.totalReviews}>{total} total reviews</Text>
      </View>

      {isLoading ? <LoadingSpinner /> : (
        <FlatList
          data={reviews}
          keyExtractor={r => r.id}
          contentContainerStyle={{ padding: 14, gap: 12, paddingBottom: 40 }}
          showsVerticalScrollIndicator={false}
          renderItem={({ item: review }) => (
            <View style={styles.reviewCard}>
              <View style={styles.reviewHeader}>
                <Avatar name={`${review.patient?.firstName} ${review.patient?.lastName}`} size={40} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.reviewerName}>{review.patient?.firstName} {review.patient?.lastName}</Text>
                  <Text style={styles.reviewDate}>{formatDate(review.createdAt)}</Text>
                </View>
                <StarRow rating={review.rating} />
              </View>
              {review.comment && <Text style={styles.reviewComment}>"{review.comment}"</Text>}
            </View>
          )}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Text style={{ fontSize: 56, marginBottom: 16 }}>⭐</Text>
              <Text style={styles.emptyTitle}>No reviews yet</Text>
              <Text style={styles.emptySub}>Reviews will appear after patients rate your consultations</Text>
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
  backBtn: { width: 40, height: 40, borderRadius: 12, backgroundColor: Colors.slate[100], alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: FontSize['2xl'], fontWeight: '900', color: Colors.slate[900] },
  ratingSummary: { backgroundColor: Colors.white, alignItems: 'center', padding: 24, gap: 6, borderBottomWidth: 1, borderBottomColor: Colors.slate[100] },
  avgRating: { fontSize: 56, fontWeight: '900', color: Colors.slate[900] },
  starRow: { flexDirection: 'row', gap: 4 },
  totalReviews: { fontSize: FontSize.sm, color: Colors.slate[400], fontWeight: '500' },
  reviewCard: { backgroundColor: Colors.white, borderRadius: Radius['2xl'], padding: 14, gap: 10, ...Shadow.sm, borderWidth: 1, borderColor: Colors.slate[100] },
  reviewHeader: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  reviewerName: { fontSize: FontSize.sm, fontWeight: '700', color: Colors.slate[900] },
  reviewDate: { fontSize: FontSize.xs, color: Colors.slate[400], marginTop: 1 },
  reviewComment: { fontSize: FontSize.sm, color: Colors.slate[600], lineHeight: 20, fontStyle: 'italic', paddingLeft: 4 },
  empty: { alignItems: 'center', paddingVertical: 60, paddingHorizontal: 32 },
  emptyTitle: { fontSize: FontSize.xl, fontWeight: '800', color: Colors.slate[900], marginBottom: 8 },
  emptySub: { fontSize: FontSize.sm, color: Colors.slate[400], textAlign: 'center', lineHeight: 20 },
});
