'use client';
import { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { Search, Star, MapPin, Clock, Shield, Zap, ChevronRight, Play, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

const SPECIALITIES = ['Cardiologist', 'Dermatologist', 'Neurologist', 'Pediatrician', 'Gynecologist', 'Psychiatrist', 'Orthopedist'];

const TRUST_BADGES = [
  { icon: Shield, text: 'Verified Doctors', color: 'text-green-400' },
  { icon: Clock, text: '24/7 Booking', color: 'text-blue-400' },
  { icon: Star, text: '4.9★ Rated', color: 'text-amber-400' },
  { icon: Zap, text: 'Instant Confirm', color: 'text-purple-400' },
];

const LIVE_STATS = [
  { val: '50,000+', label: 'Happy Patients', icon: '❤️' },
  { val: '2,000+', label: 'Expert Doctors', icon: '👨‍⚕️' },
  { val: '150+', label: 'Specialities', icon: '🏥' },
  { val: '< 2 min', label: 'Avg Booking', icon: '⚡' },
];

export default function HeroSection() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [wordIdx, setWordIdx] = useState(0);
  const [displayed, setDisplayed] = useState('');
  const [typing, setTyping] = useState(true);
  const [activeCity, setActiveCity] = useState('Delhi');

  // Typewriter
  useEffect(() => {
    const word = SPECIALITIES[wordIdx];
    if (typing) {
      if (displayed.length < word.length) {
        const t = setTimeout(() => setDisplayed(word.slice(0, displayed.length + 1)), 75);
        return () => clearTimeout(t);
      } else {
        const t = setTimeout(() => setTyping(false), 2000);
        return () => clearTimeout(t);
      }
    } else {
      if (displayed.length > 0) {
        const t = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 35);
        return () => clearTimeout(t);
      } else { setWordIdx(i => (i + 1) % SPECIALITIES.length); setTyping(true); }
    }
  }, [displayed, typing, wordIdx]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) router.push(`/doctors?search=${encodeURIComponent(search.trim())}`);
    else router.push('/doctors');
  };

  return (
    <section className="relative min-h-screen flex flex-col overflow-hidden bg-slate-950">
      {/* Animated background layers */}
      <div className="absolute inset-0">
        {/* Base gradient */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/40 via-slate-950 to-slate-950" />
        
        {/* Grid lines */}
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: `linear-gradient(rgba(99,179,237,0.4) 1px, transparent 1px),linear-gradient(90deg,rgba(99,179,237,0.4) 1px,transparent 1px)`,
          backgroundSize: '80px 80px',
        }} />

        {/* Glowing orbs */}
        <motion.div animate={{ scale:[1,1.3,1], opacity:[0.15,0.3,0.15] }} transition={{ duration:8, repeat:Infinity }}
          className="absolute top-20 left-1/4 w-[500px] h-[500px] rounded-full bg-blue-600/20 blur-[80px]" />
        <motion.div animate={{ scale:[1.2,1,1.2], opacity:[0.1,0.25,0.1] }} transition={{ duration:10, repeat:Infinity, delay:3 }}
          className="absolute bottom-20 right-1/4 w-[400px] h-[400px] rounded-full bg-teal-500/20 blur-[80px]" />
        <motion.div animate={{ x:[-20,20,-20], opacity:[0.2,0.35,0.2] }} transition={{ duration:12, repeat:Infinity, delay:1 }}
          className="absolute top-1/2 left-1/2 w-[300px] h-[300px] rounded-full bg-violet-500/15 blur-[60px]" />

        {/* Floating particles */}
        {[...Array(24)].map((_,i) => (
          <motion.div key={i}
            className={cn('absolute rounded-full', i%3===0?'w-1.5 h-1.5 bg-blue-400/50':i%3===1?'w-1 h-1 bg-teal-400/40':'w-1 h-1 bg-violet-400/30')}
            style={{ left:`${5+Math.random()*90}%`, top:`${5+Math.random()*90}%` }}
            animate={{ y:[0,-40-Math.random()*40,0], opacity:[0,0.8,0] }}
            transition={{ duration:3+Math.random()*5, repeat:Infinity, delay:Math.random()*8, ease:'easeInOut' }}
          />
        ))}
      </div>

      {/* Main content */}
      <div className="relative flex-1 flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 w-full">
          <div className="grid lg:grid-cols-2 gap-16 items-center">

            {/* ── Left Column ── */}
            <div>
              {/* Trust pill */}
              <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:0.1}}
                className="inline-flex items-center gap-3 mb-8">
                <div className="flex -space-x-2">
                  {['32','44','55'].map(n => (
                    <img key={n} src={`https://randomuser.me/api/portraits/men/${n}.jpg`}
                      className="w-8 h-8 rounded-full ring-2 ring-slate-900 object-cover" alt="" />
                  ))}
                </div>
                <span className="text-slate-300 text-sm font-medium">
                  <span className="text-green-400 font-bold">50K+</span> patients trusted us this month
                </span>
              </motion.div>

              {/* Headline */}
              <motion.div initial={{opacity:0,y:30}} animate={{opacity:1,y:0}} transition={{delay:0.2}}>
                <h1 className="text-5xl sm:text-6xl lg:text-[70px] font-black text-white leading-[1.02] tracking-tight mb-6">
                  Book Your
                  <div className="relative h-[80px] overflow-hidden">
                    <span className="absolute inset-x-0 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-300 to-teal-400">
                      {displayed}<span className="inline-block w-0.5 h-[1em] bg-blue-400 ml-1 animate-pulse align-middle" />
                    </span>
                  </div>
                  <span className="text-white">In Seconds</span>
                </h1>
              </motion.div>

              <motion.p initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:0.3}}
                className="text-lg sm:text-xl text-slate-400 leading-relaxed mb-8 max-w-lg">
                India's most trusted healthcare platform. Verified doctors, instant slots, digital prescriptions — all in one place.
              </motion.p>

              {/* City selector + Search */}
              <motion.form initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:0.4}} onSubmit={handleSearch} className="mb-6">
                <div className="bg-white/8 backdrop-blur-xl border border-white/15 rounded-2xl p-1.5 flex gap-1.5">
                  {/* City pills */}
                  <div className="hidden sm:flex gap-1 items-center px-1">
                    {['Delhi','Mumbai','Bangalore'].map(city => (
                      <button key={city} type="button" onClick={() => setActiveCity(city)}
                        className={cn('px-3 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap', activeCity === city ? 'bg-blue-600 text-white' : 'text-white/50 hover:text-white hover:bg-white/10')}>
                        {city}
                      </button>
                    ))}
                  </div>
                  <div className="w-px bg-white/15 hidden sm:block" />
                  <div className="flex-1 flex items-center gap-2 px-3">
                    <Search className="w-4 h-4 text-white/40 shrink-0" />
                    <input type="text" value={search} onChange={e=>setSearch(e.target.value)}
                      placeholder="Doctors, specialities, symptoms..."
                      className="flex-1 bg-transparent text-white placeholder:text-white/35 text-sm outline-none" />
                  </div>
                  <button type="submit"
                    className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-500 text-white text-sm font-bold rounded-xl hover:from-blue-500 hover:to-cyan-400 transition-all shadow-lg shadow-blue-500/30 whitespace-nowrap">
                    Search →
                  </button>
                </div>
              </motion.form>

              {/* Popular quick links */}
              <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.5}} className="flex flex-wrap gap-2 mb-12">
                <span className="text-white/30 text-xs self-center">Quick:</span>
                {SPECIALITIES.slice(0,4).map(s => (
                  <button key={s} onClick={() => router.push(`/doctors?search=${s}`)}
                    className="flex items-center gap-1 px-3 py-1.5 bg-white/6 border border-white/12 text-white/60 hover:text-white hover:border-blue-400/50 hover:bg-blue-500/10 rounded-full text-xs font-medium transition-all">
                    {s} <ChevronRight className="w-3 h-3" />
                  </button>
                ))}
              </motion.div>

              {/* Trust badges row */}
              <motion.div initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{delay:0.6}}
                className="flex flex-wrap gap-4 pt-6 border-t border-white/8">
                {TRUST_BADGES.map(({icon:Icon, text, color}) => (
                  <div key={text} className="flex items-center gap-2">
                    <Icon className={cn('w-4 h-4', color)} />
                    <span className="text-white/50 text-xs font-medium">{text}</span>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* ── Right Column — Interactive Card ── */}
            <motion.div initial={{opacity:0,x:40}} animate={{opacity:1,x:0}} transition={{delay:0.3,duration:0.7}}
              className="hidden lg:block relative">
              {/* Main appointment card */}
              <motion.div animate={{y:[0,-10,0]}} transition={{duration:6,repeat:Infinity,ease:'easeInOut'}}
                className="relative bg-white/6 backdrop-blur-2xl border border-white/15 rounded-3xl p-6 shadow-2xl">
                
                {/* Doctor profile */}
                <div className="flex items-start gap-4 mb-5 pb-5 border-b border-white/10">
                  <div className="relative">
                    <img src="https://randomuser.me/api/portraits/men/32.jpg" className="w-16 h-16 rounded-2xl object-cover ring-2 ring-blue-400/50" alt="Doctor" />
                    <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-slate-900" />
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-white text-lg leading-tight">Dr. Arjun Mehta</p>
                    <p className="text-blue-300 text-sm font-medium">Sr. Cardiologist</p>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex gap-0.5">{[...Array(5)].map((_,i) => <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />)}</div>
                      <span className="text-white/40 text-xs">4.9 (342 reviews)</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-white/40 text-xs">Fee</p>
                    <p className="text-white font-black text-xl">₹800</p>
                    <p className="text-green-400 text-xs font-medium">Online</p>
                  </div>
                </div>

                {/* Available slots */}
                <div className="mb-5">
                  <p className="text-white/40 text-xs font-semibold uppercase tracking-wider mb-3">Available Today, {new Date().toLocaleDateString('en-IN',{day:'numeric',month:'short'})}</p>
                  <div className="grid grid-cols-4 gap-2">
                    {[{t:'10:00 AM',a:true},{t:'11:30 AM',a:true},{t:'2:00 PM',a:false},{t:'4:30 PM',a:true}].map(({t,a},i) => (
                      <motion.button key={t} whileHover={{scale:1.05}} whileTap={{scale:0.95}}
                        className={cn('py-2 rounded-xl text-xs font-semibold text-center transition-all',
                          i===1 ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg shadow-blue-500/30' :
                          a ? 'bg-white/8 text-white/70 border border-white/15 hover:bg-blue-500/20 hover:border-blue-400/50' :
                          'bg-white/3 text-white/20 border border-white/5 cursor-not-allowed line-through')}>
                        {t}
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* CTA */}
                <motion.button whileHover={{scale:1.02}} whileTap={{scale:0.98}}
                  onClick={() => router.push('/doctors')}
                  className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold rounded-2xl text-sm shadow-xl shadow-blue-500/30 flex items-center justify-center gap-2 hover:from-blue-500 hover:to-cyan-400 transition-all">
                  Book This Slot <ArrowRight className="w-4 h-4" />
                </motion.button>
              </motion.div>

              {/* Floating notification cards */}
              {[
                { icon:'✅', title:'Confirmed!', sub:'Appointment booked', pos:'-bottom-6 -left-8', delay:0, bg:'bg-white/10' },
                { icon:'💊', title:'Prescription', sub:'Ready to download', pos:'top-6 -right-8', delay:1.2, bg:'bg-teal-500/15' },
                { icon:'⭐', title:'4.9/5 Rating', sub:'Dr. Mehta · 342 reviews', pos:'-top-4 left-10', delay:0.6, bg:'bg-amber-500/10' },
              ].map(({icon,title,sub,pos,delay,bg}) => (
                <motion.div key={title}
                  initial={{opacity:0,scale:0.8}}
                  animate={{opacity:1,scale:1,y:[0,-6,0]}}
                  transition={{delay:0.8+delay,y:{duration:4+delay,repeat:Infinity,ease:'easeInOut'}}}
                  className={cn('absolute',pos,bg,'backdrop-blur-xl border border-white/15 rounded-2xl px-4 py-3 flex items-center gap-3 shadow-xl')}>
                  <span className="text-2xl">{icon}</span>
                  <div>
                    <p className="text-white text-xs font-bold leading-tight">{title}</p>
                    <p className="text-white/50 text-xs">{sub}</p>
                  </div>
                </motion.div>
              ))}

              {/* Pulse rings */}
              <motion.div animate={{scale:[1,1.5,1],opacity:[0.4,0,0.4]}} transition={{duration:3,repeat:Infinity}}
                className="absolute -bottom-2 left-20 w-20 h-20 rounded-full border border-blue-400/30" />
            </motion.div>
          </div>
        </div>
      </div>

      {/* Stats bar */}
      <motion.div initial={{opacity:0,y:30}} animate={{opacity:1,y:0}} transition={{delay:0.8}}
        className="relative z-10 bg-white/4 backdrop-blur-xl border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {LIVE_STATS.map((s,i) => (
              <motion.div key={s.label} initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{delay:0.9+i*0.1}}
                className="flex items-center gap-3">
                <span className="text-2xl">{s.icon}</span>
                <div>
                  <p className="text-white font-black text-lg leading-none">{s.val}</p>
                  <p className="text-white/40 text-xs mt-0.5">{s.label}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-surface-subtle to-transparent pointer-events-none" />
    </section>
  );
}
