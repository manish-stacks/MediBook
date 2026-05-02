'use client';
// src/app/admin/revenue/page.tsx
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { formatCurrency } from '@/lib/utils';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function AdminRevenuePage() {
  const { data } = useQuery({
    queryKey: ['admin-revenue'],
    queryFn: () => api.get('/admin/revenue').then(r => r.data.data),
  });
  const { data: dashData } = useQuery({
    queryKey: ['admin-dashboard'],
    queryFn: () => api.get('/admin/dashboard').then(r => r.data.data),
  });

  const monthly = dashData?.charts?.monthly || [];
  const overview = dashData?.overview || {};

  return (
    <div className="w-full space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900">Revenue Analytics</h1>
        <p className="text-slate-500 mt-1">Financial overview of the platform</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          { label: 'Total Revenue', value: formatCurrency(Number(overview.totalRevenue || 0)), color: 'text-green-600', bg: 'bg-green-50' },
          { label: 'This Month', value: formatCurrency(Number(overview.monthRevenue || 0)), color: 'text-brand-600', bg: 'bg-brand-50' },
          { label: 'Total Appointments', value: (overview.totalAppointments || 0).toLocaleString(), color: 'text-violet-600', bg: 'bg-violet-50' },
        ].map(stat => (
          <div key={stat.label} className={`${stat.bg} rounded-2xl p-5 border border-slate-100`}>
            <p className={`text-2xl font-extrabold ${stat.color}`}>{stat.value}</p>
            <p className="text-sm text-slate-500 mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-card">
        <h3 className="font-bold text-slate-900 mb-4">Monthly Revenue (Last 6 Months)</h3>
        <ResponsiveContainer width="100%" height={280}>
          <AreaChart data={monthly} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
            <defs>
              <linearGradient id="revGradAdmin" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#1e6fe8" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#1e6fe8" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} tickFormatter={v => `₹${v/1000}k`} />
            <Tooltip formatter={(v: any) => [formatCurrency(v), 'Revenue']} contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0' }} />
            <Area type="monotone" dataKey="revenue" stroke="#1e6fe8" strokeWidth={2.5} fill="url(#revGradAdmin)" name="Revenue" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-card">
        <h3 className="font-bold text-slate-900 mb-4">Monthly Appointments</h3>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={monthly} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0' }} />
            <Bar dataKey="appointments" fill="#02c9b3" radius={[6, 6, 0, 0]} name="Appointments" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
