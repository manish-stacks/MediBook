'use client';
// src/app/(dashboard)/dashboard/page.tsx
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { useAuthStore } from '@/store/auth.store';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Calendar, Clock, FileText, Users, ArrowRight, Star, MapPin, Plus } from 'lucide-react';
import { cn, formatDate, formatTime, getStatusColor, getInitials, formatCurrency } from '@/lib/utils';

function StatCard({ title, value, icon: Icon, color, href }: any) {
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} whileHover={{ y: -2 }} className="bg-white rounded-2xl border border-slate-100 p-5 shadow-card hover:shadow-card-hover transition-all">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-11 h-11 rounded-2xl ${color} flex items-center justify-center`}>
          <Icon className="w-5 h-5" />
        </div>
        {href && <Link href={href} className="text-xs text-brand-600 hover:underline font-medium flex items-center gap-1">View all <ArrowRight className="w-3 h-3" /></Link>}
      </div>
      <p className="text-3xl font-extrabold text-slate-900">{value}</p>
      <p className="text-sm text-slate-500 mt-1">{title}</p>
    </motion.div>
  );
}

export default function DashboardPage() {
  const { user } = useAuthStore();

  const { data: stats } = useQuery({
    queryKey: ['appointment-stats'],
    queryFn: () => api.get('/appointments/stats').then(r => r.data.data),
  });

  const { data: appointmentsData } = useQuery({
    queryKey: ['upcoming-appointments'],
    queryFn: () => api.get('/appointments?status=CONFIRMED&limit=5').then(r => r.data.data.appointments),
  });

  const { data: patientsData } = useQuery({
    queryKey: ['my-patients'],
    queryFn: () => api.get('/patients').then(r => r.data.data),
  });

  const appointments = appointmentsData || [];
  const patients = patientsData || [];
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="space-y-6 w-full">
      {/* Greeting */}
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900">{greeting}, {user?.firstName}! 👋</h1>
        <p className="text-slate-500 mt-1">Here's your health overview for today.</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Appointments" value={stats?.total || 0} icon={Calendar} color="bg-brand-50 text-brand-600" href="/dashboard/appointments" />
        <StatCard title="Upcoming"    value={stats?.confirmed || 0} icon={Clock}     color="bg-blue-50 text-blue-600"    href="/dashboard/appointments?status=CONFIRMED" />
        <StatCard title="Completed"   value={stats?.completed || 0} icon={Star}      color="bg-green-50 text-green-600"  href="/dashboard/appointments?status=COMPLETED" />
        <StatCard title="Family Members" value={patients.length} icon={Users}      color="bg-violet-50 text-violet-600" href="/dashboard/family" />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Upcoming appointments */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-card overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
              <h2 className="font-bold text-slate-900">Upcoming Appointments</h2>
              <Link href="/dashboard/appointments" className="text-sm text-brand-600 hover:underline font-medium">View all</Link>
            </div>

            {appointments.length === 0 ? (
              <div className="p-10 text-center">
                <div className="text-4xl mb-3">📅</div>
                <p className="font-semibold text-slate-700 mb-1">No upcoming appointments</p>
                <p className="text-sm text-slate-400 mb-4">Book an appointment with a doctor</p>
                <Link href="/doctors" className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-600 text-white font-semibold rounded-xl text-sm">
                  <Plus className="w-4 h-4" /> Book Now
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-slate-50">
                {appointments.map((apt: any) => (
                  <Link key={apt.id} href={`/dashboard/appointments/${apt.id}`} className="flex items-center gap-4 px-5 py-4 hover:bg-slate-50/60 transition-colors">
                    <div className="w-12 h-12 rounded-2xl overflow-hidden shrink-0">
                      <img
                        src={apt.doctor?.user?.avatar || `https://ui-avatars.com/api/?name=${apt.doctor?.user?.firstName}&background=1e6fe8&color=fff`}
                        alt="Doctor"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-slate-900 text-sm">Dr. {apt.doctor?.user?.firstName} {apt.doctor?.user?.lastName}</p>
                      <p className="text-xs text-slate-500">{apt.doctor?.speciality?.name}</p>
                      <div className="flex items-center gap-3 mt-1 text-xs text-slate-400">
                        <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{formatDate(apt.scheduledDate)}</span>
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{formatTime(apt.scheduledTime)}</span>
                        {apt.clinic && <span className="flex items-center gap-1 truncate"><MapPin className="w-3 h-3 shrink-0" />{apt.clinic.name}</span>}
                      </div>
                    </div>
                    <span className={cn('px-2.5 py-1 rounded-full text-xs font-medium border shrink-0', getStatusColor(apt.status))}>
                      {apt.status}
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Family members sidebar */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-card overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
              <h2 className="font-bold text-slate-900">Family Members</h2>
              <Link href="/dashboard/family" className="text-sm text-brand-600 hover:underline font-medium">Manage</Link>
            </div>
            {patients.length === 0 ? (
              <div className="p-6 text-center">
                <p className="text-slate-400 text-sm mb-3">No family members added</p>
                <Link href="/dashboard/family/add" className="text-sm text-brand-600 hover:underline">+ Add member</Link>
              </div>
            ) : (
              <div className="divide-y divide-slate-50">
                {patients.slice(0, 5).map((p: any) => (
                  <div key={p.id} className="flex items-center gap-3 px-5 py-3">
                    <div className="w-9 h-9 rounded-xl bg-brand-100 flex items-center justify-center text-brand-600 font-bold text-xs shrink-0">
                      {getInitials(p.firstName, p.lastName)}
                    </div>
                    <div>
                      <p className="font-medium text-sm text-slate-900">{p.firstName} {p.lastName}</p>
                      <p className="text-xs text-slate-400 capitalize">{p.relation?.toLowerCase()} · {p.gender?.toLowerCase()}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <div className="px-5 py-3 border-t border-slate-50">
              <Link href="/dashboard/family/add" className="flex items-center gap-2 text-sm text-brand-600 font-medium hover:gap-3 transition-all">
                <Plus className="w-4 h-4" /> Add family member
              </Link>
            </div>
          </div>

          {/* Quick actions */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-card p-5">
            <h3 className="font-bold text-slate-900 mb-3 text-sm">Quick Actions</h3>
            <div className="space-y-2">
              {[
                { label: 'Book Appointment',    href: '/doctors',                      icon: Plus,      color: 'bg-brand-50 text-brand-600' },
                { label: 'View Prescriptions',  href: '/dashboard/prescriptions',      icon: FileText,  color: 'bg-teal-50 text-teal-600' },
                { label: 'Payment History',     href: '/dashboard/payments',           icon: Calendar,  color: 'bg-amber-50 text-amber-600' },
              ].map((action) => (
                <Link key={action.href} href={action.href} className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors group">
                  <div className={`w-8 h-8 rounded-xl ${action.color} flex items-center justify-center shrink-0`}>
                    <action.icon className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-medium text-slate-700 group-hover:text-slate-900">{action.label}</span>
                  <ArrowRight className="w-4 h-4 text-slate-300 ml-auto group-hover:text-brand-500 transition-colors" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
