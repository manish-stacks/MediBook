'use client';
// src/app/(dashboard)/dashboard/appointments/page.tsx
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Calendar, Clock, MapPin, Search, Filter, Eye, X, AlertTriangle } from 'lucide-react';
import { cn, formatDate, formatTime, getStatusColor, formatCurrency } from '@/lib/utils';
import toast from 'react-hot-toast';

const STATUS_TABS = ['ALL', 'PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED'];

export default function AppointmentsPage() {
  const qc = useQueryClient();
  const [activeTab, setActiveTab] = useState('ALL');
  const [search, setSearch] = useState('');
  const [cancelId, setCancelId] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ['appointments', activeTab, page],
    queryFn: () =>
      api.get('/appointments', {
        params: { status: activeTab === 'ALL' ? undefined : activeTab, page, limit: 10 },
      }).then(r => r.data.data),
    // keepPreviousData: true,
    placeholderData: (prev) => prev,
  });

  const cancelMutation = useMutation({
    mutationFn: (id: string) => api.put(`/appointments/${id}/status`, { status: 'CANCELLED' }),
    onSuccess: () => {
      toast.success('Appointment cancelled');
      qc.invalidateQueries({ queryKey: ['appointments'] });
      setCancelId(null);
    },
    onError: (e: any) => toast.error(e.response?.data?.message || 'Failed to cancel'),
  });

  const appointments = data?.appointments || [];
  const pagination = data?.pagination;

  const filtered = search
    ? appointments.filter((a: any) =>
      `${a.doctor?.user?.firstName} ${a.doctor?.user?.lastName}`.toLowerCase().includes(search.toLowerCase()) ||
      a.clinic?.name?.toLowerCase().includes(search.toLowerCase()),
    )
    : appointments;

  return (
    <div className="w-full space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900">My Appointments</h1>
        <p className="text-slate-500 mt-1">View and manage all your appointments</p>
      </div>

      {/* Status tabs */}
      <div className="flex gap-1 bg-slate-100 p-1 rounded-2xl w-fit overflow-x-auto">
        {STATUS_TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => { setActiveTab(tab); setPage(1); }}
            className={cn('px-4 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap', activeTab === tab ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700')}
          >
            {tab === 'ALL' ? 'All' : tab.charAt(0) + tab.slice(1).toLowerCase()}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="flex items-center gap-3 bg-white border border-slate-200 rounded-2xl px-4 py-3 max-w-sm shadow-sm focus-within:border-brand-400 transition-all">
        <Search className="w-4 h-4 text-slate-400 shrink-0" />
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search by doctor or clinic..."
          className="flex-1 text-sm outline-none bg-transparent placeholder:text-slate-400"
        />
        {search && <button onClick={() => setSearch('')}><X className="w-4 h-4 text-slate-400" /></button>}
      </div>

      {/* List */}
      {isLoading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => <div key={i} className="h-28 skeleton rounded-2xl" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-100 p-14 text-center shadow-card">
          <div className="text-5xl mb-4">📅</div>
          <p className="font-bold text-slate-800 mb-2">No appointments found</p>
          <p className="text-slate-400 text-sm mb-5">Book an appointment with a top doctor</p>
          <Link href="/doctors" className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-600 text-white font-semibold rounded-xl text-sm">Find a Doctor</Link>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((apt: any, i: number) => (
            <motion.div
              key={apt.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-white rounded-2xl border border-slate-100 p-5 shadow-card hover:shadow-card-hover transition-all"
            >
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-2xl overflow-hidden shrink-0">
                  <img
                    src={apt.doctor?.user?.avatar || `https://ui-avatars.com/api/?name=${apt.doctor?.user?.firstName}&background=1e6fe8&color=fff`}
                    className="w-full h-full object-cover"
                    alt="Doctor"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 flex-wrap">
                    <div>
                      <p className="font-bold text-slate-900">Dr. {apt.doctor?.user?.firstName} {apt.doctor?.user?.lastName}</p>
                      <p className="text-sm text-brand-600 font-medium">{apt.doctor?.speciality?.name}</p>
                    </div>
                    <span className={cn('px-2.5 py-1 rounded-full text-xs font-semibold border', getStatusColor(apt.status))}>
                      {apt.status}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-xs text-slate-500">
                    <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 text-brand-400" />{formatDate(apt.scheduledDate)}</span>
                    <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-brand-400" />{formatTime(apt.scheduledTime)}</span>
                    {apt.clinic && <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-teal-400" />{apt.clinic.name}</span>}
                    {apt.payment && <span className="font-semibold text-slate-700">{formatCurrency(Number(apt.payment.amount))}</span>}
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-50">
                <p className="text-xs text-slate-400">#{apt.appointmentNo}</p>
                <div className="flex gap-2">
                  {['PENDING', 'CONFIRMED'].includes(apt.status) && (
                    <button
                      onClick={() => setCancelId(apt.id)}
                      className="px-3 py-1.5 text-xs font-medium text-red-600 border border-red-200 rounded-xl hover:bg-red-50 transition-colors"
                    >
                      Cancel
                    </button>
                  )}
                  <Link href={`/dashboard/appointments/${apt.id}`} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-brand-600 border border-brand-200 rounded-xl hover:bg-brand-50 transition-colors">
                    <Eye className="w-3.5 h-3.5" /> Details
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="px-4 py-2 rounded-xl border border-slate-200 text-sm disabled:opacity-40 hover:bg-slate-50 transition-colors">Previous</button>
          <span className="text-sm text-slate-600 px-3">Page {page} of {pagination.totalPages}</span>
          <button onClick={() => setPage(p => p + 1)} disabled={page === pagination.totalPages} className="px-4 py-2 rounded-xl border border-slate-200 text-sm disabled:opacity-40 hover:bg-slate-50 transition-colors">Next</button>
        </div>
      )}

      {/* Cancel confirmation dialog */}
      {cancelId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-3xl p-7 max-w-sm w-full shadow-2xl">
            <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center mb-4 mx-auto">
              <AlertTriangle className="w-7 h-7 text-red-500" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 text-center mb-2">Cancel Appointment?</h3>
            <p className="text-slate-500 text-sm text-center mb-6">This action cannot be undone. Your slot will be freed for other patients.</p>
            <div className="flex gap-3">
              <button onClick={() => setCancelId(null)} className="flex-1 py-3 border border-slate-200 text-slate-700 font-semibold rounded-2xl hover:bg-slate-50 transition-colors">Keep It</button>
              <button onClick={() => cancelMutation.mutate(cancelId!)} disabled={cancelMutation.isPending} className="flex-1 py-3 bg-red-600 text-white font-semibold rounded-2xl hover:bg-red-700 transition-colors disabled:opacity-60">
                {cancelMutation.isPending ? 'Cancelling...' : 'Yes, Cancel'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
