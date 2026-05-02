'use client';
// src/components/layout/Navbar.tsx
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Bell, ChevronDown, Stethoscope, User, LogOut, LayoutDashboard, Calendar } from 'lucide-react';
import { useAuthStore } from '@/store/auth.store';
import { cn, getInitials } from '@/lib/utils';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

const NAV_LINKS = [
  { href: '/doctors',       label: 'Find Doctors' },
  { href: '/specialities',  label: 'Specialities' },
  { href: '/clinics',       label: 'Clinics' },
  { href: '/blog',          label: 'Health Blog' },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuthStore();
  const [isOpen, setIsOpen]   = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  const handleLogout = async () => {
    await logout();
    toast.success('Logged out successfully');
    router.push('/');
    setUserMenuOpen(false);
  };

  const getDashboardHref = () => {
    if (!user) return '/login';
    const map: Record<string, string> = {
      SUPER_ADMIN: '/admin',
      CLINIC_ADMIN: '/admin',
      DOCTOR: '/dashboard/doctor',
      PATIENT: '/dashboard',
    };
    return map[user.role] || '/dashboard';
  };

  return (
    <header
      className={cn(
        'fixed top-0 inset-x-0 z-50 transition-all duration-300',
        scrolled ? 'glass shadow-sm border-b border-white/60' : 'bg-transparent',
      )}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-xl bg-brand-gradient flex items-center justify-center shadow-sm">
              <Stethoscope className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-bold gradient-text">MediBook</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200',
                  pathname.startsWith(link.href)
                    ? 'text-brand-600 bg-brand-50'
                    : 'text-slate-600 hover:text-brand-600 hover:bg-brand-50/60',
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right side */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated && user ? (
              <>
                <Link href="/dashboard/appointments" className="relative p-2 text-slate-500 hover:text-brand-600 hover:bg-brand-50 rounded-xl transition-all">
                  <Bell className="w-5 h-5" />
                </Link>
                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-xl hover:bg-slate-50 border border-slate-100 transition-all"
                  >
                    <div className="w-8 h-8 rounded-xl bg-brand-gradient flex items-center justify-center text-white text-xs font-bold">
                      {user.avatar
                        ? <img src={user.avatar} alt={user.firstName} className="w-8 h-8 rounded-xl object-cover" />
                        : getInitials(user.firstName, user.lastName)
                      }
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-semibold text-slate-800 leading-none">{user.firstName}</p>
                      <p className="text-xs text-slate-400 leading-none mt-0.5 capitalize">{user.role.toLowerCase().replace('_', ' ')}</p>
                    </div>
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  </button>

                  <AnimatePresence>
                    {userMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.96 }}
                        className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-card-hover border border-slate-100 py-2 overflow-hidden"
                      >
                        <Link href={getDashboardHref()} className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors" onClick={() => setUserMenuOpen(false)}>
                          <LayoutDashboard className="w-4 h-4 text-brand-500" /> Dashboard
                        </Link>
                        <Link href="/dashboard" className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors" onClick={() => setUserMenuOpen(false)}>
                          <Calendar className="w-4 h-4 text-brand-500" /> My Appointments
                        </Link>
                        <Link href="/dashboard/profile" className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors" onClick={() => setUserMenuOpen(false)}>
                          <User className="w-4 h-4 text-brand-500" /> Profile
                        </Link>
                        <div className="border-t border-slate-100 mt-1 pt-1">
                          <button onClick={handleLogout} className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors">
                            <LogOut className="w-4 h-4" /> Sign Out
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </>
            ) : (
              <>
                <Link href="/login" className="px-4 py-2 text-sm font-medium text-slate-700 hover:text-brand-600 transition-colors rounded-xl hover:bg-brand-50">
                  Sign In
                </Link>
                <Link href="/register" className="px-5 py-2 text-sm font-semibold text-white bg-brand-600 hover:bg-brand-700 rounded-xl shadow-sm hover:shadow-md transition-all">
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button className="md:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-slate-100 shadow-lg"
          >
            <div className="px-4 py-4 space-y-1">
              {NAV_LINKS.map((link) => (
                <Link key={link.href} href={link.href} className="block px-4 py-3 rounded-xl text-sm font-medium text-slate-700 hover:bg-brand-50 hover:text-brand-600 transition-colors" onClick={() => setIsOpen(false)}>
                  {link.label}
                </Link>
              ))}
              <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
                {isAuthenticated ? (
                  <>
                    <Link href={getDashboardHref()} className="block w-full px-4 py-3 text-center text-sm font-medium text-brand-600 bg-brand-50 rounded-xl" onClick={() => setIsOpen(false)}>Dashboard</Link>
                    <button onClick={handleLogout} className="block w-full px-4 py-3 text-center text-sm font-medium text-red-600 bg-red-50 rounded-xl">Sign Out</button>
                  </>
                ) : (
                  <>
                    <Link href="/login" className="block w-full px-4 py-3 text-center text-sm font-medium text-slate-700 border border-slate-200 rounded-xl" onClick={() => setIsOpen(false)}>Sign In</Link>
                    <Link href="/register" className="block w-full px-4 py-3 text-center text-sm font-semibold text-white bg-brand-600 rounded-xl" onClick={() => setIsOpen(false)}>Get Started Free</Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
