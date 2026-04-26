'use client';
// src/app/admin/testimonials/page.tsx
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { motion } from 'framer-motion';
import { Plus, Pencil, Trash2, X, Save, Star } from 'lucide-react';
import toast from 'react-hot-toast';

function TestimonialModal({ item, onClose }: { item: any; onClose: () => void }) {
  const qc = useQueryClient();
  const isEdit = !!item?.id;
  const [form, setForm] = useState({
    name: item?.name || '', location: item?.location || '', text: item?.text || '',
    rating: item?.rating || 5, avatar: item?.avatar || '', isActive: item?.isActive ?? true,
  });
  const up = (k: string, v: any) => setForm(f => ({ ...f, [k]: v }));

  const mutation = useMutation({
    mutationFn: (data: any) => isEdit
      ? api.put(`/settings/testimonials/${item.id}`, data)
      : api.post('/settings/testimonials', data),
    onSuccess: () => { toast.success(isEdit ? 'Updated!' : 'Created!'); qc.invalidateQueries({ queryKey: ['admin-testimonials'] }); onClose(); },
    onError: (e: any) => toast.error(e.response?.data?.message || 'Failed'),
  });

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-3xl w-full max-w-md shadow-2xl p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-bold text-slate-900 text-lg">{isEdit ? 'Edit Testimonial' : 'Add Testimonial'}</h3>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-slate-100"><X className="w-5 h-5" /></button>
        </div>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div><label className="block text-xs font-semibold text-slate-600 mb-1">Name *</label>
              <input type="text" value={form.name} onChange={e => up('name', e.target.value)} placeholder="Patient name"
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-brand-400" /></div>
            <div><label className="block text-xs font-semibold text-slate-600 mb-1">Location</label>
              <input type="text" value={form.location} onChange={e => up('location', e.target.value)} placeholder="Delhi"
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-brand-400" /></div>
          </div>
          <div><label className="block text-xs font-semibold text-slate-600 mb-1">Avatar URL</label>
            <input type="url" value={form.avatar} onChange={e => up('avatar', e.target.value)} placeholder="https://..."
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-brand-400" /></div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-2">Rating</label>
            <div className="flex gap-1">
              {[1,2,3,4,5].map(r => (
                <button key={r} type="button" onClick={() => up('rating', r)}>
                  <Star className={`w-6 h-6 transition-colors ${r <= form.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}`} />
                </button>
              ))}
            </div>
          </div>
          <div><label className="block text-xs font-semibold text-slate-600 mb-1">Testimonial Text *</label>
            <textarea value={form.text} onChange={e => up('text', e.target.value)} rows={4} placeholder="Patient's experience..."
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-brand-400 resize-none" /></div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.isActive} onChange={e => up('isActive', e.target.checked)} className="w-4 h-4 accent-brand-600" />
            <span className="text-sm text-slate-700">Active (show on website)</span>
          </label>
        </div>
        <div className="flex gap-3 mt-5">
          <button onClick={onClose} className="flex-1 py-3 border border-slate-200 text-slate-700 font-semibold rounded-2xl">Cancel</button>
          <button onClick={() => mutation.mutate(form)} disabled={mutation.isPending || !form.name || !form.text}
            className="flex-1 py-3 bg-brand-600 text-white font-bold rounded-2xl disabled:opacity-60 flex items-center justify-center gap-2">
            <Save className="w-4 h-4" /> {mutation.isPending ? 'Saving...' : isEdit ? 'Update' : 'Create'}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export default function AdminTestimonialsPage() {
  const qc = useQueryClient();
  const [editItem, setEditItem] = useState<any>(null);
  const [showCreate, setShowCreate] = useState(false);

  const { data } = useQuery({
    queryKey: ['admin-testimonials'],
    queryFn: () => api.get('/settings/testimonials/all?admin=true').then(r => r.data.data),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/settings/testimonials/${id}`),
    onSuccess: () => { toast.success('Deleted'); qc.invalidateQueries({ queryKey: ['admin-testimonials'] }); },
  });

  const items = data || [];

  return (
    <div className="w-full space-y-5">
      <div className="flex items-center justify-between">
        <div><h1 className="text-3xl font-extrabold text-slate-900">Testimonials</h1><p className="text-slate-500 mt-1">{items.length} reviews</p></div>
        <button onClick={() => setShowCreate(true)} className="flex items-center gap-2 px-5 py-2.5 bg-brand-600 text-white font-semibold rounded-2xl text-sm hover:bg-brand-700 shadow-sm">
          <Plus className="w-4 h-4" /> Add Testimonial
        </button>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((item: any, i: number) => (
          <motion.div key={item.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
            className={`bg-white rounded-2xl border p-5 shadow-card ${item.isActive ? 'border-slate-100' : 'border-red-100 opacity-60'}`}>
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                {item.avatar ? <img src={item.avatar} alt={item.name} className="w-10 h-10 rounded-2xl object-cover" />
                  : <div className="w-10 h-10 rounded-2xl bg-brand-100 flex items-center justify-center text-brand-600 font-bold">{item.name?.[0]}</div>}
                <div>
                  <p className="font-bold text-slate-900 text-sm">{item.name}</p>
                  <p className="text-xs text-slate-400">{item.location}</p>
                </div>
              </div>
              <div className="flex gap-1">
                <button onClick={() => setEditItem(item)} className="p-1.5 rounded-xl hover:bg-brand-50 text-slate-400 hover:text-brand-600 transition-colors"><Pencil className="w-3.5 h-3.5" /></button>
                <button onClick={() => { if(confirm('Delete?')) deleteMutation.mutate(item.id); }} className="p-1.5 rounded-xl hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
              </div>
            </div>
            <div className="flex gap-0.5 mb-2">
              {[...Array(5)].map((_,j) => <Star key={j} className={`w-3.5 h-3.5 ${j < item.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}`} />)}
            </div>
            <p className="text-sm text-slate-600 line-clamp-3 italic">"{item.text}"</p>
            <div className="mt-3 pt-2 border-t border-slate-50">
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${item.isActive ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500'}`}>
                {item.isActive ? 'Active' : 'Hidden'}
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      {(editItem || showCreate) && <TestimonialModal item={editItem} onClose={() => { setEditItem(null); setShowCreate(false); }} />}
    </div>
  );
}
