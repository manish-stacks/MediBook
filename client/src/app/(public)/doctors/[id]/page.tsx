'use client';
// src/app/(public)/doctors/[id]/page.tsx
import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { motion } from 'framer-motion';
import { Star, MapPin, Clock, Award, Languages, GraduationCap, Phone, ChevronLeft, ChevronRight, Check, X, IndianRupee, Calendar, Heart } from 'lucide-react';
import Link from 'next/link';
import { cn, formatCurrency, formatDate, formatTime, getInitials } from '@/lib/utils';
import { format, addDays, parseISO, isSameDay, isToday } from 'date-fns';
import { useAuthStore } from '@/store/auth.store';
import toast from 'react-hot-toast';

function SlotPicker({ doctorId, onSelectSlot }: { doctorId: string; onSelectSlot: (date: string, time: string) => void }) {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [weekOffset, setWeekOffset] = useState(0);

  const dateStr = format(selectedDate, 'yyyy-MM-dd');

  const { data: availableDates } = useQuery({
    queryKey: ['available-dates', doctorId],
    queryFn: () => api.get(`/slots/doctor/${doctorId}/dates`).then(r => r.data.data),
  });

  const { data: slots, isLoading: slotsLoading } = useQuery({
    queryKey: ['slots', doctorId, dateStr],
    queryFn: () => api.get(`/slots/doctor/${doctorId}/available?date=${dateStr}`).then(r => r.data.data),
  });

  // Build week days
  const today = new Date();
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(today, i + weekOffset * 7));

  const availableDateStrings = new Set((availableDates || []).map((d: any) => d.date));

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
    onSelectSlot(dateStr, time);
  };

  const morningSlots   = (slots || []).filter((s: any) => parseInt(s.time) < 12);
  const afternoonSlots = (slots || []).filter((s: any) => parseInt(s.time) >= 12 && parseInt(s.time) < 17);
  const eveningSlots   = (slots || []).filter((s: any) => parseInt(s.time) >= 17);

  const SlotGroup = ({ label, items }: { label: string; items: any[] }) => {
    if (!items.length) return null;
    return (
      <div className="mb-4">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">{label}</p>
        <div className="flex flex-wrap gap-2">
          {items.map((slot: any) => (
            <button
              key={slot.time}
              disabled={!slot.isAvailable}
              onClick={() => slot.isAvailable && handleTimeSelect(slot.time)}
              className={cn(
                'px-3 py-1.5 rounded-xl text-xs font-medium border transition-all',
                !slot.isAvailable ? 'bg-slate-50 text-slate-300 border-slate-100 cursor-not-allowed line-through' :
                selectedTime === slot.time ? 'bg-brand-600 text-white border-brand-600 shadow-sm' :
                'bg-white text-slate-700 border-slate-200 hover:border-brand-300 hover:bg-brand-50',
              )}
            >
              {formatTime(slot.time)}
            </button>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div>
      {/* Week strip */}
      <div className="flex items-center gap-2 mb-4">
        <button onClick={() => setWeekOffset(w => Math.max(0, w - 1))} disabled={weekOffset === 0} className="p-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 disabled:opacity-30 transition-colors">
          <ChevronLeft className="w-4 h-4" />
        </button>
        <div className="flex-1 grid grid-cols-7 gap-1">
          {weekDays.map((day) => {
            const dStr = format(day, 'yyyy-MM-dd');
            const isAvail = availableDateStrings.has(dStr);
            const isSelected = isSameDay(day, selectedDate);
            return (
              <button
                key={dStr}
                onClick={() => { if (isAvail) { setSelectedDate(day); setSelectedTime(null); } }}
                disabled={!isAvail}
                className={cn(
                  'flex flex-col items-center py-2 px-1 rounded-xl text-xs transition-all',
                  isSelected ? 'bg-brand-600 text-white shadow-sm' :
                  isAvail    ? 'bg-brand-50 text-brand-700 hover:bg-brand-100 border border-brand-100' :
                  'text-slate-300 cursor-not-allowed',
                )}
              >
                <span className="font-medium">{format(day, 'EEE')}</span>
                <span className="font-bold text-sm">{format(day, 'd')}</span>
                {isToday(day) && <span className="text-[10px] opacity-70">Today</span>}
              </button>
            );
          })}
        </div>
        <button onClick={() => setWeekOffset(w => w + 1)} className="p-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors">
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Selected date heading */}
      <p className="text-sm font-semibold text-slate-700 mb-3">
        {isToday(selectedDate) ? 'Today' : format(selectedDate, 'EEEE, dd MMMM')}
      </p>

      {/* Time slots */}
      {slotsLoading ? (
        <div className="grid grid-cols-4 gap-2">
          {[...Array(8)].map((_, i) => <div key={i} className="h-8 skeleton rounded-xl" />)}
        </div>
      ) : !slots || slots.length === 0 ? (
        <p className="text-sm text-slate-400 text-center py-6">No slots available for this date</p>
      ) : (
        <>
          <SlotGroup label="Morning" items={morningSlots} />
          <SlotGroup label="Afternoon" items={afternoonSlots} />
          <SlotGroup label="Evening" items={eveningSlots} />
        </>
      )}
    </div>
  );
}

function BookingModal({ doctor, selectedDate, selectedTime, onClose }: any) {
  const { user, isAuthenticated } = useAuthStore();
  const router = useRouter();
  const [selectedPatientId, setSelectedPatientId] = useState('');
  const [selectedClinicId, setSelectedClinicId] = useState(doctor.clinics?.[0]?.clinic?.id || '');
  const [paymentMode, setPaymentMode] = useState<'PAY_AT_CLINIC' | 'ONLINE'>('PAY_AT_CLINIC');
  const [notes, setNotes] = useState('');

  const { data: patientsData } = useQuery({
    queryKey: ['my-patients'],
    queryFn: () => api.get('/patients').then(r => r.data.data),
    enabled: isAuthenticated,
  });

  const bookMutation = useMutation({
    mutationFn: (data: any) => api.post('/appointments', data),
    onSuccess: (res) => {
      toast.success('Appointment booked successfully!');
      onClose();
      router.push(`/dashboard/appointments/${res.data.data.id}`);
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Booking failed');
    },
  });

  const handleBook = () => {
    if (!isAuthenticated) { router.push(`/login?redirect=/doctors/${doctor.id}`); return; }
    if (!selectedPatientId) { toast.error('Please select a patient'); return; }
    if (!selectedClinicId) { toast.error('Please select a clinic'); return; }

    bookMutation.mutate({
      patientId: selectedPatientId,
      doctorId: doctor.id,
      clinicId: selectedClinicId,
      scheduledDate: selectedDate,
      scheduledTime: selectedTime,
      paymentMode,
      notes,
    });
  };

  const patients = patientsData || [];

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative bg-white rounded-3xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl"
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-slate-900">Confirm Booking</h3>
            <button onClick={onClose} className="p-2 rounded-xl hover:bg-slate-100"><X className="w-5 h-5" /></button>
          </div>

          {/* Summary */}
          <div className="bg-brand-50 border border-brand-100 rounded-2xl p-4 mb-5">
            <div className="flex items-center gap-3 mb-3">
              <img src={doctor.user?.avatar || `https://ui-avatars.com/api/?name=${doctor.user?.firstName}&background=1e6fe8&color=fff`} className="w-12 h-12 rounded-2xl object-cover" alt="" />
              <div>
                <p className="font-bold text-slate-900">Dr. {doctor.user?.firstName} {doctor.user?.lastName}</p>
                <p className="text-sm text-brand-600">{doctor.speciality?.name}</p>
              </div>
            </div>
            <div className="flex items-center gap-4 text-sm text-slate-600">
              <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4 text-brand-500" />{format(parseISO(selectedDate), 'EEE, dd MMM')}</span>
              <span className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-brand-500" />{formatTime(selectedTime)}</span>
              <span className="flex items-center gap-1.5"><IndianRupee className="w-4 h-4 text-brand-500" />{formatCurrency(Number(doctor.consultationFee))}</span>
            </div>
          </div>

          {!isAuthenticated ? (
            <div className="text-center py-4">
              <p className="text-slate-600 mb-4">Please sign in to book an appointment</p>
              <button onClick={() => router.push(`/login?redirect=/doctors/${doctor.id}`)} className="w-full py-3 bg-brand-600 text-white font-semibold rounded-2xl">Sign In to Continue</button>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Select patient */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Select Patient</label>
                {patients.length === 0 ? (
                  <p className="text-sm text-slate-400">No patients found. <Link href="/dashboard/family" className="text-brand-600">Add one</Link></p>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    {patients.map((p: any) => (
                      <button key={p.id} onClick={() => setSelectedPatientId(p.id)} className={cn('flex items-center gap-2 p-3 rounded-xl border text-left transition-all', selectedPatientId === p.id ? 'border-brand-500 bg-brand-50' : 'border-slate-200 hover:border-brand-300')}>
                        <div className="w-8 h-8 rounded-xl bg-brand-100 flex items-center justify-center text-brand-600 font-bold text-xs shrink-0">
                          {getInitials(p.firstName, p.lastName)}
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-sm text-slate-900 truncate">{p.firstName} {p.lastName}</p>
                          <p className="text-xs text-slate-400 capitalize">{p.relation?.toLowerCase()}</p>
                        </div>
                        {selectedPatientId === p.id && <Check className="w-3.5 h-3.5 text-brand-600 ml-auto shrink-0" />}
                      </button>
                    ))}
                  </div>
                )}
                <Link href="/dashboard/family/add" className="mt-2 block text-xs text-brand-600 hover:underline">+ Add family member</Link>
              </div>

              {/* Clinic selection (if multiple) */}
              {doctor.clinics?.length > 1 && (
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Select Clinic</label>
                  <div className="space-y-2">
                    {doctor.clinics.map((dc: any) => (
                      <button key={dc.clinic.id} onClick={() => setSelectedClinicId(dc.clinic.id)} className={cn('flex items-center gap-2 w-full p-3 rounded-xl border text-left transition-all', selectedClinicId === dc.clinic.id ? 'border-brand-500 bg-brand-50' : 'border-slate-200 hover:border-brand-300')}>
                        <MapPin className="w-4 h-4 text-brand-500 shrink-0" />
                        <div>
                          <p className="font-medium text-sm text-slate-900">{dc.clinic.name}</p>
                          <p className="text-xs text-slate-400">{dc.clinic.city}</p>
                        </div>
                        {selectedClinicId === dc.clinic.id && <Check className="w-3.5 h-3.5 text-brand-600 ml-auto" />}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Payment mode */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Payment Mode</label>
                <div className="grid grid-cols-2 gap-2">
                  {[{ value: 'PAY_AT_CLINIC', label: 'Pay at Clinic', icon: '🏥' }, { value: 'ONLINE', label: 'Pay Online', icon: '💳' }].map((opt) => (
                    <button key={opt.value} onClick={() => setPaymentMode(opt.value as any)} className={cn('flex items-center gap-2 p-3 rounded-xl border text-left transition-all', paymentMode === opt.value ? 'border-brand-500 bg-brand-50' : 'border-slate-200 hover:border-brand-300')}>
                      <span>{opt.icon}</span>
                      <span className="text-sm font-medium text-slate-700">{opt.label}</span>
                      {paymentMode === opt.value && <Check className="w-3.5 h-3.5 text-brand-600 ml-auto" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Notes (optional)</label>
                <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Any symptoms or concerns..." rows={2} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-brand-400 resize-none transition-colors placeholder:text-slate-400" />
              </div>

              <button onClick={handleBook} disabled={bookMutation.isPending || !selectedPatientId} className="w-full py-4 bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white font-bold rounded-2xl transition-all text-sm shadow-sm hover:shadow-md">
                {bookMutation.isPending ? 'Booking...' : `Confirm Booking · ${formatCurrency(Number(doctor.consultationFee))}`}
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}

export default function DoctorProfilePage() {
  const { id } = useParams();
  const { isAuthenticated } = useAuthStore();
  const qc = useQueryClient();
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [showBooking, setShowBooking] = useState(false);
  const [activeTab, setActiveTab] = useState('about');

  const { data, isLoading } = useQuery({
    queryKey: ['doctor', id],
    queryFn: () => api.get(`/doctors/${id}`).then(r => r.data.data),
    enabled: !!id,
  });

  const { data: favData } = useQuery({
    queryKey: ['fav-check', id],
    queryFn: () => api.get(`/favorites/check/${id}`).then(r => r.data.data),
    enabled: !!id && isAuthenticated,
  });

  const favMutation = useMutation({
    mutationFn: () => api.post(`/favorites/toggle/${id}`),
    onSuccess: (res) => {
      qc.invalidateQueries({ queryKey: ['fav-check', id] });
      qc.invalidateQueries({ queryKey: ['favorites'] });
      toast.success(res.data.data.isFavorite ? '❤️ Added to favorites' : 'Removed from favorites');
    },
  });

  const isFavorite = favData?.isFavorite || false;

  if (isLoading) return (
    <div className="pt-16 min-h-screen bg-surface-subtle">
      <div className="max-w-5xl mx-auto px-4 py-10">
        <div className="h-64 skeleton rounded-3xl mb-6" />
        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-2 space-y-4">{[...Array(3)].map((_, i) => <div key={i} className="h-32 skeleton rounded-2xl" />)}</div>
          <div className="h-80 skeleton rounded-2xl" />
        </div>
      </div>
    </div>
  );

  if (!data) return <div className="pt-24 text-center text-slate-500">Doctor not found</div>;

  const doctor = data;
  const name = `Dr. ${doctor.user?.firstName} ${doctor.user?.lastName}`;
  const education = Array.isArray(doctor.education) ? doctor.education : (typeof doctor.education === 'string' ? JSON.parse(doctor.education || '[]') : []);
  const languages = Array.isArray(doctor.languages) ? doctor.languages : (typeof doctor.languages === 'string' ? JSON.parse(doctor.languages || '[]') : []);

  return (
    <div className="pt-16 min-h-screen bg-surface-subtle">
      {/* Header card */}
      <div className="bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Link href="/doctors" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-brand-600 mb-6 transition-colors">
            <ChevronLeft className="w-4 h-4" /> Back to Doctors
          </Link>

          <div className="flex flex-col sm:flex-row gap-6">
            <div className="shrink-0">
              <div className="w-28 h-28 rounded-3xl overflow-hidden ring-4 ring-brand-50">
                <img src={doctor.user?.avatar || `https://ui-avatars.com/api/?name=${doctor.user?.firstName}+${doctor.user?.lastName}&background=1e6fe8&color=fff&size=200`} alt={name} className="w-full h-full object-cover" />
              </div>
            </div>
            <div className="flex-1">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h1 className="text-3xl font-extrabold text-slate-900">{name}</h1>
                    {doctor.isVerified && <span className="px-2.5 py-1 bg-green-50 border border-green-200 text-green-700 rounded-full text-xs font-semibold">✓ Verified</span>}
                    {isAuthenticated && (
                      <button
                        onClick={() => favMutation.mutate()}
                        disabled={favMutation.isPending}
                        className={cn('p-2 rounded-xl border transition-all', isFavorite ? 'bg-rose-50 border-rose-200 text-rose-500' : 'bg-white border-slate-200 text-slate-400 hover:border-rose-200 hover:text-rose-400')}
                        title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                      >
                        <Heart className={cn('w-5 h-5', isFavorite && 'fill-rose-500')} />
                      </button>
                    )}
                  </div>
                  <p className="text-brand-600 font-semibold text-lg mb-2">{doctor.speciality?.name}</p>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
                    <span className="flex items-center gap-1.5"><Award className="w-4 h-4 text-brand-400" />{doctor.experience} years experience</span>
                    {doctor.clinics?.[0]?.clinic && <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4 text-teal-400" />{doctor.clinics[0].clinic.name}, {doctor.clinics[0].clinic.city}</span>}
                    <span className="flex items-center gap-1.5"><Star className="w-4 h-4 fill-amber-400 text-amber-400" /><strong className="text-slate-800">{Number(doctor.rating).toFixed(1)}</strong> ({doctor.totalReviews} reviews)</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-400 mb-1">Consultation fee</p>
                  <p className="text-3xl font-extrabold text-slate-900">{formatCurrency(Number(doctor.consultationFee))}</p>
                  {doctor.followUpFee > 0 && <p className="text-xs text-slate-400">Follow-up: {formatCurrency(Number(doctor.followUpFee))}</p>}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left content */}
          <div className="lg:col-span-2 space-y-5">
            {/* Tabs */}
            <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-card">
              <div className="flex border-b border-slate-100">
                {['about', 'education', 'reviews'].map((tab) => (
                  <button key={tab} onClick={() => setActiveTab(tab)} className={cn('flex-1 py-4 text-sm font-semibold capitalize transition-colors', activeTab === tab ? 'text-brand-600 border-b-2 border-brand-600 bg-brand-50/50' : 'text-slate-500 hover:text-slate-700')}>
                    {tab}
                  </button>
                ))}
              </div>

              <div className="p-6">
                {activeTab === 'about' && (
                  <div className="space-y-5">
                    {doctor.about && (
                      <div>
                        <h3 className="font-bold text-slate-900 mb-2">About</h3>
                        <p className="text-slate-600 text-sm leading-relaxed">{doctor.about}</p>
                      </div>
                    )}
                    {languages.length > 0 && (
                      <div>
                        <h3 className="font-bold text-slate-900 mb-2 flex items-center gap-2"><Languages className="w-4 h-4 text-brand-500" />Languages</h3>
                        <div className="flex flex-wrap gap-2">{languages.map((l: string) => <span key={l} className="px-3 py-1 bg-brand-50 text-brand-700 rounded-full text-xs font-medium border border-brand-100">{l}</span>)}</div>
                      </div>
                    )}
                    {doctor.clinics?.length > 0 && (
                      <div>
                        <h3 className="font-bold text-slate-900 mb-2">Practice Locations</h3>
                        <div className="space-y-3">
                          {doctor.clinics.map((dc: any) => (
                            <div key={dc.clinic.id} className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl">
                              <MapPin className="w-4 h-4 text-brand-500 mt-0.5 shrink-0" />
                              <div>
                                <p className="font-semibold text-slate-900 text-sm">{dc.clinic.name}</p>
                                <p className="text-xs text-slate-500">{dc.clinic.address}, {dc.clinic.city}</p>
                                {dc.clinic.phone && <p className="text-xs text-slate-400 flex items-center gap-1 mt-1"><Phone className="w-3 h-3" />{dc.clinic.phone}</p>}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'education' && (
                  <div>
                    <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2"><GraduationCap className="w-5 h-5 text-brand-500" />Education & Qualifications</h3>
                    {education.length === 0 ? <p className="text-slate-400 text-sm">No education details</p> : (
                      <div className="space-y-4">
                        {education.map((edu: any, i: number) => (
                          <div key={i} className="flex gap-4 p-4 bg-slate-50 rounded-xl">
                            <div className="w-10 h-10 rounded-xl bg-brand-100 flex items-center justify-center shrink-0">
                              <GraduationCap className="w-5 h-5 text-brand-600" />
                            </div>
                            <div>
                              <p className="font-bold text-slate-900">{edu.degree}</p>
                              <p className="text-sm text-slate-600">{edu.institution}</p>
                              <p className="text-xs text-slate-400">{edu.year}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'reviews' && (
                  <div>
                    <div className="flex items-center gap-4 mb-5 p-4 bg-brand-50 rounded-xl">
                      <div className="text-center">
                        <p className="text-4xl font-extrabold text-slate-900">{Number(doctor.rating).toFixed(1)}</p>
                        <div className="flex gap-0.5 justify-center mt-1">{[...Array(5)].map((_, i) => <Star key={i} className={cn('w-4 h-4', i < Math.round(doctor.rating) ? 'fill-amber-400 text-amber-400' : 'text-slate-200')} />)}</div>
                        <p className="text-xs text-slate-500 mt-1">{doctor.totalReviews} reviews</p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      {doctor.reviews?.map((review: any) => (
                        <div key={review.id} className="p-4 border border-slate-100 rounded-xl">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-xl bg-brand-100 flex items-center justify-center text-brand-600 font-bold text-xs">
                                {getInitials(review.user?.firstName, review.user?.lastName)}
                              </div>
                              <span className="font-semibold text-sm text-slate-900">{review.user?.firstName} {review.user?.lastName}</span>
                            </div>
                            <div className="flex gap-0.5">{[...Array(5)].map((_, i) => <Star key={i} className={cn('w-3.5 h-3.5', i < review.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200')} />)}</div>
                          </div>
                          {review.comment && <p className="text-sm text-slate-600">{review.comment}</p>}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Booking sidebar */}
          <div className="space-y-4" id="book">
            <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-card sticky top-24">
              <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-brand-500" /> Book Appointment
              </h3>
              <SlotPicker
                doctorId={doctor.id}
                onSelectSlot={(date, time) => { setSelectedDate(date); setSelectedTime(time); }}
              />
              {selectedDate && selectedTime && (
                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-4">
                  <div className="p-3 bg-brand-50 border border-brand-100 rounded-xl text-sm text-brand-700 mb-3">
                    <p className="font-semibold">{format(parseISO(selectedDate), 'EEEE, dd MMMM')}</p>
                    <p>{formatTime(selectedTime)} · {formatCurrency(Number(doctor.consultationFee))}</p>
                  </div>
                  <button onClick={() => setShowBooking(true)} className="w-full py-3.5 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-2xl transition-all text-sm shadow-sm hover:shadow-md">
                    Book This Slot →
                  </button>
                </motion.div>
              )}
              {(!selectedDate || !selectedTime) && (
                <p className="text-xs text-slate-400 text-center mt-3">Select a date and time to continue</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Booking modal */}
      {showBooking && selectedDate && selectedTime && (
        <BookingModal doctor={doctor} selectedDate={selectedDate} selectedTime={selectedTime} onClose={() => setShowBooking(false)} />
      )}
    </div>
  );
}
