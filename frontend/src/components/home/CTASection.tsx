'use client';
// src/components/home/CTASection.tsx
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Smartphone } from 'lucide-react';

export default function CTASection() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-3xl bg-brand-gradient p-12 text-center text-white"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.08),transparent_60%)]" />
          <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-white/5 blur-2xl" />
          <div className="absolute -bottom-20 -left-20 w-64 h-64 rounded-full bg-teal-400/20 blur-2xl" />

          <div className="relative">
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/15 rounded-full text-sm font-medium mb-6">
              <Smartphone className="w-4 h-4" /> Free to use · No hidden charges
            </span>
            <h2 className="text-4xl sm:text-5xl font-extrabold mb-4 tracking-tight">
              Your Health,<br />Our Priority
            </h2>
            <p className="text-blue-100 mb-8 max-w-xl mx-auto">
              Join 50,000+ patients who trust MediBook for their healthcare needs. Book your first appointment today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-brand-700 font-bold rounded-2xl hover:bg-blue-50 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5">
                Create Free Account <ArrowRight className="w-5 h-5" />
              </Link>
              <Link href="/doctors" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/15 text-white font-bold rounded-2xl border border-white/30 hover:bg-white/25 transition-all">
                Browse Doctors
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
