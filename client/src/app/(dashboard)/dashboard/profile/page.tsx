'use client';
// src/app/(dashboard)/dashboard/profile/page.tsx
import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { useAuthStore } from '@/store/auth.store';
import { motion } from 'framer-motion';
import { User, Lock, Save, Eye, EyeOff } from 'lucide-react';
import { getInitials } from '@/lib/utils';
import toast from 'react-hot-toast';

export default function ProfilePage() {
  const { user, updateUser } = useAuthStore();
  const qc = useQueryClient();
  const [tab, setTab] = useState<'profile' | 'password'>('profile');
  const [form, setForm] = useState({
    firstName: user?.firstName || '', lastName: user?.lastName || '',
    phone: '', gender: '', avatar: '',
  });
  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [showPw, setShowPw] = useState({ current: false, new: false, confirm: false });

  const profileMutation = useMutation({
    mutationFn: (data: any) => api.put('/users/me', data),
    onSuccess: (res) => { toast.success('Profile updated!'); updateUser(res.data.data); },
    onError: (e: any) => toast.error(e.response?.data?.message || 'Update failed'),
  });

  const pwMutation = useMutation({
    mutationFn: (data: any) => api.post('/auth/change-password', data),
    onSuccess: () => { toast.success('Password changed!'); setPwForm({ currentPassword: '', newPassword: '', confirmPassword: '' }); },
    onError: (e: any) => toast.error(e.response?.data?.message || 'Failed to change password'),
  });

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    profileMutation.mutate(form);
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pwForm.newPassword !== pwForm.confirmPassword) { toast.error('Passwords do not match'); return; }
    if (pwForm.newPassword.length < 6) { toast.error('Password must be at least 6 characters'); return; }
    pwMutation.mutate({ currentPassword: pwForm.currentPassword, newPassword: pwForm.newPassword });
  };

  return (
    <div className="max-w-2xl space-y-6 mx-auto">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900">Profile Settings</h1>
        <p className="text-slate-500 mt-1">Manage your account information</p>
      </div>

      {/* Avatar + name header */}
      <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-card flex items-center gap-4">
        <div className="w-16 h-16 rounded-2xl bg-brand-gradient flex items-center justify-center text-white text-xl font-extrabold shrink-0">
          {user?.avatar ? <img src={user.avatar} className="w-full h-full rounded-2xl object-cover" alt="" /> : getInitials(user?.firstName || '', user?.lastName || '')}
        </div>
        <div>
          <p className="font-bold text-slate-900 text-lg">{user?.firstName} {user?.lastName}</p>
          <p className="text-slate-500 text-sm">{user?.email}</p>
          <p className="text-xs text-brand-600 font-medium capitalize mt-0.5">{user?.role?.toLowerCase().replace('_', ' ')}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-slate-100 p-1 rounded-2xl w-fit">
        {[{ key: 'profile', icon: User, label: 'Profile' }, { key: 'password', icon: Lock, label: 'Password' }].map(t => (
          <button key={t.key} onClick={() => setTab(t.key as any)} className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${tab === t.key ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
            <t.icon className="w-4 h-4" /> {t.label}
          </button>
        ))}
      </div>

      {tab === 'profile' && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl border border-slate-100 p-6 shadow-card">
          <form onSubmit={handleProfileSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {[{ label: 'First Name', key: 'firstName' }, { label: 'Last Name', key: 'lastName' }].map(({ label, key }) => (
                <div key={key}>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">{label}</label>
                  <input type="text" value={(form as any)[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} required
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100 transition-all" />
                </div>
              ))}
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Phone</label>
              <input type="tel" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} placeholder="+91 9876543210"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm outline-none focus:border-brand-400 transition-all placeholder:text-slate-400" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Gender</label>
              <select value={form.gender} onChange={e => setForm(f => ({ ...f, gender: e.target.value }))}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm outline-none focus:border-brand-400 transition-all">
                <option value="">Select gender</option>
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
                <option value="OTHER">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Avatar URL</label>
              <input type="url" value={form.avatar} onChange={e => setForm(f => ({ ...f, avatar: e.target.value }))} placeholder="https://example.com/avatar.jpg"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm outline-none focus:border-brand-400 transition-all placeholder:text-slate-400" />
            </div>
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-700">
              📧 Email address cannot be changed for security reasons.
            </div>
            <button type="submit" disabled={profileMutation.isPending} className="w-full py-3.5 bg-brand-600 text-white font-bold rounded-2xl hover:bg-brand-700 transition-all disabled:opacity-60 flex items-center justify-center gap-2">
              <Save className="w-4 h-4" /> {profileMutation.isPending ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        </motion.div>
      )}

      {tab === 'password' && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl border border-slate-100 p-6 shadow-card">
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            {[
              { label: 'Current Password', key: 'currentPassword', showKey: 'current' },
              { label: 'New Password', key: 'newPassword', showKey: 'new' },
              { label: 'Confirm New Password', key: 'confirmPassword', showKey: 'confirm' },
            ].map(({ label, key, showKey }) => (
              <div key={key}>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">{label}</label>
                <div className="relative">
                  <input
                    type={(showPw as any)[showKey] ? 'text' : 'password'}
                    value={(pwForm as any)[key]}
                    onChange={e => setPwForm(f => ({ ...f, [key]: e.target.value }))}
                    required minLength={6} placeholder="••••••••"
                    className="w-full px-4 py-3 pr-12 bg-slate-50 border border-slate-200 rounded-2xl text-sm outline-none focus:border-brand-400 transition-all placeholder:text-slate-400"
                  />
                  <button type="button" onClick={() => setShowPw(s => ({ ...s, [showKey]: !(s as any)[showKey] }))} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
                    {(showPw as any)[showKey] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            ))}
            <button type="submit" disabled={pwMutation.isPending} className="w-full py-3.5 bg-brand-600 text-white font-bold rounded-2xl hover:bg-brand-700 transition-all disabled:opacity-60 flex items-center justify-center gap-2">
              <Lock className="w-4 h-4" /> {pwMutation.isPending ? 'Changing...' : 'Change Password'}
            </button>
          </form>
        </motion.div>
      )}
    </div>
  );
}
