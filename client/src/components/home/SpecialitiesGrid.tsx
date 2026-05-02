'use client';
// src/components/home/SpecialitiesGrid.tsx
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { ArrowRight } from 'lucide-react';

const FALLBACK_SPECIALITIES = [
  { name: 'Cardiology',      slug: 'cardiology',      icon: '🫀', _count: { doctors: 24 } },
  { name: 'Dermatology',     slug: 'dermatology',     icon: '🧴', _count: { doctors: 18 } },
  { name: 'Neurology',       slug: 'neurology',       icon: '🧠', _count: { doctors: 15 } },
  { name: 'Orthopedics',     slug: 'orthopedics',     icon: '🦴', _count: { doctors: 20 } },
  { name: 'Pediatrics',      slug: 'pediatrics',      icon: '👶', _count: { doctors: 22 } },
  { name: 'Gynecology',      slug: 'gynecology',      icon: '🌸', _count: { doctors: 16 } },
  { name: 'Psychiatry',      slug: 'psychiatry',      icon: '🧘', _count: { doctors: 12 } },
  { name: 'General Medicine',slug: 'general-medicine',icon: '🏥', _count: { doctors: 35 } },
];

const COLORS = [
  'from-rose-50 to-pink-50 hover:from-rose-100 hover:to-pink-100 border-rose-100',
  'from-blue-50 to-sky-50 hover:from-blue-100 hover:to-sky-100 border-blue-100',
  'from-violet-50 to-purple-50 hover:from-violet-100 hover:to-purple-100 border-violet-100',
  'from-amber-50 to-yellow-50 hover:from-amber-100 hover:to-yellow-100 border-amber-100',
  'from-green-50 to-emerald-50 hover:from-green-100 hover:to-emerald-100 border-green-100',
  'from-teal-50 to-cyan-50 hover:from-teal-100 hover:to-cyan-100 border-teal-100',
  'from-indigo-50 to-blue-50 hover:from-indigo-100 hover:to-blue-100 border-indigo-100',
  'from-orange-50 to-red-50 hover:from-orange-100 hover:to-red-100 border-orange-100',
];

export default function SpecialitiesGrid() {
  const { data } = useQuery({
    queryKey: ['specialities'],
    queryFn: () => api.get('/specialities').then((r) => r.data.data),
  });

  const specs = data || FALLBACK_SPECIALITIES;

  return (
    <section className="py-20 bg-surface-subtle">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
            <span className="text-brand-600 text-sm font-semibold tracking-wider uppercase">Browse by specialty</span>
            <h2 className="text-4xl font-extrabold text-slate-900 mt-2 mb-3">Find the Right Specialist</h2>
            <p className="text-slate-500 max-w-xl mx-auto">
              From routine checkups to complex treatments, we have specialists across every medical field.
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {specs.map((spec: any, i: number) => (
            <motion.div
              key={spec.slug}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
            >
              <Link
                href={`/doctors?speciality=${spec.id || spec.slug}`}
                className={`group block p-5 rounded-2xl bg-gradient-to-br ${COLORS[i % COLORS.length]} border transition-all duration-300 card-hover`}
              >
                <div className="text-4xl mb-3">{spec.icon}</div>
                <h3 className="font-bold text-slate-800 text-sm mb-1 group-hover:text-brand-700 transition-colors">{spec.name}</h3>
                <p className="text-xs text-slate-500">{spec._count?.doctors || 0} doctors</p>
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-8">
          <Link href="/specialities" className="inline-flex items-center gap-2 text-brand-600 font-semibold hover:gap-3 transition-all">
            View all specialities <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
