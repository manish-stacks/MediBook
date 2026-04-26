'use client';
// src/app/(dashboard)/dashboard/doctor/page.tsx
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { useAuthStore } from '@/store/auth.store';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Calendar, Clock, Users, IndianRupee, ArrowRight, Star, CheckCircle2 } from 'lucide-react';
import { cn, formatTime, formatCurrency, getStatusColor } from '@/lib/utils';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function DoctorDashboardPage() {
  const { user } = useAuthStore();
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  const { data: stats } = useQuery({
    queryKey: ['doctor-stats'],
    queryFn: () => api.get('/doctors/me/stats').then(r => r.data.data),
  });

  const { data: todayApts } = useQuery({
    queryKey: ['doctor-today'],
    queryFn: () => api.get('/doctors/me/today').then(r => r.data.data),
  });

  const { data: earnings } = useQuery({
    queryKey: ['doctor-earnings'],
    queryFn: () => api.get('/doctors/me/earnings').then(r => r.data.data),
  });

  const today = todayApts || [];
  const monthlyData = earnings?.monthly || [];

  return (
    <div className="space-y-6 w-full">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900">{greeting}, Dr. {user?.firstName}! 👨‍⚕️</h1>
        <p className="text-slate-500 mt-1">Here's your practice summary for today.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Today's Appointments", value: stats?.todayAppointments || 0,     icon: Calendar,      color: 'bg-brand-50 text-brand-600', href: '/dashboard/doctor/appointments' },
          { label: 'Total Patients',        value: stats?.totalPatients || 0,         icon: Users,         color: 'bg-teal-50 text-teal-600',   href: '/dashboard/doctor/patients' },
          { label: 'Completed',             value: stats?.completedAppointments || 0, icon: CheckCircle2,  color: 'bg-green-50 text-green-600', href: '/dashboard/doctor/appointments' },
          { label: 'Month Revenue',         value: formatCurrency(stats?.monthRevenue || 0), icon: IndianRupee, color: 'bg-amber-50 text-amber-600', href: '/dashboard/doctor/earnings' },
        ].map((stat, i) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
            className="bg-white rounded-2xl border border-slate-100 p-5 shadow-card hover:shadow-card-hover transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className={cn('w-11 h-11 rounded-2xl flex items-center justify-center', stat.color)}>
                <stat.icon className="w-5 h-5" />
              </div>
              <Link href={stat.href} className="text-xs text-brand-600 hover:underline font-medium">View</Link>
            </div>
            <p className="text-2xl font-extrabold text-slate-900">{stat.value}</p>
            <p className="text-sm text-slate-500 mt-1">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Today's schedule */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-card overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
              <h2 className="font-bold text-slate-900">Today's Schedule</h2>
              <Link href="/dashboard/doctor/appointments" className="text-sm text-brand-600 hover:underline font-medium">View all</Link>
            </div>
            {today.length === 0 ? (
              <div className="p-12 text-center">
                <div className="text-4xl mb-3">🗓️</div>
                <p className="font-semibold text-slate-700 mb-1">No appointments today</p>
                <p className="text-sm text-slate-400">Enjoy your free day!</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-50">
                {today.map((apt: any) => (
                  <Link key={apt.id} href={`/dashboard/doctor/appointments/${apt.id}`} className="flex items-center gap-4 px-5 py-4 hover:bg-slate-50/60 transition-colors">
                    <div className="text-center w-14 shrink-0">
                      <p className="text-lg font-extrabold text-brand-600 leading-none">{formatTime(apt.scheduledTime).split(' ')[0]}</p>
                      <p className="text-xs text-slate-400">{formatTime(apt.scheduledTime).split(' ')[1]}</p>
                    </div>
                    <div className="w-px h-10 bg-slate-100 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-slate-900 text-sm">{apt.patient?.firstName} {apt.patient?.lastName}</p>
                      <p className="text-xs text-slate-400">{apt.clinic?.name || 'Clinic'}</p>
                    </div>
                    <span className={cn('px-2.5 py-1 rounded-full text-xs font-semibold border shrink-0', getStatusColor(apt.status))}>
                      {apt.status}
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Earnings chart + rating */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-card">
            <h3 className="font-bold text-slate-900 mb-1">Monthly Revenue</h3>
            <p className="text-xs text-slate-400 mb-4">Last 6 months</p>
            {monthlyData.length > 0 ? (
              <ResponsiveContainer width="100%" height={140}>
                <AreaChart data={monthlyData} margin={{ top: 0, right: 0, left: -30, bottom: 0 }}>
                  <defs>
                    <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#1e6fe8" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="#1e6fe8" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} tickFormatter={v => `₹${v/1000}k`} />
                  <Tooltip formatter={(v: any) => [formatCurrency(v), 'Revenue']} contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '12px' }} />
                  <Area type="monotone" dataKey="revenue" stroke="#1e6fe8" strokeWidth={2} fill="url(#revGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-32 flex items-center justify-center text-slate-300 text-sm">No earnings data</div>
            )}
          </div>

          {stats && (
            <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-card">
              <h3 className="font-bold text-slate-900 mb-3">Your Rating</h3>
              <div className="flex items-center gap-3 mb-2">
                <p className="text-4xl font-extrabold text-slate-900">{Number(stats.rating || 0).toFixed(1)}</p>
                <div>
                  <div className="flex gap-0.5">{[...Array(5)].map((_, i) => <Star key={i} className={cn('w-4 h-4', i < Math.round(stats.rating || 0) ? 'fill-amber-400 text-amber-400' : 'text-slate-200')} />)}</div>
                  <p className="text-xs text-slate-400 mt-0.5">{stats.totalReviews} reviews</p>
                </div>
              </div>
              <Link href="/dashboard/doctor/appointments" className="text-sm text-brand-600 hover:underline flex items-center gap-1">
                View feedback <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
