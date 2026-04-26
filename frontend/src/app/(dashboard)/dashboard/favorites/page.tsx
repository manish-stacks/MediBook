'use client';
// src/app/(dashboard)/dashboard/favorites/page.tsx
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Heart, Star, MapPin, Award, Calendar, Trash2 } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import toast from 'react-hot-toast';

export default function FavoritesPage() {
  const qc = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['favorites'],
    queryFn: () => api.get('/favorites').then(r => r.data.data),
  });

  const removeMutation = useMutation({
    mutationFn: (doctorId: string) => api.post(`/favorites/toggle/${doctorId}`),
    onSuccess: () => { toast.success('Removed from favorites'); qc.invalidateQueries({ queryKey: ['favorites'] }); },
  });

  const favorites = data || [];

  return (
    <div className="w-full space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 flex items-center gap-2">
          <Heart className="w-7 h-7 text-rose-500 fill-rose-500" /> Favorite Doctors
        </h1>
        <p className="text-slate-500 mt-1">Quickly book your preferred doctors</p>
      </div>

      {isLoading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">{[...Array(6)].map((_,i) => <div key={i} className="h-56 skeleton rounded-2xl" />)}</div>
      ) : favorites.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-100 p-16 text-center shadow-card">
          <Heart className="w-16 h-16 text-slate-200 mx-auto mb-4" />
          <h3 className="font-bold text-slate-800 mb-2">No favorites yet</h3>
          <p className="text-slate-400 text-sm mb-6">Add doctors to your favorites from their profile page</p>
          <Link href="/doctors" className="inline-flex items-center gap-2 px-6 py-3 bg-brand-600 text-white font-semibold rounded-2xl text-sm">
            Browse Doctors
          </Link>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {favorites.map((fav: any, i: number) => {
            const doctor = fav.doctor;
            const clinic = doctor?.clinics?.[0]?.clinic;
            return (
              <motion.div key={fav.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
                className="bg-white rounded-2xl border border-slate-100 p-5 shadow-card hover:shadow-card-hover transition-all relative group">
                <button onClick={() => removeMutation.mutate(doctor.id)} className="absolute top-3 right-3 p-1.5 rounded-xl text-rose-400 opacity-0 group-hover:opacity-100 hover:bg-rose-50 transition-all">
                  <Trash2 className="w-4 h-4" />
                </button>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-14 h-14 rounded-2xl overflow-hidden ring-2 ring-rose-50 shrink-0">
                    <img src={doctor?.user?.avatar || `https://ui-avatars.com/api/?name=${doctor?.user?.firstName}+${doctor?.user?.lastName}&background=1e6fe8&color=fff`}
                      alt="" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">Dr. {doctor?.user?.firstName} {doctor?.user?.lastName}</p>
                    <p className="text-brand-600 text-sm font-medium">{doctor?.speciality?.name}</p>
                  </div>
                </div>
                <div className="space-y-1.5 text-xs text-slate-500 mb-4">
                  <span className="flex items-center gap-1.5"><Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />{Number(doctor?.rating).toFixed(1)} ({doctor?.totalReviews} reviews)</span>
                  <span className="flex items-center gap-1.5"><Award className="w-3.5 h-3.5 text-brand-400" />{doctor?.experience} years experience</span>
                  {clinic && <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-teal-400" />{clinic.name}, {clinic.city}</span>}
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-slate-50">
                  <span className="font-bold text-slate-900">{formatCurrency(Number(doctor?.consultationFee))}</span>
                  <div className="flex gap-2">
                    <Link href={`/doctors/${doctor?.id}`} className="px-3 py-1.5 border border-brand-200 text-brand-600 text-xs font-semibold rounded-xl hover:bg-brand-50 transition-colors">
                      Profile
                    </Link>
                    <Link href={`/doctors/${doctor?.id}#book`} className="px-3 py-1.5 bg-brand-600 text-white text-xs font-semibold rounded-xl hover:bg-brand-700 transition-colors flex items-center gap-1">
                      <Calendar className="w-3 h-3" /> Book
                    </Link>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
