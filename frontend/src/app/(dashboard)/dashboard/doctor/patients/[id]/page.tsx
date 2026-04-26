'use client';
// src/app/(dashboard)/dashboard/doctor/patients/[id]/page.tsx
import { useParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import Link from 'next/link';
import { ChevronLeft, Activity, FileText, Calendar, Clock, Download } from 'lucide-react';
import { cn, formatDate, formatTime, getStatusColor, getAgeFromDOB } from '@/lib/utils';

export default function DoctorPatientDetailPage() {
  const { id } = useParams();
  const router = useRouter();

  // Get patient's history from appointments
  const { data, isLoading } = useQuery({
    queryKey: ['doctor-patient-history', id],
    queryFn: async () => {
      const apts = await api.get('/appointments', { params: { limit: 100 } }).then(r => r.data.data.appointments);
      const patientApts = apts.filter((a: any) => a.patientId === id || a.patient?.id === id);
      const patient = patientApts[0]?.patient || null;
      return { patient, appointments: patientApts };
    },
    enabled: !!id,
  });

  if (isLoading) return (
    <div className="w-full space-y-4">
      {[...Array(4)].map((_,i) => <div key={i} className="h-24 skeleton rounded-2xl" />)}
    </div>
  );

  const patient = data?.patient;
  const appointments = data?.appointments || [];

  if (!patient) return (
    <div className="max-w-3xl">
      <button onClick={() => router.back()} className="flex items-center gap-2 text-slate-500 mb-4"><ChevronLeft className="w-4 h-4" /> Back</button>
      <div className="bg-white rounded-2xl border border-slate-100 p-12 text-center shadow-card">
        <p className="text-slate-400">Patient not found or no appointments yet.</p>
      </div>
    </div>
  );

  const latestVitals = patient?.vitals?.[0];

  return (
    <div className="w-full space-y-5">
      <div className="flex items-center gap-3">
        <button onClick={() => router.back()} className="p-2 rounded-xl hover:bg-slate-100 text-slate-600"><ChevronLeft className="w-5 h-5" /></button>
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">{patient.firstName} {patient.lastName}</h1>
          <p className="text-slate-400 text-sm">Patient Medical History</p>
        </div>
      </div>

      {/* Patient info */}
      <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-card">
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 rounded-2xl bg-brand-gradient flex items-center justify-center text-white text-xl font-extrabold shrink-0">
            {patient.firstName?.[0]}{patient.lastName?.[0]}
          </div>
          <div className="flex-1">
            <h2 className="font-bold text-slate-900 text-xl">{patient.firstName} {patient.lastName}</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-2 text-sm text-slate-500">
              <span className="capitalize">Gender: {patient.gender?.toLowerCase()}</span>
              {patient.dateOfBirth && <span>Age: {getAgeFromDOB(patient.dateOfBirth)} yrs</span>}
              {patient.bloodGroup && <span className="text-red-600 font-semibold">Blood: {patient.bloodGroup}</span>}
              <span className="capitalize">Relation: {patient.relation?.toLowerCase()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Latest Vitals */}
      {latestVitals && (
        <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-card">
          <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2"><Activity className="w-4 h-4 text-rose-500" />Latest Vitals <span className="text-xs text-slate-400 font-normal ml-1">({formatDate(latestVitals.recordedAt)})</span></h3>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
            {[
              { label: 'Temp', val: latestVitals.temperature ? `${latestVitals.temperature}°C` : '—' },
              { label: 'BP', val: latestVitals.bloodPressure || '—' },
              { label: 'Heart', val: latestVitals.heartRate ? `${latestVitals.heartRate}bpm` : '—' },
              { label: 'Weight', val: latestVitals.weight ? `${latestVitals.weight}kg` : '—' },
              { label: 'Height', val: latestVitals.height ? `${latestVitals.height}cm` : '—' },
              { label: 'SpO2', val: latestVitals.oxygenSaturation ? `${latestVitals.oxygenSaturation}%` : '—' },
            ].map(({ label, val }) => (
              <div key={label} className="bg-slate-50 rounded-xl p-3 text-center">
                <p className="text-xs text-slate-400">{label}</p>
                <p className="font-bold text-slate-800 text-sm">{val}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Appointment history */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-card overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100">
          <h3 className="font-bold text-slate-900">Appointment History ({appointments.length})</h3>
        </div>
        {appointments.length === 0 ? (
          <div className="p-10 text-center text-slate-400">No appointments found</div>
        ) : (
          <div className="divide-y divide-slate-50">
            {appointments.map((apt: any) => (
              <Link key={apt.id} href={`/dashboard/doctor/appointments/${apt.id}`} className="flex items-center gap-4 px-5 py-4 hover:bg-slate-50/60 transition-colors">
                <div className="shrink-0">
                  <p className="font-bold text-slate-900 text-sm">{formatDate(apt.scheduledDate)}</p>
                  <p className="text-xs text-slate-400 flex items-center gap-1"><Clock className="w-3 h-3" />{formatTime(apt.scheduledTime)}</p>
                </div>
                <div className="flex-1 min-w-0">
                  {apt.prescription ? (
                    <p className="text-sm text-slate-600 truncate">📋 {apt.prescription.diagnosis || 'Prescription available'}</p>
                  ) : (
                    <p className="text-sm text-slate-400">No prescription</p>
                  )}
                  <p className="text-xs text-slate-400">{apt.clinic?.name}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className={cn('px-2 py-0.5 rounded-full text-xs font-semibold border', getStatusColor(apt.status))}>{apt.status}</span>
                  {apt.prescription && (
                    <a href={`${process.env.NEXT_PUBLIC_API_URL}/prescriptions/${apt.prescription.id}/pdf`} target="_blank" rel="noopener"
                      onClick={e => e.stopPropagation()}
                      className="p-1.5 text-brand-600 hover:bg-brand-50 rounded-xl transition-colors">
                      <Download className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
