'use client';
// src/app/admin/clinics/page.tsx
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, MapPin, Phone, Users, Pencil, X, Save } from 'lucide-react';
import toast from 'react-hot-toast';

function ClinicModal({ clinic, onClose }: { clinic: any; onClose: () => void }) {
  const qc = useQueryClient();
  const isEdit = !!clinic?.id;
  const [form, setForm] = useState({
    name: clinic?.name || '', address: clinic?.address || '', city: clinic?.city || '',
    state: clinic?.state || '', phone: clinic?.phone || '', email: clinic?.email || '',
    description: clinic?.description || '', timings: clinic?.timings || '9:00 AM - 6:00 PM',
  });
  const up = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  const mutation = useMutation({
    mutationFn: (data: any) => isEdit ? api.put(`/clinics/${clinic.id}`, data) : api.post('/clinics', data),
    onSuccess: () => { toast.success(isEdit ? 'Clinic updated!' : 'Clinic created!'); qc.invalidateQueries({ queryKey: ['admin-clinics'] }); onClose(); },
    onError: (e: any) => toast.error(e.response?.data?.message || 'Failed'),
  });

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-3xl w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-bold text-slate-900 text-lg">{isEdit ? 'Edit Clinic' : 'Add New Clinic'}</h3>
            <button onClick={onClose} className="p-2 rounded-xl hover:bg-slate-100"><X className="w-5 h-5" /></button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: 'Clinic Name *', key: 'name', col: 2 },
              { label: 'Address *', key: 'address', col: 2 },
              { label: 'City *', key: 'city', col: 1 },
              { label: 'State', key: 'state', col: 1 },
              { label: 'Phone', key: 'phone', col: 1 },
              { label: 'Email', key: 'email', col: 1 },
              { label: 'Timings', key: 'timings', col: 2 },
              { label: 'Description', key: 'description', col: 2, textarea: true },
            ].map(({ label, key, col, textarea }) => (
              <div key={key} className={col === 2 ? 'col-span-2' : ''}>
                <label className="block text-xs font-semibold text-slate-600 mb-1">{label}</label>
                {textarea ? (
                  <textarea value={(form as any)[key]} onChange={e => up(key, e.target.value)} rows={2}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-brand-400 transition-all resize-none placeholder:text-slate-400" />
                ) : (
                  <input type="text" value={(form as any)[key]} onChange={e => up(key, e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-brand-400 transition-all" />
                )}
              </div>
            ))}
          </div>
          <div className="flex gap-3 mt-5">
            <button onClick={onClose} className="flex-1 py-3 border border-slate-200 text-slate-700 font-semibold rounded-2xl">Cancel</button>
            <button onClick={() => mutation.mutate(form)} disabled={mutation.isPending || !form.name || !form.city}
              className="flex-1 py-3 bg-brand-600 text-white font-bold rounded-2xl disabled:opacity-60 hover:bg-brand-700 transition-all flex items-center justify-center gap-2">
              <Save className="w-4 h-4" /> {mutation.isPending ? 'Saving...' : isEdit ? 'Update' : 'Create Clinic'}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default function AdminClinicsPage() {
  const qc = useQueryClient();
  const [search, setSearch]   = useState('');
  const [editClinic, setEditClinic] = useState<any>(null);
  const [showCreate, setShowCreate] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ['admin-clinics', search],
    queryFn: () => api.get('/clinics', { params: { search: search || undefined, limit: 50 } }).then(r => r.data.data),
    keepPreviousData: true,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/clinics/${id}`),
    onSuccess: () => { toast.success('Clinic deactivated'); qc.invalidateQueries({ queryKey: ['admin-clinics'] }); },
  });

  const clinics = data?.clinics || [];

  return (
    <div className="w-full space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900">Clinics</h1>
          <p className="text-slate-500 mt-1">{clinics.length} clinics on the platform</p>
        </div>
        <button onClick={() => setShowCreate(true)} className="flex items-center gap-2 px-5 py-2.5 bg-brand-600 text-white font-semibold rounded-2xl text-sm hover:bg-brand-700 transition-all shadow-sm">
          <Plus className="w-4 h-4" /> Add Clinic
        </button>
      </div>

      <div className="flex items-center gap-3 bg-white border border-slate-200 rounded-2xl px-4 py-2.5 shadow-sm max-w-sm focus-within:border-brand-400 transition-all">
        <Search className="w-4 h-4 text-slate-400 shrink-0" />
        <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search clinics..." className="text-sm outline-none bg-transparent placeholder:text-slate-400 flex-1" />
        {search && <button onClick={() => setSearch('')}><X className="w-4 h-4 text-slate-400" /></button>}
      </div>

      {isLoading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">{[...Array(6)].map((_, i) => <div key={i} className="h-44 skeleton rounded-2xl" />)}</div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {clinics.map((clinic: any, i: number) => (
            <motion.div key={clinic.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className="bg-white rounded-2xl border border-slate-100 p-5 shadow-card hover:shadow-card-hover transition-all">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-bold text-slate-900">{clinic.name}</h3>
                  <div className="flex items-center gap-1 text-sm text-slate-400 mt-1">
                    <MapPin className="w-3.5 h-3.5" />{clinic.city}, {clinic.state || 'India'}
                  </div>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => setEditClinic(clinic)} className="p-2 rounded-xl text-slate-400 hover:text-brand-600 hover:bg-brand-50 transition-colors">
                    <Pencil className="w-4 h-4" />
                  </button>
                </div>
              </div>
              {clinic.phone && (
                <div className="flex items-center gap-1.5 text-sm text-slate-400 mb-2"><Phone className="w-3.5 h-3.5" />{clinic.phone}</div>
              )}
              <div className="flex items-center justify-between pt-3 border-t border-slate-50">
                <span className="flex items-center gap-1.5 text-xs text-slate-400"><Users className="w-3.5 h-3.5" />{clinic._count?.doctors || 0} doctors</span>
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${clinic.isActive ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500'}`}>
                  {clinic.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {(editClinic || showCreate) && (
        <ClinicModal clinic={editClinic} onClose={() => { setEditClinic(null); setShowCreate(false); }} />
      )}
    </div>
  );
}
