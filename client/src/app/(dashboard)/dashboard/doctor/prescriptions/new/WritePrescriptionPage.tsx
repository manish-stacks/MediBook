'use client';
// src/app/(dashboard)/dashboard/doctor/prescriptions/new/page.tsx
import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useQuery, useMutation } from '@tanstack/react-query';
import api from '@/lib/api';
import { motion } from 'framer-motion';
import { ChevronLeft, Plus, Trash2, Pill, FileText, Save, Search, X } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import toast from 'react-hot-toast';
type Prescription = {
  diagnosis: string;
  notes?: string;
  followUpDate?: string;
  medicines: {
    id: string;
    name: string;
    dosage?: string;
    morning: boolean;
    afternoon: boolean;
    evening: boolean;
    duration?: number;
    instructions?: string;
  }[];
};
const COMMON_DOSAGES = ['500mg', '250mg', '100mg', '50mg', '10mg', '5mg', '400mg', '200mg', '1g', '2g', '25mg', '75mg'];
const DURATIONS = ['3 days', '5 days', '7 days', '10 days', '14 days', '21 days', '30 days', '2 months', '3 months', 'Ongoing'];

interface Medicine { id: string; name: string; dosage: string; morning: boolean; afternoon: boolean; evening: boolean; duration: string; instructions: string; suggestions: string[]; }

// RxNorm API search for drug names
async function searchRxNorm(term: string): Promise<string[]> {
  if (term.length < 2) return [];
  try {
    const res = await fetch(`https://rxnav.nlm.nih.gov/REST/drugs.json?name=${encodeURIComponent(term)}&expand=prescribable`, { signal: AbortSignal.timeout(3000) });
    const data = await res.json();
    const names: string[] = [];
    const groups = data?.drugGroup?.conceptGroup || [];
    for (const group of groups) {
      for (const concept of (group.conceptProperties || [])) {
        if (concept.name && !names.includes(concept.name)) names.push(concept.name);
        if (names.length >= 8) break;
      }
      if (names.length >= 8) break;
    }
    return names;
  } catch {
    // Fallback to local list
    return FALLBACK_MEDICINES.filter(m => m.toLowerCase().includes(term.toLowerCase())).slice(0, 8);
  }
}

const FALLBACK_MEDICINES = [
  'Paracetamol 500mg', 'Ibuprofen 400mg', 'Amoxicillin 500mg', 'Azithromycin 500mg',
  'Ciprofloxacin 500mg', 'Metformin 500mg', 'Atorvastatin 10mg', 'Amlodipine 5mg',
  'Losartan 50mg', 'Omeprazole 20mg', 'Pantoprazole 40mg', 'Cetirizine 10mg',
  'Loratadine 10mg', 'Montelukast 10mg', 'Salbutamol 2mg', 'Doxycycline 100mg',
  'Metronidazole 400mg', 'Fluconazole 150mg', 'Prednisolone 5mg', 'Gabapentin 300mg',
  'Pregabalin 75mg', 'Sertraline 50mg', 'Escitalopram 10mg', 'Ranitidine 150mg',
  'Domperidone 10mg', 'Ondansetron 4mg', 'Tramadol 50mg', 'Diclofenac 50mg',
  'Naproxen 250mg', 'Vitamin B12 500mcg', 'Vitamin D3 60000IU', 'Calcium Carbonate 500mg',
  'Iron Tablets 100mg', 'Folic Acid 5mg', 'ORS Sachets', 'Cough Syrup 100ml',
  'Betahistine 8mg', 'Propranolol 40mg', 'Furosemide 40mg', 'Spironolactone 25mg',
  'Levothyroxine 50mcg', 'Glimepiride 1mg', 'Sitagliptin 100mg', 'Rosuvastatin 10mg',
];

function MedicineRow({ med, index, onChange, onDelete }: { med: Medicine; index: number; onChange: (id: string, f: string, v: any) => void; onDelete: (id: string) => void }) {
  const [showSugg, setShowSugg] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (val: string) => {
    onChange(med.id, 'name', val);
    if (val.length >= 2) {
      setLoading(true);
      const suggs = await searchRxNorm(val);
      onChange(med.id, 'suggestions', suggs);
      setShowSugg(suggs.length > 0);
      setLoading(false);
    } else {
      onChange(med.id, 'suggestions', []);
      setShowSugg(false);
    }
  };

  const selectMed = (name: string) => {
    onChange(med.id, 'name', name);
    onChange(med.id, 'suggestions', []);
    setShowSugg(false);
    // Auto-set dosage if embedded in name
    const dMatch = name.match(/(\d+\s?(?:mg|mcg|g|ml|IU))/i);
    if (dMatch) onChange(med.id, 'dosage', dMatch[1]);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="bg-slate-50 border border-slate-200 rounded-2xl p-4 relative">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Medicine #{index + 1}</span>
        <button onClick={() => onDelete(med.id)} className="p-1 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors"><Trash2 className="w-4 h-4" /></button>
      </div>
      <div className="grid grid-cols-2 gap-3 mb-3">
        {/* Medicine name with RxNorm autocomplete */}
        <div className="relative col-span-2 sm:col-span-1">
          <label className="block text-xs font-semibold text-slate-600 mb-1">Medicine Name *</label>
          <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3 py-2.5 focus-within:border-brand-400 transition-colors">
            <Pill className="w-4 h-4 text-slate-400 shrink-0" />
            <input type="text" value={med.name} onChange={e => handleSearch(e.target.value)} onBlur={() => setTimeout(() => setShowSugg(false), 150)}
              placeholder="Type to search..." className="flex-1 text-sm outline-none bg-transparent" />
            {loading && <div className="w-3 h-3 border border-brand-400 border-t-transparent rounded-full animate-spin" />}
          </div>
          {showSugg && med.suggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-card-hover z-30 overflow-hidden max-h-52 overflow-y-auto">
              {med.suggestions.map(s => (
                <button key={s} onMouseDown={() => selectMed(s)} className="block w-full text-left px-4 py-2.5 text-sm hover:bg-brand-50 hover:text-brand-700 transition-colors">
                  💊 {s}
                </button>
              ))}
            </div>
          )}
        </div>
        {/* Dosage */}
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1">Dosage</label>
          <select value={med.dosage} onChange={e => onChange(med.id, 'dosage', e.target.value)}
            className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:border-brand-400 transition-colors appearance-none">
            <option value="">Select dosage</option>
            {COMMON_DOSAGES.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>
      </div>
      {/* Timing */}
      <div className="mb-3">
        <label className="block text-xs font-semibold text-slate-600 mb-2">Timing</label>
        <div className="flex gap-4">
          {[['morning', '🌅 Morning'], ['afternoon', '☀️ Afternoon'], ['evening', '🌙 Evening']].map(([key, label]) => (
            <label key={key} className="flex items-center gap-2 cursor-pointer">
              <div onClick={() => onChange(med.id, key, !(med as any)[key])}
                className={`w-5 h-5 rounded-lg border-2 flex items-center justify-center cursor-pointer transition-all ${(med as any)[key] ? 'bg-brand-600 border-brand-600' : 'border-slate-300 hover:border-brand-400'}`}>
                {(med as any)[key] && <span className="text-white text-xs font-bold">✓</span>}
              </div>
              <span className="text-xs font-medium text-slate-600">{label}</span>
            </label>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1">Duration</label>
          <select value={med.duration} onChange={e => onChange(med.id, 'duration', e.target.value)}
            className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:border-brand-400 transition-colors">
            <option value="">Select duration</option>
            {DURATIONS.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1">Instructions</label>
          <input type="text" value={med.instructions} onChange={e => onChange(med.id, 'instructions', e.target.value)}
            placeholder="After meals, with water..." className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:border-brand-400 transition-colors placeholder:text-slate-400" />
        </div>
      </div>
    </motion.div>
  );
}

export default function WritePrescriptionPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const appointmentId = searchParams.get('appointmentId') || '';
  const editId = searchParams.get('edit') || '';

  const [diagnosis, setDiagnosis] = useState('');
  const [notes, setNotes] = useState('');
  const [followUpDate, setFollowUpDate] = useState('');
  const [medicines, setMedicines] = useState<Medicine[]>([]);

  const { data: aptData } = useQuery({
    queryKey: ['appointment', appointmentId],
    queryFn: () => api.get(`/appointments/${appointmentId}`).then(r => r.data.data),
    enabled: !!appointmentId,
  });


  const { data: existingRx } = useQuery<Prescription>({
    queryKey: ['prescription', editId],
    queryFn: () =>
      api.get(`/prescriptions/${editId}`).then(r => r.data.data),
    enabled: !!editId,
    onSuccess: (data) => {
      if (data) {
        setDiagnosis(data.diagnosis || '');
        setNotes(data.notes || '');
        setFollowUpDate(
          data.followUpDate ? data.followUpDate.split('T')[0] : ''
        );
        setMedicines(
          (data.medicines || []).map((m) => ({
            id: m.id,
            name: m.name,
            dosage: m.dosage || '',
            morning: m.morning,
            afternoon: m.afternoon,
            evening: m.evening,
            duration: m.duration ? `${m.duration} days` : '',
            instructions: m.instructions || '',
            suggestions: [],
          }))
        );
      }
    },
  });

  const apt = aptData;
  const v = apt?.patient?.vitals?.[0];

  const addMedicine = () => setMedicines(prev => [...prev, { id: `med-${Date.now()}`, name: '', dosage: '', morning: false, afternoon: false, evening: false, duration: '', instructions: '', suggestions: [] }]);
  const updateMed = (id: string, field: string, value: any) => setMedicines(prev => prev.map(m => m.id === id ? { ...m, [field]: value } : m));
  const deleteMed = (id: string) => setMedicines(prev => prev.filter(m => m.id !== id));

  const createMutation = useMutation({
    mutationFn: (data: any) => editId ? api.put(`/prescriptions/${editId}`, data) : api.post('/prescriptions', data),
    onSuccess: () => { toast.success(editId ? 'Prescription updated!' : 'Prescription created! Patient notified.'); router.push('/dashboard/doctor/appointments'); },
    onError: (e: any) => toast.error(e.response?.data?.message || 'Failed'),
  });

  const handleSubmit = () => {
    if (!diagnosis.trim()) { toast.error('Please enter a diagnosis'); return; }
    if (medicines.length === 0) { toast.error('Add at least one medicine'); return; }
    if (medicines.some(m => !m.name.trim())) { toast.error('Fill in all medicine names'); return; }
    const durationToDays = (dur: string) => { const match = dur?.match(/^(\d+)/); return match ? parseInt(match[1]) : 0; };
    createMutation.mutate({
      appointmentId,
      diagnosis, notes,
      followUpDate: followUpDate || null,
      medicines: medicines.map(m => ({
        name: m.name, dosage: m.dosage,
        morning: m.morning, afternoon: m.afternoon, evening: m.evening,
        duration: durationToDays(m.duration),
        instructions: m.instructions,
      })),
    });
  };

  return (
    <div className="max-w-3xl space-y-5">
      <div className="flex items-center gap-3">
        <button onClick={() => router.back()} className="p-2 rounded-xl hover:bg-slate-100 text-slate-600"><ChevronLeft className="w-5 h-5" /></button>
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">{editId ? 'Edit Prescription' : 'Write Prescription'}</h1>
          <p className="text-slate-400 text-sm">Medicine search powered by RxNorm</p>
        </div>
      </div>

      {/* Patient + Vitals preview */}
      {apt && (
        <div className="bg-brand-50 border border-brand-100 rounded-2xl p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-2xl bg-brand-gradient flex items-center justify-center text-white font-bold shrink-0">
              {apt.patient?.firstName?.[0]}{apt.patient?.lastName?.[0]}
            </div>
            <div>
              <p className="font-bold text-slate-900">{apt.patient?.firstName} {apt.patient?.lastName}</p>
              <p className="text-sm text-slate-500 capitalize">{apt.patient?.gender?.toLowerCase()} · {apt.clinic?.name} · {formatDate(apt.scheduledDate)}</p>
            </div>
          </div>
          {v && (
            <div className="grid grid-cols-4 gap-2 pt-3 border-t border-brand-100">
              {[
                { l: 'Temp', v: v.temperature ? `${v.temperature}°C` : '—' },
                { l: 'BP', v: v.bloodPressure || '—' },
                { l: 'Weight', v: v.weight ? `${v.weight}kg` : '—' },
                { l: 'SpO2', v: v.oxygenSaturation ? `${v.oxygenSaturation}%` : '—' },
              ].map(item => (
                <div key={item.l} className="text-center bg-white/60 rounded-xl py-1.5">
                  <p className="text-xs text-slate-400">{item.l}</p>
                  <p className="font-bold text-slate-800 text-sm">{item.v}</p>
                </div>
              ))}
            </div>
          )}
          {apt.notes && <p className="mt-2 text-sm text-slate-600 bg-white/60 rounded-xl p-2"><span className="font-semibold">Note:</span> {apt.notes}</p>}
        </div>
      )}

      {/* Diagnosis & Notes */}
      <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-card">
        <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2"><FileText className="w-4 h-4 text-brand-500" />Diagnosis & Notes</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Diagnosis *</label>
            <input type="text" value={diagnosis} onChange={e => setDiagnosis(e.target.value)} placeholder="e.g., Upper Respiratory Tract Infection"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm outline-none focus:border-brand-400 transition-all" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Doctor's Notes</label>
            <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={2} placeholder="Lifestyle advice, precautions, special instructions..."
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm outline-none focus:border-brand-400 resize-none transition-all" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Follow-up Date</label>
            <input type="date" value={followUpDate} onChange={e => setFollowUpDate(e.target.value)} min={new Date().toISOString().split('T')[0]}
              className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm outline-none focus:border-brand-400 transition-all" />
          </div>
        </div>
      </div>

      {/* Medicines */}
      <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-slate-900 flex items-center gap-2"><Pill className="w-4 h-4 text-teal-500" />Medicines ({medicines.length})</h3>
          <button onClick={addMedicine} className="flex items-center gap-2 px-4 py-2 bg-brand-50 text-brand-600 border border-brand-200 rounded-xl text-sm font-semibold hover:bg-brand-100 transition-colors">
            <Plus className="w-4 h-4" /> Add Medicine
          </button>
        </div>
        {medicines.length === 0 ? (
          <div className="border-2 border-dashed border-slate-200 rounded-2xl p-8 text-center">
            <div className="text-4xl mb-3">💊</div>
            <p className="text-slate-500 text-sm mb-3">No medicines added yet</p>
            <button onClick={addMedicine} className="px-5 py-2 bg-brand-600 text-white text-sm font-semibold rounded-xl hover:bg-brand-700">+ Add First Medicine</button>
          </div>
        ) : (
          <div className="space-y-3">
            {medicines.map((med, i) => <MedicineRow key={med.id} med={med} index={i} onChange={updateMed} onDelete={deleteMed} />)}
          </div>
        )}
      </div>

      <div className="flex gap-3">
        <button onClick={() => router.back()} className="flex-1 py-3.5 border border-slate-200 text-slate-700 font-semibold rounded-2xl hover:bg-slate-50">Cancel</button>
        <button onClick={handleSubmit} disabled={createMutation.isPending}
          className="flex-1 py-3.5 bg-brand-600 text-white font-bold rounded-2xl hover:bg-brand-700 transition-all disabled:opacity-60 flex items-center justify-center gap-2">
          <Save className="w-4 h-4" /> {createMutation.isPending ? 'Saving...' : editId ? 'Update Prescription' : 'Save & Notify Patient'}
        </button>
      </div>
    </div>
  );
}
