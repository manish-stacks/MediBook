'use client';
// src/app/(public)/clinics/[id]/page.tsx
import { useParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ChevronLeft, MapPin, Phone, Mail, Clock, Star, Users, Globe, Award, Calendar } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

export default function ClinicDetailPage() {
  const { id } = useParams();
  const router = useRouter();

  const { data, isLoading } = useQuery({
    queryKey: ['clinic', id],
    queryFn: () => api.get(`/clinics/${id}`).then(r => r.data.data),
    enabled: !!id,
  });

  if (isLoading) return (
    <div className="pt-16 min-h-screen bg-surface-subtle">
      <div className="max-w-5xl mx-auto px-4 py-10 space-y-4">
        <div className="h-64 skeleton rounded-3xl" />
        <div className="h-32 skeleton rounded-2xl" />
        <div className="grid grid-cols-3 gap-4">{[...Array(3)].map((_,i) => <div key={i} className="h-48 skeleton rounded-2xl" />)}</div>
      </div>
    </div>
  );

  if (!data) return (
    <div className="pt-24 text-center">
      <p className="text-slate-400 text-lg">Clinic not found</p>
      <Link href="/clinics" className="text-brand-600 hover:underline mt-2 inline-block">← Back to Clinics</Link>
    </div>
  );

  const clinic = data;
  const doctors = clinic.doctors || [];

  return (
    <div className="pt-16 min-h-screen bg-surface-subtle">
      {/* Hero */}
      <div className="bg-gradient-to-br from-brand-600 to-teal-600">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <button onClick={() => router.back()} className="flex items-center gap-2 text-white/70 hover:text-white mb-6 text-sm transition-colors">
            <ChevronLeft className="w-4 h-4" /> Back
          </button>
          <div className="flex items-start gap-5">
            <div className="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center text-4xl shrink-0">
              {clinic.logo ? <img src={clinic.logo} className="w-full h-full rounded-2xl object-cover" alt="" /> : '🏥'}
            </div>
            <div className="flex-1 text-white">
              <h1 className="text-3xl font-extrabold mb-1">{clinic.name}</h1>
              <div className="flex flex-wrap gap-4 text-white/80 text-sm">
                <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4" />{clinic.address}, {clinic.city}</span>
                {clinic.phone && <span className="flex items-center gap-1.5"><Phone className="w-4 h-4" />{clinic.phone}</span>}
                {clinic.email && <span className="flex items-center gap-1.5"><Mail className="w-4 h-4" />{clinic.email}</span>}
              </div>
            </div>
            <div className="hidden sm:flex flex-col items-end gap-2">
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${clinic.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                {clinic.isActive ? '● Open' : '● Closed'}
              </span>
              <span className="text-white/60 text-xs flex items-center gap-1"><Users className="w-3.5 h-3.5" />{clinic._count?.doctors || 0} Doctors</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Info cards */}
        <div className="grid sm:grid-cols-3 gap-4">
          {[
            { icon: Clock, label: 'Timings', val: clinic.timings || '9:00 AM – 8:00 PM', color: 'text-amber-600 bg-amber-50' },
            { icon: Users, label: 'Doctors', val: `${clinic._count?.doctors || 0} Specialists`, color: 'text-brand-600 bg-brand-50' },
            { icon: Calendar, label: 'Appointments', val: `${clinic._count?.appointments || 0} Total`, color: 'text-teal-600 bg-teal-50' },
          ].map(({ icon: Icon, label, val, color }) => (
            <div key={label} className="bg-white rounded-2xl border border-slate-100 p-4 shadow-card flex items-center gap-3">
              <div className={`w-10 h-10 rounded-2xl ${color} flex items-center justify-center shrink-0`}>
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-slate-400 font-medium">{label}</p>
                <p className="font-bold text-slate-900">{val}</p>
              </div>
            </div>
          ))}
        </div>

        {/* About */}
        {clinic.description && (
          <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-card">
            <h3 className="font-bold text-slate-900 mb-2">About</h3>
            <p className="text-slate-600 text-sm leading-relaxed">{clinic.description}</p>
          </div>
        )}

        {/* Doctors */}
        {doctors.length > 0 && (
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 mb-4">Our Doctors</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {doctors.map(({ doctor }: any, i: number) => (
                <motion.div key={doctor.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
                  <Link href={`/doctors/${doctor.id}`} className="group block bg-white rounded-2xl border border-slate-100 p-5 shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-14 h-14 rounded-2xl overflow-hidden ring-2 ring-brand-50 shrink-0">
                        <img
                          src={doctor.user?.avatar || `https://ui-avatars.com/api/?name=${doctor.user?.firstName}+${doctor.user?.lastName}&background=1e6fe8&color=fff&size=100`}
                          alt={`Dr. ${doctor.user?.firstName}`} className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 group-hover:text-brand-600 transition-colors">
                          Dr. {doctor.user?.firstName} {doctor.user?.lastName}
                        </p>
                        <p className="text-brand-600 text-sm font-medium">{doctor.speciality?.name}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-sm text-slate-500 mb-3">
                      <span className="flex items-center gap-1"><Award className="w-3.5 h-3.5 text-brand-400" />{doctor.experience} yrs exp</span>
                      <span className="flex items-center gap-1"><Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />{Number(doctor.rating).toFixed(1)}</span>
                    </div>
                    <div className="flex items-center justify-between pt-3 border-t border-slate-50">
                      <span className="text-xs text-slate-400">{doctor._count?.appointments || 0} appointments</span>
                      <span className="font-bold text-slate-900">{formatCurrency(Number(doctor.consultationFee))}</span>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
