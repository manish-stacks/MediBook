'use client';
// src/components/home/HowItWorks.tsx
import { motion } from 'framer-motion';
import { Search, CalendarCheck, Video, FileCheck } from 'lucide-react';

const STEPS = [
  { step: '01', icon: Search,       title: 'Find Your Doctor',      desc: 'Search by name, speciality, or clinic. Filter by experience, fees, ratings, and availability.', color: 'bg-brand-600' },
  { step: '02', icon: CalendarCheck, title: 'Book a Slot',          desc: 'Pick your preferred date and time. See real-time availability with our calendar picker.', color: 'bg-teal-600' },
  { step: '03', icon: Video,         title: 'Visit or Consult',     desc: 'Visit the clinic or consult online. Get full medical attention and a digital prescription.', color: 'bg-violet-600' },
  { step: '04', icon: FileCheck,     title: 'Access Records',       desc: 'All prescriptions and medical history saved digitally. Download PDFs anytime.', color: 'bg-rose-600' },
];

export default function HowItWorks() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <span className="text-brand-600 text-sm font-semibold tracking-wider uppercase">Simple process</span>
          <h2 className="text-4xl font-extrabold text-slate-900 mt-2 mb-3">How MediBook Works</h2>
          <p className="text-slate-500">From search to prescription in minutes.</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {STEPS.map((step, i) => (
            <motion.div
              key={step.step}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="relative p-6 rounded-3xl bg-slate-50 border border-slate-100 group hover:border-brand-200 hover:bg-brand-50/30 transition-all duration-300"
            >
              <span className="absolute top-6 right-6 text-4xl font-black text-slate-100 group-hover:text-brand-100 transition-colors">{step.step}</span>
              <div className={`w-12 h-12 ${step.color} rounded-2xl flex items-center justify-center mb-5 shadow-sm`}>
                <step.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-bold text-slate-900 mb-2">{step.title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
