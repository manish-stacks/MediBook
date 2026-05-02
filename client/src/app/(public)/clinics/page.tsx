'use client';
// src/app/(public)/clinics/page.tsx
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Search, MapPin, Phone, Clock, Star, Users, X } from 'lucide-react';
import { useState } from 'react';

export default function ClinicsPage() {
  const [search, setSearch] = useState('');
  const [city, setCity] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['clinics', search, city],
    queryFn: () => api.get('/clinics', { params: { search: search || undefined, city: city || undefined, limit: 50 } }).then(r => r.data.data),
  });

  const clinics = data?.clinics || [];

  return (
    <div className="pt-16 min-h-screen bg-surface-subtle">
      {/* Header */}
      <div className="bg-white border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-4xl font-extrabold text-slate-900 mb-2">Find Clinics</h1>
            <p className="text-slate-500 mb-8">Discover top clinics near you with the best specialists</p>

            <div className="flex gap-3 flex-wrap">
              <div className="flex items-center gap-3 bg-white border border-slate-200 rounded-2xl px-4 py-3 shadow-sm focus-within:border-brand-400 transition-all flex-1 min-w-56">
                <Search className="w-4 h-4 text-slate-400 shrink-0" />
                <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search clinics..." className="flex-1 text-sm outline-none bg-transparent placeholder:text-slate-400" />
                {search && <button onClick={() => setSearch('')}><X className="w-4 h-4 text-slate-400" /></button>}
              </div>
              <div className="flex items-center gap-3 bg-white border border-slate-200 rounded-2xl px-4 py-3 shadow-sm focus-within:border-brand-400 transition-all">
                <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                <input type="text" value={city} onChange={e => setCity(e.target.value)} placeholder="Filter by city..." className="text-sm outline-none bg-transparent placeholder:text-slate-400 w-36" />
                {city && <button onClick={() => setCity('')}><X className="w-4 h-4 text-slate-400" /></button>}
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {isLoading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[...Array(6)].map((_, i) => <div key={i} className="h-64 skeleton rounded-2xl" />)}
          </div>
        ) : clinics.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">🏥</div>
            <p className="text-slate-500">No clinics found</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {clinics.map((clinic: any, i: number) => (
              <motion.div key={clinic.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
                <Link href={`/clinics/${clinic.id}`} className="group block bg-white rounded-2xl border border-slate-100 shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1 overflow-hidden">
                  {/* Header */}
                  <div className="h-40 bg-gradient-to-br from-brand-50 to-teal-50 flex items-center justify-center relative overflow-hidden">
                    {clinic.image ? (
                      <img src={clinic.image} alt={clinic.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="text-7xl">🏥</div>
                    )}
                    <div className="absolute top-3 right-3 bg-green-50 border border-green-200 text-green-700 text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-green-500 rounded-full" /> Open
                    </div>
                  </div>

                  <div className="p-5">
                    <h3 className="font-bold text-slate-900 text-lg mb-1 group-hover:text-brand-600 transition-colors">{clinic.name}</h3>
                    {clinic.description && <p className="text-sm text-slate-400 line-clamp-2 mb-3">{clinic.description}</p>}
                    
                    <div className="space-y-2 text-sm text-slate-500 mb-4">
                      <div className="flex items-start gap-2">
                        <MapPin className="w-4 h-4 text-brand-400 mt-0.5 shrink-0" />
                        <span className="line-clamp-1">{clinic.address}, {clinic.city}</span>
                      </div>
                      {clinic.phone && (
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-teal-400 shrink-0" />
                          <span>{clinic.phone}</span>
                        </div>
                      )}
                      {clinic.timings && (
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                          <span>{clinic.timings}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                      <span className="flex items-center gap-1 text-xs text-slate-400">
                        <Users className="w-3.5 h-3.5" /> {clinic._count?.doctors || 0} doctors
                      </span>
                      <span className="text-xs font-semibold text-brand-600 group-hover:underline">View Clinic →</span>
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
