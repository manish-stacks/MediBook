'use client';
// src/app/admin/layout.tsx
import { useAuthStore } from '@/store/auth.store';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, Users, Stethoscope, Calendar, BarChart3, Building2, LogOut, Stethoscope as Logo, Menu, X, ChevronRight, Settings, Bell, FileText, Star, Globe } from 'lucide-react';
import { cn, getInitials } from '@/lib/utils';
import toast from 'react-hot-toast';

const ADMIN_NAV = [
  { href: '/admin',               label: 'Dashboard',     icon: LayoutDashboard },
  { href: '/admin/doctors',       label: 'Doctors',       icon: Stethoscope },
  { href: '/admin/appointments',  label: 'Appointments',  icon: Calendar },
  { href: '/admin/patients',      label: 'Patients',      icon: Users },
  { href: '/admin/users',         label: 'Users',         icon: Users },
  { href: '/admin/clinics',       label: 'Clinics',       icon: Building2 },
  { href: '/admin/specialities',  label: 'Specialities',  icon: Star },
  { href: '/admin/blog',          label: 'Blog',          icon: FileText },
  { href: '/admin/testimonials',  label: 'Testimonials',  icon: Star },
  { href: '/admin/notifications', label: 'Notifications', icon: Bell },
  { href: '/admin/revenue',       label: 'Revenue',       icon: BarChart3 },
  { href: '/admin/settings',      label: 'Settings',      icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated, logout } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) { router.replace('/login'); return; }
    if (user?.role === 'CLINIC_ADMIN') { router.replace('/clinic'); return; }
    if (user?.role !== 'SUPER_ADMIN') { router.replace('/dashboard'); }
  }, [isAuthenticated, user]);

  if (!isAuthenticated || !user) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-brand-600 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  const handleLogout = async () => { await logout(); toast.success('Logged out'); router.push('/'); };

  const Sidebar = () => (
    <div className="flex flex-col h-full">
      <div className="px-5 py-5 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-brand-gradient flex items-center justify-center"><Logo className="w-4 h-4 text-white" /></div>
          <div><span className="text-white font-bold text-sm">MediBook</span><p className="text-slate-400 text-xs">Admin Panel</p></div>
        </div>
      </div>

      {/* <div className="px-3 py-3 border-b border-slate-800">
        <div className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-2xl">
          <div className="w-9 h-9 rounded-xl bg-brand-gradient flex items-center justify-center text-white font-bold text-xs shrink-0">
            {getInitials(user.firstName, user.lastName)}
          </div>
          <div className="min-w-0">
            <p className="text-white font-semibold text-sm truncate">{user.firstName} {user.lastName}</p>
            <p className="text-slate-400 text-xs capitalize">{user.role.toLowerCase().replace('_', ' ')}</p>
          </div>
        </div>
      </div> */}

      <nav className="flex-1 px-3 py-4 overflow-y-auto space-y-1">
        {ADMIN_NAV.map(item => {
          const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
          return (
            <Link key={item.href} href={item.href} onClick={() => setSidebarOpen(false)}
              className={cn('flex items-center gap-3 px-4 py-2.5 rounded-2xl text-sm font-medium transition-all', isActive ? 'bg-brand-600 text-white shadow-sm' : 'text-slate-400 hover:bg-slate-800 hover:text-white')}>
              <item.icon className="w-4 h-4 shrink-0" />
              {item.label}
              {isActive && <ChevronRight className="w-3.5 h-3.5 ml-auto opacity-60" />}
            </Link>
          );
        })}
      </nav>

      <div className="px-3 py-4 border-t border-slate-800">
        <button onClick={handleLogout} className="flex items-center gap-3 w-full px-4 py-2.5 rounded-2xl text-sm font-medium text-red-400 hover:bg-red-900/30 transition-colors">
          <LogOut className="w-4 h-4" /> Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <aside className="hidden lg:flex flex-col w-64 bg-slate-900 fixed h-full z-30">
        <Sidebar />
      </aside>

      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
            <motion.aside initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }} className="fixed left-0 top-0 h-full w-72 bg-slate-900 z-50 flex flex-col shadow-2xl">
              <div className="flex items-center justify-between px-5 pt-5 pb-3">
                <span className="text-white font-bold">Admin Panel</span>
                <button onClick={() => setSidebarOpen(false)} className="p-2 rounded-xl hover:bg-slate-800 text-slate-400"><X className="w-5 h-5" /></button>
              </div>
              <Sidebar />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <div className="lg:ml-64 flex-1 flex flex-col min-h-screen">
        <header className="bg-white border-b border-slate-100 px-4 sm:px-6 h-16 flex items-center justify-between sticky top-0 z-20">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 rounded-xl hover:bg-slate-100"><Menu className="w-5 h-5" /></button>
          <div className="hidden lg:block">
            <h2 className="font-bold text-slate-900">{ADMIN_NAV.find(n => n.href === pathname || (n.href !== '/admin' && pathname.startsWith(n.href)))?.label || 'Admin'}</h2>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <span className="w-2 h-2 rounded-full bg-green-400" />
            <span>Live System</span>
          </div>
        </header>
        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
