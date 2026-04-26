'use client';
// src/app/clinic/page.tsx
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { useAuthStore } from '@/store/auth.store';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  LayoutDashboard, Calendar, Users, Stethoscope, LogOut, Clock, CheckCircle2, X,
  Activity, FileText, Menu, ChevronRight, CreditCard, Settings, IndianRupee,
  RefreshCw, Search, Download, Eye, MapPin, Star, Award,
} from 'lucide-react';
import { cn, formatDate, formatTime, getStatusColor, getPaymentStatusColor, getInitials, formatCurrency } from '@/lib/utils';
import toast from 'react-hot-toast';

const CLINIC_NAV = [
  { key: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { key: 'today', label: "Today's Queue", icon: Calendar },
  { key: 'appointments', label: 'All Appointments', icon: Calendar },
  { key: 'doctors', label: 'Our Doctors', icon: Stethoscope },
  { key: 'profile', label: 'Clinic Profile', icon: Settings },
];

// ── Vitals Modal ──
function VitalsModal({ patient, onClose }: { patient: any; onClose: () => void }) {
  const qc = useQueryClient();
  const [form, setForm] = useState({
    temperature: patient?.vitals?.[0]?.temperature?.toString() || '',
    bloodPressure: patient?.vitals?.[0]?.bloodPressure || '',
    heartRate: patient?.vitals?.[0]?.heartRate?.toString() || '',
    weight: patient?.vitals?.[0]?.weight?.toString() || '',
    height: patient?.vitals?.[0]?.height?.toString() || '',
    oxygenSaturation: patient?.vitals?.[0]?.oxygenSaturation?.toString() || '',
    notes: '',
  });
  const up = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  const mutation = useMutation({
    mutationFn: (data: any) => api.post(`/patients/${patient.id}/vitals`, data),
    onSuccess: () => { toast.success('Vitals saved!'); qc.invalidateQueries({ queryKey: ['clinic-today'] }); qc.invalidateQueries({ queryKey: ['clinic-appointments'] }); onClose(); },
    onError: (e: any) => toast.error(e.response?.data?.message || 'Failed'),
  });

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-3xl w-full max-w-md shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-slate-900 text-lg">Record Vitals</h3>
              <p className="text-sm text-slate-400">{patient.firstName} {patient.lastName}</p>
            </div>
            <button onClick={onClose} className="p-2 rounded-xl hover:bg-slate-100"><X className="w-5 h-5" /></button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Temperature (°C)', key: 'temperature', placeholder: '98.6' },
              { label: 'Blood Pressure', key: 'bloodPressure', placeholder: '120/80' },
              { label: 'Heart Rate (bpm)', key: 'heartRate', placeholder: '72' },
              { label: 'Weight (kg)', key: 'weight', placeholder: '70' },
              { label: 'Height (cm)', key: 'height', placeholder: '170' },
              { label: 'SpO2 (%)', key: 'oxygenSaturation', placeholder: '98' },
            ].map(({ label, key, placeholder }) => (
              <div key={key}>
                <label className="block text-xs font-semibold text-slate-600 mb-1">{label}</label>
                <input type="text" value={(form as any)[key]} onChange={e => up(key, e.target.value)} placeholder={placeholder}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-brand-400" />
              </div>
            ))}
            <div className="col-span-2">
              <label className="block text-xs font-semibold text-slate-600 mb-1">Clinical Notes</label>
              <textarea value={form.notes} onChange={e => up('notes', e.target.value)} rows={2}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-brand-400 resize-none" />
            </div>
          </div>
          <div className="flex gap-3 mt-4">
            <button onClick={onClose} className="flex-1 py-3 border border-slate-200 text-slate-700 font-semibold rounded-2xl">Cancel</button>
            <button onClick={() => mutation.mutate(form)} disabled={mutation.isPending}
              className="flex-1 py-3 bg-brand-600 text-white font-bold rounded-2xl disabled:opacity-60 hover:bg-brand-700 flex items-center justify-center gap-2">
              <Activity className="w-4 h-4" /> {mutation.isPending ? 'Saving...' : 'Save Vitals'}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// ── Reschedule Modal ──
function RescheduleModal({ appointment, onClose }: { appointment: any; onClose: () => void }) {
  const qc = useQueryClient();
  const [form, setForm] = useState({ scheduledDate: '', scheduledTime: '' });

  const mutation = useMutation({
    mutationFn: (data: any) => api.put(`/clinics/me/appointments/${appointment.id}/reschedule`, data),
    onSuccess: () => { toast.success('Appointment rescheduled!'); qc.invalidateQueries({ queryKey: ['clinic-today'] }); qc.invalidateQueries({ queryKey: ['clinic-appointments'] }); onClose(); },
    onError: (e: any) => toast.error(e.response?.data?.message || 'Failed to reschedule'),
  });

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-3xl w-full max-w-sm shadow-2xl p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-bold text-slate-900">Reschedule Appointment</h3>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-slate-100"><X className="w-5 h-5" /></button>
        </div>
        <div className="bg-brand-50 border border-brand-100 rounded-2xl p-3 mb-4">
          <p className="font-semibold text-slate-900 text-sm">{appointment.patient?.firstName} {appointment.patient?.lastName}</p>
          <p className="text-xs text-slate-500">Dr. {appointment.doctor?.user?.firstName} {appointment.doctor?.user?.lastName}</p>
          <p className="text-xs text-slate-400">Original: {formatDate(appointment.scheduledDate)} at {formatTime(appointment.scheduledTime)}</p>
        </div>
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">New Date</label>
            <input type="date" value={form.scheduledDate} onChange={e => setForm(f => ({...f, scheduledDate: e.target.value}))} min={new Date().toISOString().split('T')[0]}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm outline-none focus:border-brand-400" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">New Time</label>
            <input type="time" value={form.scheduledTime} onChange={e => setForm(f => ({...f, scheduledTime: e.target.value}))}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm outline-none focus:border-brand-400" />
          </div>
        </div>
        <div className="flex gap-3 mt-5">
          <button onClick={onClose} className="flex-1 py-3 border border-slate-200 text-slate-700 font-semibold rounded-2xl">Cancel</button>
          <button onClick={() => mutation.mutate(form)} disabled={mutation.isPending || !form.scheduledDate || !form.scheduledTime}
            className="flex-1 py-3 bg-brand-600 text-white font-bold rounded-2xl disabled:opacity-60">
            {mutation.isPending ? 'Saving...' : 'Reschedule'}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

// ── Appointment Card ──
function AptCard({ apt, onVitals, onReschedule }: any) {
  const qc = useQueryClient();
  const confirmMutation = useMutation({
    mutationFn: () => api.put(`/appointments/${apt.id}/status`, { status: 'CONFIRMED' }),
    onSuccess: () => { toast.success('Confirmed'); qc.invalidateQueries({ queryKey: ['clinic-today'] }); qc.invalidateQueries({ queryKey: ['clinic-appointments'] }); },
  });
  const acceptPayMutation = useMutation({
    mutationFn: () => api.post(`/clinics/me/appointments/${apt.id}/accept-payment`),
    onSuccess: () => { toast.success('Payment accepted!'); qc.invalidateQueries({ queryKey: ['clinic-today'] }); qc.invalidateQueries({ queryKey: ['clinic-appointments'] }); },
  });

  const hasVitals = apt.patient?.vitals?.length > 0;
  const v = hasVitals ? apt.patient.vitals[0] : null;

  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-card">
      <div className="flex items-start gap-4">
        <div className="text-center bg-brand-50 rounded-xl py-2 px-3 shrink-0">
          <p className="text-lg font-extrabold text-brand-600 leading-none">{formatTime(apt.scheduledTime).split(' ')[0]}</p>
          <p className="text-xs text-brand-400">{formatTime(apt.scheduledTime).split(' ')[1]}</p>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 flex-wrap">
            <div>
              <p className="font-bold text-slate-900">{apt.patient?.firstName} {apt.patient?.lastName}</p>
              <p className="text-xs text-slate-400 capitalize">{apt.patient?.gender?.toLowerCase()} · Dr. {apt.doctor?.user?.firstName} {apt.doctor?.user?.lastName}</p>
            </div>
            <span className={cn('px-2.5 py-1 rounded-full text-xs font-semibold border shrink-0', getStatusColor(apt.status))}>{apt.status}</span>
          </div>
          {/* Vitals preview */}
          {hasVitals && (
            <div className="flex gap-2 mt-2 flex-wrap">
              {v?.temperature && <span className="text-xs bg-orange-50 text-orange-600 border border-orange-100 px-2 py-0.5 rounded-full">🌡️ {v.temperature}°C</span>}
              {v?.bloodPressure && <span className="text-xs bg-red-50 text-red-600 border border-red-100 px-2 py-0.5 rounded-full">❤️ {v.bloodPressure}</span>}
              {v?.weight && <span className="text-xs bg-blue-50 text-blue-600 border border-blue-100 px-2 py-0.5 rounded-full">⚖️ {v.weight}kg</span>}
              {v?.oxygenSaturation && <span className="text-xs bg-teal-50 text-teal-600 border border-teal-100 px-2 py-0.5 rounded-full">💨 {v.oxygenSaturation}%</span>}
            </div>
          )}
          {/* Payment info */}
          {apt.payment && (
            <div className="flex items-center gap-2 mt-1.5">
              <span className="text-xs text-slate-400">{formatCurrency(Number(apt.payment.amount))}</span>
              <span className={cn('text-xs font-semibold px-2 py-0.5 rounded-full', getPaymentStatusColor(apt.payment.status))}>{apt.payment.status}</span>
              <span className="text-xs text-slate-400 capitalize">{apt.payment.paymentMode?.replace('_', ' ').toLowerCase()}</span>
            </div>
          )}
        </div>
      </div>
      <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-slate-50">
        <button onClick={() => onVitals(apt.patient)} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-teal-700 border border-teal-200 rounded-xl hover:bg-teal-50 transition-colors">
          <Activity className="w-3.5 h-3.5" /> {hasVitals ? 'Update Vitals' : 'Record Vitals'}
        </button>
        {apt.status === 'PENDING' && (
          <button onClick={() => confirmMutation.mutate()} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-green-700 border border-green-200 rounded-xl hover:bg-green-50 transition-colors">
            <CheckCircle2 className="w-3.5 h-3.5" /> Confirm
          </button>
        )}
        {apt.payment?.status === 'PENDING' && apt.payment?.paymentMode === 'PAY_AT_CLINIC' && (
          <button onClick={() => acceptPayMutation.mutate()} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-violet-700 border border-violet-200 rounded-xl hover:bg-violet-50 transition-colors">
            <CreditCard className="w-3.5 h-3.5" /> Accept Payment
          </button>
        )}
        <button onClick={() => onReschedule(apt)} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-amber-700 border border-amber-200 rounded-xl hover:bg-amber-50 transition-colors">
          <RefreshCw className="w-3.5 h-3.5" /> Reschedule
        </button>
        {apt.prescription && (
          <a href={`${process.env.NEXT_PUBLIC_API_URL}/prescriptions/${apt.prescription.id}/pdf`} target="_blank" rel="noopener"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-brand-700 border border-brand-200 rounded-xl hover:bg-brand-50 transition-colors">
            <FileText className="w-3.5 h-3.5" /> Prescription
          </a>
        )}
      </div>
    </div>
  );
}

export default function ClinicAdminPortal() {
  const { user, isAuthenticated, logout } = useAuthStore();
  const router = useRouter();
  const qc = useQueryClient();
  const [tab, setTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [vitalsPatient, setVitalsPatient] = useState<any>(null);
  const [rescheduleApt, setRescheduleApt] = useState<any>(null);
  const [aptStatus, setAptStatus] = useState('');
  const [aptDoctor, setAptDoctor] = useState('');
  const [aptDate, setAptDate] = useState('');
  const [profileForm, setProfileForm] = useState({ name: '', phone: '', address: '', description: '', timings: '' });

  useEffect(() => {
    if (!isAuthenticated) { router.replace('/login'); return; }
    if (user?.role !== 'CLINIC_ADMIN') { router.replace('/admin'); }
  }, [isAuthenticated, user]);

  const { data: dashData } = useQuery({ queryKey: ['clinic-dashboard'], queryFn: () => api.get('/clinics/me/dashboard').then(r => r.data.data), enabled: tab === 'dashboard' });
  const { data: todayData } = useQuery({ queryKey: ['clinic-today'], queryFn: () => api.get('/clinics/me/appointments', { params: { date: new Date().toISOString().split('T')[0], limit: 100 } }).then(r => r.data.data.appointments), enabled: tab === 'today' });
  const { data: allApts } = useQuery({ queryKey: ['clinic-appointments', aptStatus, aptDoctor, aptDate], queryFn: () => api.get('/clinics/me/appointments', { params: { status: aptStatus || undefined, doctorId: aptDoctor || undefined, date: aptDate || undefined, limit: 50 } }).then(r => r.data.data), enabled: tab === 'appointments' });
  const { data: myClinic } = useQuery({ queryKey: ['my-clinic'], queryFn: () => api.get('/clinics/me/clinic').then(r => r.data.data), onSuccess: (data: any) => { if (data) setProfileForm({ name: data.name, phone: data.phone || '', address: data.address, description: data.description || '', timings: data.timings || '' }); } } as any);

  const updateClinicMutation = useMutation({
    mutationFn: (data: any) => api.put(`/clinics/${myClinic?.id}`, data),
    onSuccess: () => { toast.success('Profile updated!'); qc.invalidateQueries({ queryKey: ['my-clinic'] }); },
  });

  if (!isAuthenticated || !user) return <div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-2 border-brand-600 border-t-transparent rounded-full animate-spin" /></div>;

  const handleLogout = async () => { await logout(); router.push('/'); };
  const dash = dashData;
  const today = todayData || [];

  const Sidebar = () => (
    <div className="flex flex-col h-full">
      <div className="px-5 py-5 border-b border-slate-800">
        <p className="text-white font-bold text-lg">🏥 {myClinic?.name || 'Clinic Portal'}</p>
        <p className="text-slate-400 text-xs mt-0.5">Clinic Admin Dashboard</p>
      </div>
      <div className="px-3 py-3 border-b border-slate-800">
        <div className="bg-slate-800/50 rounded-2xl p-3 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-brand-gradient flex items-center justify-center text-white font-bold text-xs shrink-0">{getInitials(user.firstName, user.lastName)}</div>
          <div className="min-w-0"><p className="text-white font-semibold text-sm truncate">{user.firstName} {user.lastName}</p><p className="text-slate-400 text-xs">Clinic Admin</p></div>
        </div>
      </div>
      <nav className="flex-1 px-3 py-4 space-y-1">
        {CLINIC_NAV.map(item => (
          <button key={item.key} onClick={() => { setTab(item.key); setSidebarOpen(false); }}
            className={cn('flex items-center gap-3 w-full px-4 py-2.5 rounded-2xl text-sm font-medium transition-all text-left', tab === item.key ? 'bg-brand-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white')}>
            <item.icon className="w-4 h-4" />{item.label}
            {tab === item.key && <ChevronRight className="w-3.5 h-3.5 ml-auto opacity-60" />}
          </button>
        ))}
      </nav>
      <div className="px-3 py-4 border-t border-slate-800">
        <button onClick={handleLogout} className="flex items-center gap-3 w-full px-4 py-2.5 rounded-2xl text-sm font-medium text-red-400 hover:bg-red-900/30 transition-colors">
          <LogOut className="w-4 h-4" /> Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-surface-subtle flex">
      <aside className="hidden lg:flex flex-col w-64 bg-slate-900 fixed h-full z-30"><Sidebar /></aside>

      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
            <motion.aside initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }} className="fixed left-0 top-0 h-full w-72 bg-slate-900 z-50 flex flex-col shadow-2xl">
              <div className="flex items-center justify-between px-5 pt-5 pb-3">
                <span className="text-white font-bold">Clinic Portal</span>
                <button onClick={() => setSidebarOpen(false)} className="p-2 rounded-xl hover:bg-slate-800 text-slate-400"><X className="w-5 h-5" /></button>
              </div>
              <Sidebar />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <div className="lg:ml-64 flex-1 flex flex-col min-h-screen">
        <header className="bg-white border-b border-slate-100 px-4 sm:px-6 h-16 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 rounded-xl hover:bg-slate-100"><Menu className="w-5 h-5" /></button>
            <h2 className="font-bold text-slate-900">{CLINIC_NAV.find(n => n.key === tab)?.label}</h2>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-500"><span className="w-2 h-2 rounded-full bg-green-400" /><span>Live</span></div>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          {/* ── DASHBOARD ── */}
          {tab === 'dashboard' && (
            <div className="w-full space-y-5">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label: 'Total Appointments', val: dash?.totalAppointments || 0, icon: Calendar, color: 'bg-brand-50 text-brand-600' },
                  { label: "Today's Bookings", val: dash?.todayAppointments || 0, icon: Clock, color: 'bg-amber-50 text-amber-600' },
                  { label: 'Total Doctors', val: dash?.totalDoctors || 0, icon: Stethoscope, color: 'bg-teal-50 text-teal-600' },
                  { label: 'Total Revenue', val: formatCurrency(Number(dash?.totalRevenue || 0)), icon: IndianRupee, color: 'bg-green-50 text-green-600' },
                ].map((stat, i) => (
                  <motion.div key={stat.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
                    className="bg-white rounded-2xl border border-slate-100 p-5 shadow-card">
                    <div className={`w-10 h-10 rounded-2xl ${stat.color} flex items-center justify-center mb-3`}><stat.icon className="w-5 h-5" /></div>
                    <p className="text-2xl font-extrabold text-slate-900">{stat.val}</p>
                    <p className="text-sm text-slate-500 mt-0.5">{stat.label}</p>
                  </motion.div>
                ))}
              </div>
              {/* Status breakdown */}
              <div className="grid grid-cols-3 gap-4">
                {[
                  { label: 'Pending', val: dash?.pending || 0, color: 'bg-amber-50 text-amber-700' },
                  { label: 'Confirmed', val: dash?.confirmed || 0, color: 'bg-blue-50 text-blue-700' },
                  { label: 'Completed', val: dash?.completed || 0, color: 'bg-green-50 text-green-700' },
                ].map(s => (
                  <div key={s.label} className={`${s.color} rounded-2xl p-4 border border-slate-100`}>
                    <p className="text-2xl font-extrabold">{s.val}</p><p className="text-sm">{s.label}</p>
                  </div>
                ))}
              </div>
              {/* Per-doctor appointments */}
              {dash?.doctors?.length > 0 && (
                <div className="bg-white rounded-2xl border border-slate-100 shadow-card overflow-hidden">
                  <div className="px-5 py-4 border-b border-slate-100"><h3 className="font-bold text-slate-900">Doctors Performance</h3></div>
                  <div className="divide-y divide-slate-50">
                    {dash.doctors.map((doc: any) => (
                      <div key={doc.id} className="flex items-center gap-4 px-5 py-3.5">
                        <img src={doc.user?.avatar || `https://ui-avatars.com/api/?name=${doc.user?.firstName}&background=1e6fe8&color=fff`}
                          className="w-10 h-10 rounded-xl object-cover shrink-0" alt="" />
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-slate-900 text-sm">Dr. {doc.user?.firstName} {doc.user?.lastName}</p>
                          <p className="text-xs text-slate-400">{doc.speciality?.name}</p>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="font-bold text-slate-900">{doc._count?.appointments || 0}</p>
                          <p className="text-xs text-slate-400">appointments</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── TODAY'S QUEUE ── */}
          {tab === 'today' && (
            <div className="w-full space-y-4">
              <div className="grid grid-cols-4 gap-3">
                {[
                  { l: 'Total', v: today.length, c: 'bg-slate-50' },
                  { l: 'Pending', v: today.filter((a: any) => a.status === 'PENDING').length, c: 'bg-amber-50 text-amber-700' },
                  { l: 'Confirmed', v: today.filter((a: any) => a.status === 'CONFIRMED').length, c: 'bg-blue-50 text-blue-700' },
                  { l: 'Done', v: today.filter((a: any) => a.status === 'COMPLETED').length, c: 'bg-green-50 text-green-700' },
                ].map(s => (
                  <div key={s.l} className={`${s.c} rounded-2xl p-3 border border-slate-100 text-center`}>
                    <p className="text-2xl font-extrabold text-slate-900">{s.v}</p><p className="text-xs mt-0.5">{s.l}</p>
                  </div>
                ))}
              </div>
              {today.length === 0 ? (
                <div className="bg-white rounded-2xl border border-slate-100 p-12 text-center shadow-card">
                  <div className="text-5xl mb-3">🗓️</div><p className="font-semibold text-slate-700">No appointments today</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {today.map((apt: any) => (
                    <AptCard key={apt.id} apt={apt} onVitals={(p: any) => setVitalsPatient(p)} onReschedule={(a: any) => setRescheduleApt(a)} />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ── ALL APPOINTMENTS ── */}
          {tab === 'appointments' && (
            <div className="w-full space-y-4">
              {/* Filters */}
              <div className="flex flex-wrap gap-3">
                <select value={aptStatus} onChange={e => setAptStatus(e.target.value)} className="px-4 py-2.5 bg-white border border-slate-200 rounded-2xl text-sm outline-none shadow-sm">
                  <option value="">All Status</option>
                  {['PENDING','CONFIRMED','COMPLETED','CANCELLED'].map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                <select value={aptDoctor} onChange={e => setAptDoctor(e.target.value)} className="px-4 py-2.5 bg-white border border-slate-200 rounded-2xl text-sm outline-none shadow-sm">
                  <option value="">All Doctors</option>
                  {(dash?.doctors || []).map((d: any) => <option key={d.id} value={d.id}>Dr. {d.user?.firstName} {d.user?.lastName}</option>)}
                </select>
                <input type="date" value={aptDate} onChange={e => setAptDate(e.target.value)} className="px-4 py-2.5 bg-white border border-slate-200 rounded-2xl text-sm outline-none shadow-sm" />
                {(aptStatus || aptDoctor || aptDate) && <button onClick={() => { setAptStatus(''); setAptDoctor(''); setAptDate(''); }} className="px-4 py-2.5 text-sm text-slate-600 bg-white border border-slate-200 rounded-2xl hover:bg-slate-50">Clear</button>}
              </div>

              <div className="space-y-3">
                {(allApts?.appointments || []).map((apt: any) => (
                  <AptCard key={apt.id} apt={apt} onVitals={(p: any) => setVitalsPatient(p)} onReschedule={(a: any) => setRescheduleApt(a)} />
                ))}
                {(allApts?.appointments || []).length === 0 && (
                  <div className="bg-white rounded-2xl border border-slate-100 p-12 text-center shadow-card">
                    <p className="text-slate-400">No appointments found</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── DOCTORS ── */}
          {tab === 'doctors' && (
            <div className="w-full grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {(dash?.doctors || []).map((doc: any) => (
                <div key={doc.id} className="bg-white rounded-2xl border border-slate-100 p-5 shadow-card">
                  <div className="flex items-center gap-3 mb-4">
                    <img src={doc.user?.avatar || `https://ui-avatars.com/api/?name=${doc.user?.firstName}&background=1e6fe8&color=fff`}
                      className="w-14 h-14 rounded-2xl object-cover ring-2 ring-brand-50" alt="" />
                    <div>
                      <p className="font-bold text-slate-900">Dr. {doc.user?.firstName} {doc.user?.lastName}</p>
                      <p className="text-xs text-brand-600 font-medium">{doc.speciality?.name}</p>
                      <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-400">
                        <span className="flex items-center gap-1"><Award className="w-3 h-3" />{doc.experience} yrs</span>
                        <span className="flex items-center gap-1"><Star className="w-3 h-3 fill-amber-400 text-amber-400" />{Number(doc.rating).toFixed(1)}</span>
                      </div>
                    </div>
                  </div>
                  {/* Today's slots preview */}
                  <div className="mb-3">
                    <p className="text-xs text-slate-400 font-semibold mb-2">AVAILABLE SLOTS TODAY</p>
                    <div className="flex flex-wrap gap-1">
                      {doc.slots?.slice(0, 4).map((slot: any) => (
                        <span key={slot.id} className="text-xs bg-brand-50 text-brand-600 border border-brand-100 px-2 py-0.5 rounded-full">
                          {slot.startTime}–{slot.endTime}
                        </span>
                      ))}
                      {doc.slots?.length === 0 && <span className="text-xs text-slate-400">No slots configured</span>}
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t border-slate-50 text-xs text-slate-400">
                    <span>{doc._count?.appointments || 0} total appointments</span>
                    <span className={doc.isVerified ? 'text-green-600 font-semibold' : 'text-amber-600'}>{doc.isVerified ? '✓ Verified' : 'Pending'}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ── CLINIC PROFILE ── */}
          {tab === 'profile' && (
            <div className="max-w-2xl mx-auto">
              <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-card">
                <h3 className="font-bold text-slate-900 text-xl mb-5 flex items-center gap-2"><Settings className="w-5 h-5 text-brand-500" />Clinic Profile</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  {[
                    { label: 'Clinic Name', key: 'name' },
                    { label: 'Phone', key: 'phone' },
                    { label: 'Address', key: 'address' },
                    { label: 'Timings', key: 'timings' },
                  ].map(({ label, key }) => (
                    <div key={key}>
                      <label className="block text-sm font-semibold text-slate-700 mb-1.5">{label}</label>
                      <input type="text" value={(profileForm as any)[key]} onChange={e => setProfileForm(f => ({ ...f, [key]: e.target.value }))}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm outline-none focus:border-brand-400 transition-all" />
                    </div>
                  ))}
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Description</label>
                    <textarea value={profileForm.description} onChange={e => setProfileForm(f => ({ ...f, description: e.target.value }))} rows={3}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm outline-none focus:border-brand-400 resize-none transition-all" />
                  </div>
                </div>
                <button onClick={() => updateClinicMutation.mutate(profileForm)} disabled={updateClinicMutation.isPending}
                  className="mt-5 px-6 py-3 bg-brand-600 text-white font-bold rounded-2xl text-sm disabled:opacity-60 flex items-center gap-2">
                  <Settings className="w-4 h-4" /> {updateClinicMutation.isPending ? 'Saving...' : 'Save Profile'}
                </button>
              </div>
            </div>
          )}
        </main>
      </div>

      {vitalsPatient && <VitalsModal patient={vitalsPatient} onClose={() => setVitalsPatient(null)} />}
      {rescheduleApt && <RescheduleModal appointment={rescheduleApt} onClose={() => setRescheduleApt(null)} />}
    </div>
  );
}
