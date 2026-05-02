'use client';
// src/app/(dashboard)/dashboard/doctor/appointments/[id]/page.tsx
import { useParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import Link from 'next/link';
import { ChevronLeft, Calendar, Clock, MapPin, User, FileText, Activity, CreditCard, CheckCircle2 } from 'lucide-react';
import { cn, formatDate, formatTime, getStatusColor, getPaymentStatusColor, formatCurrency } from '@/lib/utils';

export default function DoctorAppointmentDetailPage() {
  const { id } = useParams();
  const router = useRouter();

  const { data: apt, isLoading } = useQuery({
    queryKey: ['appointment', id],
    queryFn: () => api.get(`/appointments/${id}`).then(r => r.data.data),
    enabled: !!id,
  });

  if (isLoading) return (
    <div className="w-full space-y-4">
      <div className="h-10 skeleton rounded-xl w-48" />
      {[...Array(4)].map((_,i) => <div key={i} className="h-32 skeleton rounded-2xl" />)}
    </div>
  );
  if (!apt) return <div className="text-slate-400">Appointment not found</div>;

  const hasVitals = apt.patient?.vitals?.length > 0;
  const v = hasVitals ? apt.patient.vitals[0] : null;

  return (
    <div className="w-full space-y-5">
      <div className="flex items-center gap-3">
        <button onClick={() => router.back()} className="p-2 rounded-xl hover:bg-slate-100 text-slate-600"><ChevronLeft className="w-5 h-5" /></button>
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Appointment Details</h1>
          <p className="text-slate-400 text-sm">#{apt.appointmentNo}</p>
        </div>
        <span className={cn('ml-auto px-3 py-1 rounded-full text-xs font-semibold border', getStatusColor(apt.status))}>{apt.status}</span>
      </div>

      {/* Patient */}
      <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-card">
        <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2"><User className="w-4 h-4 text-brand-500" />Patient Information</h3>
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-2xl bg-brand-gradient flex items-center justify-center text-white font-bold text-lg shrink-0">
            {apt.patient?.firstName?.[0]}{apt.patient?.lastName?.[0]}
          </div>
          <div className="flex-1">
            <p className="font-bold text-slate-900 text-lg">{apt.patient?.firstName} {apt.patient?.lastName}</p>
            <div className="grid grid-cols-2 gap-x-6 gap-y-1 mt-2 text-sm text-slate-500">
              <span className="capitalize">Gender: {apt.patient?.gender?.toLowerCase()}</span>
              <span className="capitalize">Relation: {apt.patient?.relation?.toLowerCase()}</span>
              {apt.patient?.dateOfBirth && <span>DOB: {formatDate(apt.patient.dateOfBirth)}</span>}
              {apt.patient?.bloodGroup && <span>Blood: {apt.patient.bloodGroup}</span>}
            </div>
          </div>
        </div>
        {apt.notes && (
          <div className="mt-4 p-3 bg-amber-50 border border-amber-100 rounded-xl text-sm text-amber-800">
            <span className="font-semibold">Patient Note:</span> {apt.notes}
          </div>
        )}
      </div>

      {/* Appointment */}
      <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-card">
        <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2"><Calendar className="w-4 h-4 text-teal-500" />Appointment</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2 text-sm text-slate-600"><Calendar className="w-4 h-4 text-brand-400" />{formatDate(apt.scheduledDate)}</div>
          <div className="flex items-center gap-2 text-sm text-slate-600"><Clock className="w-4 h-4 text-brand-400" />{formatTime(apt.scheduledTime)}</div>
          {apt.clinic && <div className="flex items-center gap-2 text-sm text-slate-600 col-span-2"><MapPin className="w-4 h-4 text-teal-400" />{apt.clinic.name}, {apt.clinic.city}</div>}
        </div>
      </div>

      {/* Vitals */}
      <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-slate-900 flex items-center gap-2"><Activity className="w-4 h-4 text-rose-500" />Patient Vitals</h3>
          {!hasVitals && <span className="text-xs text-amber-600 bg-amber-50 border border-amber-200 px-2 py-1 rounded-full">Not recorded yet</span>}
        </div>
        {hasVitals ? (
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'Temperature', val: v?.temperature ? `${v.temperature}°C` : '—' },
              { label: 'Blood Pressure', val: v?.bloodPressure || '—' },
              { label: 'Heart Rate', val: v?.heartRate ? `${v.heartRate} bpm` : '—' },
              { label: 'Weight', val: v?.weight ? `${v.weight} kg` : '—' },
              { label: 'Height', val: v?.height ? `${v.height} cm` : '—' },
              { label: 'SpO2', val: v?.oxygenSaturation ? `${v.oxygenSaturation}%` : '—' },
            ].map(({ label, val }) => (
              <div key={label} className="bg-slate-50 rounded-xl p-3 text-center">
                <p className="text-xs text-slate-400 mb-1">{label}</p>
                <p className="font-bold text-slate-800">{val}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-slate-400">Record vitals from the Patients page</p>
        )}
        {v?.notes && <p className="mt-3 text-sm text-slate-600 bg-slate-50 rounded-xl p-3">{v.notes}</p>}
      </div>

      {/* Payment */}
      <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-card">
        <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2"><CreditCard className="w-4 h-4 text-violet-500" />Payment</h3>
        <div className="flex items-center justify-between">
          <div>
            <p className="font-bold text-slate-900 text-2xl">{apt.payment ? formatCurrency(Number(apt.payment.amount)) : '—'}</p>
            <p className="text-sm text-slate-400 capitalize mt-0.5">{apt.payment?.paymentMode?.replace('_', ' ').toLowerCase() || ''}</p>
          </div>
          <span className={cn('px-3 py-1.5 rounded-full text-sm font-semibold', getPaymentStatusColor(apt.payment?.status || 'PENDING'))}>
            {apt.payment?.status || 'PENDING'}
          </span>
        </div>
      </div>

      {/* Prescription */}
      <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-card">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-slate-900 flex items-center gap-2"><FileText className="w-4 h-4 text-green-500" />Prescription</h3>
          {!apt.prescription && (
            <Link href={`/dashboard/doctor/prescriptions/new?appointmentId=${apt.id}&patientId=${apt.patientId}`}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-brand-600 text-white text-xs font-semibold rounded-xl hover:bg-brand-700 transition-colors">
              <FileText className="w-3.5 h-3.5" /> Write Prescription
            </Link>
          )}
        </div>
        {apt.prescription ? (
          <div>
            <p className="text-sm font-semibold text-slate-700 mb-2">Diagnosis: <span className="font-normal text-slate-600">{apt.prescription.diagnosis || 'General Consultation'}</span></p>
            <div className="space-y-2 mb-3">
              {apt.prescription.medicines?.map((med: any, i: number) => (
                <div key={i} className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
                  <div>
                    <p className="font-semibold text-sm text-slate-900">💊 {med.name}</p>
                    <p className="text-xs text-slate-400">{med.dosage} · {[med.morning && 'Morning', med.afternoon && 'Afternoon', med.evening && 'Evening'].filter(Boolean).join(', ') || 'As directed'}</p>
                  </div>
                  <span className="text-xs text-slate-500">{med.duration ? `${med.duration} days` : ''}</span>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <Link href={`/dashboard/doctor/prescriptions/new?appointmentId=${apt.id}&patientId=${apt.patientId}&edit=${apt.prescription.id}`}
                className="px-3 py-1.5 border border-brand-200 text-brand-600 text-xs font-semibold rounded-xl hover:bg-brand-50 transition-colors">
                Edit Prescription
              </Link>
              <a href={`${process.env.NEXT_PUBLIC_API_URL}/prescriptions/${apt.prescription.id}/pdf`} target="_blank" rel="noopener"
                className="px-3 py-1.5 bg-green-50 border border-green-200 text-green-700 text-xs font-semibold rounded-xl hover:bg-green-100 transition-colors">
                Download PDF
              </a>
            </div>
          </div>
        ) : (
          <p className="text-sm text-slate-400">No prescription yet for this appointment.</p>
        )}
      </div>
    </div>
  );
}
