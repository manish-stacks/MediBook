// app/index.tsx
import { useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuthStore } from '../src/store/auth.store';
import { Colors } from '../src/constants/theme';

const { width } = Dimensions.get('window');

export default function SplashScreen() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuthStore();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isAuthenticated) {
        router.replace('/(auth)/welcome');
      } else if (user?.role === 'DOCTOR') {
        router.replace('/(doctor)');
      } else {
        router.replace('/(patient)');
      }
    }, 1800);
    return () => clearTimeout(timer);
  }, [isAuthenticated, user]);

  return (
    <LinearGradient colors={['#0f172a', '#1e293b', '#0f172a']} style={styles.container}>
      {/* Glow blobs */}
      <View style={[styles.blob, { backgroundColor: '#1e6fe830', top: -100, left: -100 }]} />
      <View style={[styles.blob, { backgroundColor: '#02c9b320', bottom: -80, right: -80, width: 300, height: 300 }]} />

      {/* Logo area */}
      <View style={styles.logoArea}>
        <View style={styles.logoRing}>
          <LinearGradient colors={['#1e6fe8', '#02c9b3']} style={styles.logoInner} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
            <Text style={styles.logoEmoji}>🏥</Text>
          </LinearGradient>
        </View>
        <Text style={styles.appName}>MediBook</Text>
        <Text style={styles.tagline}>Your Health, Our Priority</Text>
      </View>

      {/* Dots loader */}
      <View style={styles.dots}>
        {[0, 1, 2].map(i => (
          <View key={i} style={[styles.dot, { opacity: 0.4 + i * 0.2 }]} />
        ))}
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  blob: { position: 'absolute', width: 350, height: 350, borderRadius: 175, opacity: 1 },
  logoArea: { alignItems: 'center' },
  logoRing: {
    width: 100, height: 100, borderRadius: 28,
    borderWidth: 1.5, borderColor: 'rgba(30,111,232,0.4)',
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 20,
  },
  logoInner: { width: 80, height: 80, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  logoEmoji: { fontSize: 38 },
  appName: { fontSize: 38, fontWeight: '900', color: Colors.white, letterSpacing: -1, marginBottom: 8 },
  tagline: { fontSize: 14, color: 'rgba(255,255,255,0.5)', fontWeight: '500' },
  dots:   { flexDirection: 'row', gap: 6, position: 'absolute', bottom: 60 },
  dot:    { width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.brand[400] },
});
