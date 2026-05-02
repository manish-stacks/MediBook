'use client';
// src/app/(dashboard)/dashboard/doctor/appointments/page.tsx
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Calendar, Clock, User, FileText, Search, X, CheckCircle2 } from 'lucide-react';
import { cn, formatDate, formatTime, getStatusColor } from '@/lib/utils';
import toast from 'react-hot-toast';

const STATUS_TABS = ['ALL', 'PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED'];

export default function DoctorAppointmentsPage() {
  const qc = useQueryClient();
  const [activeTab, setActiveTab] = useState('ALL');
  const [search, setSearch]       = useState('');
  const [page, setPage]           = useState(1);
  const [dateFilter, setDateFilter] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['doctor-appointments', activeTab, page, dateFilter],
    queryFn: () => api.get('/appointments', { params: { status: activeTab === 'ALL' ? undefined : activeTab, page, limit: 15 } }).then(r => r.data.data),
    placeholderData: (prev) => prev,
  });

  const markDoneMutation = useMutation({
    mutationFn: (id: string) => api.put(`/appointments/${id}/status`, { status: 'COMPLETED' }),
    onSuccess: () => { toast.success('Appointment marked complete'); qc.invalidateQueries({ queryKey: ['doctor-appointments'] }); },
  });

  const appointments = (data?.appointments || []).filter((a: any) =>
    !search || `${a.patient?.firstName} ${a.patient?.lastName}`.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="w-full space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900">Appointments</h1>
        <p className="text-slate-500 mt-1">Manage your patient appointments</p>
      </div>

      <div className="flex flex-wrap gap-2 items-center">
        <div className="flex gap-1 bg-slate-100 p-1 rounded-2xl overflow-x-auto">
          {STATUS_TABS.map(tab => (
            <button key={tab} onClick={() => { setActiveTab(tab); setPage(1); }}
              className={cn('px-4 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap', activeTab === tab ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700')}>
              {tab === 'ALL' ? 'All' : tab.charAt(0) + tab.slice(1).toLowerCase()}
            </button>
          ))}
        </div>
        <button
          onClick={() => setDateFilter(new Date().toISOString().split('T')[0])}
          className={cn('px-4 py-2 rounded-2xl text-xs font-semibold transition-all border', dateFilter === new Date().toISOString().split('T')[0] ? 'bg-brand-600 text-white border-brand-600' : 'bg-white text-slate-600 border-slate-200 hover:bg-brand-50')}>
          📅 Today
        </button>
      </div>

      <div className="flex flex-wrap gap-3 items-center">
        <div className="flex items-center gap-3 bg-white border border-slate-200 rounded-2xl px-4 py-3 max-w-sm shadow-sm focus-within:border-brand-400 transition-all">
          <Search className="w-4 h-4 text-slate-400 shrink-0" />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search patient name..." className="flex-1 text-sm outline-none bg-transparent placeholder:text-slate-400" />
          {search && <button onClick={() => setSearch('')}><X className="w-4 h-4 text-slate-400" /></button>}
        </div>
        <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-2xl px-4 py-3 shadow-sm text-sm text-slate-600">
          <span className="text-slate-400 text-xs font-medium">Date:</span>
          <input type="date" value={dateFilter} onChange={e => setDateFilter(e.target.value)} className="outline-none bg-transparent text-sm" />
          {dateFilter && <button onClick={() => setDateFilter('')}><X className="w-4 h-4 text-slate-400" /></button>}
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-3">{[...Array(5)].map((_, i) => <div key={i} className="h-28 skeleton rounded-2xl" />)}</div>
      ) : appointments.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-100 p-14 text-center shadow-card">
          <div className="text-5xl mb-4">📅</div>
          <p className="font-bold text-slate-800 mb-2">No appointments found</p>
        </div>
      ) : (
        <div className="space-y-3">
          {appointments.map((apt: any, i: number) => (
            <motion.div key={apt.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
              className="bg-white rounded-2xl border border-slate-100 p-5 shadow-card">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-brand-100 flex items-center justify-center text-brand-600 font-bold text-sm shrink-0">
                  {apt.patient?.firstName?.[0]}{apt.patient?.lastName?.[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 flex-wrap">
                    <div>
                      <p className="font-bold text-slate-900">{apt.patient?.firstName} {apt.patient?.lastName}</p>
                      <p className="text-sm text-slate-400 capitalize">{apt.patient?.gender?.toLowerCase()} · {apt.patient?.relation?.toLowerCase()}</p>
                    </div>
                    <span className={cn('px-2.5 py-1 rounded-full text-xs font-semibold border shrink-0', getStatusColor(apt.status))}>{apt.status}</span>
                  </div>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-xs text-slate-500">
                    <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 text-brand-400" />{formatDate(apt.scheduledDate)}</span>
                    <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-brand-400" />{formatTime(apt.scheduledTime)}</span>
                    {apt.clinic && <span className="flex items-center gap-1.5">🏥 {apt.clinic.name}</span>}
                    {apt.notes && <span className="text-slate-400 truncate">Note: {apt.notes}</span>}
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-end gap-2 mt-4 pt-3 border-t border-slate-50">
                {apt.status === 'CONFIRMED' && (
                  <>
                    <button onClick={() => markDoneMutation.mutate(apt.id)} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-green-700 border border-green-200 rounded-xl hover:bg-green-50 transition-colors">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Mark Complete
                    </button>
                    <Link href={`/dashboard/doctor/prescriptions/new?appointmentId=${apt.id}&patientId=${apt.patientId}`}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-brand-600 border border-brand-200 rounded-xl hover:bg-brand-50 transition-colors">
                      <FileText className="w-3.5 h-3.5" /> Write Prescription
                    </Link>
                  </>
                )}
                {apt.status === 'COMPLETED' && !apt.prescription && (
                  <Link href={`/dashboard/doctor/prescriptions/new?appointmentId=${apt.id}&patientId=${apt.patientId}`}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-brand-600 border border-brand-200 rounded-xl hover:bg-brand-50 transition-colors">
                    <FileText className="w-3.5 h-3.5" /> Add Prescription
                  </Link>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {data?.pagination?.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="px-4 py-2 rounded-xl border border-slate-200 text-sm disabled:opacity-40 hover:bg-slate-50">Previous</button>
          <span className="text-sm text-slate-500">Page {page} of {data.pagination.totalPages}</span>
          <button onClick={() => setPage(p => p + 1)} disabled={page === data.pagination.totalPages} className="px-4 py-2 rounded-xl border border-slate-200 text-sm disabled:opacity-40 hover:bg-slate-50">Next</button>
        </div>
      )}
    </div>
  );
}
