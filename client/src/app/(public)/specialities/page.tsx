'use client';
// src/app/(public)/specialities/page.tsx
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Search, ChevronRight, Users } from 'lucide-react';
import { useState } from 'react';

const COLORS = [
  'from-rose-400 to-pink-500', 'from-blue-400 to-sky-500', 'from-violet-400 to-purple-500',
  'from-amber-400 to-yellow-500', 'from-green-400 to-emerald-500', 'from-teal-400 to-cyan-500',
  'from-indigo-400 to-blue-500', 'from-orange-400 to-red-500', 'from-fuchsia-400 to-pink-500',
  'from-cyan-400 to-teal-500', 'from-lime-400 to-green-500', 'from-red-400 to-rose-500',
];

export default function SpecialitiesPage() {
  const [search, setSearch] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['specialities'],
    queryFn: () => api.get('/specialities').then(r => r.data.data),
  });

  const specialities = (data || []).filter((s: any) =>
    !search || s.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="pt-16 min-h-screen bg-surface-subtle">
      {/* Header */}
      <div className="bg-white border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-4xl font-extrabold text-slate-900 mb-3">Medical Specialities</h1>
            <p className="text-slate-500 text-lg mb-8">Find the right specialist for your health needs</p>

            <div className="flex items-center gap-3 bg-white border border-slate-200 rounded-2xl px-5 py-3.5 max-w-md mx-auto shadow-sm focus-within:border-brand-400 transition-all">
              <Search className="w-5 h-5 text-slate-400 shrink-0" />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search specialities..."
                className="flex-1 text-sm outline-none bg-transparent placeholder:text-slate-400"
              />
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
            {[...Array(12)].map((_, i) => <div key={i} className="h-48 skeleton rounded-2xl" />)}
          </div>
        ) : specialities.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">🔍</div>
            <p className="text-slate-500">No specialities found for "{search}"</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
            {specialities.map((spec: any, i: number) => (
              <motion.div
                key={spec.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
              >
                <Link
                  href={`/doctors?specialityId=${spec.id}`}
                  className="group block bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1"
                >
                  {/* Color header */}
                  <div className={`h-28 bg-gradient-to-br ${COLORS[i % COLORS.length]} flex items-center justify-center`}>
                    <span className="text-5xl">{spec.icon || '🏥'}</span>
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-slate-900 mb-1 group-hover:text-brand-600 transition-colors">{spec.name}</h3>
                    {spec.description && <p className="text-xs text-slate-400 line-clamp-2 mb-3">{spec.description}</p>}
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1 text-xs text-slate-400">
                        <Users className="w-3 h-3" /> {spec._count?.doctors || 0} doctors
                      </span>
                      <span className="text-brand-600 text-xs font-semibold flex items-center gap-1 group-hover:gap-2 transition-all">
                        View <ChevronRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
