// app/(doctor)/profile.tsx
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Toast from 'react-native-toast-message';
import { useAuthStore } from '../../src/store/auth.store';
import { Colors, FontSize, Radius, Shadow } from '../../src/constants/theme';
import Avatar from '../../src/components/ui/Avatar';

const MENU_ITEMS = [
  { group: 'Practice', items: [
    { icon: '🗓️', label: 'Manage Slots', route: '/(doctor)/slots', color: Colors.teal[600] },
    { icon: '💰', label: 'Earnings', route: '/(doctor)/earnings', color: Colors.green[600] },
    { icon: '⭐', label: 'Reviews', route: '/(doctor)/reviews', color: Colors.amber[600] },
  ]},
  { group: 'Account', items: [
    { icon: '✏️', label: 'Edit Profile', route: '/(doctor)/edit-profile', color: Colors.brand[600] },
    { icon: '🔒', label: 'Change Password', route: '/(doctor)/change-password', color: Colors.slate[600] },
    { icon: '🔔', label: 'Notifications', route: '/(doctor)/notifications', color: Colors.violet[600] },
  ]},
];

export default function DoctorProfileScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    Alert.alert('Sign Out', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign Out', style: 'destructive', onPress: async () => {
        await logout();
        router.replace('/(auth)/welcome');
      }},
    ]);
  };

  return (
    <ScrollView style={[styles.container, { paddingTop: insets.top }]} showsVerticalScrollIndicator={false}>
      {/* Profile Header */}
      <LinearGradient colors={['#0f172a', '#0d4f4f', '#02c9b3']} style={styles.headerGradient}>
        <View style={styles.profileArea}>
          <View style={styles.avatarRing}>
            <Avatar uri={user?.avatar} name={`${user?.firstName} ${user?.lastName}`} size={80} />
          </View>
          <View style={styles.verifiedBadge}>
            <Ionicons name="checkmark-circle" size={18} color={Colors.teal[400]} />
            <Text style={styles.verifiedText}>Verified Doctor</Text>
          </View>
          <Text style={styles.userName}>Dr. {user?.firstName} {user?.lastName}</Text>
          <Text style={styles.userEmail}>{user?.email}</Text>
        </View>

        {/* Quick stats */}
        <View style={styles.statsBar}>
          {[
            { l: 'Rating', v: '—', icon: '⭐' },
            { l: 'Patients', v: '—', icon: '👥' },
            { l: 'Completed', v: '—', icon: '✅' },
          ].map(s => (
            <View key={s.l} style={styles.statItem}>
              <Text style={styles.statIcon}>{s.icon}</Text>
              <Text style={styles.statValue}>{s.v}</Text>
              <Text style={styles.statLabel}>{s.l}</Text>
            </View>
          ))}
        </View>
      </LinearGradient>

      <View style={styles.menuContainer}>
        {MENU_ITEMS.map(group => (
          <View key={group.group} style={styles.menuGroup}>
            <Text style={styles.groupTitle}>{group.group}</Text>
            <View style={styles.menuCard}>
              {group.items.map((item, idx) => (
                <TouchableOpacity
                  key={item.label}
                  style={[styles.menuItem, idx < group.items.length - 1 && styles.menuItemBorder]}
                  onPress={() => router.push(item.route as any)}
                  activeOpacity={0.7}
                >
                  <View style={[styles.menuIcon, { backgroundColor: item.color + '18' }]}>
                    <Text style={{ fontSize: 18 }}>{item.icon}</Text>
                  </View>
                  <Text style={styles.menuLabel}>{item.label}</Text>
                  <Ionicons name="chevron-forward" size={16} color={Colors.slate[300]} />
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}

        <TouchableOpacity onPress={handleLogout} style={styles.logoutBtn}>
          <Ionicons name="log-out-outline" size={20} color={Colors.red[600]} />
          <Text style={styles.logoutText}>Sign Out</Text>
        </TouchableOpacity>

        <Text style={styles.versionText}>MediBook v1.0.0 · Doctor Portal</Text>
        <View style={{ height: 100 }} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.slate[50] },
  headerGradient: { paddingBottom: 24 },
  profileArea: { alignItems: 'center', paddingTop: 24, paddingBottom: 20 },
  avatarRing: { borderWidth: 3, borderColor: 'rgba(2,201,179,0.3)', borderRadius: 32, padding: 3, marginBottom: 10 },
  verifiedBadge: { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: 'rgba(2,201,179,0.15)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: Radius.full, marginBottom: 10 },
  verifiedText: { fontSize: FontSize.xs, color: Colors.teal[400], fontWeight: '700' },
  userName:  { fontSize: FontSize['3xl'], fontWeight: '900', color: Colors.white, letterSpacing: -0.3, marginBottom: 4 },
  userEmail: { fontSize: FontSize.sm, color: 'rgba(255,255,255,0.5)' },
  statsBar:  { flexDirection: 'row', borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.1)', paddingTop: 16, paddingHorizontal: 20 },
  statItem:  { flex: 1, alignItems: 'center', gap: 4 },
  statIcon:  { fontSize: 22 },
  statValue: { fontSize: FontSize['2xl'], fontWeight: '900', color: Colors.white },
  statLabel: { fontSize: 10, color: 'rgba(255,255,255,0.4)', fontWeight: '600' },

  menuContainer: { padding: 16, gap: 4 },
  menuGroup: { marginBottom: 16 },
  groupTitle:{ fontSize: FontSize.xs, fontWeight: '700', color: Colors.slate[400], textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 8, marginLeft: 4 },
  menuCard:  { backgroundColor: Colors.white, borderRadius: Radius['2xl'], overflow: 'hidden', ...Shadow.sm, borderWidth: 1, borderColor: Colors.slate[100] },
  menuItem:  { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 16 },
  menuItemBorder: { borderBottomWidth: 1, borderBottomColor: Colors.slate[50] },
  menuIcon:  { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  menuLabel: { flex: 1, fontSize: FontSize.base, fontWeight: '600', color: Colors.slate[800] },

  logoutBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: Colors.red[50], borderWidth: 1.5, borderColor: Colors.red[200], borderRadius: Radius['2xl'], padding: 16, marginTop: 8, marginBottom: 16 },
  logoutText:{ fontSize: FontSize.base, fontWeight: '700', color: Colors.red[600] },
  versionText:{ textAlign: 'center', fontSize: FontSize.xs, color: Colors.slate[400] },
});
