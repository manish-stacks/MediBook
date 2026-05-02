'use client';
// src/app/admin/specialities/page.tsx
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { motion } from 'framer-motion';
import { Plus, Pencil, Trash2, X, Save, ToggleLeft, ToggleRight } from 'lucide-react';
import toast from 'react-hot-toast';

function SpecialityModal({ spec, onClose }: { spec: any; onClose: () => void }) {
  const qc = useQueryClient();
  const isEdit = !!spec?.id;
  const [form, setForm] = useState({ name: spec?.name||'', description: spec?.description||'', icon: spec?.icon||'', isActive: spec?.isActive ?? true });
  const up = (k: string, v: any) => setForm(f => ({ ...f, [k]: v }));

  const mutation = useMutation({
    mutationFn: (data: any) => isEdit ? api.put(`/admin/specialities/${spec.id}`, data) : api.post('/admin/specialities', data),
    onSuccess: () => { toast.success(isEdit ? 'Updated!' : 'Created!'); qc.invalidateQueries({ queryKey: ['admin-specialities'] }); onClose(); },
    onError: (e: any) => toast.error(e.response?.data?.message || 'Failed'),
  });

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-3xl w-full max-w-md shadow-2xl p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-bold text-slate-900 text-lg">{isEdit ? 'Edit Speciality' : 'Add Speciality'}</h3>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-slate-100"><X className="w-5 h-5" /></button>
        </div>
        <div className="space-y-4">
          <div><label className="block text-xs font-semibold text-slate-600 mb-1">Name *</label>
            <input type="text" value={form.name} onChange={e => up('name', e.target.value)} className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-brand-400" /></div>
          <div><label className="block text-xs font-semibold text-slate-600 mb-1">Icon (emoji)</label>
            <input type="text" value={form.icon} onChange={e => up('icon', e.target.value)} placeholder="🫀" className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-brand-400" /></div>
          <div><label className="block text-xs font-semibold text-slate-600 mb-1">Description</label>
            <textarea value={form.description} onChange={e => up('description', e.target.value)} rows={2} className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-brand-400 resize-none" /></div>
        </div>
        <div className="flex gap-3 mt-5">
          <button onClick={onClose} className="flex-1 py-3 border border-slate-200 text-slate-700 font-semibold rounded-2xl">Cancel</button>
          <button onClick={() => mutation.mutate(form)} disabled={mutation.isPending || !form.name}
            className="flex-1 py-3 bg-brand-600 text-white font-bold rounded-2xl disabled:opacity-60 flex items-center justify-center gap-2">
            <Save className="w-4 h-4" />{mutation.isPending ? 'Saving...' : isEdit ? 'Update' : 'Create'}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export default function AdminSpecialitiesPage() {
  const qc = useQueryClient();
  const [editSpec, setEditSpec] = useState<any>(null);
  const [showCreate, setShowCreate] = useState(false);

  const { data } = useQuery({ queryKey: ['admin-specialities'], queryFn: () => api.get('/admin/specialities').then(r => r.data.data) });
  const toggleMutation = useMutation({ mutationFn: (id: string) => api.put(`/admin/specialities/${id}/toggle`), onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-specialities'] }) });
  const deleteMutation = useMutation({ mutationFn: (id: string) => api.delete(`/admin/specialities/${id}`), onSuccess: () => { toast.success('Deleted'); qc.invalidateQueries({ queryKey: ['admin-specialities'] }); } });

  const specs = data || [];

  return (
    <div className="w-full space-y-5">
      <div className="flex items-center justify-between">
        <div><h1 className="text-3xl font-extrabold text-slate-900">Specialities</h1><p className="text-slate-500 mt-1">{specs.length} medical specialities</p></div>
        <button onClick={() => setShowCreate(true)} className="flex items-center gap-2 px-5 py-2.5 bg-brand-600 text-white font-semibold rounded-2xl text-sm hover:bg-brand-700 transition-all shadow-sm">
          <Plus className="w-4 h-4" /> Add Speciality
        </button>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {specs.map((spec: any, i: number) => (
          <motion.div key={spec.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
            className={`bg-white rounded-2xl border p-5 shadow-card transition-all ${spec.isActive ? 'border-slate-100' : 'border-red-100 opacity-60'}`}>
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{spec.icon || '🏥'}</span>
                <div>
                  <p className="font-bold text-slate-900">{spec.name}</p>
                  <p className="text-xs text-slate-400">{spec._count?.doctors || 0} doctors</p>
                </div>
              </div>
              <div className="flex gap-1">
                <button onClick={() => setEditSpec(spec)} className="p-1.5 rounded-xl hover:bg-brand-50 text-slate-400 hover:text-brand-600 transition-colors"><Pencil className="w-3.5 h-3.5" /></button>
                <button onClick={() => toggleMutation.mutate(spec.id)} className="p-1.5 rounded-xl hover:bg-amber-50 text-slate-400 hover:text-amber-600 transition-colors">
                  {spec.isActive ? <ToggleRight className="w-3.5 h-3.5" /> : <ToggleLeft className="w-3.5 h-3.5" />}
                </button>
                <button onClick={() => { if(confirm('Delete?')) deleteMutation.mutate(spec.id); }} className="p-1.5 rounded-xl hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
              </div>
            </div>
            {spec.description && <p className="text-xs text-slate-400 line-clamp-2">{spec.description}</p>}
            <div className="flex items-center gap-2 mt-3 pt-3 border-t border-slate-50">
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${spec.isActive ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500'}`}>{spec.isActive ? 'Active' : 'Inactive'}</span>
            </div>
          </motion.div>
        ))}
      </div>

      {(editSpec || showCreate) && <SpecialityModal spec={editSpec} onClose={() => { setEditSpec(null); setShowCreate(false); }} />}
    </div>
  );
}
