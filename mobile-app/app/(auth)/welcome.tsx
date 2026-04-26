// app/(auth)/welcome.tsx
import { View, Text, StyleSheet, Dimensions, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, FontSize, Radius, Shadow } from '../../src/constants/theme';
import Button from '../../src/components/ui/Button';

const { width, height } = Dimensions.get('window');

const FEATURES = [
  { icon: '🔍', title: 'Find Doctors', desc: 'Search by speciality, rating, and location' },
  { icon: '📅', title: 'Book Instantly', desc: 'Real-time slot availability and confirmation' },
  // { icon: '💊', title: 'Digital Rx', desc: 'Prescriptions delivered right to your phone' },
  // { icon: '👨‍👩‍👧', title: 'Family Care', desc: 'Manage appointments for your whole family' },
];

export default function WelcomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
      <View style={[styles.container, { paddingBottom: insets.bottom }]}>
        {/* Hero */}
        <LinearGradient colors={['#0f172a', '#1e3a5f', '#0f172a']} style={styles.hero} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
          {/* Grid overlay */}
          <View style={styles.gridOverlay} pointerEvents="none" />

          {/* Glow blobs */}
          <View style={[styles.blob, { top: -40, right: -60, backgroundColor: '#1e6fe825' }]} />
          <View style={[styles.blob, { bottom: -40, left: -60, backgroundColor: '#02c9b320', width: 250, height: 250, borderRadius: 125 }]} />

          {/* Logo */}
          <View style={styles.logoRow}>
            <LinearGradient colors={['#1e6fe8', '#02c9b3']} style={styles.logoBox} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
              <Text style={{ fontSize: 26 }}>🏥</Text>
            </LinearGradient>
            <Text style={styles.logoText}>MediBook</Text>
          </View>

          {/* Headline */}
          <Text style={styles.headline}>Healthcare</Text>
          <Text style={styles.subtext}>Book doctors, manage prescriptions,{'\n'}and track your family's health.</Text>

          {/* Floating card mock */}
          <View style={styles.floatingCard}>
            <View style={styles.docRow}>
              <LinearGradient colors={['#1e6fe8', '#02c9b3']} style={styles.docAvatar}>
                <Text style={{ fontSize: 22 }}>👨‍⚕️</Text>
              </LinearGradient>
              <View style={{ flex: 1 }}>
                <Text style={styles.docName}>Dr. Arjun Mehta</Text>
                <Text style={styles.docSpec}>Cardiologist · ⭐ 4.9</Text>
              </View>
              <Text style={styles.docFee}>₹800</Text>
            </View>
            <View style={styles.slotsRow}>
              {['10:00 AM', '11:30 AM', '2:00 PM'].map((t, i) => (
                <View key={t} style={[styles.slotPill, i === 1 && styles.slotPillActive]}>
                  <Text style={[styles.slotText, i === 1 && styles.slotTextActive]}>{t}</Text>
                </View>
              ))}
            </View>
          </View>
        </LinearGradient>

        {/* Bottom section */}
        <View style={styles.bottom}>
          {/* Features grid */}
          <View style={styles.featuresGrid}>
            {FEATURES.map(f => (
              <View key={f.title} style={styles.featureItem}>
                <Text style={styles.featureIcon}>{f.icon}</Text>
                <Text style={styles.featureTitle}>{f.title}</Text>
                <Text style={styles.featureDesc}>{f.desc}</Text>
              </View>
            ))}
          </View>

          {/* Stats */}
          <View style={styles.statsRow}>
            {[{ v: '50K+', l: 'Patients' }, { v: '2K+', l: 'Doctors' }, { v: '99%', l: 'Satisfaction' }].map(s => (
              <View key={s.l} style={styles.stat}>
                <Text style={styles.statValue}>{s.v}</Text>
                <Text style={styles.statLabel}>{s.l}</Text>
              </View>
            ))}
          </View>

          {/* CTAs */}
          <View style={styles.ctas}>
            <Button title="Get Started" onPress={() => router.push('/(auth)/register')} fullWidth size="lg" />
            <Button title="Sign In" onPress={() => router.push('/(auth)/login')} variant="secondary" fullWidth size="lg" style={{ marginTop: 10 }} />
          </View>

          <Text style={styles.demoHint}>Demo: user@demo.com / User@123</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.white },
  hero: { height: height * 0.45, padding: 24, paddingTop: 56, overflow: 'hidden' },
  gridOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.06,
  },
  blob: { position: 'absolute', width: 280, height: 280, borderRadius: 140 },
  logoRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 24 },
  logoBox: { width: 44, height: 44, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  logoText: { fontSize: FontSize['3xl'], fontWeight: '900', color: Colors.white, letterSpacing: -0.5 },
  headline: { fontSize: 38, fontWeight: '900', color: Colors.white, lineHeight: 44, letterSpacing: -1, marginBottom: 10 },
  subtext: { fontSize: FontSize.base, color: 'rgba(255,255,255,0.55)', lineHeight: 22 },
  floatingCard: {
    position: 'absolute', bottom: 20, right: 20, left: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.15)',
    borderRadius: Radius['2xl'], padding: 14,
  },
  docRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10 },
  docAvatar: { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  docName: { fontSize: FontSize.base, fontWeight: '700', color: Colors.white },
  docSpec: { fontSize: FontSize.xs, color: 'rgba(255,255,255,0.6)' },
  docFee: { fontSize: FontSize.lg, fontWeight: '800', color: Colors.white },
  slotsRow: { flexDirection: 'row', gap: 6 },
  slotPill: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: Radius.full, backgroundColor: 'rgba(255,255,255,0.1)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)' },
  slotPillActive: { backgroundColor: Colors.brand[600], borderColor: Colors.brand[600] },
  slotText: { fontSize: FontSize.xs, color: 'rgba(255,255,255,0.6)', fontWeight: '600' },
  slotTextActive: { color: Colors.white },

  bottom: { flex: 1, padding: 20, paddingTop: 16 },
  featuresGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 16 },
  featureItem: { width: (width - 60) / 2, backgroundColor: Colors.slate[50], borderRadius: Radius.lg, padding: 12 },
  featureIcon: { fontSize: 22, marginBottom: 4 },
  featureTitle: { fontSize: FontSize.sm, fontWeight: '700', color: Colors.slate[900], marginBottom: 2 },
  featureDesc: { fontSize: FontSize.xs, color: Colors.slate[500], lineHeight: 16 },

  statsRow: { flexDirection: 'row', justifyContent: 'space-around', paddingVertical: 12, borderTopWidth: 1, borderBottomWidth: 1, borderColor: Colors.slate[100], marginBottom: 16 },
  stat: { alignItems: 'center' },
  statValue: { fontSize: FontSize['2xl'], fontWeight: '900', color: Colors.brand[600] },
  statLabel: { fontSize: FontSize.xs, color: Colors.slate[500], fontWeight: '600' },

  ctas: { gap: 0 },
  demoHint: { textAlign: 'center', fontSize: FontSize.xs, color: Colors.slate[400], marginTop: 12 },
});
