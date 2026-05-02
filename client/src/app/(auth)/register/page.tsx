'use client';
// src/app/(auth)/register/page.tsx
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Stethoscope, ArrowRight, Check } from 'lucide-react';
import { useAuthStore } from '@/store/auth.store';
import toast from 'react-hot-toast';

const BENEFITS = ['Free appointment booking', 'Digital prescriptions', 'Family member management', 'Complete medical history'];

export default function RegisterPage() {
  const router = useRouter();
  const { register, isLoading } = useAuthStore();
  const [showPass, setShowPass] = useState(false);
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', phone: '', password: '', gender: '' });

  const update = (field: string, value: string) => setForm(f => ({ ...f, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password.length < 6) { toast.error('Password must be at least 6 characters'); return; }
    try {
      await register(form);
      toast.success('Account created! Welcome to MediBook 🎉');
      router.push('/dashboard');
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-hero-mesh flex items-center justify-center p-4 py-12">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full bg-brand-100/50 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-[400px] h-[400px] rounded-full bg-teal-100/40 blur-3xl" />
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative w-full max-w-lg">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2.5 mb-4">
            <div className="w-10 h-10 rounded-2xl bg-brand-gradient flex items-center justify-center shadow-lg">
              <Stethoscope className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-extrabold gradient-text">MediBook</span>
          </Link>
          <h1 className="text-3xl font-extrabold text-slate-900">Create your account</h1>
          <p className="text-slate-500 mt-2">Join 50,000+ patients on MediBook</p>
        </div>

        {/* Benefits */}
        <div className="flex flex-wrap justify-center gap-x-5 gap-y-1 mb-6">
          {BENEFITS.map((b) => (
            <span key={b} className="flex items-center gap-1.5 text-xs text-slate-600">
              <Check className="w-3.5 h-3.5 text-teal-500" />{b}
            </span>
          ))}
        </div>

        <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-card-hover border border-white/60 p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">First Name</label>
                <input type="text" value={form.firstName} onChange={(e) => update('firstName', e.target.value)} required placeholder="John"
                  className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100 transition-all placeholder:text-slate-400" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Last Name</label>
                <input type="text" value={form.lastName} onChange={(e) => update('lastName', e.target.value)} required placeholder="Doe"
                  className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100 transition-all placeholder:text-slate-400" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email address</label>
              <input type="email" value={form.email} onChange={(e) => update('email', e.target.value)} required placeholder="you@example.com"
                className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100 transition-all placeholder:text-slate-400" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Phone (optional)</label>
              <input type="tel" value={form.phone} onChange={(e) => update('phone', e.target.value)} placeholder="+91 9876543210"
                className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100 transition-all placeholder:text-slate-400" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Gender</label>
              <select value={form.gender} onChange={(e) => update('gender', e.target.value)}
                className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100 transition-all text-slate-700">
                <option value="">Select gender</option>
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
                <option value="OTHER">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Password</label>
              <div className="relative">
                <input type={showPass ? 'text' : 'password'} value={form.password} onChange={(e) => update('password', e.target.value)} required placeholder="Min. 6 characters"
                  className="w-full px-4 py-3.5 pr-12 bg-slate-50 border border-slate-200 rounded-2xl text-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100 transition-all placeholder:text-slate-400" />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <p className="text-xs text-slate-400">
              By creating an account, you agree to our{' '}
              <Link href="/terms" className="text-brand-600 hover:underline">Terms of Service</Link> and{' '}
              <Link href="/privacy" className="text-brand-600 hover:underline">Privacy Policy</Link>.
            </p>
            <button type="submit" disabled={isLoading} className="w-full py-4 bg-brand-600 hover:bg-brand-700 disabled:opacity-60 text-white font-bold rounded-2xl transition-all shadow-sm hover:shadow-md flex items-center justify-center gap-2">
              {isLoading ? 'Creating account...' : <><span>Create Account</span><ArrowRight className="w-4 h-4" /></>}
            </button>
          </form>
          <p className="text-center text-sm text-slate-500 mt-4">
            Already have an account?{' '}
            <Link href="/login" className="text-brand-600 font-semibold hover:underline">Sign in</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
