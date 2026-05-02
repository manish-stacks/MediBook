'use client';
// src/app/admin/appointments/page.tsx
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { motion } from 'framer-motion';
import { Search, Download, Calendar } from 'lucide-react';
import { cn, formatDate, formatTime, getStatusColor, formatCurrency } from '@/lib/utils';
import toast from 'react-hot-toast';

const STATUSES = ['', 'PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED', 'NO_SHOW'];

export default function AdminAppointmentsPage() {
  const [status, setStatus] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [exporting, setExporting] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ['admin-appointments', status, startDate, endDate, page],
    queryFn: () => api.get('/admin/appointments', {
      params: { status: status || undefined, startDate: startDate || undefined, endDate: endDate || undefined, page, limit: 15 },
    }).then(r => r.data.data),
    keepPreviousData: true,
  });

  const handleExport = async () => {
    setExporting(true);
    try {
      const res = await api.get('/admin/appointments/export', {
        params: { status: status || undefined, startDate: startDate || undefined, endDate: endDate || undefined },
        responseType: 'blob',
      });
      const url = URL.createObjectURL(res.data);
      const a = document.createElement('a');
      a.href = url;
      a.download = `appointments-${new Date().toISOString().split('T')[0]}.xlsx`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success('Exported successfully!');
    } catch { toast.error('Export failed'); }
    finally { setExporting(false); }
  };

  const appointments = data?.appointments || [];
  const total        = data?.total || 0;

  return (
    <div className="w-full space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900">Appointments</h1>
          <p className="text-slate-500 mt-1">{total} total appointments</p>
        </div>
        <button onClick={handleExport} disabled={exporting}
          className="flex items-center gap-2 px-5 py-2.5 bg-green-600 text-white font-semibold rounded-2xl text-sm hover:bg-green-700 transition-all disabled:opacity-60 shadow-sm">
          <Download className="w-4 h-4" /> {exporting ? 'Exporting...' : 'Export Excel'}
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <select value={status} onChange={e => setStatus(e.target.value)} className="px-4 py-2.5 bg-white border border-slate-200 rounded-2xl text-sm outline-none shadow-sm min-w-36">
          <option value="">All Statuses</option>
          {STATUSES.filter(Boolean).map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-2xl px-4 py-2 shadow-sm text-sm text-slate-600">
          <Calendar className="w-4 h-4 text-slate-400" />
          <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="outline-none bg-transparent text-sm" />
          <span className="text-slate-300">—</span>
          <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="outline-none bg-transparent text-sm" />
        </div>
        {(status || startDate || endDate) && (
          <button onClick={() => { setStatus(''); setStartDate(''); setEndDate(''); setPage(1); }} className="px-4 py-2.5 text-sm text-slate-600 bg-white border border-slate-200 rounded-2xl hover:bg-slate-50">Clear</button>
        )}
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-card overflow-hidden">
        <div className="px-5 py-3 border-b border-slate-100 bg-slate-50/50 grid grid-cols-6 gap-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
          <div>Appointment</div>
          <div>Patient</div>
          <div>Doctor</div>
          <div>Date / Time</div>
          <div>Amount</div>
          <div>Status</div>
        </div>
        {isLoading ? (
          <div className="space-y-1 p-3">{[...Array(8)].map((_, i) => <div key={i} className="h-14 skeleton rounded-xl" />)}</div>
        ) : appointments.length === 0 ? (
          <div className="p-12 text-center text-slate-400">No appointments found</div>
        ) : (
          <div className="divide-y divide-slate-50">
            {appointments.map((apt: any, i: number) => (
              <motion.div key={apt.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
                className="px-5 py-3.5 grid grid-cols-6 gap-3 items-center hover:bg-slate-50/50 transition-colors text-sm">
                <div className="font-mono text-xs text-slate-400">#{apt.appointmentNo}</div>
                <div>
                  <p className="font-medium text-slate-900 truncate">{apt.patient?.firstName} {apt.patient?.lastName}</p>
                </div>
                <div>
                  <p className="font-medium text-slate-900 truncate">Dr. {apt.doctor?.user?.firstName}</p>
                  <p className="text-xs text-slate-400 truncate">{apt.clinic?.name}</p>
                </div>
                <div>
                  <p className="font-medium text-slate-700">{formatDate(apt.scheduledDate)}</p>
                  <p className="text-xs text-slate-400">{formatTime(apt.scheduledTime)}</p>
                </div>
                <div>
                  <p className="font-semibold text-slate-900">{apt.payment ? formatCurrency(Number(apt.payment.amount)) : '-'}</p>
                  <p className="text-xs text-slate-400 capitalize">{apt.payment?.paymentMode?.replace('_', ' ').toLowerCase() || ''}</p>
                </div>
                <div>
                  <span className={cn('px-2 py-0.5 rounded-full text-xs font-semibold border', getStatusColor(apt.status))}>{apt.status}</span>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500">{total} total records</p>
        <div className="flex gap-2">
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="px-4 py-2 rounded-xl border border-slate-200 text-sm disabled:opacity-40 hover:bg-slate-50">Previous</button>
          <span className="px-4 py-2 text-sm text-slate-600">Page {page}</span>
          <button onClick={() => setPage(p => p + 1)} disabled={appointments.length < 15} className="px-4 py-2 rounded-xl border border-slate-200 text-sm disabled:opacity-40 hover:bg-slate-50">Next</button>
        </div>
      </div>
    </div>
  );
}
