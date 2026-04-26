'use client';
// src/app/admin/users/page.tsx
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { motion } from 'framer-motion';
import { Search, X, CheckCircle2, XCircle, Users } from 'lucide-react';
import { cn, formatDate, getInitials } from '@/lib/utils';
import toast from 'react-hot-toast';

const ROLE_COLORS: Record<string, string> = {
  PATIENT:     'bg-brand-50 text-brand-700 border-brand-200',
  DOCTOR:      'bg-teal-50 text-teal-700 border-teal-200',
  CLINIC_ADMIN:'bg-violet-50 text-violet-700 border-violet-200',
  SUPER_ADMIN: 'bg-amber-50 text-amber-700 border-amber-200',
};

export default function AdminUsersPage() {
  const qc = useQueryClient();
  const [search, setSearch] = useState('');
  const [role, setRole]     = useState('');
  const [page, setPage]     = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ['admin-users', search, role, page],
    queryFn: () => api.get('/users', { params: { search: search || undefined, role: role || undefined, page, limit: 20 } }).then(r => r.data.data),
    keepPreviousData: true,
  });

  const toggleMutation = useMutation({
    mutationFn: (id: string) => api.put(`/users/${id}/toggle-status`),
    onSuccess: (_, id) => { toast.success('Status updated'); qc.invalidateQueries({ queryKey: ['admin-users'] }); },
    onError: (e: any) => toast.error(e.response?.data?.message || 'Failed'),
  });

  const users = data?.users || [];
  const total = data?.total || 0;

  return (
    <div className="w-full space-y-5">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900">Users</h1>
        <p className="text-slate-500 mt-1">{total} registered users</p>
      </div>

      <div className="flex gap-3 flex-wrap">
        <div className="flex items-center gap-3 bg-white border border-slate-200 rounded-2xl px-4 py-2.5 shadow-sm focus-within:border-brand-400 transition-all">
          <Search className="w-4 h-4 text-slate-400 shrink-0" />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search users..." className="text-sm outline-none bg-transparent placeholder:text-slate-400 w-48" />
          {search && <button onClick={() => setSearch('')}><X className="w-4 h-4 text-slate-400" /></button>}
        </div>
        <select value={role} onChange={e => setRole(e.target.value)} className="px-4 py-2.5 bg-white border border-slate-200 rounded-2xl text-sm outline-none shadow-sm">
          <option value="">All Roles</option>
          <option value="PATIENT">Patient</option>
          <option value="DOCTOR">Doctor</option>
          <option value="CLINIC_ADMIN">Clinic Admin</option>
          <option value="SUPER_ADMIN">Super Admin</option>
        </select>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-card overflow-hidden">
        <div className="px-5 py-3 border-b border-slate-100 bg-slate-50/50 grid grid-cols-5 gap-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
          <div className="col-span-2">User</div>
          <div>Role</div>
          <div>Joined</div>
          <div>Status</div>
        </div>
        {isLoading ? (
          <div className="space-y-1 p-3">{[...Array(8)].map((_, i) => <div key={i} className="h-14 skeleton rounded-xl" />)}</div>
        ) : users.length === 0 ? (
          <div className="p-12 text-center text-slate-400">No users found</div>
        ) : (
          <div className="divide-y divide-slate-50">
            {users.map((user: any, i: number) => (
              <motion.div key={user.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.02 }}
                className="px-5 py-3.5 grid grid-cols-5 gap-3 items-center hover:bg-slate-50/50 transition-colors">
                <div className="col-span-2 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-brand-gradient flex items-center justify-center text-white font-bold text-xs shrink-0">
                    {user.avatar ? <img src={user.avatar} className="w-full h-full rounded-xl object-cover" alt="" /> : getInitials(user.firstName, user.lastName)}
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-slate-900 text-sm truncate">{user.firstName} {user.lastName}</p>
                    <p className="text-xs text-slate-400 truncate">{user.email}</p>
                  </div>
                </div>
                <div>
                  <span className={cn('px-2 py-0.5 rounded-full text-xs font-semibold border', ROLE_COLORS[user.role] || 'bg-slate-50 text-slate-600 border-slate-200')}>
                    {user.role?.replace('_', ' ')}
                  </span>
                </div>
                <div className="text-sm text-slate-500">{formatDate(user.createdAt)}</div>
                <div>
                  <button
                    onClick={() => toggleMutation.mutate(user.id)}
                    disabled={toggleMutation.isPending}
                    className={cn('flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border transition-all', user.isActive ? 'bg-green-50 text-green-700 border-green-200 hover:bg-red-50 hover:text-red-600 hover:border-red-200' : 'bg-red-50 text-red-600 border-red-200 hover:bg-green-50 hover:text-green-700 hover:border-green-200')}
                  >
                    {user.isActive ? <><CheckCircle2 className="w-3 h-3" />Active</> : <><XCircle className="w-3 h-3" />Inactive</>}
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500">{total} total users</p>
        <div className="flex gap-2">
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="px-4 py-2 rounded-xl border border-slate-200 text-sm disabled:opacity-40 hover:bg-slate-50">Previous</button>
          <button onClick={() => setPage(p => p + 1)} disabled={users.length < 20} className="px-4 py-2 rounded-xl border border-slate-200 text-sm disabled:opacity-40 hover:bg-slate-50">Next</button>
        </div>
      </div>
    </div>
  );
}
