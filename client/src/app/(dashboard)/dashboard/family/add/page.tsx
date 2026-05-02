'use client';
// src/app/(dashboard)/dashboard/family/add/page.tsx
import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { useRouter } from 'next/navigation';
import { ChevronLeft, UserPlus } from 'lucide-react';
import toast from 'react-hot-toast';

const RELATIONS = ['SELF', 'SPOUSE', 'CHILD', 'PARENT', 'SIBLING', 'OTHER'];
const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

export default function AddFamilyMemberPage() {
  const router = useRouter();
  const qc = useQueryClient();
  const [form, setForm] = useState({
    firstName: '', lastName: '', gender: 'MALE', relation: 'CHILD',
    dateOfBirth: '', bloodGroup: '', phone: '', allergies: '',
  });
  const up = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  const mutation = useMutation({
    mutationFn: (data: any) => api.post('/patients', data),
    onSuccess: () => { toast.success('Family member added!'); qc.invalidateQueries({ queryKey: ['my-patients'] }); router.push('/dashboard/family'); },
    onError: (e: any) => toast.error(e.response?.data?.message || 'Failed to add member'),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.firstName || !form.lastName) { toast.error('Name is required'); return; }
    mutation.mutate({ ...form, allergies: form.allergies ? form.allergies.split(',').map(s => s.trim()) : [] });
  };

  return (
    <div className="max-w-xl space-y-6">
      <div className="flex items-center gap-3">
        <button onClick={() => router.back()} className="p-2 rounded-xl hover:bg-slate-100 text-slate-600"><ChevronLeft className="w-5 h-5" /></button>
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Add Family Member</h1>
          <p className="text-slate-500 text-sm">Add a member to book appointments on their behalf</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-card">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {[{ label: 'First Name', key: 'firstName', placeholder: 'John' }, { label: 'Last Name', key: 'lastName', placeholder: 'Doe' }].map(({ label, key, placeholder }) => (
              <div key={key}>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">{label} *</label>
                <input type="text" value={(form as any)[key]} onChange={e => up(key, e.target.value)} required placeholder={placeholder}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100 transition-all placeholder:text-slate-400" />
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Relation *</label>
              <select value={form.relation} onChange={e => up('relation', e.target.value)} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm outline-none focus:border-brand-400 transition-all capitalize">
                {RELATIONS.map(r => <option key={r} value={r}>{r.charAt(0) + r.slice(1).toLowerCase()}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Gender *</label>
              <select value={form.gender} onChange={e => up('gender', e.target.value)} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm outline-none focus:border-brand-400 transition-all">
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
                <option value="OTHER">Other</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Date of Birth</label>
              <input type="date" value={form.dateOfBirth} onChange={e => up('dateOfBirth', e.target.value)} max={new Date().toISOString().split('T')[0]}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm outline-none focus:border-brand-400 transition-all" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Blood Group</label>
              <select value={form.bloodGroup} onChange={e => up('bloodGroup', e.target.value)} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm outline-none focus:border-brand-400 transition-all">
                <option value="">Select</option>
                {BLOOD_GROUPS.map(b => <option key={b} value={b}>{b}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Phone</label>
            <input type="tel" value={form.phone} onChange={e => up('phone', e.target.value)} placeholder="+91 9876543210"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm outline-none focus:border-brand-400 transition-all placeholder:text-slate-400" />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Known Allergies</label>
            <input type="text" value={form.allergies} onChange={e => up('allergies', e.target.value)} placeholder="Penicillin, Pollen (comma-separated)"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm outline-none focus:border-brand-400 transition-all placeholder:text-slate-400" />
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => router.back()} className="flex-1 py-3 border border-slate-200 text-slate-700 font-semibold rounded-2xl hover:bg-slate-50 transition-colors">Cancel</button>
            <button type="submit" disabled={mutation.isPending} className="flex-1 py-3 bg-brand-600 text-white font-bold rounded-2xl hover:bg-brand-700 transition-all disabled:opacity-60 flex items-center justify-center gap-2">
              <UserPlus className="w-4 h-4" /> {mutation.isPending ? 'Adding...' : 'Add Member'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
