// app/(auth)/login.tsx
import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import { useAuthStore } from '../../src/store/auth.store';
import { Colors, FontSize, Radius, Shadow } from '../../src/constants/theme';
import Input from '../../src/components/ui/Input';
import Button from '../../src/components/ui/Button';
import { Ionicons } from '@expo/vector-icons';

const DEMO_ACCOUNTS = [
  { role: 'Patient', email: 'user@demo.com', pass: 'User@123', color: Colors.brand[600], icon: '👤' },
  { role: 'Doctor',  email: 'doctor@demo.com', pass: 'Doctor@123', color: Colors.teal[600], icon: '👨‍⚕️' },
];

export default function LoginScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { login, isLoading } = useAuthStore();
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Toast.show({ type: 'error', text1: 'Missing Fields', text2: 'Please enter email and password.' });
      return;
    }
    try {
      const user = await login(email.trim(), password);
      Toast.show({ type: 'success', text1: `Welcome back, ${user.firstName}! 👋` });
      if (user.role === 'DOCTOR') router.replace('/(doctor)');
      else router.replace('/(patient)');
    } catch (e: any) {
      Toast.show({ type: 'error', text1: 'Login Failed', text2: e.message });
    }
  };

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom }]}>
      {/* Header */}
      <LinearGradient colors={['#0f172a', '#1e3a5f']} style={[styles.header, { paddingTop: insets.top + 20 }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color={Colors.white} />
        </TouchableOpacity>
        <LinearGradient colors={['#1e6fe8', '#02c9b3']} style={styles.logoBox}>
          <Text style={{ fontSize: 28 }}>🏥</Text>
        </LinearGradient>
        <Text style={styles.headerTitle}>Welcome Back</Text>
        <Text style={styles.headerSub}>Sign in to your MediBook account</Text>
      </LinearGradient>

      <ScrollView style={styles.body} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <View style={styles.form}>
          <Input
            label="Email Address"
            placeholder="you@example.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            leftIcon="mail-outline"
          />
          <Input
            label="Password"
            placeholder="••••••••"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            leftIcon="lock-closed-outline"
          />

          <TouchableOpacity style={styles.forgotBtn}>
            <Text style={styles.forgotText}>Forgot Password?</Text>
          </TouchableOpacity>

          <Button title="Sign In" onPress={handleLogin} loading={isLoading} fullWidth size="lg" style={{ marginTop: 8 }} />

          <TouchableOpacity onPress={() => router.push('/(auth)/register')} style={styles.registerLink}>
            <Text style={styles.registerText}>
              Don't have an account?{' '}
              <Text style={{ color: Colors.brand[600], fontWeight: '700' }}>Create one</Text>
            </Text>
          </TouchableOpacity>
        </View>

        {/* Demo accounts */}
        <View style={styles.demoSection}>
          <View style={styles.demoHeader}>
            <View style={styles.demoLine} />
            <Text style={styles.demoLabel}>Quick Demo Login</Text>
            <View style={styles.demoLine} />
          </View>
          {DEMO_ACCOUNTS.map(acc => (
            <TouchableOpacity
              key={acc.role}
              style={styles.demoCard}
              onPress={() => { setEmail(acc.email); setPassword(acc.pass); }}
              activeOpacity={0.75}
            >
              <View style={[styles.demoIcon, { backgroundColor: acc.color + '20' }]}>
                <Text style={{ fontSize: 22 }}>{acc.icon}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.demoRole}>{acc.role}</Text>
                <Text style={styles.demoEmail}>{acc.email}</Text>
              </View>
              <View style={[styles.demoBadge, { backgroundColor: acc.color }]}>
                <Text style={styles.demoBadgeText}>Tap to Fill</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.white },
  header:    { padding: 24, paddingBottom: 32, alignItems: 'center' },
  backBtn:   { position: 'absolute', top: 56, left: 20, width: 40, height: 40, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.1)', alignItems: 'center', justifyContent: 'center' },
  logoBox:   { width: 72, height: 72, borderRadius: 22, alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  headerTitle:{ fontSize: FontSize['4xl'], fontWeight: '900', color: Colors.white, letterSpacing: -0.5, marginBottom: 6 },
  headerSub: { fontSize: FontSize.sm, color: 'rgba(255,255,255,0.55)' },

  body: { flex: 1 },
  form: { padding: 24, gap: 16 },

  forgotBtn: { alignSelf: 'flex-end', marginTop: -4 },
  forgotText:{ fontSize: FontSize.sm, color: Colors.brand[600], fontWeight: '600' },

  registerLink:{ alignItems: 'center', marginTop: 16 },
  registerText:{ fontSize: FontSize.sm, color: Colors.slate[600] },

  demoSection: { padding: 24, paddingTop: 0 },
  demoHeader:  { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 14 },
  demoLine:    { flex: 1, height: 1, backgroundColor: Colors.slate[100] },
  demoLabel:   { fontSize: FontSize.xs, color: Colors.slate[400], fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5 },

  demoCard: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: Colors.slate[50], borderRadius: Radius.xl,
    padding: 14, marginBottom: 10, borderWidth: 1, borderColor: Colors.slate[100],
  },
  demoIcon:    { width: 48, height: 48, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  demoRole:    { fontSize: FontSize.base, fontWeight: '700', color: Colors.slate[900] },
  demoEmail:   { fontSize: FontSize.xs, color: Colors.slate[500], marginTop: 2 },
  demoBadge:   { paddingHorizontal: 10, paddingVertical: 5, borderRadius: Radius.full },
  demoBadgeText:{ fontSize: FontSize.xs, color: Colors.white, fontWeight: '700' },
});
