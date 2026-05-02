// src/lib/utils.ts
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { format, formatDistanceToNow, isToday, isTomorrow } from 'date-fns';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number, currency = 'INR') {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency, maximumFractionDigits: 0 }).format(amount);
}

export function formatDate(date: string | Date, fmt = 'dd MMM yyyy') {
  return format(new Date(date), fmt);
}

export function formatTime(time: string) {
  const [h, m] = time.split(':').map(Number);
  const period = h >= 12 ? 'PM' : 'AM';
  const hour = h % 12 || 12;
  return `${hour}:${m.toString().padStart(2, '0')} ${period}`;
}

export function getRelativeDate(date: string | Date) {
  const d = new Date(date);
  if (isToday(d)) return 'Today';
  if (isTomorrow(d)) return 'Tomorrow';
  return format(d, 'EEE, dd MMM');
}

export function getInitials(firstName: string, lastName: string) {
  return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase();
}

export function getAgeFromDOB(dob: string | Date) {
  return Math.floor((Date.now() - new Date(dob).getTime()) / (365.25 * 24 * 60 * 60 * 1000));
}

export function getStatusColor(status: string) {
  const map: Record<string, string> = {
    PENDING:     'bg-amber-50 text-amber-700 border-amber-200',
    CONFIRMED:   'bg-blue-50 text-blue-700 border-blue-200',
    COMPLETED:   'bg-green-50 text-green-700 border-green-200',
    CANCELLED:   'bg-red-50 text-red-700 border-red-200',
    RESCHEDULED: 'bg-purple-50 text-purple-700 border-purple-200',
    NO_SHOW:     'bg-gray-50 text-gray-700 border-gray-200',
  };
  return map[status] || 'bg-gray-50 text-gray-600 border-gray-200';
}

export function getPaymentStatusColor(status: string) {
  const map: Record<string, string> = {
    PAID:    'bg-green-50 text-green-700',
    PENDING: 'bg-amber-50 text-amber-700',
    FAILED:  'bg-red-50 text-red-700',
    REFUNDED:'bg-purple-50 text-purple-700',
  };
  return map[status] || 'bg-gray-50 text-gray-700';
}

export function slugify(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

export const SPECIALITY_ICONS: Record<string, string> = {
  'cardiology':       '🫀',
  'dermatology':      '🧴',
  'neurology':        '🧠',
  'orthopedics':      '🦴',
  'pediatrics':       '👶',
  'gynecology':       '🌸',
  'psychiatry':       '🧘',
  'general-medicine': '🏥',
};
