'use client';
// src/app/admin/patients/[id]/page.tsx
import { useParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import Link from 'next/link';
import { ChevronLeft, Activity, FileText, Calendar, Clock, Download, CreditCard } from 'lucide-react';
import { cn, formatDate, formatTime, getStatusColor, getAgeFromDOB, formatCurrency, getPaymentStatusColor } from '@/lib/utils';

export default function AdminPatientHistoryPage() {
  const { id } = useParams();
  const router = useRouter();

  const { data, isLoading } = useQuery({
    queryKey: ['admin-patient-history', id],
    queryFn: () => api.get(`/admin/patients/${id}/history`).then(r => r.data.data),
    enabled: !!id,
  });

  if (isLoading) return (
    <div className="max-w-4xl space-y-4">
      {[...Array(4)].map((_,i) => <div key={i} className="h-24 skeleton rounded-2xl" />)}
    </div>
  );

  const { patient, appointments, vitals } = data || {};

  return (
    <div className="max-w-4xl space-y-5">
      <div className="flex items-center gap-3">
        <button onClick={() => router.back()} className="p-2 rounded-xl hover:bg-slate-100 text-slate-600"><ChevronLeft className="w-5 h-5" /></button>
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">{patient?.firstName} {patient?.lastName}</h1>
          <p className="text-slate-400 text-sm">Complete Medical History</p>
        </div>
      </div>

      {/* Patient info */}
      <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-card">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm text-slate-600">
          <div><p className="text-xs text-slate-400 mb-0.5">Gender</p><p className="font-semibold capitalize">{patient?.gender?.toLowerCase() || '—'}</p></div>
          <div><p className="text-xs text-slate-400 mb-0.5">Age</p><p className="font-semibold">{patient?.dateOfBirth ? `${getAgeFromDOB(patient.dateOfBirth)} yrs` : '—'}</p></div>
          <div><p className="text-xs text-slate-400 mb-0.5">Blood Group</p><p className="font-semibold text-red-600">{patient?.bloodGroup || '—'}</p></div>
          <div><p className="text-xs text-slate-400 mb-0.5">Relation</p><p className="font-semibold capitalize">{patient?.relation?.toLowerCase() || '—'}</p></div>
        </div>
      </div>

      {/* Vitals history */}
      {vitals?.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-card">
          <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2"><Activity className="w-4 h-4 text-rose-500" />Vitals History ({vitals.length} records)</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100">
                  {['Date', 'Temp', 'BP', 'Heart Rate', 'Weight', 'Height', 'SpO2'].map(h => (
                    <th key={h} className="text-left py-2 px-3 text-xs font-semibold text-slate-400 uppercase">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {vitals.map((v: any) => (
                  <tr key={v.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-2 px-3 text-xs text-slate-400">{formatDate(v.recordedAt)}</td>
                    <td className="py-2 px-3">{v.temperature ? `${v.temperature}°C` : '—'}</td>
                    <td className="py-2 px-3">{v.bloodPressure || '—'}</td>
                    <td className="py-2 px-3">{v.heartRate ? `${v.heartRate}bpm` : '—'}</td>
                    <td className="py-2 px-3">{v.weight ? `${v.weight}kg` : '—'}</td>
                    <td className="py-2 px-3">{v.height ? `${v.height}cm` : '—'}</td>
                    <td className="py-2 px-3">{v.oxygenSaturation ? `${v.oxygenSaturation}%` : '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Appointment history */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-card overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100">
          <h3 className="font-bold text-slate-900">Appointment History ({appointments?.length || 0})</h3>
        </div>
        {!appointments?.length ? (
          <div className="p-10 text-center text-slate-400">No appointments found</div>
        ) : (
          <div className="divide-y divide-slate-50">
            {appointments.map((apt: any) => (
              <div key={apt.id} className="px-5 py-4">
                <div className="flex items-start justify-between gap-3 flex-wrap">
                  <div>
                    <p className="font-semibold text-slate-900 text-sm">Dr. {apt.doctor?.user?.firstName} {apt.doctor?.user?.lastName}</p>
                    <p className="text-xs text-brand-600">{apt.doctor?.speciality?.name} · {apt.clinic?.name}</p>
                    <div className="flex items-center gap-3 mt-1 text-xs text-slate-400">
                      <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{formatDate(apt.scheduledDate)}</span>
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{formatTime(apt.scheduledTime)}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className={cn('px-2.5 py-1 rounded-full text-xs font-semibold border', getStatusColor(apt.status))}>{apt.status}</span>
                    {apt.payment && (
                      <span className={cn('px-2.5 py-1 rounded-full text-xs font-semibold', getPaymentStatusColor(apt.payment.status))}>
                        {formatCurrency(Number(apt.payment.amount))} · {apt.payment.status}
                      </span>
                    )}
                  </div>
                </div>
                {apt.prescription && (
                  <div className="mt-3 pt-3 border-t border-slate-50">
                    <p className="text-xs font-semibold text-slate-600 mb-1">Prescription</p>
                    <p className="text-sm text-slate-600">{apt.prescription.diagnosis || 'General Consultation'}</p>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {apt.prescription.medicines?.map((m: any, j: number) => (
                        <span key={j} className="text-xs bg-teal-50 text-teal-700 border border-teal-100 px-2 py-0.5 rounded-full">
                          💊 {m.name} {m.dosage}
                        </span>
                      ))}
                    </div>
                    <a href={`${process.env.NEXT_PUBLIC_API_URL}/prescriptions/${apt.prescription.id}/pdf`} target="_blank" rel="noopener"
                      className="mt-2 inline-flex items-center gap-1.5 text-xs font-medium text-brand-600 hover:underline">
                      <Download className="w-3 h-3" /> Download PDF
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
