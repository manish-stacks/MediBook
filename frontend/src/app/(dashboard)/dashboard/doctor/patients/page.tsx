'use client';
// src/app/(dashboard)/dashboard/doctor/patients/page.tsx
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Search, User, Activity, X, Plus, ChevronRight } from 'lucide-react';
import { cn, getInitials, getAgeFromDOB } from '@/lib/utils';
import toast from 'react-hot-toast';

function VitalsModal({ patient, onClose }: { patient: any; onClose: () => void }) {
  const qc = useQueryClient();
  const [form, setForm] = useState({ temperature: '', bloodPressure: '', heartRate: '', weight: '', height: '', oxygenSaturation: '', notes: '' });
  const up = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  const mutation = useMutation({
    mutationFn: (data: any) => api.post(`/patients/${patient.id}/vitals`, data),
    onSuccess: () => { toast.success('Vitals recorded!'); qc.invalidateQueries({ queryKey: ['doctor-patients'] }); onClose(); },
    onError: (e: any) => toast.error(e.response?.data?.message || 'Failed'),
  });

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-3xl w-full max-w-md shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-bold text-slate-900 text-lg">Record Vitals — {patient.firstName} {patient.lastName}</h3>
            <button onClick={onClose} className="p-2 rounded-xl hover:bg-slate-100"><X className="w-5 h-5" /></button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Temperature (°C)', key: 'temperature', placeholder: '98.6' },
              { label: 'Blood Pressure', key: 'bloodPressure', placeholder: '120/80' },
              { label: 'Heart Rate (bpm)', key: 'heartRate', placeholder: '72' },
              { label: 'Weight (kg)', key: 'weight', placeholder: '70' },
              { label: 'Height (cm)', key: 'height', placeholder: '170' },
              { label: 'SpO2 (%)', key: 'oxygenSaturation', placeholder: '98' },
            ].map(({ label, key, placeholder }) => (
              <div key={key}>
                <label className="block text-xs font-semibold text-slate-600 mb-1">{label}</label>
                <input type="text" value={(form as any)[key]} onChange={e => up(key, e.target.value)} placeholder={placeholder}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-brand-400 transition-all placeholder:text-slate-400" />
              </div>
            ))}
            <div className="col-span-2">
              <label className="block text-xs font-semibold text-slate-600 mb-1">Clinical Notes</label>
              <textarea value={form.notes} onChange={e => up('notes', e.target.value)} rows={2} placeholder="Any observations..."
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-brand-400 transition-all resize-none placeholder:text-slate-400" />
            </div>
          </div>
          <div className="flex gap-3 mt-5">
            <button onClick={onClose} className="flex-1 py-3 border border-slate-200 text-slate-700 font-semibold rounded-2xl">Cancel</button>
            <button onClick={() => mutation.mutate(form)} disabled={mutation.isPending}
              className="flex-1 py-3 bg-brand-600 text-white font-bold rounded-2xl disabled:opacity-60 hover:bg-brand-700 transition-all">
              {mutation.isPending ? 'Saving...' : 'Save Vitals'}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default function DoctorPatientsPage() {
  const [search, setSearch] = useState('');
  const [vitalsPatient, setVitalsPatient] = useState<any>(null);

  // Get all completed appointments to get unique patients
  const { data, isLoading } = useQuery({
    queryKey: ['doctor-patients', search],
    queryFn: () => api.get('/appointments', { params: { limit: 200 } }).then(r => {
      const apts = r.data.data.appointments;
      const seen = new Set();
      return apts.filter((a: any) => {
        if (seen.has(a.patientId)) return false;
        seen.add(a.patientId);
        return true;
      }).map((a: any) => a.patient);
    }),
  });

  const patients = (data || []).filter((p: any) =>
    !search || `${p.firstName} ${p.lastName}`.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="w-full space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900">My Patients</h1>
        <p className="text-slate-500 mt-1">View and manage patient records</p>
      </div>

      <div className="flex items-center gap-3 bg-white border border-slate-200 rounded-2xl px-4 py-3 max-w-sm shadow-sm focus-within:border-brand-400 transition-all">
        <Search className="w-4 h-4 text-slate-400 shrink-0" />
        <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search patients..." className="flex-1 text-sm outline-none bg-transparent placeholder:text-slate-400" />
        {search && <button onClick={() => setSearch('')}><X className="w-4 h-4 text-slate-400" /></button>}
      </div>

      {isLoading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">{[...Array(6)].map((_, i) => <div key={i} className="h-40 skeleton rounded-2xl" />)}</div>
      ) : patients.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-100 p-14 text-center shadow-card">
          <div className="text-5xl mb-4">👥</div>
          <p className="font-bold text-slate-800 mb-1">No patients yet</p>
          <p className="text-slate-400 text-sm">Patients who book with you will appear here</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {patients.map((p: any, i: number) => (
            <motion.div key={p.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
              className="bg-white rounded-2xl border border-slate-100 p-5 shadow-card hover:shadow-card-hover transition-all">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-12 h-12 rounded-2xl bg-brand-gradient flex items-center justify-center text-white font-bold shrink-0">
                  {getInitials(p.firstName, p.lastName)}
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-slate-900 truncate">{p.firstName} {p.lastName}</p>
                  <p className="text-sm text-slate-400 capitalize">{p.gender?.toLowerCase()} {p.dateOfBirth ? `· ${getAgeFromDOB(p.dateOfBirth)} yrs` : ''}</p>
                  {p.bloodGroup && <span className="text-xs bg-red-50 text-red-600 border border-red-100 px-1.5 py-0.5 rounded-full font-medium">{p.bloodGroup}</span>}
                </div>
              </div>
              {p.vitals?.length > 0 && (
                <div className="grid grid-cols-2 gap-1.5 mb-3">
                  {[
                    { label: 'Temp', v: p.vitals[0]?.temperature ? `${p.vitals[0].temperature}°C` : '-' },
                    { label: 'BP', v: p.vitals[0]?.bloodPressure || '-' },
                    { label: 'Weight', v: p.vitals[0]?.weight ? `${p.vitals[0].weight}kg` : '-' },
                    { label: 'SpO2', v: p.vitals[0]?.oxygenSaturation ? `${p.vitals[0].oxygenSaturation}%` : '-' },
                  ].map(({ label, v }) => (
                    <div key={label} className="bg-slate-50 rounded-xl px-2.5 py-1.5 text-center">
                      <p className="text-xs text-slate-400">{label}</p>
                      <p className="text-xs font-bold text-slate-800">{v}</p>
                    </div>
                  ))}
                </div>
              )}
              <div className="flex gap-2">
                <button onClick={() => setVitalsPatient(p)} className="flex-1 flex items-center justify-center gap-1.5 py-2 border border-brand-200 text-brand-600 text-xs font-semibold rounded-xl hover:bg-brand-50 transition-colors">
                  <Activity className="w-3.5 h-3.5" /> Record Vitals
                </button>
                <Link href={`/dashboard/doctor/patients/${p.id}`} className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-brand-50 text-brand-700 text-xs font-semibold rounded-xl hover:bg-brand-100 transition-colors">
                  History <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {vitalsPatient && <VitalsModal patient={vitalsPatient} onClose={() => setVitalsPatient(null)} />}
    </div>
  );
}
