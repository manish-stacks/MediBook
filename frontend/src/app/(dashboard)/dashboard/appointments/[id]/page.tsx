'use client';
// src/app/(dashboard)/dashboard/appointments/[id]/page.tsx
import { useParams, useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ChevronLeft, Calendar, Clock, MapPin, User, CreditCard, FileText, Star, CheckCircle2, XCircle, Download } from 'lucide-react';
import { cn, formatDate, formatTime, getStatusColor, getPaymentStatusColor, formatCurrency } from '@/lib/utils';
import toast from 'react-hot-toast';
import { useState } from 'react';

export default function AppointmentDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const qc = useQueryClient();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  const { data: apt, isLoading } = useQuery({
    queryKey: ['appointment', id],
    queryFn: () => api.get(`/appointments/${id}`).then(r => r.data.data),
    enabled: !!id,
  });

  const { data: prescription } = useQuery({
    queryKey: ['prescription-by-apt', id],
    queryFn: () => api.get(`/prescriptions/appointment/${id}`).then(r => r.data.data).catch(() => null),
    enabled: !!id,
  });

  // Razorpay payment
  const payMutation = useMutation({
    mutationFn: async () => {
      const { data: orderData } = await api.post(`/payments/create-order/${id}`);
      const order = orderData.data;
      if (order.isMock) { toast.success('Mock payment successful (test mode)'); qc.invalidateQueries({ queryKey: ['appointment', id] }); return; }
      return new Promise((resolve, reject) => {
        const rzp = new (window as any).Razorpay({
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
          amount: order.amount,
          currency: order.currency,
          order_id: order.id,
          name: 'MediBook',
          description: 'Doctor Consultation',
          handler: async (response: any) => {
            await api.post('/payments/verify', { orderId: response.razorpay_order_id, paymentId: response.razorpay_payment_id, signature: response.razorpay_signature, appointmentId: id });
            toast.success('Payment successful!');
            qc.invalidateQueries({ queryKey: ['appointment', id] });
            resolve(true);
          },
          modal: { ondismiss: () => reject(new Error('Payment cancelled')) },
        });
        rzp.open();
      });
    },
    onError: (e: any) => toast.error(e.message || 'Payment failed'),
  });

  if (isLoading) return <div className="h-96 skeleton rounded-3xl max-w-3xl" />;
  if (!apt) return <div className="text-slate-400">Appointment not found</div>;

  const canPay = apt.status === 'CONFIRMED' && apt.payment?.status === 'PENDING' && apt.payment?.paymentMode === 'ONLINE';

  const StatusIcon = apt.status === 'COMPLETED' ? CheckCircle2 : apt.status === 'CANCELLED' ? XCircle : Calendar;
  const statusIconColor = apt.status === 'COMPLETED' ? 'text-green-500' : apt.status === 'CANCELLED' ? 'text-red-400' : 'text-brand-500';

  return (
    <div className="max-w-3xl space-y-5">
      <div className="flex items-center gap-3">
        <button onClick={() => router.back()} className="p-2 rounded-xl hover:bg-slate-100 text-slate-600 transition-colors">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Appointment Details</h1>
          <p className="text-slate-500 text-sm">#{apt.appointmentNo}</p>
        </div>
      </div>

      {/* Status banner */}
      <div className={cn('flex items-center gap-3 p-4 rounded-2xl border', getStatusColor(apt.status))}>
        <StatusIcon className={cn('w-5 h-5 shrink-0', statusIconColor)} />
        <div>
          <p className="font-bold">{apt.status}</p>
          <p className="text-xs opacity-70">{formatDate(apt.scheduledDate)} at {formatTime(apt.scheduledTime)}</p>
        </div>
      </div>

      {/* Doctor info */}
      <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-card">
        <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2"><User className="w-4 h-4 text-brand-500" />Doctor</h3>
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl overflow-hidden shrink-0">
            <img src={apt.doctor?.user?.avatar || `https://ui-avatars.com/api/?name=${apt.doctor?.user?.firstName}&background=1e6fe8&color=fff`} className="w-full h-full object-cover" alt="" />
          </div>
          <div>
            <p className="font-bold text-slate-900">Dr. {apt.doctor?.user?.firstName} {apt.doctor?.user?.lastName}</p>
            <p className="text-brand-600 text-sm font-medium">{apt.doctor?.speciality?.name}</p>
            {apt.clinic && (
              <p className="text-xs text-slate-400 flex items-center gap-1 mt-1"><MapPin className="w-3 h-3" />{apt.clinic.name}, {apt.clinic.city}</p>
            )}
          </div>
        </div>
        {apt.notes && (
          <div className="mt-4 p-3 bg-slate-50 rounded-xl">
            <p className="text-xs font-semibold text-slate-500 mb-1">Your Notes</p>
            <p className="text-sm text-slate-700">{apt.notes}</p>
          </div>
        )}
      </div>

      {/* Patient info */}
      <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-card">
        <h3 className="font-bold text-slate-900 mb-3 flex items-center gap-2"><User className="w-4 h-4 text-teal-500" />Patient</h3>
        <div className="flex items-center justify-between">
          <div>
            <p className="font-semibold text-slate-900">{apt.patient?.firstName} {apt.patient?.lastName}</p>
            <p className="text-sm text-slate-400 capitalize">{apt.patient?.gender?.toLowerCase()} · {apt.patient?.relation?.toLowerCase()}</p>
          </div>
        </div>
      </div>

      {/* Payment */}
      <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-card">
        <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2"><CreditCard className="w-4 h-4 text-violet-500" />Payment</h3>
        <div className="flex items-center justify-between mb-3">
          <span className="text-slate-600">Consultation fee</span>
          <span className="font-bold text-slate-900">{apt.payment ? formatCurrency(Number(apt.payment.amount)) : '-'}</span>
        </div>
        <div className="flex items-center justify-between mb-4">
          <span className="text-slate-600">Mode</span>
          <span className="text-slate-700 font-medium capitalize">{apt.payment?.paymentMode?.replace('_', ' ').toLowerCase() || '-'}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-slate-600">Status</span>
          <span className={cn('px-2.5 py-1 rounded-full text-xs font-semibold', getPaymentStatusColor(apt.payment?.status || 'PENDING'))}>
            {apt.payment?.status || 'PENDING'}
          </span>
        </div>
        {canPay && (
          <button onClick={() => payMutation.mutate()} disabled={payMutation.isPending} className="w-full mt-4 py-3 bg-brand-600 text-white font-bold rounded-2xl hover:bg-brand-700 transition-all disabled:opacity-60 text-sm">
            {payMutation.isPending ? 'Processing...' : `Pay Now · ${apt.payment ? formatCurrency(Number(apt.payment.amount)) : ''}`}
          </button>
        )}
      </div>

      {/* Prescription */}
      {prescription && (
        <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-card">
          <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2"><FileText className="w-4 h-4 text-green-500" />Prescription</h3>
          <div className="space-y-2 mb-4">
            {prescription.medicines?.map((med: any, i: number) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
                <div>
                  <p className="font-semibold text-sm text-slate-900">{med.name}</p>
                  <p className="text-xs text-slate-400">{med.dosage} · {med.frequency}</p>
                </div>
                <span className="text-xs text-slate-500">{med.duration}</span>
              </div>
            ))}
          </div>
          {prescription.notes && <p className="text-sm text-slate-600 bg-slate-50 rounded-xl p-3">{prescription.notes}</p>}
          <a href={`${process.env.NEXT_PUBLIC_API_URL}/prescriptions/${prescription.id}/pdf`} target="_blank" rel="noopener" className="mt-4 flex items-center justify-center gap-2 w-full py-3 border border-brand-200 text-brand-600 font-semibold rounded-2xl hover:bg-brand-50 transition-colors text-sm">
            <Download className="w-4 h-4" /> Download Prescription PDF
          </a>
        </div>
      )}
    </div>
  );
}
