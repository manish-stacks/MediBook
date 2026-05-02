'use client';
// src/app/(dashboard)/dashboard/payments/page.tsx
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { motion } from 'framer-motion';
import { CreditCard, Calendar, CheckCircle2, Clock, XCircle, RotateCcw, Download } from 'lucide-react';
import { cn, formatDate, formatCurrency, getPaymentStatusColor } from '@/lib/utils';

const STATUS_ICONS: Record<string, any> = { PAID:CheckCircle2, PENDING:Clock, FAILED:XCircle, REFUNDED:RotateCcw };
const STATUS_ICON_COLORS: Record<string, string> = { PAID:'text-green-500', PENDING:'text-amber-500', FAILED:'text-red-500', REFUNDED:'text-purple-500' };

function downloadReceipt(pay: any) {
  const w = window.open('', '_blank');
  if (!w) return;
  w.document.write(`<!DOCTYPE html><html><head><title>Receipt</title><style>
    body{font-family:'Segoe UI',sans-serif;margin:0;padding:40px;background:#f8fafc}
    .card{max-width:480px;margin:auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.1)}
    .header{background:linear-gradient(135deg,#1e6fe8,#02c9b3);padding:24px;text-align:center}
    .header h1{color:#fff;margin:0;font-size:22px}.header p{color:rgba(255,255,255,.7);margin:4px 0 0;font-size:13px}
    .body{padding:28px}.row{display:flex;justify-content:space-between;padding:10px 0;border-bottom:1px solid #f1f5f9;font-size:14px}
    .row:last-child{border:none}.label{color:#94a3b8}.value{font-weight:600;color:#1e293b}
    .amount{text-align:center;padding:20px 0;border-bottom:1px solid #f1f5f9}
    .amount .val{font-size:36px;font-weight:800;color:#15803d}
    .footer{background:#f8fafc;padding:16px 28px;text-align:center;font-size:11px;color:#94a3b8}
    .badge{display:inline-block;background:#dcfce7;color:#166534;padding:4px 12px;border-radius:999px;font-size:12px;font-weight:700}
  </style></head><body>
  <div class="card">
    <div class="header"><h1>🏥 MediBook</h1><p>Payment Receipt</p></div>
    <div class="body">
      <div class="amount"><p style="margin:0 0 4px;color:#94a3b8;font-size:12px">AMOUNT PAID</p><div class="val">₹${Number(pay.amount)}</div></div>
      <div class="row"><span class="label">Receipt No</span><span class="value">${pay.id?.slice(-8).toUpperCase()}</span></div>
      <div class="row"><span class="label">Date</span><span class="value">${pay.paidAt ? new Date(pay.paidAt).toLocaleDateString('en-IN') : new Date(pay.createdAt).toLocaleDateString('en-IN')}</span></div>
      <div class="row"><span class="label">Doctor</span><span class="value">Dr. ${pay.appointment?.doctor?.user?.firstName||''} ${pay.appointment?.doctor?.user?.lastName||''}</span></div>
      <div class="row"><span class="label">Payment Mode</span><span class="value">${(pay.paymentMode||'').replace('_',' ')}</span></div>
      ${pay.razorpayPaymentId ? `<div class="row"><span class="label">Transaction ID</span><span class="value">${pay.razorpayPaymentId}</span></div>` : ''}
      <div class="row"><span class="label">Status</span><span class="badge">✓ PAID</span></div>
    </div>
    <div class="footer">MediBook Technologies Pvt. Ltd. | support@medibook.in<br/>This is a system generated receipt</div>
  </div>
  <script>window.onload=()=>window.print();</script>
  </body></html>`);
  w.document.close();
}

export default function PaymentsPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['payment-history'],
    queryFn: () => api.get('/payments/history').then(r => r.data.data),
  });

  const payments = data?.payments || [];
  const total    = data?.total || 0;
  const totalPaid = payments.filter((p: any) => p.status === 'PAID').reduce((acc: number, p: any) => acc + Number(p.amount), 0);

  return (
    <div className="w-full space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900">Payment History</h1>
        <p className="text-slate-500 mt-1">All your consultation payments in one place</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total Spent', value: formatCurrency(totalPaid), color: 'text-brand-600', bg: 'bg-brand-50 border-brand-100' },
          { label: 'Transactions', value: total, color: 'text-slate-900', bg: 'bg-slate-50 border-slate-100' },
          { label: 'Paid Online', value: payments.filter((p: any) => p.paymentMode === 'ONLINE').length, color: 'text-teal-600', bg: 'bg-teal-50 border-teal-100' },
        ].map(stat => (
          <div key={stat.label} className={cn('p-4 rounded-2xl border', stat.bg)}>
            <p className={cn('text-2xl font-extrabold', stat.color)}>{stat.value}</p>
            <p className="text-sm text-slate-500 mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {isLoading ? (
        <div className="space-y-3">{[...Array(5)].map((_,i) => <div key={i} className="h-20 skeleton rounded-2xl" />)}</div>
      ) : payments.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-100 p-14 text-center shadow-card">
          <div className="text-5xl mb-4">💳</div>
          <p className="font-bold text-slate-800 mb-1">No payments yet</p>
          <p className="text-slate-400 text-sm">Your payment history will appear here</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-card overflow-hidden">
          <div className="px-5 py-3 border-b border-slate-100 bg-slate-50/50 grid grid-cols-6 gap-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
            <div className="col-span-2">Doctor / Date</div>
            <div>Mode</div>
            <div>Amount</div>
            <div>Status</div>
            <div>Receipt</div>
          </div>
          <div className="divide-y divide-slate-50">
            {payments.map((pay: any, i: number) => {
              const StatusIcon = STATUS_ICONS[pay.status] || Clock;
              return (
                <motion.div key={pay.id} initial={{opacity:0}} animate={{opacity:1}} transition={{delay:i*0.04}}
                  className="px-5 py-4 grid grid-cols-6 gap-3 items-center hover:bg-slate-50/50 transition-colors">
                  <div className="col-span-2">
                    <p className="font-semibold text-slate-900 text-sm">
                      {pay.appointment?.doctor ? `Dr. ${pay.appointment.doctor.user?.firstName} ${pay.appointment.doctor.user?.lastName}` : 'Consultation'}
                    </p>
                    <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                      <Calendar className="w-3 h-3" />
                      {pay.paidAt ? formatDate(pay.paidAt) : formatDate(pay.createdAt)}
                    </p>
                  </div>
                  <div><span className="text-xs font-medium text-slate-600 capitalize">{pay.paymentMode?.replace('_',' ').toLowerCase()||'-'}</span></div>
                  <div><span className="font-bold text-slate-900">{formatCurrency(Number(pay.amount))}</span></div>
                  <div>
                    <span className={cn('inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold', getPaymentStatusColor(pay.status))}>
                      <StatusIcon className={cn('w-3 h-3', STATUS_ICON_COLORS[pay.status])} />
                      {pay.status}
                    </span>
                  </div>
                  <div>
                    {pay.status === 'PAID' && (
                      <button onClick={() => downloadReceipt(pay)}
                        className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-brand-700 bg-brand-50 border border-brand-200 rounded-xl hover:bg-brand-100 transition-colors">
                        <Download className="w-3 h-3" /> PDF
                      </button>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
