'use client';
// src/app/(dashboard)/dashboard/family/page.tsx
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Plus, Trash2, User, Calendar, Phone, AlertTriangle } from 'lucide-react';
import { cn, getInitials, getAgeFromDOB } from '@/lib/utils';
import toast from 'react-hot-toast';

const RELATION_COLORS: Record<string, string> = {
  SELF: 'bg-brand-50 text-brand-700 border-brand-200',
  SPOUSE: 'bg-rose-50 text-rose-700 border-rose-200',
  CHILD: 'bg-green-50 text-green-700 border-green-200',
  PARENT: 'bg-violet-50 text-violet-700 border-violet-200',
  SIBLING: 'bg-amber-50 text-amber-700 border-amber-200',
  OTHER: 'bg-slate-50 text-slate-700 border-slate-200',
};

export default function FamilyPage() {
  const qc = useQueryClient();
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['my-patients'],
    queryFn: () => api.get('/patients').then(r => r.data.data),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/patients/${id}`),
    onSuccess: () => { toast.success('Member removed'); qc.invalidateQueries({ queryKey: ['my-patients'] }); setDeleteId(null); },
    onError: (e: any) => toast.error(e.response?.data?.message || 'Failed to remove'),
  });

  const patients = data || [];

  return (
    <div className="w-full space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900">My Family</h1>
          <p className="text-slate-500 mt-1">Manage family members for booking appointments</p>
        </div>
        <Link href="/dashboard/family/add" className="flex items-center gap-2 px-5 py-2.5 bg-brand-600 text-white font-semibold rounded-2xl text-sm hover:bg-brand-700 transition-all shadow-sm">
          <Plus className="w-4 h-4" /> Add Member
        </Link>
      </div>

      {isLoading ? (
        <div className="grid sm:grid-cols-3 gap-4">{[...Array(4)].map((_, i) => <div key={i} className="h-40 skeleton rounded-2xl" />)}</div>
      ) : patients.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-100 p-16 text-center shadow-card">
          <div className="text-5xl mb-4">👨‍👩‍👧‍👦</div>
          <h3 className="font-bold text-slate-800 mb-2">No family members yet</h3>
          <p className="text-slate-400 text-sm mb-6">Add family members to book appointments on their behalf</p>
          <Link href="/dashboard/family/add" className="inline-flex items-center gap-2 px-6 py-3 bg-brand-600 text-white font-semibold rounded-2xl text-sm">
            <Plus className="w-4 h-4" /> Add First Member
          </Link>
        </div>
      ) : (
        <div className="grid sm:grid-cols-3 gap-4">
          {patients.map((p: any, i: number) => (
            <motion.div key={p.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
              className="bg-white rounded-2xl border border-slate-100 p-5 shadow-card hover:shadow-card-hover transition-all">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-brand-gradient flex items-center justify-center text-white font-bold text-sm shrink-0">
                    {getInitials(p.firstName, p.lastName)}
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">{p.firstName} {p.lastName}</p>
                    <span className={cn('px-2 py-0.5 rounded-full text-xs font-medium border', RELATION_COLORS[p.relation] || RELATION_COLORS.OTHER)}>
                      {p.relation?.toLowerCase()}
                    </span>
                  </div>
                </div>
                {p.relation !== 'SELF' && (
                  <button onClick={() => setDeleteId(p.id)} className="p-2 rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
              <div className="space-y-2 text-sm text-slate-500">
                <div className="flex items-center gap-2"><User className="w-4 h-4 text-slate-300" /><span className="capitalize">{p.gender?.toLowerCase()} {p.dateOfBirth ? `· ${getAgeFromDOB(p.dateOfBirth)} years` : ''}</span></div>
                {p.phone && <div className="flex items-center gap-2"><Phone className="w-4 h-4 text-slate-300" /><span>{p.phone}</span></div>}
                {p.dateOfBirth && <div className="flex items-center gap-2"><Calendar className="w-4 h-4 text-slate-300" /><span>Born {new Date(p.dateOfBirth).toLocaleDateString('en-IN')}</span></div>}
                {p.bloodGroup && <div className="flex items-center gap-2"><span className="w-4 text-center text-slate-300 font-bold text-xs">Rh</span><span>Blood Group: {p.bloodGroup}</span></div>}
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Delete confirm */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-3xl p-7 max-w-sm w-full shadow-2xl">
            <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center mb-4 mx-auto"><AlertTriangle className="w-7 h-7 text-red-500" /></div>
            <h3 className="text-xl font-bold text-slate-900 text-center mb-2">Remove Member?</h3>
            <p className="text-slate-500 text-sm text-center mb-6">This will remove them from your family list.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)} className="flex-1 py-3 border border-slate-200 text-slate-700 font-semibold rounded-2xl">Cancel</button>
              <button onClick={() => deleteMutation.mutate(deleteId!)} disabled={deleteMutation.isPending} className="flex-1 py-3 bg-red-600 text-white font-semibold rounded-2xl disabled:opacity-60">
                {deleteMutation.isPending ? 'Removing...' : 'Remove'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
