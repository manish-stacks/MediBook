'use client';
// src/app/(dashboard)/dashboard/prescriptions/page.tsx
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { motion } from 'framer-motion';
import { Download, FileText, Pill, Calendar, User } from 'lucide-react';
import { formatDate } from '@/lib/utils';

export default function PrescriptionsPage() {
  // Fetch all completed appointments to get prescriptions
  const { data, isLoading } = useQuery({
    queryKey: ['prescriptions'],
    queryFn: () => api.get('/appointments?status=COMPLETED&limit=50').then(r => r.data.data.appointments),
  });

  const appointments = data || [];

  return (
    <div className="w-full space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900">My Prescriptions</h1>
        <p className="text-slate-500 mt-1">Download and manage your digital prescriptions</p>
      </div>

      {isLoading ? (
        <div className="space-y-4">{[...Array(4)].map((_, i) => <div key={i} className="h-24 skeleton rounded-2xl" />)}</div>
      ) : appointments.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-100 p-16 text-center shadow-card">
          <div className="text-5xl mb-4">💊</div>
          <h3 className="font-bold text-slate-800 mb-2">No prescriptions yet</h3>
          <p className="text-slate-400 text-sm">Prescriptions from completed appointments will appear here</p>
        </div>
      ) : (
        <div className="space-y-3">
          {appointments.map((apt: any, i: number) => (
            <PrescriptionCard key={apt.id} apt={apt} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}

function PrescriptionCard({ apt, index }: { apt: any; index: number }) {
  const { data: prescription } = useQuery({
    queryKey: ['prescription-by-apt', apt.id],
    queryFn: () => api.get(`/prescriptions/appointment/${apt.id}`).then(r => r.data.data).catch(() => null),
  });

  if (!prescription) return null;

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.06 }}
      className="bg-white rounded-2xl border border-slate-100 p-5 shadow-card hover:shadow-card-hover transition-all">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-green-50 border border-green-100 flex items-center justify-center shrink-0">
            <FileText className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <p className="font-bold text-slate-900">Dr. {apt.doctor?.user?.firstName} {apt.doctor?.user?.lastName}</p>
            <p className="text-sm text-brand-600 font-medium">{apt.doctor?.speciality?.name}</p>
            <div className="flex flex-wrap gap-3 mt-1 text-xs text-slate-400">
              <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{formatDate(apt.scheduledDate)}</span>
              <span className="flex items-center gap-1"><User className="w-3 h-3" />{apt.patient?.firstName} {apt.patient?.lastName}</span>
              {prescription.medicines?.length > 0 && (
                <span className="flex items-center gap-1"><Pill className="w-3 h-3" />{prescription.medicines.length} medicine{prescription.medicines.length > 1 ? 's' : ''}</span>
              )}
            </div>
          </div>
        </div>
        <a
          href={`${process.env.NEXT_PUBLIC_API_URL}/prescriptions/${prescription.id}/pdf`}
          target="_blank"
          rel="noopener"
          className="flex items-center gap-1.5 px-4 py-2 bg-brand-50 border border-brand-200 text-brand-700 font-semibold rounded-xl text-xs hover:bg-brand-100 transition-colors shrink-0"
        >
          <Download className="w-3.5 h-3.5" /> PDF
        </a>
      </div>

      {prescription.medicines?.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {prescription.medicines.map((med: any, i: number) => (
            <span key={i} className="px-3 py-1 bg-slate-50 border border-slate-100 rounded-full text-xs font-medium text-slate-600">
              💊 {med.name} · {med.dosage}
            </span>
          ))}
        </div>
      )}
    </motion.div>
  );
}
