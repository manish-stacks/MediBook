'use client';
// src/app/admin/doctors/page.tsx
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { motion } from 'framer-motion';
import { Search, CheckCircle2, XCircle, Plus, Star, Filter } from 'lucide-react';
import { cn, formatCurrency } from '@/lib/utils';
import toast from 'react-hot-toast';

export default function AdminDoctorsPage() {
  const qc = useQueryClient();
  const [search, setSearch] = useState('');
  const [filterVerified, setFilterVerified] = useState('');
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ['admin-doctors', search, filterVerified, page],
    queryFn: () => api.get('/admin/doctors', { params: { search: search || undefined, isVerified: filterVerified || undefined, page, limit: 15 } }).then(r => r.data.data),
    keepPreviousData: true,
  });

  const verifyMutation = useMutation({
    mutationFn: (id: string) => api.put(`/admin/doctors/${id}/verify`),
    onSuccess: () => { toast.success('Doctor verified!'); qc.invalidateQueries({ queryKey: ['admin-doctors'] }); },
    onError: (e: any) => toast.error(e.response?.data?.message || 'Failed'),
  });

  const doctors    = data?.doctors || [];
  const total      = data?.total || 0;

  return (
    <div className="w-full space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900">Doctors</h1>
          <p className="text-slate-500 mt-1">{total} doctors registered on the platform</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-3 flex-wrap">
        <div className="flex items-center gap-3 bg-white border border-slate-200 rounded-2xl px-4 py-2.5 shadow-sm focus-within:border-brand-400 transition-all">
          <Search className="w-4 h-4 text-slate-400 shrink-0" />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search doctors..." className="text-sm outline-none bg-transparent placeholder:text-slate-400 w-52" />
        </div>
        <select value={filterVerified} onChange={e => setFilterVerified(e.target.value)} className="px-4 py-2.5 bg-white border border-slate-200 rounded-2xl text-sm outline-none shadow-sm">
          <option value="">All Doctors</option>
          <option value="true">Verified Only</option>
          <option value="false">Unverified Only</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-card overflow-hidden">
        <div className="px-5 py-3 border-b border-slate-100 bg-slate-50/50 grid grid-cols-6 gap-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
          <div className="col-span-2">Doctor</div>
          <div>Speciality</div>
          <div>Clinic</div>
          <div>Fee</div>
          <div>Status / Action</div>
        </div>
        {isLoading ? (
          <div className="space-y-1 p-3">{[...Array(8)].map((_, i) => <div key={i} className="h-14 skeleton rounded-xl" />)}</div>
        ) : doctors.length === 0 ? (
          <div className="p-12 text-center text-slate-400">No doctors found</div>
        ) : (
          <div className="divide-y divide-slate-50">
            {doctors.map((doc: any, i: number) => (
              <motion.div key={doc.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
                className="px-5 py-3.5 grid grid-cols-6 gap-3 items-center hover:bg-slate-50/50 transition-colors">
                <div className="col-span-2 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl overflow-hidden shrink-0">
                    <img src={doc.user?.avatar || `https://ui-avatars.com/api/?name=${doc.user?.firstName}&background=1e6fe8&color=fff`} className="w-full h-full object-cover" alt="" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-slate-900 text-sm truncate">Dr. {doc.user?.firstName} {doc.user?.lastName}</p>
                    <p className="text-xs text-slate-400 truncate">{doc.user?.email}</p>
                  </div>
                </div>
                <div className="text-sm text-slate-600">{doc.speciality?.name || '-'}</div>
                <div className="text-sm text-slate-600 truncate">{doc.clinics?.[0]?.clinic?.name || '-'}</div>
                <div className="text-sm font-semibold text-slate-900">{formatCurrency(Number(doc.consultationFee))}</div>
                <div className="flex items-center gap-2">
                  {doc.isVerified ? (
                    <span className="flex items-center gap-1.5 text-xs font-semibold text-green-700 bg-green-50 border border-green-200 px-2.5 py-1 rounded-full">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Verified
                    </span>
                  ) : (
                    <button onClick={() => verifyMutation.mutate(doc.id)} disabled={verifyMutation.isPending}
                      className="flex items-center gap-1.5 text-xs font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-full hover:bg-amber-100 transition-colors disabled:opacity-60">
                      <Star className="w-3.5 h-3.5" /> Verify
                    </button>
                  )}
                  {!doc.user?.isActive && (
                    <span className="text-xs text-red-500 font-medium">Inactive</span>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500">{total} total doctors</p>
        <div className="flex gap-2">
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="px-4 py-2 rounded-xl border border-slate-200 text-sm disabled:opacity-40 hover:bg-slate-50">Previous</button>
          <button onClick={() => setPage(p => p + 1)} disabled={doctors.length < 15} className="px-4 py-2 rounded-xl border border-slate-200 text-sm disabled:opacity-40 hover:bg-slate-50">Next</button>
        </div>
      </div>
    </div>
  );
}
