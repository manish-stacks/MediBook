'use client';
// src/components/home/FeaturedDoctors.tsx
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { Star, MapPin, Clock, ArrowRight } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

export default function FeaturedDoctors() {
  const { data } = useQuery({
    queryKey: ['featured-doctors'],
    queryFn: () => api.get('/doctors?limit=4&sortBy=rating&sortOrder=desc').then(r => r.data.data.doctors),
  });

  const doctors = data || [];

  return (
    <section className="py-20 bg-surface-subtle">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-12">
          <div>
            <span className="text-brand-600 text-sm font-semibold tracking-wider uppercase">Top rated</span>
            <h2 className="text-4xl font-extrabold text-slate-900 mt-2">Featured Doctors</h2>
          </div>
          <Link href="/doctors" className="hidden md:flex items-center gap-2 text-brand-600 font-semibold hover:gap-3 transition-all">
            View all <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {doctors.length === 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-3xl p-5 animate-pulse">
                <div className="w-20 h-20 rounded-2xl skeleton mx-auto mb-4" />
                <div className="h-4 skeleton rounded mb-2" />
                <div className="h-3 skeleton rounded w-2/3 mx-auto" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {doctors.map((doc: any, i: number) => (
              <motion.div
                key={doc.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Link href={`/doctors/${doc.id}`} className="group block bg-white rounded-3xl p-5 shadow-card hover:shadow-card-hover border border-slate-100 hover:border-brand-100 transition-all duration-300 -translate-y-0 hover:-translate-y-1">
                  <div className="text-center mb-4">
                    <div className="w-20 h-20 rounded-2xl overflow-hidden mx-auto mb-3 ring-4 ring-brand-50 group-hover:ring-brand-100 transition-all">
                      <img
                        src={doc.user?.avatar || `https://ui-avatars.com/api/?name=${doc.user?.firstName}+${doc.user?.lastName}&background=1e6fe8&color=fff&size=100`}
                        alt={`Dr. ${doc.user?.firstName}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <h3 className="font-bold text-slate-900 group-hover:text-brand-700 transition-colors">
                      Dr. {doc.user?.firstName} {doc.user?.lastName}
                    </h3>
                    <p className="text-sm text-brand-600 font-medium">{doc.speciality?.name}</p>
                  </div>

                  <div className="space-y-2 text-xs text-slate-500 mb-4">
                    <div className="flex items-center gap-1.5">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span className="font-semibold text-slate-800">{doc.rating}</span>
                      <span>({doc.totalReviews} reviews)</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-brand-400" />
                      <span>{doc.experience} years experience</span>
                    </div>
                    {doc.clinics?.[0]?.clinic && (
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-teal-400" />
                        <span className="truncate">{doc.clinics[0].clinic.city}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                    <span className="text-xs text-slate-400">Consult fee</span>
                    <span className="font-bold text-slate-900">{formatCurrency(Number(doc.consultationFee))}</span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}

        <div className="text-center mt-8 md:hidden">
          <Link href="/doctors" className="inline-flex items-center gap-2 text-brand-600 font-semibold">
            View all doctors <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
