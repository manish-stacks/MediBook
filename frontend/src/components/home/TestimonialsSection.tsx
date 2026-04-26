'use client';
// src/components/home/TestimonialsSection.tsx
import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';

const TESTIMONIALS = [
  { name: 'Priya Sharma', location: 'New Delhi', rating: 5, avatar: 'https://randomuser.me/api/portraits/women/1.jpg', text: 'MediBook made booking so easy! Got an appointment with a top cardiologist in under 2 minutes. The digital prescription was so convenient.', doctor: 'Dr. Arjun Mehta' },
  { name: 'Rajesh Kumar', location: 'Mumbai', rating: 5, avatar: 'https://randomuser.me/api/portraits/men/2.jpg', text: 'Managing my entire family\'s health on one platform is a game changer. I can track my parents\' medications and book their appointments easily.', doctor: 'Dr. Priya Patel' },
  { name: 'Ananya Singh', location: 'Bangalore', rating: 5, avatar: 'https://randomuser.me/api/portraits/women/3.jpg', text: 'The slot picker is so intuitive. I could see the exact availability and pick what worked for me. MediBook is the future of healthcare.', doctor: 'Dr. Vikram Singh' },
];

export default function TestimonialsSection() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <span className="text-brand-600 text-sm font-semibold tracking-wider uppercase">Patient stories</span>
          <h2 className="text-4xl font-extrabold text-slate-900 mt-2 mb-3">What Our Patients Say</h2>
          <p className="text-slate-500">Trusted by thousands of families across India.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-slate-50 rounded-3xl p-6 border border-slate-100 relative"
            >
              <Quote className="absolute top-6 right-6 w-8 h-8 text-brand-100" />
              <div className="flex gap-1 mb-4">
                {[...Array(t.rating)].map((_, j) => <Star key={j} className="w-4 h-4 fill-amber-400 text-amber-400" />)}
              </div>
              <p className="text-slate-600 text-sm leading-relaxed mb-5 italic">"{t.text}"</p>
              <div className="flex items-center gap-3">
                <img src={t.avatar} alt={t.name} className="w-10 h-10 rounded-2xl object-cover" />
                <div>
                  <p className="font-bold text-slate-900 text-sm">{t.name}</p>
                  <p className="text-xs text-slate-400">{t.location} · Patient of {t.doctor}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
