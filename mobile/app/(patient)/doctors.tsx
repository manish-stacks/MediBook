// app/(patient)/doctors.tsx
import { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, RefreshControl } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { doctorsApi, specialitiesApi } from '../../src/api/endpoints';
import { Colors, FontSize, Radius, Shadow } from '../../src/constants/theme';
import { formatCurrency } from '../../src/constants/utils';
import Avatar from '../../src/components/ui/Avatar';
import Card from '../../src/components/ui/Card';
import LoadingSpinner from '../../src/components/ui/LoadingSpinner';

export default function DoctorsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams() || {};
  const [search, setSearch] = useState('');
  const [selectedSpec, setSelectedSpec] = useState(params.specialityId as string || '');
  const [sortBy, setSortBy] = useState('rating');

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['doctors-list', search, selectedSpec, sortBy],
    queryFn: () => doctorsApi.list({ search: search || undefined, specialityId: selectedSpec || undefined, sortBy, sortOrder: 'desc', limit: 20 }).then(r => r.data.data),
  });

  const { data: specsData } = useQuery({ queryKey: ['specialities'], queryFn: () => specialitiesApi.list().then(r => r.data.data) });

  const doctors = data?.doctors || [];
  const specs = specsData || [];

  const DoctorCard = ({ item }: { item: any }) => (
    <TouchableOpacity onPress={() => router.push(`/(patient)/doctor-detail?id=${item.id}`)} activeOpacity={0.85}>
      <Card style={styles.docCard} elevated>
        {/* Top */}
        <View style={styles.docTop}>
          <Avatar uri={item.user?.avatar} name={`${item.user?.firstName} ${item.user?.lastName}`} size={64} />
          <View style={{ flex: 1 }}>
            <View style={styles.nameRow}>
              <Text style={styles.docName} numberOfLines={1}>Dr. {item.user?.firstName} {item.user?.lastName}</Text>
              {item.isVerified && <Ionicons name="checkmark-circle" size={16} color={Colors.green[500]} />}
            </View>
            <Text style={styles.docSpec}>{item.speciality?.name}</Text>
            <View style={styles.metaRow}>
              <View style={styles.ratingBadge}>
                <Ionicons name="star" size={11} color="#f59e0b" />
                <Text style={styles.ratingText}>{Number(item.rating).toFixed(1)}</Text>
              </View>
              <Text style={styles.metaDivider}>•</Text>
              <Text style={styles.metaText}>{item.experience} yrs exp</Text>
              <Text style={styles.metaDivider}>•</Text>
              <Text style={styles.metaText}>{item.totalReviews} reviews</Text>
            </View>
          </View>
        </View>

        {/* Bottom */}
        <View style={styles.docBottom}>
          {item.clinics?.[0]?.clinic && (
            <View style={styles.clinicRow}>
              <Ionicons name="location-outline" size={13} color={Colors.teal[500]} />
              <Text style={styles.clinicText} numberOfLines={1}>{item.clinics[0].clinic.name}, {item.clinics[0].clinic.city}</Text>
            </View>
          )}
          <View style={styles.feeRow}>
            <View>
              <Text style={styles.feeLabel}>Consultation Fee</Text>
              <Text style={styles.fee}>{formatCurrency(Number(item.consultationFee))}</Text>
            </View>
            <LinearGradient colors={['#1e6fe8', '#02c9b3']} style={styles.bookBtn} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
              <Text style={styles.bookBtnText}>Book Now</Text>
            </LinearGradient>
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Find Doctors</Text>
        <Text style={styles.headerSub}>{data?.pagination?.total || doctors.length} verified doctors</Text>

        {/* Search */}
        <View style={styles.searchBar}>
          <Ionicons name="search" size={18} color={Colors.slate[400]} />
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Search doctors, specialities..."
            placeholderTextColor={Colors.slate[400]}
            style={styles.searchInput}
          />
          {search ? (
            <TouchableOpacity onPress={() => setSearch('')}><Ionicons name="close-circle" size={18} color={Colors.slate[400]} /></TouchableOpacity>
          ) : null}
        </View>

        {/* Speciality chips */}
        <FlatList
          data={[{ id: '', name: 'All', icon: '🏥', slug: 'all', _count: { doctors: 0 } }, ...specs]}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={i => i.id}
          contentContainerStyle={{ gap: 8, paddingRight: 4, marginTop: 12 }}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => setSelectedSpec(item.id)}
              style={[styles.chip, selectedSpec === item.id && styles.chipActive]}
              activeOpacity={0.75}
            >
              <Text style={{ fontSize: 14 }}>{item.icon || '🏥'}</Text>
              <Text style={[styles.chipText, selectedSpec === item.id && styles.chipTextActive]}>{item.name}</Text>
            </TouchableOpacity>
          )}
        />
      </View>

      {/* Sort row */}
      <View style={styles.sortRow}>
        <Text style={styles.sortLabel}>Sort by:</Text>
        {[{ v: 'rating', l: '⭐ Rating' }, { v: 'fee', l: '💰 Fee' }, { v: 'experience', l: '🏆 Exp' }].map(opt => (
          <TouchableOpacity key={opt.v} onPress={() => setSortBy(opt.v)} style={[styles.sortBtn, sortBy === opt.v && styles.sortBtnActive]}>
            <Text style={[styles.sortBtnText, sortBy === opt.v && styles.sortBtnTextActive]}>{opt.l}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* List */}
      {isLoading ? (
        <LoadingSpinner label="Finding doctors..." />
      ) : (
        <FlatList
          data={doctors}
          keyExtractor={d => d.id}
          renderItem={({ item }) => <DoctorCard item={item} />}
          contentContainerStyle={{ padding: 16, gap: 12, paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={isLoading} onRefresh={refetch} />}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Text style={{ fontSize: 48, marginBottom: 12 }}>🔍</Text>
              <Text style={styles.emptyText}>No doctors found</Text>
              <Text style={styles.emptySubText}>Try adjusting your search or filters</Text>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.slate[50] },
  header:    { backgroundColor: Colors.white, paddingHorizontal: 16, paddingBottom: 16, paddingTop: 16, borderBottomWidth: 1, borderBottomColor: Colors.slate[100] },
  headerTitle:{ fontSize: FontSize['3xl'], fontWeight: '900', color: Colors.slate[900], letterSpacing: -0.5 },
  headerSub: { fontSize: FontSize.sm, color: Colors.slate[500], marginTop: 2, marginBottom: 14 },
  searchBar: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: Colors.slate[50], borderRadius: Radius.xl, paddingHorizontal: 14, paddingVertical: 12, borderWidth: 1.5, borderColor: Colors.slate[200] },
  searchInput:{ flex: 1, fontSize: FontSize.base, color: Colors.slate[900] },
  chip:      { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 12, paddingVertical: 7, borderRadius: Radius.full, backgroundColor: Colors.slate[100], borderWidth: 1.5, borderColor: Colors.slate[200] },
  chipActive:{ backgroundColor: Colors.brand[600], borderColor: Colors.brand[600] },
  chipText:  { fontSize: FontSize.xs, fontWeight: '700', color: Colors.slate[600] },
  chipTextActive:{ color: Colors.white },

  sortRow:   { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 16, paddingVertical: 10, backgroundColor: Colors.white, borderBottomWidth: 1, borderBottomColor: Colors.slate[100] },
  sortLabel: { fontSize: FontSize.xs, color: Colors.slate[400], fontWeight: '600', marginRight: 4 },
  sortBtn:   { paddingHorizontal: 10, paddingVertical: 5, borderRadius: Radius.full, backgroundColor: Colors.slate[100] },
  sortBtnActive:{ backgroundColor: Colors.brand[50] },
  sortBtnText:  { fontSize: FontSize.xs, fontWeight: '600', color: Colors.slate[600] },
  sortBtnTextActive:{ color: Colors.brand[700] },

  docCard:   { padding: 14, gap: 12 },
  docTop:    { flexDirection: 'row', gap: 12 },
  nameRow:   { flexDirection: 'row', alignItems: 'center', gap: 5, marginBottom: 2 },
  docName:   { fontSize: FontSize.md, fontWeight: '800', color: Colors.slate[900], flex: 1 },
  docSpec:   { fontSize: FontSize.xs, color: Colors.brand[600], fontWeight: '600', marginBottom: 6 },
  metaRow:   { flexDirection: 'row', alignItems: 'center', gap: 5, flexWrap: 'wrap' },
  ratingBadge:{ flexDirection: 'row', alignItems: 'center', gap: 3, backgroundColor: '#fffbeb', paddingHorizontal: 7, paddingVertical: 3, borderRadius: Radius.full },
  ratingText:{ fontSize: 11, fontWeight: '700', color: '#b45309' },
  metaDivider:{ color: Colors.slate[300], fontSize: 12 },
  metaText:  { fontSize: 11, color: Colors.slate[500], fontWeight: '500' },
  docBottom: { gap: 10 },
  clinicRow: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  clinicText:{ fontSize: FontSize.xs, color: Colors.slate[500], flex: 1 },
  feeRow:    { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  feeLabel:  { fontSize: 10, color: Colors.slate[400], fontWeight: '500' },
  fee:       { fontSize: FontSize.xl, fontWeight: '900', color: Colors.slate[900] },
  bookBtn:   { paddingHorizontal: 20, paddingVertical: 10, borderRadius: Radius.xl, ...Shadow.brand },
  bookBtnText:{ fontSize: FontSize.sm, fontWeight: '800', color: Colors.white },
  empty:     { alignItems: 'center', paddingVertical: 60 },
  emptyText: { fontSize: FontSize.xl, fontWeight: '800', color: Colors.slate[900], marginBottom: 6 },
  emptySubText:{ fontSize: FontSize.sm, color: Colors.slate[500] },
});
