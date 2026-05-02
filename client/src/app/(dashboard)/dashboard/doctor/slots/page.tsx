'use client';
// src/app/(dashboard)/dashboard/doctor/slots/page.tsx
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { motion } from 'framer-motion';
import { Plus, Trash2, Clock, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';
import toast from 'react-hot-toast';

const DAYS = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];
const DAY_LABELS: Record<string, string> = { MONDAY: 'Mon', TUESDAY: 'Tue', WEDNESDAY: 'Wed', THURSDAY: 'Thu', FRIDAY: 'Fri', SATURDAY: 'Sat', SUNDAY: 'Sun' };

export default function SlotsPage() {
  const qc = useQueryClient();
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [form, setForm] = useState({
    dayOfWeek: 'MONDAY', startTime: '09:00', endTime: '17:00', slotDuration: 30, clinicId: '',
  });
  const up = (k: string, v: any) => setForm(f => ({ ...f, [k]: v }));

  const { data: slots, isLoading } = useQuery({
    queryKey: ['my-slots'],
    queryFn: () => api.get('/slots/my-slots').then(r => r.data.data),
  });

  const { data: clinicsData } = useQuery({
    queryKey: ['doctor-clinics'],
    queryFn: () => api.get('/clinics?limit=50').then(r => r.data.data.clinics),
  });

  const createMutation = useMutation({
    mutationFn: (data: any) => api.post('/slots', data),
    onSuccess: () => { toast.success('Slot created!'); qc.invalidateQueries({ queryKey: ['my-slots'] }); },
    onError: (e: any) => toast.error(e.response?.data?.message || 'Failed to create slot'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/slots/${id}`),
    onSuccess: () => { toast.success('Slot deleted'); qc.invalidateQueries({ queryKey: ['my-slots'] }); setDeleteId(null); },
    onError: (e: any) => toast.error(e.response?.data?.message || 'Failed to delete'),
  });

  const clinics = clinicsData || [];
  const slotsByDay = DAYS.reduce((acc, day) => {
    acc[day] = (slots || []).filter((s: any) => s.dayOfWeek === day);
    return acc;
  }, {} as Record<string, any[]>);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.clinicId) { toast.error('Please select a clinic'); return; }
    createMutation.mutate(form);
  };

  return (
    <div className="max-w-5xl space-y-6 ">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900">Manage Slots</h1>
        <p className="text-slate-500 mt-1">Configure your weekly availability for appointments</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Create slot form */}
        <div>
          <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-card sticky top-24">
            <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2"><Plus className="w-4 h-4 text-brand-500" />Add New Slot</h3>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Day of Week</label>
                <div className="grid grid-cols-7 gap-1">
                  {DAYS.map(day => (
                    <button key={day} type="button" onClick={() => up('dayOfWeek', day)}
                      className={cn('py-2 rounded-xl text-xs font-semibold transition-all', form.dayOfWeek === day ? 'bg-brand-600 text-white' : 'bg-slate-50 text-slate-600 hover:bg-brand-50 hover:text-brand-700')}>
                      {DAY_LABELS[day]}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Start Time</label>
                  <input type="time" value={form.startTime} onChange={e => up('startTime', e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-brand-400 transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">End Time</label>
                  <input type="time" value={form.endTime} onChange={e => up('endTime', e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-brand-400 transition-all" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Slot Duration (minutes)</label>
                <select value={form.slotDuration} onChange={e => up('slotDuration', Number(e.target.value))}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-brand-400 transition-all">
                  {[15, 20, 30, 45, 60].map(d => <option key={d} value={d}>{d} minutes</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Clinic *</label>
                <select value={form.clinicId} onChange={e => up('clinicId', e.target.value)} required
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-brand-400 transition-all">
                  <option value="">Select clinic</option>
                  {clinics.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>

              <button type="submit" disabled={createMutation.isPending}
                className="w-full py-3 bg-brand-600 text-white font-bold rounded-2xl hover:bg-brand-700 transition-all disabled:opacity-60 text-sm">
                {createMutation.isPending ? 'Creating...' : 'Create Slot'}
              </button>
            </form>
          </div>
        </div>

        {/* Existing slots by day */}
        <div className="lg:col-span-2 space-y-3">
          {isLoading ? (
            [...Array(5)].map((_, i) => <div key={i} className="h-20 skeleton rounded-2xl" />)
          ) : (
            DAYS.map(day => {
              const daySlots = slotsByDay[day];
              if (!daySlots.length) return null;
              return (
                <motion.div key={day} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white rounded-2xl border border-slate-100 p-4 shadow-card">
                  <h4 className="font-bold text-slate-800 mb-3 text-sm">{day.charAt(0) + day.slice(1).toLowerCase()}</h4>
                  <div className="space-y-2">
                    {daySlots.map((slot: any) => (
                      <div key={slot.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                        <div className="flex items-center gap-3">
                          <Clock className="w-4 h-4 text-brand-400" />
                          <span className="text-sm font-medium text-slate-700">{slot.startTime} – {slot.endTime}</span>
                          <span className="text-xs text-slate-400">{slot.slotDuration}min slots</span>
                          {slot.clinic?.name && <span className="text-xs text-brand-600 bg-brand-50 px-2 py-0.5 rounded-full">{slot.clinic.name}</span>}
                        </div>
                        <button onClick={() => setDeleteId(slot.id)} className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </motion.div>
              );
            })
          )}
          {!isLoading && (slots || []).length === 0 && (
            <div className="bg-white rounded-2xl border border-slate-100 p-12 text-center shadow-card">
              <div className="text-4xl mb-3">🗓️</div>
              <p className="font-semibold text-slate-700 mb-1">No slots configured</p>
              <p className="text-sm text-slate-400">Use the form to add your weekly availability</p>
            </div>
          )}
        </div>
      </div>

      {/* Delete confirm */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-3xl p-7 max-w-sm w-full shadow-2xl">
            <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center mb-4 mx-auto"><AlertTriangle className="w-7 h-7 text-red-500" /></div>
            <h3 className="text-xl font-bold text-slate-900 text-center mb-2">Delete Slot?</h3>
            <p className="text-slate-500 text-sm text-center mb-6">Future time slots will no longer be generated for this slot.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)} className="flex-1 py-3 border border-slate-200 text-slate-700 font-semibold rounded-2xl">Cancel</button>
              <button onClick={() => deleteMutation.mutate(deleteId!)} disabled={deleteMutation.isPending} className="flex-1 py-3 bg-red-600 text-white font-semibold rounded-2xl disabled:opacity-60">
                {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
