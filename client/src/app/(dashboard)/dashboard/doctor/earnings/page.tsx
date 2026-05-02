'use client';
// src/app/(dashboard)/dashboard/doctor/earnings/page.tsx
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { motion } from 'framer-motion';
import { IndianRupee, TrendingUp, Calendar, CheckCircle2 } from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/utils';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

export default function DoctorEarningsPage() {
  const { data } = useQuery({
    queryKey: ['doctor-earnings'],
    queryFn: () => api.get('/doctors/me/earnings').then(r => r.data.data),
  });
  const { data: stats } = useQuery({
    queryKey: ['doctor-stats'],
    queryFn: () => api.get('/doctors/me/stats').then(r => r.data.data),
  });

  const earnings = data?.earnings || [];
  const monthly  = data?.monthly || [];
  const total    = data?.total || 0;

  return (
    <div className="w-full space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900">Earnings</h1>
        <p className="text-slate-500 mt-1">Track your consultation revenue</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Earned',    value: formatCurrency(Number(stats?.totalEarnings || 0)), icon: IndianRupee, color: 'bg-green-50 text-green-600' },
          { label: 'This Month',      value: formatCurrency(Number(stats?.monthRevenue || 0)),  icon: TrendingUp,  color: 'bg-brand-50 text-brand-600' },
          { label: 'Appointments',    value: stats?.totalAppointments || 0,  icon: Calendar,   color: 'bg-teal-50 text-teal-600' },
          { label: 'Completed',       value: stats?.completedAppointments || 0, icon: CheckCircle2, color: 'bg-violet-50 text-violet-600' },
        ].map((stat, i) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
            className="bg-white rounded-2xl border border-slate-100 p-5 shadow-card">
            <div className={`w-10 h-10 rounded-2xl ${stat.color} flex items-center justify-center mb-3`}>
              <stat.icon className="w-5 h-5" />
            </div>
            <p className="text-2xl font-extrabold text-slate-900">{stat.value}</p>
            <p className="text-sm text-slate-500 mt-1">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Monthly chart */}
      <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-card">
        <h3 className="font-bold text-slate-900 mb-4">Monthly Revenue (Last 6 Months)</h3>
        <ResponsiveContainer width="100%" height={240}>
          <AreaChart data={monthly} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
            <defs>
              <linearGradient id="earningsGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#1e6fe8" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#1e6fe8" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} tickFormatter={v => `₹${v/1000}k`} />
            <Tooltip formatter={(v: any) => [formatCurrency(v), 'Revenue']} contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0' }} />
            <Area type="monotone" dataKey="revenue" stroke="#1e6fe8" strokeWidth={2.5} fill="url(#earningsGrad)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Appointment count chart */}
      <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-card">
        <h3 className="font-bold text-slate-900 mb-4">Monthly Appointments</h3>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={monthly} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0' }} />
            <Bar dataKey="appointments" fill="#02c9b3" radius={[6, 6, 0, 0]} name="Appointments" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Recent earnings */}
      {earnings.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-card overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100">
            <h3 className="font-bold text-slate-900">Recent Payments</h3>
          </div>
          <div className="divide-y divide-slate-50">
            {earnings.slice(0, 10).map((pay: any) => (
              <div key={pay.id} className="px-5 py-3.5 flex items-center justify-between hover:bg-slate-50/50 transition-colors">
                <div>
                  <p className="font-semibold text-slate-900 text-sm">{pay.appointment?.patient?.firstName} {pay.appointment?.patient?.lastName}</p>
                  <p className="text-xs text-slate-400">{pay.appointment?.scheduledDate ? formatDate(pay.appointment.scheduledDate) : ''}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-green-600">{formatCurrency(Number(pay.amount))}</p>
                  <p className="text-xs text-slate-400 capitalize">{pay.paymentMode?.replace('_', ' ').toLowerCase()}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
