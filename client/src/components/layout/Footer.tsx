// src/components/layout/Footer.tsx
import Link from 'next/link';
import { Stethoscope, Mail, Phone, MapPin } from 'lucide-react';

const FOOTER_LINKS = {
  'Find Care': [
    { label: 'Browse Doctors',  href: '/doctors' },
    { label: 'Specialities',    href: '/specialities' },
    { label: 'Clinics',         href: '/clinics' },
    { label: 'Health Blog',     href: '/blog' },
  ],
  'Company': [
    { label: 'About Us',    href: '/about' },
    { label: 'Contact',     href: '/contact' },
    { label: 'Careers',     href: '/careers' },
    { label: 'Press',       href: '/press' },
  ],
  'Support': [
    { label: 'Help Centre',     href: '/help' },
    { label: 'Privacy Policy',  href: '/privacy' },
    { label: 'Terms of Service',href: '/terms' },
    { label: 'Refund Policy',   href: '/refund' },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-xl bg-brand-gradient flex items-center justify-center">
                <Stethoscope className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">MediBook</span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed mb-6 max-w-xs">
              India's most trusted healthcare platform. Book appointments with verified doctors, manage prescriptions, and take control of your health.
            </p>
            <div className="space-y-2.5 text-sm">
              <a href="mailto:support@medibook.in" className="flex items-center gap-2.5 text-slate-400 hover:text-teal-400 transition-colors">
                <Mail className="w-4 h-4 shrink-0" /> support@medibook.in
              </a>
              <a href="tel:+918001234567" className="flex items-center gap-2.5 text-slate-400 hover:text-teal-400 transition-colors">
                <Phone className="w-4 h-4 shrink-0" /> +91 800 123 4567
              </a>
              <span className="flex items-center gap-2.5 text-slate-400">
                <MapPin className="w-4 h-4 shrink-0" /> New Delhi, India
              </span>
            </div>
          </div>

          {/* Links */}
          {Object.entries(FOOTER_LINKS).map(([heading, links]) => (
            <div key={heading}>
              <h4 className="text-sm font-semibold text-white mb-4">{heading}</h4>
              <ul className="space-y-2.5">
                {links.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="text-sm text-slate-400 hover:text-teal-400 transition-colors">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-slate-800 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-500">© {new Date().getFullYear()} MediBook Technologies Pvt. Ltd. All rights reserved.</p>
          <div className="flex items-center gap-1 text-xs text-slate-500">
            <span>Made with</span>
            <span className="text-red-400">♥</span>
            <span>for better healthcare</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
