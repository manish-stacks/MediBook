'use client';
// src/app/(dashboard)/dashboard/layout.tsx
import { useAuthStore } from '@/store/auth.store';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Calendar, Users, FileText, CreditCard,
  Settings, LogOut, Stethoscope, Bell, Menu, X, ChevronRight
} from 'lucide-react';
import { cn, getInitials } from '@/lib/utils';
import toast from 'react-hot-toast';

const PATIENT_NAV = [
  { href: '/dashboard',              label: 'Overview',       icon: LayoutDashboard },
  { href: '/dashboard/appointments', label: 'Appointments',   icon: Calendar },
  { href: '/dashboard/favorites',    label: 'Favorites',      icon: Users },
  { href: '/dashboard/family',       label: 'My Family',      icon: Users },
  { href: '/dashboard/prescriptions',label: 'Prescriptions',  icon: FileText },
  { href: '/dashboard/payments',     label: 'Payments',       icon: CreditCard },
  { href: '/dashboard/profile',      label: 'Profile',        icon: Settings },
];

const DOCTOR_NAV = [
  { href: '/dashboard/doctor',              label: 'Overview',     icon: LayoutDashboard },
  { href: '/dashboard/doctor/appointments', label: 'Appointments', icon: Calendar },
  { href: '/dashboard/doctor/patients',     label: 'Patients',     icon: Users },
  { href: '/dashboard/doctor/slots',        label: 'Manage Slots', icon: Calendar },
  { href: '/dashboard/doctor/earnings',     label: 'Earnings',     icon: CreditCard },
  { href: '/dashboard/profile',             label: 'Profile',      icon: Settings },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated, logout } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) router.replace('/login');
    else if (user?.role === 'DOCTOR' && pathname === '/dashboard') router.replace('/dashboard/doctor');
    else if ((user?.role === 'SUPER_ADMIN' || user?.role === 'CLINIC_ADMIN') && pathname === '/dashboard') router.replace('/admin');
  }, [isAuthenticated, user]);

  if (!isAuthenticated || !user) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-brand-600 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  const nav = user.role === 'DOCTOR' ? DOCTOR_NAV : PATIENT_NAV;

  const handleLogout = async () => {
    await logout();
    toast.success('Logged out');
    router.push('/');
  };

  const Sidebar = ({ mobile = false }) => (
    <div className={cn('flex flex-col h-full', mobile && 'pt-4')}>
      {/* Logo */}
      <div className="px-5 pb-5 border-b border-slate-100">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-brand-gradient flex items-center justify-center">
            <Stethoscope className="w-4 h-4 text-white" />
          </div>
          <span className="text-lg font-extrabold gradient-text">MediBook</span>
        </Link>
      </div>

      {/* User info */}
      <div className="px-4 py-4 border-b border-slate-100">
        <div className="flex items-center gap-3 p-3 bg-brand-50 rounded-2xl">
          <div className="w-10 h-10 rounded-xl bg-brand-gradient flex items-center justify-center text-white font-bold text-sm shrink-0">
            {user.avatar ? <img src={user.avatar} className="w-full h-full rounded-xl object-cover" alt="" /> : getInitials(user.firstName, user.lastName)}
          </div>
          <div className="min-w-0">
            <p className="font-bold text-slate-900 text-sm truncate">{user.firstName} {user.lastName}</p>
            <p className="text-xs text-slate-500 capitalize">{user.role.toLowerCase().replace('_', ' ')}</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto">
        <div className="space-y-1">
          {nav.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/dashboard' && item.href !== '/dashboard/doctor' && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  'flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition-all',
                  isActive ? 'bg-brand-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900',
                )}
              >
                <item.icon className="w-4 h-4 shrink-0" />
                {item.label}
                {isActive && <ChevronRight className="w-3.5 h-3.5 ml-auto opacity-60" />}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Logout */}
      <div className="px-3 py-4 border-t border-slate-100">
        <button onClick={handleLogout} className="flex items-center gap-3 w-full px-4 py-3 rounded-2xl text-sm font-medium text-red-600 hover:bg-red-50 transition-colors">
          <LogOut className="w-4 h-4" /> Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-surface-subtle flex">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-slate-100 fixed h-full z-30">
        <Sidebar />
      </aside>

      {/* Mobile sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
            <motion.aside initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }} className="fixed left-0 top-0 h-full w-72 bg-white z-50 lg:hidden shadow-2xl flex flex-col">
              <div className="flex items-center justify-between px-5 pt-5 pb-3">
                <span className="font-extrabold gradient-text text-lg">MediBook</span>
                <button onClick={() => setSidebarOpen(false)} className="p-2 rounded-xl hover:bg-slate-100"><X className="w-5 h-5" /></button>
              </div>
              <Sidebar mobile />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main content */}
      <div className="lg:ml-64 flex-1 flex flex-col min-h-screen">
        {/* Top bar */}
        <header className="bg-white border-b border-slate-100 px-4 sm:px-6 h-16 flex items-center justify-between sticky top-0 z-20">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 rounded-xl hover:bg-slate-100 text-slate-600">
            <Menu className="w-5 h-5" />
          </button>
          <div className="lg:hidden flex items-center gap-2">
            <Stethoscope className="w-5 h-5 text-brand-600" />
            <span className="font-bold text-slate-800">MediBook</span>
          </div>
          <div className="hidden lg:block" />
          <div className="flex items-center gap-3">
            <Link href="/doctors" className="hidden sm:inline-flex items-center gap-2 px-4 py-2 bg-brand-50 text-brand-700 font-medium text-sm rounded-xl hover:bg-brand-100 transition-colors">
              + Book Appointment
            </Link>
            <button className="relative p-2.5 rounded-xl hover:bg-slate-100 text-slate-500 transition-colors">
              <Bell className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
