'use client';
// src/app/admin/page.tsx
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Users, Stethoscope, Calendar, IndianRupee, TrendingUp, TrendingDown, Building2, Clock, CheckCircle2, XCircle } from 'lucide-react';
import { cn, formatCurrency, formatDate, formatTime, getStatusColor } from '@/lib/utils';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend
} from 'recharts';

export default function AdminDashboard() {
  const { data, isLoading } = useQuery({
    queryKey: ['admin-dashboard'],
    queryFn: () => api.get('/admin/dashboard').then(r => r.data.data),
  });

  if (isLoading) return (
    <div className="space-y-6 max-w-7xl">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">{[...Array(4)].map((_, i) => <div key={i} className="h-28 skeleton rounded-2xl" />)}</div>
      <div className="grid lg:grid-cols-2 gap-5">{[...Array(2)].map((_, i) => <div key={i} className="h-72 skeleton rounded-2xl" />)}</div>
    </div>
  );

  const overview = data?.overview || {};
  const charts   = data?.charts?.monthly || [];
  const recent   = data?.recent?.appointments || [];
  const topDocs  = data?.topDoctors || [];

  const STAT_CARDS = [
    { label: 'Total Patients',    value: overview.totalUsers?.toLocaleString()    || '0', icon: Users,      color: 'bg-brand-50 text-brand-600',  growth: '+12%' },
    { label: 'Verified Doctors',  value: overview.verifiedDoctors?.toLocaleString() || '0', icon: Stethoscope,color: 'bg-teal-50 text-teal-600',    growth: '+5%'  },
    { label: 'Total Clinics',     value: overview.totalClinics?.toLocaleString()  || '0', icon: Building2,  color: 'bg-violet-50 text-violet-600', growth: '+2%'  },
    { label: 'Total Revenue',     value: formatCurrency(Number(overview.totalRevenue || 0)), icon: IndianRupee, color: 'bg-green-50 text-green-600', growth: '+18%' },
    { label: "Today's Bookings",  value: overview.todayAppointments?.toLocaleString() || '0', icon: Calendar, color: 'bg-amber-50 text-amber-600', growth: '' },
    { label: 'Month Revenue',     value: formatCurrency(Number(overview.monthRevenue || 0)), icon: TrendingUp, color: 'bg-rose-50 text-rose-600',  growth: data?.growth?.appointments ? `${data.growth.appointments}%` : '' },
    { label: 'Total Appointments',value: overview.totalAppointments?.toLocaleString() || '0', icon: CheckCircle2, color: 'bg-sky-50 text-sky-600', growth: '' },
    { label: 'Active Users',      value: overview.activeUsers?.toLocaleString()   || '0', icon: Users,      color: 'bg-orange-50 text-orange-600', growth: '' },
  ];

  return (
    <div className="space-y-6 w-full">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900">Admin Dashboard</h1>
        <p className="text-slate-500 mt-1">Platform-wide overview and analytics</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {STAT_CARDS.slice(0, 4).map((stat, i) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
            className="bg-white rounded-2xl border border-slate-100 p-5 shadow-card">
            <div className="flex items-center justify-between mb-3">
              <div className={cn('w-10 h-10 rounded-2xl flex items-center justify-center', stat.color)}>
                <stat.icon className="w-5 h-5" />
              </div>
              {stat.growth && (
                <span className="flex items-center gap-1 text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-full">
                  <TrendingUp className="w-3 h-3" />{stat.growth}
                </span>
              )}
            </div>
            <p className="text-2xl font-extrabold text-slate-900">{stat.value}</p>
            <p className="text-sm text-slate-500 mt-0.5">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Appointment status row */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Pending',    value: data?.appointments?.pending    || 0, color: 'bg-amber-500',  bg: 'bg-amber-50' },
          { label: 'Completed',  value: data?.appointments?.completed  || 0, color: 'bg-green-500',  bg: 'bg-green-50' },
          { label: 'Cancelled',  value: data?.appointments?.cancelled  || 0, color: 'bg-red-500',    bg: 'bg-red-50' },
        ].map(s => (
          <div key={s.label} className={cn('rounded-2xl p-4 border border-slate-100', s.bg)}>
            <div className={cn('w-3 h-3 rounded-full mb-2', s.color)} />
            <p className="text-2xl font-extrabold text-slate-900">{s.value}</p>
            <p className="text-sm text-slate-600">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-5">
        {/* Monthly appointments */}
        <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-card">
          <h3 className="font-bold text-slate-900 mb-1">Monthly Appointments</h3>
          <p className="text-xs text-slate-400 mb-4">Last 6 months</p>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={charts} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '12px' }} />
              <Bar dataKey="appointments" fill="#1e6fe8" radius={[6, 6, 0, 0]} name="Appointments" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Monthly revenue */}
        <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-card">
          <h3 className="font-bold text-slate-900 mb-1">Monthly Revenue</h3>
          <p className="text-xs text-slate-400 mb-4">Last 6 months</p>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={charts} margin={{ top: 0, right: 0, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="revGrad2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#02c9b3" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#02c9b3" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} tickFormatter={v => `₹${v/1000}k`} />
              <Tooltip formatter={(v: any) => [formatCurrency(v), 'Revenue']} contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '12px' }} />
              <Area type="monotone" dataKey="revenue" stroke="#02c9b3" strokeWidth={2} fill="url(#revGrad2)" name="Revenue" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent appointments + Top doctors */}
      <div className="grid lg:grid-cols-2 gap-5">
        {/* Recent appointments */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-card overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
            <h3 className="font-bold text-slate-900">Recent Appointments</h3>
            <Link href="/admin/appointments" className="text-xs text-brand-600 font-semibold hover:underline">View all</Link>
          </div>
          <div className="divide-y divide-slate-50">
            {recent.slice(0, 6).map((apt: any) => (
              <div key={apt.id} className="flex items-center gap-3 px-5 py-3">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-900 truncate">{apt.patient?.firstName} {apt.patient?.lastName}</p>
                  <p className="text-xs text-slate-400 truncate">Dr. {apt.doctor?.user?.firstName} · {formatDate(apt.scheduledDate)}</p>
                </div>
                <div className="text-right shrink-0">
                  <span className={cn('px-2 py-0.5 rounded-full text-xs font-semibold border', getStatusColor(apt.status))}>{apt.status}</span>
                  {apt.payment && <p className="text-xs text-slate-400 mt-0.5">{formatCurrency(Number(apt.payment.amount))}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top doctors */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-card overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
            <h3 className="font-bold text-slate-900">Top Doctors</h3>
            <Link href="/admin/doctors" className="text-xs text-brand-600 font-semibold hover:underline">View all</Link>
          </div>
          <div className="divide-y divide-slate-50">
            {topDocs.map((doc: any, i: number) => (
              <div key={doc.id} className="flex items-center gap-3 px-5 py-3">
                <span className="text-slate-300 font-bold text-sm w-5 shrink-0">#{i + 1}</span>
                <div className="w-9 h-9 rounded-xl overflow-hidden shrink-0">
                  <img src={doc.user?.avatar || `https://ui-avatars.com/api/?name=${doc.user?.firstName}&background=1e6fe8&color=fff`} className="w-full h-full object-cover" alt="" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-900 truncate">Dr. {doc.user?.firstName} {doc.user?.lastName}</p>
                  <p className="text-xs text-slate-400">{doc.speciality?.name}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-bold text-slate-900">{doc._count?.appointments || 0}</p>
                  <p className="text-xs text-slate-400">appointments</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
