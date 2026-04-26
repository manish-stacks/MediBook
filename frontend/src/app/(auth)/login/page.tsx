'use client';
// src/app/(auth)/login/page.tsx
import { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Stethoscope, ArrowRight } from 'lucide-react';
import { useAuthStore } from '@/store/auth.store';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/dashboard';
  const { login, isLoading } = useAuthStore();

  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const user = await login(email, password);
      toast.success('Welcome back!');
      // Role-based redirect
      const roleRedirect: Record<string, string> = {
        SUPER_ADMIN: '/admin',
        CLINIC_ADMIN: '/clinic',
        DOCTOR: '/dashboard/doctor',
        PATIENT: '/dashboard',
      };
      const dest = redirect && redirect !== '/dashboard' ? redirect : (roleRedirect[user.role] || '/dashboard');
      router.push(dest);
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const DEMO_ACCOUNTS = [
    { role: 'Patient',     email: 'user@demo.com',        password: 'User@123'   },
    { role: 'Doctor',      email: 'doctor@demo.com',       password: 'Doctor@123' },
    { role: 'Clinic Admin',email: 'clinicadmin@demo.com',  password: 'Clinic@123' },
    { role: 'Super Admin', email: 'admin@demo.com',        password: 'Admin@123'  },
  ];

  return (
    <div className="min-h-screen bg-hero-mesh flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full bg-brand-100/50 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-[400px] h-[400px] rounded-full bg-teal-100/40 blur-3xl" />
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2.5 mb-4">
            <div className="w-10 h-10 rounded-2xl bg-brand-gradient flex items-center justify-center shadow-lg">
              <Stethoscope className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-extrabold gradient-text">MediBook</span>
          </Link>
          <h1 className="text-3xl font-extrabold text-slate-900">Welcome back</h1>
          <p className="text-slate-500 mt-2">Sign in to your account</p>
        </div>

        <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-card-hover border border-white/60 p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Email address</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="you@example.com"
                className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100 transition-all placeholder:text-slate-400" />
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-semibold text-slate-700">Password</label>
                <Link href="/forgot-password" className="text-xs text-brand-600 hover:underline">Forgot password?</Link>
              </div>
              <div className="relative">
                <input type={showPass ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="••••••••"
                  className="w-full px-4 py-3.5 pr-12 bg-slate-50 border border-slate-200 rounded-2xl text-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100 transition-all placeholder:text-slate-400" />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <button type="submit" disabled={isLoading} className="w-full py-4 bg-brand-600 hover:bg-brand-700 disabled:opacity-60 text-white font-bold rounded-2xl transition-all shadow-sm hover:shadow-md flex items-center justify-center gap-2">
              {isLoading ? 'Signing in...' : <><span>Sign In</span><ArrowRight className="w-4 h-4" /></>}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-5">
            Don't have an account?{' '}
            <Link href="/register" className="text-brand-600 font-semibold hover:underline">Create one free</Link>
          </p>
        </div>

        {/* Demo accounts */}
        <div className="mt-5 bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-100 p-4">
          <p className="text-xs font-semibold text-slate-500 mb-3 text-center">🧪 Demo Accounts (click to fill)</p>
          <div className="grid grid-cols-2 gap-2">
            {DEMO_ACCOUNTS.map((acc) => (
              <button key={acc.role} onClick={() => { setEmail(acc.email); setPassword(acc.password); }} className="text-left px-3 py-2.5 rounded-xl bg-slate-50 hover:bg-brand-50 border border-slate-100 hover:border-brand-200 transition-all">
                <p className="text-xs font-bold text-slate-800">{acc.role}</p>
                <p className="text-xs text-slate-400 truncate">{acc.email}</p>
              </button>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
