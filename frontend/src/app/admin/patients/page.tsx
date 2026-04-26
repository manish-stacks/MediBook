'use client';
// src/app/admin/patients/page.tsx
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { motion } from 'framer-motion';
import { Search, X, Eye } from 'lucide-react';
import Link from 'next/link';
import { formatDate, getInitials, getAgeFromDOB } from '@/lib/utils';

export default function AdminPatientsPage() {
  const [search, setSearch] = useState('');
  const [page, setPage]     = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ['admin-patients', search, page],
    queryFn: () => api.get('/admin/patients', { params: { search: search || undefined, page, limit: 20 } }).then(r => r.data.data),
    keepPreviousData: true,
  });

  const patients = data?.patients || [];
  const total    = data?.total || 0;

  return (
    <div className="w-full space-y-5">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900">Patients</h1>
        <p className="text-slate-500 mt-1">{total} patients registered</p>
      </div>

      <div className="flex items-center gap-3 bg-white border border-slate-200 rounded-2xl px-4 py-2.5 shadow-sm max-w-sm focus-within:border-brand-400 transition-all">
        <Search className="w-4 h-4 text-slate-400 shrink-0" />
        <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search patients..." className="text-sm outline-none bg-transparent placeholder:text-slate-400 flex-1" />
        {search && <button onClick={() => setSearch('')}><X className="w-4 h-4 text-slate-400" /></button>}
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-card overflow-hidden">
        <div className="px-5 py-3 border-b border-slate-100 bg-slate-50/50 grid grid-cols-6 gap-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
          <div className="col-span-2">Patient</div>
          <div>Age / Gender</div>
          <div>Blood Group</div>
          <div>Appointments</div>
          <div>History</div>
        </div>
        {isLoading ? (
          <div className="space-y-1 p-3">{[...Array(8)].map((_,i) => <div key={i} className="h-14 skeleton rounded-xl" />)}</div>
        ) : (
          <div className="divide-y divide-slate-50">
            {patients.map((p: any, i: number) => (
              <motion.div key={p.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
                className="px-5 py-3.5 grid grid-cols-6 gap-3 items-center hover:bg-slate-50/50">
                <div className="col-span-2 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-brand-gradient flex items-center justify-center text-white font-bold text-xs shrink-0">
                    {getInitials(p.firstName, p.lastName)}
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-slate-900 text-sm truncate">{p.firstName} {p.lastName}</p>
                    <p className="text-xs text-slate-400 truncate">{p.user?.email}</p>
                  </div>
                </div>
                <div className="text-sm text-slate-600">
                  {p.dateOfBirth ? `${getAgeFromDOB(p.dateOfBirth)} yrs` : '—'} · {p.gender?.toLowerCase()}
                </div>
                <div>
                  {p.bloodGroup ? (
                    <span className="px-2 py-0.5 bg-red-50 text-red-600 border border-red-100 rounded-full text-xs font-semibold">{p.bloodGroup}</span>
                  ) : <span className="text-slate-300">—</span>}
                </div>
                <div className="text-sm text-slate-600">{p._count?.appointments || 0}</div>
                <div>
                  <Link href={`/admin/patients/${p.id}`} className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-brand-600 border border-brand-200 rounded-xl hover:bg-brand-50 transition-colors w-fit">
                    <Eye className="w-3.5 h-3.5" /> View
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500">{total} total patients</p>
        <div className="flex gap-2">
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="px-4 py-2 rounded-xl border border-slate-200 text-sm disabled:opacity-40 hover:bg-slate-50">Previous</button>
          <button onClick={() => setPage(p => p + 1)} disabled={patients.length < 20} className="px-4 py-2 rounded-xl border border-slate-200 text-sm disabled:opacity-40 hover:bg-slate-50">Next</button>
        </div>
      </div>
    </div>
  );
}
