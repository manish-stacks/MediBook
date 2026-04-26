'use client';
// src/app/admin/settings/page.tsx
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { motion } from 'framer-motion';
import { Save, Eye, EyeOff, Settings, CreditCard, Globe, FileText } from 'lucide-react';
import toast from 'react-hot-toast';

const TABS = [
  { id: 'general', label: 'General', icon: Settings },
  { id: 'payment', label: 'Payment', icon: CreditCard },
  { id: 'pages', label: 'Static Pages', icon: FileText },
];

const STATIC_PAGES = [
  { slug: 'terms', title: 'Terms of Service' },
  { slug: 'privacy', title: 'Privacy Policy' },
  { slug: 'refund', title: 'Refund Policy' },
  { slug: 'about', title: 'About Us' },
];

function GeneralSettings() {
  const qc = useQueryClient();
  const { data } = useQuery({ queryKey: ['settings'], queryFn: () => api.get('/settings').then(r => r.data.data) });
  const [form, setForm] = useState<Record<string, string>>({});
  const up = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  const mutation = useMutation({
    mutationFn: (settings: any[]) => api.put('/settings/bulk', { settings }),
    onSuccess: () => { toast.success('Settings saved!'); qc.invalidateQueries({ queryKey: ['settings'] }); },
  });

  const current = data?.general || {};
  const fields = [
    { key: 'site_name', label: 'Site Name', placeholder: 'MediBook' },
    { key: 'site_tagline', label: 'Tagline', placeholder: 'Your Health, Our Priority' },
    { key: 'support_email', label: 'Support Email', placeholder: 'support@medibook.in' },
    { key: 'support_phone', label: 'Support Phone', placeholder: '+91 800 123 4567' },
    { key: 'address', label: 'Office Address', placeholder: 'New Delhi, India' },
  ];

  const handleSave = () => {
    const settings = Object.entries(form).map(([key, value]) => ({ key, value, group: 'general' }));
    if (settings.length) mutation.mutate(settings);
  };

  return (
    <div className="space-y-4">
      <div className="grid sm:grid-cols-2 gap-4">
        {fields.map(({ key, label, placeholder }) => (
          <div key={key}>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">{label}</label>
            <input type="text" value={form[key] ?? current[key] ?? ''} onChange={e => up(key, e.target.value)}
              placeholder={placeholder}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm outline-none focus:border-brand-400 transition-all" />
          </div>
        ))}
      </div>
      <button onClick={handleSave} disabled={mutation.isPending}
        className="px-6 py-3 bg-brand-600 text-white font-bold rounded-2xl text-sm disabled:opacity-60 flex items-center gap-2">
        <Save className="w-4 h-4" /> {mutation.isPending ? 'Saving...' : 'Save Settings'}
      </button>
    </div>
  );
}

function PaymentSettings() {
  const qc = useQueryClient();
  const { data } = useQuery({ queryKey: ['settings'], queryFn: () => api.get('/settings').then(r => r.data.data) });
  const [form, setForm] = useState<Record<string, string>>({});
  const [showSecrets, setShowSecrets] = useState<Record<string, boolean>>({});
  const up = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  const mutation = useMutation({
    mutationFn: (settings: any[]) => api.put('/settings/bulk', { settings }),
    onSuccess: () => { toast.success('Payment settings saved!'); qc.invalidateQueries({ queryKey: ['settings'] }); },
  });

  const current = data?.payment || {};
  const fields = [
    { key: 'razorpay_key_id', label: 'Razorpay Key ID', placeholder: 'rzp_live_...', secret: false },
    { key: 'razorpay_key_secret', label: 'Razorpay Key Secret', placeholder: 'Your secret key', secret: true },
    { key: 'platform_fee_percent', label: 'Platform Fee (%)', placeholder: '10', secret: false },
    { key: 'currency', label: 'Currency', placeholder: 'INR', secret: false },
  ];

  const handleSave = () => {
    const settings = Object.entries(form).map(([key, value]) => ({ key, value, group: 'payment' }));
    if (settings.length) mutation.mutate(settings);
  };

  return (
    <div className="space-y-4">
      <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl text-sm text-amber-800">
        ⚠️ Payment credentials are sensitive. Only change if you know what you're doing.
      </div>
      <div className="space-y-4">
        {fields.map(({ key, label, placeholder, secret }) => (
          <div key={key}>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">{label}</label>
            <div className="relative">
              <input
                type={secret && !showSecrets[key] ? 'password' : 'text'}
                value={form[key] ?? current[key] ?? ''}
                onChange={e => up(key, e.target.value)}
                placeholder={placeholder}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm outline-none focus:border-brand-400 transition-all pr-12"
              />
              {secret && (
                <button type="button" onClick={() => setShowSecrets(s => ({ ...s, [key]: !s[key] }))}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  {showSecrets[key] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
      <button onClick={handleSave} disabled={mutation.isPending}
        className="px-6 py-3 bg-brand-600 text-white font-bold rounded-2xl text-sm disabled:opacity-60 flex items-center gap-2">
        <Save className="w-4 h-4" /> {mutation.isPending ? 'Saving...' : 'Save Payment Settings'}
      </button>
    </div>
  );
}

function StaticPagesSettings() {
  const [activePage, setActivePage] = useState('terms');
  const qc = useQueryClient();

  const { data } = useQuery({
    queryKey: ['static-page', activePage],
    queryFn: () => api.get(`/settings/pages/${activePage}`).then(r => r.data.data),
  });

  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');

  const page = data;

  const mutation = useMutation({
    mutationFn: (dto: any) => api.put(`/settings/pages/${activePage}`, dto),
    onSuccess: () => { toast.success('Page saved!'); qc.invalidateQueries({ queryKey: ['static-page', activePage] }); },
  });

  return (
    <div className="space-y-4">
      <div className="flex gap-2 flex-wrap">
        {STATIC_PAGES.map(p => (
          <button key={p.slug} onClick={() => setActivePage(p.slug)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${activePage === p.slug ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
            {p.title}
          </button>
        ))}
      </div>
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-1.5">Page Title</label>
        <input type="text" value={title || page?.title || ''} onChange={e => setTitle(e.target.value)}
          placeholder={STATIC_PAGES.find(p => p.slug === activePage)?.title}
          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm outline-none focus:border-brand-400 transition-all" />
      </div>
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-1.5">Content (HTML supported)</label>
        <textarea
          value={content || page?.content || ''}
          onChange={e => setContent(e.target.value)}
          rows={16}
          placeholder="<h2>Terms of Service</h2><p>Content here...</p>"
          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm outline-none focus:border-brand-400 transition-all resize-y font-mono"
        />
      </div>
      <button
        onClick={() => mutation.mutate({ title: title || page?.title || STATIC_PAGES.find(p => p.slug === activePage)?.title, content: content || page?.content || '' })}
        disabled={mutation.isPending}
        className="px-6 py-3 bg-brand-600 text-white font-bold rounded-2xl text-sm disabled:opacity-60 flex items-center gap-2">
        <Save className="w-4 h-4" /> {mutation.isPending ? 'Saving...' : 'Save Page'}
      </button>
    </div>
  );
}

export default function AdminSettingsPage() {
  const [tab, setTab] = useState('general');

  return (
    <div className="max-w-3xl space-y-6 mx-auto">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900">Settings</h1>
        <p className="text-slate-500 mt-1">Manage website configuration</p>
      </div>

      <div className="flex gap-1 bg-slate-100 p-1 rounded-2xl w-fit">
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${tab === t.id ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
            <t.icon className="w-4 h-4" /> {t.label}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-card">
        {tab === 'general' && <GeneralSettings />}
        {tab === 'payment' && <PaymentSettings />}
        {tab === 'pages' && <StaticPagesSettings />}
      </div>
    </div>
  );
}
