'use client';
// src/app/admin/notifications/page.tsx
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { motion } from 'framer-motion';
import { Bell, Send, Trash2, X } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import toast from 'react-hot-toast';

export default function AdminNotificationsPage() {
  const qc = useQueryClient();
  const [showBroadcast, setShowBroadcast] = useState(false);
  const [broadcastForm, setBroadcastForm] = useState({ title: '', message: '', type: 'system' });

  const { data, isLoading } = useQuery({
    queryKey: ['admin-notifications'],
    queryFn: () => api.get('/admin/notifications').then(r => r.data.data),
  });

  const broadcastMutation = useMutation({
    mutationFn: (data: any) => api.post('/admin/notifications/broadcast', data),
    onSuccess: () => { toast.success('Notification broadcast!'); setShowBroadcast(false); setBroadcastForm({ title: '', message: '', type: 'system' }); qc.invalidateQueries({ queryKey: ['admin-notifications'] }); },
    onError: (e: any) => toast.error(e.response?.data?.message || 'Failed'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/admin/notifications/${id}`),
    onSuccess: () => { toast.success('Deleted'); qc.invalidateQueries({ queryKey: ['admin-notifications'] }); },
  });

  const notifications = data || [];

  return (
    <div className="w-full space-y-5">
      <div className="flex items-center justify-between">
        <div><h1 className="text-3xl font-extrabold text-slate-900">Notifications</h1>
          <p className="text-slate-500 mt-1">Manage and broadcast system notifications</p></div>
        <button onClick={() => setShowBroadcast(true)} className="flex items-center gap-2 px-5 py-2.5 bg-brand-600 text-white font-semibold rounded-2xl text-sm hover:bg-brand-700 shadow-sm">
          <Send className="w-4 h-4" /> Broadcast
        </button>
      </div>

      {/* Broadcast form */}
      {showBroadcast && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-brand-50 border border-brand-100 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-900 flex items-center gap-2"><Bell className="w-4 h-4 text-brand-600" />Broadcast to All Users</h3>
            <button onClick={() => setShowBroadcast(false)}><X className="w-5 h-5 text-slate-400" /></button>
          </div>
          <div className="space-y-3">
            <input type="text" value={broadcastForm.title} onChange={e => setBroadcastForm(f => ({...f, title: e.target.value}))}
              placeholder="Notification title..." className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:border-brand-400" />
            <textarea value={broadcastForm.message} onChange={e => setBroadcastForm(f => ({...f, message: e.target.value}))}
              rows={3} placeholder="Notification message..."
              className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:border-brand-400 resize-none" />
            <div className="flex items-center gap-3">
              <select value={broadcastForm.type} onChange={e => setBroadcastForm(f => ({...f, type: e.target.value}))}
                className="px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm outline-none">
                <option value="system">System</option>
                <option value="appointment">Appointment</option>
                <option value="payment">Payment</option>
                <option value="promo">Promotional</option>
              </select>
              <button onClick={() => broadcastMutation.mutate(broadcastForm)} disabled={broadcastMutation.isPending || !broadcastForm.title}
                className="flex-1 py-2.5 bg-brand-600 text-white font-bold rounded-xl text-sm disabled:opacity-60 flex items-center justify-center gap-2">
                <Send className="w-4 h-4" /> {broadcastMutation.isPending ? 'Sending...' : 'Broadcast Now'}
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {isLoading ? (
        <div className="space-y-2">{[...Array(6)].map((_,i) => <div key={i} className="h-16 skeleton rounded-2xl" />)}</div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-card overflow-hidden">
          <div className="divide-y divide-slate-50">
            {notifications.length === 0 ? (
              <div className="p-12 text-center text-slate-400">No notifications yet</div>
            ) : notifications.map((n: any, i: number) => (
              <motion.div key={n.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
                className="flex items-center gap-4 px-5 py-3.5 hover:bg-slate-50/50 transition-colors">
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-sm shrink-0 ${n.type === 'appointment' ? 'bg-brand-50 text-brand-600' : n.type === 'payment' ? 'bg-green-50 text-green-600' : 'bg-slate-100 text-slate-600'}`}>
                  {n.type === 'appointment' ? '📅' : n.type === 'payment' ? '💳' : '🔔'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-slate-900 text-sm truncate">{n.title}</p>
                  <p className="text-xs text-slate-400 truncate">{n.message} · {n.user?.firstName} {n.user?.email && `(${n.user.email})`}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs text-slate-400">{formatDate(n.createdAt)}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${n.isRead ? 'bg-slate-100 text-slate-500' : 'bg-blue-50 text-blue-600'}`}>{n.isRead ? 'Read' : 'Unread'}</span>
                  <button onClick={() => deleteMutation.mutate(n.id)} className="p-1 rounded-lg hover:bg-red-50 text-slate-300 hover:text-red-400 transition-colors">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
