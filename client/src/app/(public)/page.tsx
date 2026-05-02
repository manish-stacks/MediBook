'use client';
import { useState, useEffect } from 'react';

// ─── Icons (inline SVG to avoid import issues in preview) ───────────────────
const Icon = ({ d, size = 20, stroke = 'currentColor', fill = 'none', strokeWidth = 1.75 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
);

const SearchIcon = () => <Icon d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />;
const StarIcon = ({ filled }) => (
  <svg width={14} height={14} viewBox="0 0 24 24" fill={filled ? '#F59E0B' : 'none'} stroke="#F59E0B" strokeWidth={2}>
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);
const ArrowRight = ({ size = 16 }) => <Icon d="M5 12h14M12 5l7 7-7 7" size={size} />;
const MapPin = () => <Icon d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z M12 10a1 1 0 1 0 0-2 1 1 0 0 0 0 2" size={14} />;
const Clock = ({ size = 14 }) => <Icon d="M12 2a10 10 0 1 1 0 20A10 10 0 0 1 12 2zm0 5v5l3 3" size={size} />;
const ShieldCheck = () => <Icon d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z M9 12l2 2 4-4" size={16} />;
const Zap = () => <Icon d="M13 2 3 14h9l-1 8 10-12h-9l1-8z" size={16} />;
const Users = () => <Icon d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2 M23 21v-2a4 4 0 0 0-3-3.87 M16 3.13a4 4 0 0 1 0 7.75" size={22} />;
const Award = () => <Icon d="M12 15a6 6 0 1 0 0-12 6 6 0 0 0 0 12z M8.21 13.89L7 23l5-3 5 3-1.21-9.12" size={22} />;
const HeartPulse = () => <Icon d="M3 12h4l3-9 4 18 3-9h4" size={22} />;
const Quote = () => <Icon d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z" size={28} />;
const Video = () => <Icon d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42C1 8.14 1 11.71 1 11.71s0 3.57.46 5.29a2.78 2.78 0 0 0 1.95 1.95C5.12 19.42 12 19.42 12 19.42s6.88 0 8.59-.47a2.78 2.78 0 0 0 1.95-1.95C23 15.28 23 11.71 23 11.71s0-3.57-.46-5.29z M9.75 15.02l5.75-3.31-5.75-3.31v6.62z" size={22} />;
const FileText = () => <Icon d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z M14 2v6h6 M16 13H8 M16 17H8 M10 9H8" size={22} />;

// ─── Data ──────────────────────────────────────────────────────────────────
const SPECIALITIES = ['Cardiologist', 'Dermatologist', 'Neurologist', 'Pediatrician', 'Gynecologist', 'Psychiatrist'];
const CITIES = ['Delhi', 'Mumbai', 'Bangalore', 'Chennai'];

const SPECS_DATA = [
  { name: 'Cardiology', icon: '🫀', doctors: 24, color: '#FEE2E2', border: '#FCA5A5', text: '#991B1B' },
  { name: 'Dermatology', icon: '🧴', doctors: 18, color: '#EDE9FE', border: '#C4B5FD', text: '#5B21B6' },
  { name: 'Neurology', icon: '🧠', doctors: 15, color: '#DBEAFE', border: '#93C5FD', text: '#1D4ED8' },
  { name: 'Orthopedics', icon: '🦴', doctors: 20, color: '#D1FAE5', border: '#6EE7B7', text: '#065F46' },
  { name: 'Pediatrics', icon: '👶', doctors: 22, color: '#FEF3C7', border: '#FCD34D', text: '#92400E' },
  { name: 'Gynecology', icon: '🌸', doctors: 16, color: '#FCE7F3', border: '#F9A8D4', text: '#9D174D' },
  { name: 'Psychiatry', icon: '🧘', doctors: 12, color: '#E0F2FE', border: '#7DD3FC', text: '#075985' },
  { name: 'General', icon: '🏥', doctors: 35, color: '#F0FDF4', border: '#86EFAC', text: '#14532D' },
];

const STEPS = [
  { n: '01', Icon: SearchIcon, title: 'Find Your Doctor', desc: 'Search by name, speciality, or symptom. Filter by ratings, availability, and fees.', accent: '#2563EB' },
  { n: '02', Icon: () => <Icon d="M8 2v4 M16 2v4 M3 10h18 M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z M9 16l2 2 4-4" size={22} />, title: 'Book a Slot', desc: 'Pick your preferred date and time. Real-time calendar availability at a glance.', accent: '#0D9488' },
  { n: '03', Icon: Video, title: 'Visit or Consult', desc: 'See the doctor in-clinic or consult online. Get digital prescriptions instantly.', accent: '#7C3AED' },
  { n: '04', Icon: FileText, title: 'Access Records', desc: 'All prescriptions and medical history saved securely. Download PDFs anytime.', accent: '#DC2626' },
];

const DOCTORS = [
  { name: 'Dr. Arjun Mehta', spec: 'Cardiologist', rating: 4.9, reviews: 342, exp: 14, city: 'New Delhi', fee: 800, img: 'https://randomuser.me/api/portraits/men/32.jpg' },
  { name: 'Dr. Priya Patel', spec: 'Dermatologist', rating: 4.8, reviews: 218, exp: 9, city: 'Mumbai', fee: 600, img: 'https://randomuser.me/api/portraits/women/44.jpg' },
  { name: 'Dr. Vikram Singh', spec: 'Neurologist', rating: 4.9, reviews: 301, exp: 17, city: 'Bangalore', fee: 1000, img: 'https://randomuser.me/api/portraits/men/55.jpg' },
  { name: 'Dr. Riya Nair', spec: 'Pediatrician', rating: 4.7, reviews: 189, exp: 11, city: 'Chennai', fee: 700, img: 'https://randomuser.me/api/portraits/women/68.jpg' },
];

const TESTIMONIALS = [
  { name: 'Priya Sharma', city: 'New Delhi', rating: 5, img: 'https://randomuser.me/api/portraits/women/1.jpg', text: 'Got an appointment with a top cardiologist in under 2 minutes. The digital prescription feature is a game changer.', doctor: 'Dr. Arjun Mehta' },
  { name: 'Rajesh Kumar', city: 'Mumbai', rating: 5, img: 'https://randomuser.me/api/portraits/men/2.jpg', text: 'Managing my entire family\'s health on one platform. I can track my parents\' medications and book their appointments effortlessly.', doctor: 'Dr. Priya Patel' },
  { name: 'Ananya Singh', city: 'Bangalore', rating: 5, img: 'https://randomuser.me/api/portraits/women/3.jpg', text: 'The slot picker is so intuitive. MediBook is genuinely the future of healthcare in India.', doctor: 'Dr. Vikram Singh' },
];

const STATS = [
  { Icon: Users, val: '50,000+', label: 'Patients Served', color: '#2563EB', bg: '#EFF6FF' },
  { Icon: Award, val: '2,000+', label: 'Verified Doctors', color: '#0D9488', bg: '#F0FDFA' },
  { Icon: HeartPulse, val: '150+', label: 'Specialities', color: '#DC2626', bg: '#FEF2F2' },
  { Icon: Clock, val: '< 2 min', label: 'Avg Booking Time', color: '#D97706', bg: '#FFFBEB', size: 22 },
];

const BLOGS = [
  { title: '10 Heart-Healthy Foods Cardiologists Recommend', excerpt: 'A balanced diet is key to heart health. Here are the top foods recommended by leading cardiologists.', date: 'Apr 18, 2026', cover: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=600&q=80', slug: 'heart-healthy-foods' },
  { title: 'Understanding Your Child\'s Vaccination Schedule', excerpt: 'Stay on top of your child\'s immunization milestones with this comprehensive guide.', date: 'Apr 12, 2026', cover: 'https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?w=600&q=80', slug: 'child-vaccination' },
  { title: 'Managing Monsoon Skin: A Dermatologist\'s Guide', excerpt: 'Humidity spikes wreak havoc on skin. Here\'s how to keep your skin healthy through the rainy season.', date: 'Apr 5, 2026', cover: 'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?w=600&q=80', slug: 'monsoon-skin' },
];

// ─── Sub-components ────────────────────────────────────────────────────────
function HeroSection() {
  const [wordIdx, setWordIdx] = useState(0);
  const [displayed, setDisplayed] = useState('');
  const [typing, setTyping] = useState(true);
  const [city, setCity] = useState('Delhi');
  const [search, setSearch] = useState('');

  useEffect(() => {
    const word = SPECIALITIES[wordIdx];
    if (typing) {
      if (displayed.length < word.length) {
        const t = setTimeout(() => setDisplayed(word.slice(0, displayed.length + 1)), 70);
        return () => clearTimeout(t);
      } else {
        const t = setTimeout(() => setTyping(false), 1800);
        return () => clearTimeout(t);
      }
    } else {
      if (displayed.length > 0) {
        const t = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 35);
        return () => clearTimeout(t);
      } else {
        setWordIdx(i => (i + 1) % SPECIALITIES.length);
        setTyping(true);
      }
    }
  }, [displayed, typing, wordIdx]);

  return (
    <section style={{ background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 50%, #0F172A 100%)', minHeight: '100vh', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>
      {/* Grid overlay */}
      <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(99,179,237,0.06) 1px, transparent 1px),linear-gradient(90deg,rgba(99,179,237,0.06) 1px,transparent 1px)', backgroundSize: '60px 60px', pointerEvents: 'none' }} />
      {/* Orb 1 */}
      <div style={{ position: 'absolute', top: '10%', left: '15%', width: 480, height: 480, borderRadius: '50%', background: 'radial-gradient(circle, rgba(37,99,235,0.18) 0%, transparent 70%)', filter: 'blur(40px)', animation: 'pulse1 8s ease-in-out infinite' }} />
      {/* Orb 2 */}
      <div style={{ position: 'absolute', bottom: '15%', right: '10%', width: 360, height: 360, borderRadius: '50%', background: 'radial-gradient(circle, rgba(13,148,136,0.15) 0%, transparent 70%)', filter: 'blur(40px)', animation: 'pulse2 10s ease-in-out infinite' }} />

      <style>{`
        @keyframes pulse1 { 0%,100%{transform:scale(1);opacity:.6} 50%{transform:scale(1.3);opacity:1} }
        @keyframes pulse2 { 0%,100%{transform:scale(1.2);opacity:.4} 50%{transform:scale(1);opacity:.8} }
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-12px)} }
        @keyframes floatCard { 0%,100%{transform:translateY(0) rotate(-2deg)} 50%{transform:translateY(-8px) rotate(-2deg)} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
        .hero-anim-1 { animation: fadeUp .7s .1s both; }
        .hero-anim-2 { animation: fadeUp .7s .25s both; }
        .hero-anim-3 { animation: fadeUp .7s .4s both; }
        .hero-anim-4 { animation: fadeUp .7s .55s both; }
        .hero-anim-5 { animation: fadeUp .7s .7s both; }
        .cursor { display:inline-block; width:3px; height:.85em; background:#60A5FA; margin-left:2px; vertical-align:middle; animation:blink 1s step-start infinite; border-radius:1px; }
        .city-btn { background: transparent; border: 1px solid rgba(255,255,255,0.15); color: rgba(255,255,255,0.5); padding: 5px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; cursor: pointer; transition: all .2s; white-space:nowrap; }
        .city-btn.active { background: #2563EB; border-color: #2563EB; color: #fff; }
        .city-btn:hover:not(.active) { color: #fff; border-color: rgba(255,255,255,0.35); }
        .search-wrap { display:flex; align-items:center; background:rgba(255,255,255,0.07); border:1px solid rgba(255,255,255,0.15); border-radius:16px; padding:6px; gap:6px; backdrop-filter:blur(12px); }
        .search-input { flex:1; background:transparent; border:none; outline:none; color:#fff; font-size:14px; padding:6px 10px; }
        .search-input::placeholder { color:rgba(255,255,255,0.3); }
        .search-btn { background: linear-gradient(135deg, #2563EB, #0891B2); color:#fff; border:none; border-radius:12px; padding:10px 20px; font-size:13px; font-weight:700; cursor:pointer; white-space:nowrap; transition:opacity .2s; }
        .search-btn:hover { opacity:.9; }
        .quick-tag { background:rgba(255,255,255,0.06); border:1px solid rgba(255,255,255,0.1); color:rgba(255,255,255,0.55); padding:5px 12px; border-radius:20px; font-size:12px; cursor:pointer; transition:all .2s; white-space:nowrap; }
        .quick-tag:hover { color:#fff; border-color:rgba(99,179,237,0.5); background:rgba(37,99,235,0.15); }
        .trust-badge { display:flex; align-items:center; gap:6px; color:rgba(255,255,255,0.45); font-size:12px; font-weight:500; }
        .appt-card { background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.12); border-radius:24px; padding:24px; backdrop-filter:blur(20px); animation:float 6s ease-in-out infinite; }
        .slot-btn { padding:8px 4px; border-radius:12px; font-size:11px; font-weight:700; text-align:center; cursor:pointer; border:1px solid rgba(255,255,255,0.12); background:rgba(255,255,255,0.06); color:rgba(255,255,255,0.6); transition:all .2s; }
        .slot-btn.active { background:linear-gradient(135deg,#2563EB,#0891B2); border-color:transparent; color:#fff; box-shadow:0 4px 16px rgba(37,99,235,.4); }
        .slot-btn.taken { opacity:.25; cursor:not-allowed; text-decoration:line-through; }
        .book-btn { width:100%; padding:14px; background:linear-gradient(135deg,#2563EB,#0891B2); color:#fff; border:none; border-radius:14px; font-size:14px; font-weight:700; cursor:pointer; display:flex; align-items:center; justify-content:center; gap:8px; transition:opacity .2s; margin-top:16px; }
        .book-btn:hover { opacity:.9; }
        .float-chip { position:absolute; background:rgba(255,255,255,0.08); border:1px solid rgba(255,255,255,0.15); border-radius:16px; padding:10px 16px; display:flex; align-items:center; gap:10px; backdrop-filter:blur(16px); }
        .stats-bar { background:rgba(255,255,255,0.03); border-top:1px solid rgba(255,255,255,0.07); padding:20px 0; }
      `}</style>

      <div style={{ flex: 1, display: 'flex', alignItems: 'center', position: 'relative' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '80px 24px 40px', width: '100%' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 60, alignItems: 'center' }}>

            {/* Left */}
            <div>
              {/* Trust pill */}
              <div className="hero-anim-1" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, marginBottom: 28 }}>
                <div style={{ display: 'flex' }}>
                  {['32','44','55'].map((n, i) => (
                    <img key={n} src={`https://randomuser.me/api/portraits/men/${n}.jpg`}
                      style={{ width: 28, height: 28, borderRadius: '50%', border: '2px solid #0F172A', objectFit: 'cover', marginLeft: i > 0 ? -8 : 0 }} alt="" />
                  ))}
                </div>
                <span style={{ color: 'rgba(255,255,255,.65)', fontSize: 13 }}>
                  <span style={{ color: '#4ADE80', fontWeight: 700 }}>50K+</span> patients trusted us this month
                </span>
              </div>

              {/* Headline */}
              <div className="hero-anim-2">
                <h1 style={{ fontSize: 'clamp(42px, 6vw, 72px)', fontWeight: 900, color: '#fff', lineHeight: 1.05, letterSpacing: '-2px', margin: '0 0 8px' }}>
                  Book Your
                </h1>
                <h1 style={{ fontSize: 'clamp(42px, 6vw, 72px)', fontWeight: 900, lineHeight: 1.05, letterSpacing: '-2px', margin: '0 0 8px', background: 'linear-gradient(135deg, #60A5FA, #34D399)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', minHeight: '1.1em', display: 'block' }}>
                  {displayed}<span className="cursor" style={{ background: '#60A5FA', WebkitBackgroundClip: 'initial', WebkitTextFillColor: 'initial' }} />
                </h1>
                <h1 style={{ fontSize: 'clamp(42px, 6vw, 72px)', fontWeight: 900, color: '#fff', lineHeight: 1.05, letterSpacing: '-2px', margin: '0 0 20px' }}>
                  In Seconds
                </h1>
              </div>

              <p className="hero-anim-3" style={{ fontSize: 17, color: 'rgba(255,255,255,.5)', lineHeight: 1.7, maxWidth: 480, marginBottom: 28 }}>
                India's most trusted healthcare platform. Verified doctors, instant slots, and digital prescriptions — all in one place.
              </p>

              {/* Search */}
              <div className="hero-anim-4 search-wrap" style={{ marginBottom: 14 }}>
                <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                  {CITIES.slice(0,3).map(c => (
                    <button key={c} className={`city-btn${city === c ? ' active' : ''}`} onClick={() => setCity(c)}>{c}</button>
                  ))}
                </div>
                <div style={{ width: 1, height: 24, background: 'rgba(255,255,255,0.1)' }} />
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ color: 'rgba(255,255,255,.3)' }}><SearchIcon /></div>
                  <input className="search-input" value={search} onChange={e => setSearch(e.target.value)} placeholder="Doctors, specialities, symptoms..." />
                </div>
                <button className="search-btn">Search →</button>
              </div>

              {/* Quick links */}
              <div className="hero-anim-4" style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 32 }}>
                <span style={{ color: 'rgba(255,255,255,.3)', fontSize: 12, alignSelf: 'center' }}>Quick:</span>
                {SPECIALITIES.slice(0,4).map(s => (
                  <button key={s} className="quick-tag">{s}</button>
                ))}
              </div>

              {/* Trust badges */}
              <div className="hero-anim-5" style={{ display: 'flex', flexWrap: 'wrap', gap: 20, borderTop: '1px solid rgba(255,255,255,.07)', paddingTop: 24 }}>
                {[
                  { Icon: ShieldCheck, text: 'Verified Doctors', color: '#4ADE80' },
                  { Icon: Clock, text: '24/7 Booking', color: '#60A5FA' },
                  { Icon: () => <StarIcon filled />, text: '4.9★ Rated', color: '#FBBF24' },
                  { Icon: Zap, text: 'Instant Confirm', color: '#A78BFA' },
                ].map(({ Icon: I, text, color }) => (
                  <div key={text} className="trust-badge">
                    <span style={{ color }}><I /></span>
                    <span>{text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — appointment card */}
            <div style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
              <div style={{ width: '100%', maxWidth: 340 }}>
                <div className="appt-card">
                  {/* Doctor row */}
                  <div style={{ display: 'flex', gap: 14, paddingBottom: 18, borderBottom: '1px solid rgba(255,255,255,.08)', marginBottom: 18 }}>
                    <div style={{ position: 'relative', flexShrink: 0 }}>
                      <img src="https://randomuser.me/api/portraits/men/32.jpg" style={{ width: 60, height: 60, borderRadius: 14, objectFit: 'cover', border: '2px solid rgba(96,165,250,.4)' }} alt="doctor" />
                      <span style={{ position: 'absolute', bottom: -2, right: -2, width: 14, height: 14, background: '#4ADE80', borderRadius: '50%', border: '2px solid #0F172A' }} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <p style={{ color: '#fff', fontWeight: 700, fontSize: 16, margin: '0 0 2px' }}>Dr. Arjun Mehta</p>
                      <p style={{ color: '#60A5FA', fontSize: 12, fontWeight: 600, margin: '0 0 4px' }}>Sr. Cardiologist</p>
                      <div style={{ display: 'flex', gap: 2 }}>{[...Array(5)].map((_, i) => <StarIcon key={i} filled />)}<span style={{ color: 'rgba(255,255,255,.3)', fontSize: 11, marginLeft: 4 }}>4.9 (342)</span></div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <p style={{ color: 'rgba(255,255,255,.3)', fontSize: 10, margin: '0 0 2px' }}>Fee</p>
                      <p style={{ color: '#fff', fontWeight: 900, fontSize: 22, margin: '0 0 2px' }}>₹800</p>
                      <p style={{ color: '#4ADE80', fontSize: 11, fontWeight: 600 }}>Online</p>
                    </div>
                  </div>

                  {/* Slots */}
                  <p style={{ color: 'rgba(255,255,255,.3)', fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 10 }}>Available Today</p>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, marginBottom: 4 }}>
                    {[{ t: '10:00 AM', a: true }, { t: '11:30 AM', a: true, sel: true }, { t: '2:00 PM', a: false }, { t: '4:30 PM', a: true }].map(({ t, a, sel }) => (
                      <div key={t} className={`slot-btn${sel ? ' active' : ''}${!a ? ' taken' : ''}`}>{t}</div>
                    ))}
                  </div>
                  <button className="book-btn">Book This Slot <ArrowRight /></button>
                </div>

                {/* Floating chips */}
                <div className="float-chip" style={{ top: -20, left: -20, animation: 'float 5s ease-in-out infinite .6s' }}>
                  <span style={{ fontSize: 22 }}>⭐</span>
                  <div>
                    <p style={{ color: '#fff', fontSize: 12, fontWeight: 700, margin: 0 }}>4.9 / 5 Rating</p>
                    <p style={{ color: 'rgba(255,255,255,.4)', fontSize: 11, margin: 0 }}>342 reviews</p>
                  </div>
                </div>
                <div className="float-chip" style={{ bottom: 20, right: -24, animation: 'float 5s ease-in-out infinite 1.2s' }}>
                  <span style={{ fontSize: 22 }}>✅</span>
                  <div>
                    <p style={{ color: '#fff', fontSize: 12, fontWeight: 700, margin: 0 }}>Confirmed!</p>
                    <p style={{ color: 'rgba(255,255,255,.4)', fontSize: 11, margin: 0 }}>Appointment booked</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats bar */}
      <div className="stats-bar" style={{ position: 'relative' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 24 }}>
            {[
              { val: '50,000+', label: 'Happy Patients', emoji: '❤️' },
              { val: '2,000+', label: 'Expert Doctors', emoji: '👨‍⚕️' },
              { val: '150+', label: 'Specialities', emoji: '🏥' },
              { val: '< 2 min', label: 'Avg Booking', emoji: '⚡' },
            ].map(s => (
              <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ fontSize: 26 }}>{s.emoji}</span>
                <div>
                  <p style={{ color: '#fff', fontWeight: 900, fontSize: 20, margin: 0, lineHeight: 1 }}>{s.val}</p>
                  <p style={{ color: 'rgba(255,255,255,.35)', fontSize: 12, margin: '3px 0 0' }}>{s.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function StatsSection() {
  return (
    <section style={{ background: '#fff', padding: '64px 24px', borderBottom: '1px solid #F1F5F9' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 20 }}>
          {STATS.map(({ Icon: I, val, label, color, bg, size }) => (
            <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '20px 24px', borderRadius: 16, background: '#FAFAFA', border: '1px solid #F1F5F9' }}>
              <div style={{ width: 52, height: 52, borderRadius: 14, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color }}>
                <I size={size} />
              </div>
              <div>
                <p style={{ fontSize: 26, fontWeight: 900, color: '#0F172A', margin: '0 0 2px', lineHeight: 1 }}>{val}</p>
                <p style={{ fontSize: 13, color: '#94A3B8', margin: 0 }}>{label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function SpecialitiesGrid() {
  return (
    <section style={{ background: '#F8FAFC', padding: '80px 24px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <span style={{ color: '#2563EB', fontSize: 12, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase' }}>Browse by specialty</span>
          <h2 style={{ fontSize: 'clamp(28px,4vw,42px)', fontWeight: 900, color: '#0F172A', margin: '10px 0 12px', letterSpacing: '-1px' }}>Find the Right Specialist</h2>
          <p style={{ color: '#64748B', maxWidth: 480, margin: '0 auto', lineHeight: 1.6 }}>From routine checkups to complex treatments — specialists across every field.</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 16, marginBottom: 32 }}>
          {SPECS_DATA.map(s => (
            <div key={s.name} style={{ padding: '20px 16px', borderRadius: 18, background: s.color, border: `1.5px solid ${s.border}`, cursor: 'pointer', transition: 'transform .2s, box-shadow .2s' }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 32px rgba(0,0,0,.08)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = ''; }}>
              <div style={{ fontSize: 36, marginBottom: 10 }}>{s.icon}</div>
              <p style={{ fontWeight: 700, color: s.text, fontSize: 14, margin: '0 0 4px' }}>{s.name}</p>
              <p style={{ fontSize: 12, color: s.text, opacity: .7, margin: 0 }}>{s.doctors} doctors</p>
            </div>
          ))}
        </div>
        <div style={{ textAlign: 'center' }}>
          <button style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: '#2563EB', fontWeight: 700, background: 'none', border: 'none', cursor: 'pointer', fontSize: 15 }}>
            View all specialities <ArrowRight />
          </button>
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  return (
    <section style={{ background: '#fff', padding: '80px 24px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <span style={{ color: '#2563EB', fontSize: 12, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase' }}>Simple process</span>
          <h2 style={{ fontSize: 'clamp(28px,4vw,42px)', fontWeight: 900, color: '#0F172A', margin: '10px 0 12px', letterSpacing: '-1px' }}>How MediBook Works</h2>
          <p style={{ color: '#64748B' }}>From search to prescription in minutes.</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 20 }}>
          {STEPS.map((step, i) => (
            <div key={step.n} style={{ position: 'relative', padding: '28px 24px', borderRadius: 20, background: '#F8FAFC', border: '1.5px solid #F1F5F9', overflow: 'hidden', transition: 'border-color .2s, transform .2s' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = `${step.accent}40`; e.currentTarget.style.transform = 'translateY(-4px)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = '#F1F5F9'; e.currentTarget.style.transform = ''; }}>
              <span style={{ position: 'absolute', top: 20, right: 20, fontSize: 40, fontWeight: 900, color: '#F1F5F9', userSelect: 'none' }}>{step.n}</span>
              <div style={{ width: 48, height: 48, borderRadius: 14, background: step.accent, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 18, color: '#fff' }}>
                <step.Icon />
              </div>
              <h3 style={{ fontWeight: 800, color: '#0F172A', fontSize: 16, margin: '0 0 8px' }}>{step.title}</h3>
              <p style={{ fontSize: 13, color: '#64748B', lineHeight: 1.65, margin: 0 }}>{step.desc}</p>
              {i < STEPS.length - 1 && (
                <div style={{ display: 'none' }} />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FeaturedDoctors() {
  return (
    <section style={{ background: '#F8FAFC', padding: '80px 24px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 40, flexWrap: 'wrap', gap: 16 }}>
          <div>
            <span style={{ color: '#2563EB', fontSize: 12, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase' }}>Top rated</span>
            <h2 style={{ fontSize: 'clamp(26px,3.5vw,40px)', fontWeight: 900, color: '#0F172A', margin: '10px 0 0', letterSpacing: '-1px' }}>Featured Doctors</h2>
          </div>
          <button style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#2563EB', fontWeight: 700, background: 'none', border: 'none', cursor: 'pointer', fontSize: 14 }}>
            View all <ArrowRight />
          </button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 20 }}>
          {DOCTORS.map(doc => (
            <div key={doc.name} style={{ background: '#fff', borderRadius: 20, padding: 20, border: '1.5px solid #F1F5F9', cursor: 'pointer', transition: 'transform .2s, box-shadow .2s, border-color .2s' }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.boxShadow = '0 16px 40px rgba(0,0,0,.08)'; e.currentTarget.style.borderColor = '#BFDBFE'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = ''; e.currentTarget.style.borderColor = '#F1F5F9'; }}>
              {/* Avatar */}
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
                <div style={{ position: 'relative' }}>
                  <img src={doc.img} alt={doc.name} style={{ width: 72, height: 72, borderRadius: 16, objectFit: 'cover', border: '3px solid #EFF6FF' }} />
                  <div style={{ position: 'absolute', bottom: -4, right: -4, width: 18, height: 18, background: '#4ADE80', borderRadius: '50%', border: '2px solid #fff' }} />
                </div>
              </div>
              <div style={{ textAlign: 'center', marginBottom: 14 }}>
                <p style={{ fontWeight: 800, color: '#0F172A', fontSize: 15, margin: '0 0 3px' }}>{doc.name}</p>
                <p style={{ color: '#2563EB', fontSize: 13, fontWeight: 600, margin: 0 }}>{doc.spec}</p>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 7, marginBottom: 14 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#64748B' }}>
                  <StarIcon filled /><span style={{ fontWeight: 700, color: '#0F172A' }}>{doc.rating}</span><span>({doc.reviews} reviews)</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#64748B' }}>
                  <span style={{ color: '#2563EB' }}><Clock /></span>{doc.exp} yrs experience
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#64748B' }}>
                  <span style={{ color: '#0D9488' }}><MapPin /></span>{doc.city}
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #F1F5F9', paddingTop: 12 }}>
                <span style={{ fontSize: 12, color: '#94A3B8' }}>Consult fee</span>
                <span style={{ fontWeight: 900, fontSize: 16, color: '#0F172A' }}>₹{doc.fee}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function TestimonialsSection() {
  return (
    <section style={{ background: '#fff', padding: '80px 24px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <span style={{ color: '#2563EB', fontSize: 12, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase' }}>Patient stories</span>
          <h2 style={{ fontSize: 'clamp(28px,4vw,42px)', fontWeight: 900, color: '#0F172A', margin: '10px 0 10px', letterSpacing: '-1px' }}>What Our Patients Say</h2>
          <p style={{ color: '#64748B' }}>Trusted by thousands of families across India.</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
          {TESTIMONIALS.map(t => (
            <div key={t.name} style={{ background: '#F8FAFC', borderRadius: 20, padding: 28, border: '1.5px solid #F1F5F9', position: 'relative' }}>
              <div style={{ position: 'absolute', top: 24, right: 24, color: '#EFF6FF' }}><Quote /></div>
              <div style={{ display: 'flex', gap: 3, marginBottom: 16 }}>
                {[...Array(t.rating)].map((_, i) => <StarIcon key={i} filled />)}
              </div>
              <p style={{ color: '#475569', fontSize: 14, lineHeight: 1.7, marginBottom: 20, fontStyle: 'italic' }}>"{t.text}"</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <img src={t.img} alt={t.name} style={{ width: 42, height: 42, borderRadius: 12, objectFit: 'cover' }} />
                <div>
                  <p style={{ fontWeight: 800, color: '#0F172A', fontSize: 14, margin: '0 0 2px' }}>{t.name}</p>
                  <p style={{ fontSize: 12, color: '#94A3B8', margin: 0 }}>{t.city} · Patient of {t.doctor}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function BlogPreview() {
  return (
    <section style={{ background: '#F8FAFC', padding: '80px 24px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 40, flexWrap: 'wrap', gap: 16 }}>
          <div>
            <span style={{ color: '#2563EB', fontSize: 12, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase' }}>Health insights</span>
            <h2 style={{ fontSize: 'clamp(26px,3.5vw,40px)', fontWeight: 900, color: '#0F172A', margin: '10px 0 0', letterSpacing: '-1px' }}>Latest from the Blog</h2>
          </div>
          <button style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#2563EB', fontWeight: 700, background: 'none', border: 'none', cursor: 'pointer', fontSize: 14 }}>
            All articles <ArrowRight />
          </button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
          {BLOGS.map(post => (
            <div key={post.slug} style={{ background: '#fff', borderRadius: 20, overflow: 'hidden', border: '1.5px solid #F1F5F9', cursor: 'pointer', transition: 'transform .2s, box-shadow .2s' }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 32px rgba(0,0,0,.07)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = ''; }}>
              <div style={{ height: 180, overflow: 'hidden' }}>
                <img src={post.cover} alt={post.title} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform .5s' }}
                  onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.06)'}
                  onMouseLeave={e => e.currentTarget.style.transform = ''} />
              </div>
              <div style={{ padding: '18px 20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: '#94A3B8', marginBottom: 10 }}>
                  <Clock size={12} /><span>5 min read</span><span>·</span><span>{post.date}</span>
                </div>
                <h3 style={{ fontWeight: 800, color: '#0F172A', fontSize: 15, lineHeight: 1.4, margin: '0 0 8px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{post.title}</h3>
                <p style={{ fontSize: 13, color: '#64748B', lineHeight: 1.6, margin: 0, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{post.excerpt}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTASection() {
  return (
    <section style={{ background: '#fff', padding: '80px 24px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ borderRadius: 28, background: 'linear-gradient(135deg, #1E3A8A 0%, #1D4ED8 40%, #0D9488 100%)', padding: 'clamp(40px, 6vw, 72px)', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
          {/* Decorative circles */}
          <div style={{ position: 'absolute', top: -60, right: -60, width: 220, height: 220, borderRadius: '50%', background: 'rgba(255,255,255,.05)' }} />
          <div style={{ position: 'absolute', bottom: -80, left: -40, width: 280, height: 280, borderRadius: '50%', background: 'rgba(13,148,136,.15)' }} />
          <div style={{ position: 'relative' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,.12)', borderRadius: 40, padding: '8px 18px', fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,.9)', marginBottom: 24 }}>
              📱 Free to use · No hidden charges
            </span>
            <h2 style={{ fontSize: 'clamp(32px,5vw,56px)', fontWeight: 900, color: '#fff', margin: '0 0 16px', letterSpacing: '-1.5px', lineHeight: 1.1 }}>
              Your Health, Our Priority
            </h2>
            <p style={{ color: 'rgba(255,255,255,.65)', fontSize: 16, marginBottom: 36, maxWidth: 460, margin: '0 auto 36px', lineHeight: 1.6 }}>
              Join 50,000+ patients who trust MediBook for their healthcare needs. Book your first appointment today.
            </p>
            <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
              <button style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '14px 28px', background: '#fff', color: '#1D4ED8', fontWeight: 800, borderRadius: 16, border: 'none', cursor: 'pointer', fontSize: 15, boxShadow: '0 8px 24px rgba(0,0,0,.18)', transition: 'transform .2s' }}
                onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                onMouseLeave={e => e.currentTarget.style.transform = ''}>
                Create Free Account <ArrowRight />
              </button>
              <button style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '14px 28px', background: 'rgba(255,255,255,.12)', color: '#fff', fontWeight: 700, borderRadius: 16, border: '1.5px solid rgba(255,255,255,.3)', cursor: 'pointer', fontSize: 15, transition: 'background .2s' }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,.2)'}
                onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,.12)'}>
                Browse Doctors
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Root Page ─────────────────────────────────────────────────────────────
export default function HomePage() {
  return (
    <div style={{ fontFamily: "'Segoe UI', system-ui, -apple-system, sans-serif", overflowX: 'hidden' }}>
      <HeroSection />
      <StatsSection />
      <SpecialitiesGrid />
      <HowItWorks />
      <FeaturedDoctors />
      <TestimonialsSection />
      <BlogPreview />
      <CTASection />
    </div>
  );
}


/*
import type { Metadata } from 'next';
import HeroSection from '@/components/home/HeroSection';
import SpecialitiesGrid from '@/components/home/SpecialitiesGrid';
import HowItWorks from '@/components/home/HowItWorks';
import FeaturedDoctors from '@/components/home/FeaturedDoctors';
import StatsSection from '@/components/home/StatsSection';
import TestimonialsSection from '@/components/home/TestimonialsSection';
import BlogPreview from '@/components/home/BlogPreview';
import CTASection from '@/components/home/CTASection';

export const metadata: Metadata = {
  title: 'MediBook — Book Doctor Appointments Online',
  description: 'India\'s most trusted healthcare platform. Book appointments with verified doctors instantly.',
};

export default function HomePage() {
  return (
    <div className="overflow-hidden">
      <HeroSection />
      <StatsSection />
      <SpecialitiesGrid />
      <HowItWorks />
      <FeaturedDoctors />
      <TestimonialsSection />
      <BlogPreview />
      <CTASection />
    </div>
  );
}
*/