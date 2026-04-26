// app/(auth)/register.tsx
import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '../../src/store/auth.store';
import { Colors, FontSize, Radius } from '../../src/constants/theme';
import Input from '../../src/components/ui/Input';
import Button from '../../src/components/ui/Button';

export default function RegisterScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { register, isLoading } = useAuthStore();
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', phone: '', password: '', gender: 'MALE' });
  const up = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  const handleRegister = async () => {
    if (!form.firstName || !form.email || !form.password) {
      Toast.show({ type: 'error', text1: 'Missing Fields', text2: 'Name, email and password are required.' });
      return;
    }
    if (form.password.length < 6) {
      Toast.show({ type: 'error', text1: 'Weak Password', text2: 'Password must be at least 6 characters.' });
      return;
    }
    try {
      await register(form);
      Toast.show({ type: 'success', text1: 'Account Created! 🎉', text2: 'Welcome to MediBook.' });
      router.replace('/(patient)');
    } catch (e: any) {
      Toast.show({ type: 'error', text1: 'Registration Failed', text2: e.message });
    }
  };

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom }]}>
      <LinearGradient colors={['#0f172a', '#1e3a5f']} style={[styles.header, { paddingTop: insets.top + 20 }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color={Colors.white} />
        </TouchableOpacity>
        <LinearGradient colors={['#1e6fe8', '#02c9b3']} style={styles.logoBox}>
          <Text style={{ fontSize: 28 }}>🏥</Text>
        </LinearGradient>
        <Text style={styles.headerTitle}>Create Account</Text>
        <Text style={styles.headerSub}>Join 50,000+ patients on MediBook</Text>
      </LinearGradient>

      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <View style={styles.form}>
          <View style={styles.row}>
            <View style={{ flex: 1 }}>
              <Input label="First Name" placeholder="John" value={form.firstName} onChangeText={v => up('firstName', v)} autoCapitalize="words" leftIcon="person-outline" />
            </View>
            <View style={{ flex: 1 }}>
              <Input label="Last Name" placeholder="Doe" value={form.lastName} onChangeText={v => up('lastName', v)} autoCapitalize="words" leftIcon="person-outline" />
            </View>
          </View>

          <Input label="Email Address" placeholder="you@example.com" value={form.email} onChangeText={v => up('email', v)} keyboardType="email-address" leftIcon="mail-outline" />
          <Input label="Phone (optional)" placeholder="+91 9876543210" value={form.phone} onChangeText={v => up('phone', v)} keyboardType="phone-pad" leftIcon="call-outline" />

          <View>
            <Text style={styles.label}>Gender</Text>
            <View style={styles.genderRow}>
              {['MALE', 'FEMALE', 'OTHER'].map(g => (
                <TouchableOpacity
                  key={g}
                  onPress={() => up('gender', g)}
                  style={[styles.genderBtn, form.gender === g && styles.genderBtnActive]}
                >
                  <Text style={{ fontSize: 18, marginBottom: 2 }}>
                    {g === 'MALE' ? '👨' : g === 'FEMALE' ? '👩' : '🧑'}
                  </Text>
                  <Text style={[styles.genderText, form.gender === g && styles.genderTextActive]}>
                    {g.charAt(0) + g.slice(1).toLowerCase()}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <Input label="Password" placeholder="Min. 6 characters" value={form.password} onChangeText={v => up('password', v)} secureTextEntry leftIcon="lock-closed-outline" />

          <View style={styles.termsRow}>
            <Text style={styles.termsText}>
              By creating an account, you agree to our{' '}
              <Text style={{ color: Colors.brand[600], fontWeight: '600' }}>Terms of Service</Text>
              {' '}and{' '}
              <Text style={{ color: Colors.brand[600], fontWeight: '600' }}>Privacy Policy</Text>
            </Text>
          </View>

          <Button title="Create Account" onPress={handleRegister} loading={isLoading} fullWidth size="lg" />

          <TouchableOpacity onPress={() => router.push('/(auth)/login')} style={styles.loginLink}>
            <Text style={styles.loginText}>
              Already have an account?{' '}
              <Text style={{ color: Colors.brand[600], fontWeight: '700' }}>Sign In</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.white },
  header: { padding: 24, paddingBottom: 32, alignItems: 'center' },
  backBtn: { position: 'absolute', top: 56, left: 20, width: 40, height: 40, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.1)', alignItems: 'center', justifyContent: 'center' },
  logoBox: { width: 72, height: 72, borderRadius: 22, alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  headerTitle: { fontSize: FontSize['4xl'], fontWeight: '900', color: Colors.white, letterSpacing: -0.5, marginBottom: 6 },
  headerSub: { fontSize: FontSize.sm, color: 'rgba(255,255,255,0.55)' },
  form: { padding: 24, gap: 16 },
  row: { flexDirection: 'row', gap: 12 },
  label: { fontSize: FontSize.sm, fontWeight: '600', color: Colors.slate[700], marginBottom: 8 },
  genderRow: { flexDirection: 'row', gap: 10 },
  genderBtn: {
    flex: 1, padding: 12, borderRadius: Radius.xl,
    backgroundColor: Colors.slate[50], borderWidth: 1.5, borderColor: Colors.slate[200],
    alignItems: 'center',
  },
  genderBtnActive: { borderColor: Colors.brand[600], backgroundColor: Colors.brand[50] },
  genderText: { fontSize: FontSize.xs, fontWeight: '700', color: Colors.slate[600] },
  genderTextActive: { color: Colors.brand[700] },
  termsRow: { marginTop: -4 },
  termsText: { fontSize: FontSize.xs, color: Colors.slate[500], lineHeight: 18, textAlign: 'center' },
  loginLink: { alignItems: 'center', paddingVertical: 8 },
  loginText: { fontSize: FontSize.sm, color: Colors.slate[600] },
});
