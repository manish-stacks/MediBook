'use client';
// src/components/home/StatsSection.tsx
import { motion } from 'framer-motion';
import { Users, Award, Clock, HeartPulse } from 'lucide-react';

const STATS = [
  { icon: Users,     value: '50,000+', label: 'Patients Served',      color: 'text-brand-600', bg: 'bg-brand-50' },
  { icon: Award,     value: '2,000+',  label: 'Verified Doctors',     color: 'text-teal-600',  bg: 'bg-teal-50' },
  { icon: HeartPulse,value: '150+',    label: 'Medical Specialities', color: 'text-rose-600',  bg: 'bg-rose-50' },
  { icon: Clock,     value: '< 2 min', label: 'Avg Booking Time',     color: 'text-amber-600', bg: 'bg-amber-50' },
];

export default function StatsSection() {
  return (
    <section className="py-16 bg-white border-y border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="flex items-center gap-4 p-5 rounded-2xl bg-slate-50/60 border border-slate-100"
            >
              <div className={`w-12 h-12 rounded-2xl ${stat.bg} flex items-center justify-center shrink-0`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <div>
                <p className="text-2xl font-extrabold text-slate-900">{stat.value}</p>
                <p className="text-sm text-slate-500">{stat.label}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
