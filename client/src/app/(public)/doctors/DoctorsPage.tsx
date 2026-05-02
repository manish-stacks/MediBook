'use client';
import { useState } from 'react';

import { useQuery } from '@tanstack/react-query';
import { useSearchParams, useRouter } from 'next/navigation';
import api from '@/lib/api';
import { Search, SlidersHorizontal, Star, X, MapPin, Award, ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { cn, formatCurrency } from '@/lib/utils';

const SORT_OPTIONS = [
  { label: 'Best Rating', value: 'rating-desc' },
  { label: 'Fee: Low–High', value: 'fee-asc' },
  { label: 'Fee: High–Low', value: 'fee-desc' },
  { label: 'Experience', value: 'experience-desc' },
];

function DoctorCard({ doctor }: { doctor: any }) {
  const clinic = doctor.clinics?.[0]?.clinic;
  const name = `Dr. ${doctor.user?.firstName} ${doctor.user?.lastName}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl border border-slate-100 p-5 shadow-card hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-300 flex flex-col sm:flex-row gap-5"
    >
      <div className="shrink-0 flex flex-col items-center gap-2">
        <div className="w-24 h-24 rounded-2xl overflow-hidden ring-4 ring-brand-50">
          <img
            src={doctor.user?.avatar || `https://ui-avatars.com/api/?name=${doctor.user?.firstName}+${doctor.user?.lastName}&background=1e6fe8&color=fff&size=100`}
            alt={name} className="w-full h-full object-cover"
          />
        </div>
        <span className="flex items-center gap-1 text-xs bg-green-50 text-green-700 px-2 py-1 rounded-full border border-green-200">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500" />Available
        </span>
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-3 mb-1">
          <div>
            <h3 className="font-bold text-slate-900 text-lg leading-tight">{name}</h3>
            <p className="text-brand-600 font-medium text-sm">{doctor.speciality?.name}</p>
          </div>
          <div className="flex items-center gap-1 bg-amber-50 border border-amber-200 text-amber-700 px-2.5 py-1 rounded-xl text-sm font-bold shrink-0">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            {Number(doctor.rating).toFixed(1)}
          </div>
        </div>

        <div className="flex flex-wrap gap-x-5 gap-y-1.5 text-sm text-slate-500 mb-3">
          <span className="flex items-center gap-1.5"><Award className="w-4 h-4 text-brand-400" />{doctor.experience} yrs experience</span>
          {clinic && <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4 text-teal-400" />{clinic.name}, {clinic.city}</span>}
          <span className="text-slate-400">{doctor.totalReviews} reviews</span>
        </div>

        {doctor.about && <p className="text-sm text-slate-500 line-clamp-2 mb-3">{doctor.about}</p>}

        <div className="flex items-center justify-between gap-4 pt-3 border-t border-slate-100">
          <div>
            <p className="text-xs text-slate-400">Consultation fee</p>
            <p className="font-bold text-slate-900 text-lg">{formatCurrency(Number(doctor.consultationFee))}</p>
          </div>
          <div className="flex items-center gap-2">
            <Link href={`/doctors/${doctor.id}`} className="px-4 py-2 border border-brand-200 text-brand-600 font-medium text-sm rounded-xl hover:bg-brand-50 transition-colors">
              View Profile
            </Link>
            <Link href={`/doctors/${doctor.id}#book`} className="px-5 py-2 bg-brand-600 text-white font-semibold text-sm rounded-xl hover:bg-brand-700 transition-colors shadow-sm">
              Book Now
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function FilterPanel({ filters, setFilters, specialities, onClose }: any) {
  const clearFilters = () => setFilters({ specialityId: '', minFee: '', maxFee: '', minExperience: '', rating: '', city: '' });
  const active = Object.values(filters).filter(Boolean).length;

  return (
    <div className="space-y-6">
      {active > 0 && (
        <button onClick={clearFilters} className="w-full py-2 text-sm text-red-600 border border-red-200 rounded-xl hover:bg-red-50 transition-colors font-medium">
          Clear All ({active}) Filters
        </button>
      )}

      {/* City */}
      <div>
        <h4 className="font-semibold text-slate-800 mb-2 text-sm">City</h4>
        <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2">
          <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
          <input
            type="text"
            value={filters.city}
            onChange={e => setFilters((f: any) => ({ ...f, city: e.target.value }))}
            placeholder="e.g. Delhi, Mumbai"
            className="flex-1 text-sm outline-none bg-transparent placeholder:text-slate-400"
          />
          {filters.city && <button onClick={() => setFilters((f: any) => ({ ...f, city: '' }))}><X className="w-3.5 h-3.5 text-slate-400" /></button>}
        </div>
      </div>

      {/* Speciality */}
      <div>
        <h4 className="font-semibold text-slate-800 mb-2 text-sm">Speciality</h4>
        <div className="space-y-1 max-h-52 overflow-y-auto pr-1">
          <label className="flex items-center gap-2.5 cursor-pointer group py-1">
            <input type="radio" name="spec" checked={!filters.specialityId} onChange={() => setFilters((f: any) => ({ ...f, specialityId: '' }))} className="w-4 h-4 accent-brand-600" />
            <span className="text-sm text-slate-600 group-hover:text-slate-900">All Specialities</span>
          </label>
          {(specialities || []).map((s: any) => (
            <label key={s.id} className="flex items-center gap-2.5 cursor-pointer group py-1">
              <input type="radio" name="spec" checked={filters.specialityId === s.id} onChange={() => setFilters((f: any) => ({ ...f, specialityId: s.id }))} className="w-4 h-4 accent-brand-600" />
              <span className="text-sm text-slate-600 group-hover:text-slate-900">{s.icon} {s.name}</span>
              <span className="ml-auto text-xs text-slate-400">{s._count?.doctors}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Fee */}
      <div>
        <h4 className="font-semibold text-slate-800 mb-2 text-sm">Consultation Fee</h4>
        <div className="space-y-1">
          {[
            { label: 'Any', min: '', max: '' },
            { label: 'Under ₹500', min: '', max: '500' },
            { label: '₹500–₹1000', min: '500', max: '1000' },
            { label: '₹1000–₹2000', min: '1000', max: '2000' },
            { label: 'Above ₹2000', min: '2000', max: '' },
          ].map(opt => (
            <label key={opt.label} className="flex items-center gap-2.5 cursor-pointer group py-1">
              <input type="radio" name="fee" checked={filters.minFee === opt.min && filters.maxFee === opt.max} onChange={() => setFilters((f: any) => ({ ...f, minFee: opt.min, maxFee: opt.max }))} className="w-4 h-4 accent-brand-600" />
              <span className="text-sm text-slate-600 group-hover:text-slate-900">{opt.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Experience */}
      <div>
        <h4 className="font-semibold text-slate-800 mb-2 text-sm">Experience</h4>
        <div className="space-y-1">
          {[{ label: 'Any', val: '' }, { label: '1+ years', val: '1' }, { label: '5+ years', val: '5' }, { label: '10+ years', val: '10' }, { label: '15+ years', val: '15' }].map(opt => (
            <label key={opt.label} className="flex items-center gap-2.5 cursor-pointer group py-1">
              <input type="radio" name="exp" checked={filters.minExperience === opt.val} onChange={() => setFilters((f: any) => ({ ...f, minExperience: opt.val }))} className="w-4 h-4 accent-brand-600" />
              <span className="text-sm text-slate-600 group-hover:text-slate-900">{opt.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Rating */}
      <div>
        <h4 className="font-semibold text-slate-800 mb-2 text-sm">Minimum Rating</h4>
        <div className="space-y-1">
          {[{ label: 'Any', val: '' }, { label: '4.0+', val: '4' }, { label: '4.5+', val: '4.5' }].map(opt => (
            <label key={opt.label} className="flex items-center gap-2.5 cursor-pointer group py-1">
              <input type="radio" name="rat" checked={filters.rating === opt.val} onChange={() => setFilters((f: any) => ({ ...f, rating: opt.val }))} className="w-4 h-4 accent-brand-600" />
              <span className="text-sm text-slate-600 group-hover:text-slate-900 flex items-center gap-1">
                {opt.val && <Star className="w-3 h-3 fill-amber-400 text-amber-400" />}{opt.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      {onClose && (
        <button onClick={onClose} className="w-full py-3 bg-brand-600 text-white font-bold rounded-2xl text-sm">Apply Filters</button>
      )}
    </div>
  );
}

function DoctorsContent() {
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [sort, setSort] = useState('rating-desc');
  const [page, setPage] = useState(1);
  const [showMobileFilter, setShowMobileFilter] = useState(false);
  const [filters, setFilters] = useState({
    specialityId: searchParams.get('specialityId') || searchParams.get('speciality') || '',
    minFee: '', maxFee: '', minExperience: '', rating: '', city: '',
  });

  const [sortBy, sortOrder] = sort.split('-');

  const { data, isLoading } = useQuery({
    queryKey: ['doctors', filters, sortBy, sortOrder, search, page],
    queryFn: () => api.get('/doctors', {
      params: { ...filters, sortBy, sortOrder, search: search || undefined, page, limit: 10 },
    }).then(r => r.data.data),
    keepPreviousData: true,
  });

  const { data: specData } = useQuery({
    queryKey: ['specialities'],
    queryFn: () => api.get('/specialities').then(r => r.data.data),
  });

  const doctors = data?.doctors || [];
  const pagination = data?.pagination;
  const activeCount = Object.values(filters).filter(Boolean).length;

  return (
    <div className="pt-16 min-h-screen bg-surface-subtle">
      {/* Header */}
      <div className="bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-extrabold text-slate-900 mb-1">Find a Doctor</h1>
          <p className="text-slate-500 mb-5">Browse {pagination?.total || '2,000+'} verified doctors</p>

          <div className="flex gap-3 flex-wrap">
            <div className="flex-1 min-w-56 flex items-center gap-3 bg-white border border-slate-200 rounded-2xl px-4 py-3 shadow-sm focus-within:border-brand-400 transition-all">
              <Search className="w-5 h-5 text-slate-400 shrink-0" />
              <input
                type="text"
                value={search}
                onChange={e => { setSearch(e.target.value); setPage(1); }}
                placeholder="Search doctors, specialities..."
                className="flex-1 text-sm outline-none bg-transparent placeholder:text-slate-400"
              />
              {search && <button onClick={() => setSearch('')}><X className="w-4 h-4 text-slate-400" /></button>}
            </div>

            <select value={sort} onChange={e => setSort(e.target.value)} className="px-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm text-slate-700 outline-none shadow-sm hover:border-brand-300 transition-colors">
              {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>

            <button onClick={() => setShowMobileFilter(true)}
              className={cn('lg:hidden flex items-center gap-2 px-4 py-3 rounded-2xl border text-sm font-medium transition-colors', activeCount > 0 ? 'bg-brand-600 text-white border-brand-600' : 'bg-white text-slate-700 border-slate-200')}>
              <SlidersHorizontal className="w-4 h-4" />
              Filters {activeCount > 0 && `(${activeCount})`}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Sidebar */}
          <aside className="hidden lg:block w-64 shrink-0">
            <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-card sticky top-24">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-slate-900">Filters</h3>
                {activeCount > 0 && <span className="text-xs bg-brand-100 text-brand-700 px-2 py-1 rounded-full font-medium">{activeCount} active</span>}
              </div>
              <FilterPanel filters={filters} setFilters={(fn: any) => { setFilters(fn); setPage(1); }} specialities={specData} />
            </div>
          </aside>

          {/* List */}
          <div className="flex-1 min-w-0">
            {isLoading ? (
              <div className="space-y-4">{[...Array(5)].map((_, i) => <div key={i} className="h-40 skeleton rounded-2xl" />)}</div>
            ) : doctors.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-100 p-16 text-center shadow-card">
                <div className="text-5xl mb-4">🔍</div>
                <h3 className="font-bold text-slate-900 mb-2">No doctors found</h3>
                <p className="text-slate-500 text-sm mb-4">Try adjusting your filters or search terms</p>
                <button onClick={() => { setFilters({ specialityId: '', minFee: '', maxFee: '', minExperience: '', rating: '', city: '' }); setSearch(''); }}
                  className="px-5 py-2.5 bg-brand-600 text-white font-semibold rounded-xl text-sm">Clear All Filters</button>
              </div>
            ) : (
              <>
                <p className="text-sm text-slate-500 mb-4 font-medium">{pagination?.total} doctors found</p>
                <div className="space-y-4">
                  {doctors.map((doc: any) => <DoctorCard key={doc.id} doctor={doc} />)}
                </div>

                {pagination && pagination.totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-8">
                    <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="p-2 rounded-xl border border-slate-200 disabled:opacity-40 hover:bg-slate-50 transition-colors">
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                      const p = Math.max(1, page - 2) + i;
                      if (p > pagination.totalPages) return null;
                      return (
                        <button key={p} onClick={() => setPage(p)}
                          className={cn('w-10 h-10 rounded-xl text-sm font-medium transition-colors', p === page ? 'bg-brand-600 text-white' : 'border border-slate-200 hover:bg-slate-50 text-slate-700')}>
                          {p}
                        </button>
                      );
                    })}
                    <button onClick={() => setPage(p => Math.min(pagination.totalPages, p + 1))} disabled={page === pagination.totalPages} className="p-2 rounded-xl border border-slate-200 disabled:opacity-40 hover:bg-slate-50 transition-colors">
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile filter sheet */}
      <AnimatePresence>
        {showMobileFilter && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowMobileFilter(false)} className="fixed inset-0 bg-black/50 z-40 lg:hidden" />
            <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} className="fixed right-0 top-0 h-full w-80 bg-white z-50 lg:hidden overflow-y-auto shadow-2xl">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-bold text-slate-900 text-lg">Filters</h3>
                  <button onClick={() => setShowMobileFilter(false)} className="p-2 rounded-xl hover:bg-slate-100"><X className="w-5 h-5" /></button>
                </div>
                <FilterPanel filters={filters} setFilters={(fn: any) => { setFilters(fn); setPage(1); }} specialities={specData} onClose={() => setShowMobileFilter(false)} />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function DoctorsPage() {
  return (
    <DoctorsContent />
  );
}
