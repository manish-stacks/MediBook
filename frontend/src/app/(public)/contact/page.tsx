'use client';
// src/app/(public)/contact/page.tsx
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import api from '@/lib/api';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const up = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));
  const [sent, setSent] = useState(false);

  const mutation = useMutation({
    mutationFn: (data: any) => api.post('/blogs/contact', data),
    onSuccess: () => { setSent(true); toast.success('Message sent! We\'ll get back to you shortly.'); },
    onError: (e: any) => toast.error(e.response?.data?.message || 'Failed to send. Please try again.'),
  });

  if (sent) return (
    <div className="pt-16 min-h-screen bg-surface-subtle flex items-center justify-center">
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center p-12">
        <CheckCircle2 className="w-20 h-20 text-green-500 mx-auto mb-4" />
        <h2 className="text-2xl font-extrabold text-slate-900 mb-2">Message Sent!</h2>
        <p className="text-slate-500">We'll get back to you within 24 hours.</p>
      </motion.div>
    </div>
  );

  return (
    <div className="pt-16 min-h-screen bg-surface-subtle">
      <div className="bg-white border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-4xl font-extrabold text-slate-900 mb-2">Contact Us</h1>
            <p className="text-slate-500 text-lg">Have questions? We'd love to hear from you.</p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-3 gap-10">
          {/* Info */}
          <div className="space-y-6">
            {[
              { icon: Mail, title: 'Email', val: 'support@medibook.in', sub: 'We reply within 24 hours', color: 'bg-brand-50 text-brand-600' },
              { icon: Phone, title: 'Phone', val: '+91 800 123 4567', sub: 'Mon–Sat, 9AM–6PM', color: 'bg-teal-50 text-teal-600' },
              { icon: MapPin, title: 'Office', val: 'New Delhi, India', sub: 'Visit by appointment', color: 'bg-violet-50 text-violet-600' },
            ].map(({ icon: Icon, title, val, sub, color }) => (
              <div key={title} className="flex items-start gap-4 bg-white rounded-2xl border border-slate-100 p-5 shadow-card">
                <div className={`w-11 h-11 rounded-2xl ${color} flex items-center justify-center shrink-0`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-bold text-slate-900">{title}</p>
                  <p className="text-slate-700 text-sm font-medium">{val}</p>
                  <p className="text-slate-400 text-xs">{sub}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-card">
              <h2 className="font-bold text-slate-900 text-xl mb-6">Send a Message</h2>
              <div className="grid sm:grid-cols-2 gap-4 mb-4">
                {[
                  { label: 'Your Name *', key: 'name', placeholder: 'John Doe', type: 'text' },
                  { label: 'Email *', key: 'email', placeholder: 'you@example.com', type: 'email' },
                  { label: 'Phone', key: 'phone', placeholder: '+91 9876543210', type: 'tel' },
                  { label: 'Subject *', key: 'subject', placeholder: 'How can we help?', type: 'text' },
                ].map(({ label, key, placeholder, type }) => (
                  <div key={key}>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">{label}</label>
                    <input type={type} value={(form as any)[key]} onChange={e => up(key, e.target.value)} placeholder={placeholder}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100 transition-all placeholder:text-slate-400" />
                  </div>
                ))}
              </div>
              <div className="mb-5">
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Message *</label>
                <textarea value={form.message} onChange={e => up('message', e.target.value)} rows={5} placeholder="Describe your query in detail..."
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100 transition-all resize-none placeholder:text-slate-400" />
              </div>
              <button
                onClick={() => { if (!form.name || !form.email || !form.subject || !form.message) { toast.error('Please fill required fields'); return; } mutation.mutate(form); }}
                disabled={mutation.isPending}
                className="w-full py-4 bg-brand-600 text-white font-bold rounded-2xl hover:bg-brand-700 transition-all disabled:opacity-60 flex items-center justify-center gap-2 text-sm shadow-sm hover:shadow-md">
                <Send className="w-4 h-4" /> {mutation.isPending ? 'Sending...' : 'Send Message'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
