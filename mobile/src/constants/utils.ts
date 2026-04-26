// src/constants/utils.ts
import { format, formatDistanceToNow, isToday, isTomorrow } from 'date-fns';

export function formatCurrency(amount: number, currency = 'INR') {
  return `₹${amount.toLocaleString('en-IN')}`;
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

export function getStatusColor(status: string): { bg: string; text: string; border: string } {
  const map: Record<string, { bg: string; text: string; border: string }> = {
    PENDING:    { bg: '#fffbeb', text: '#b45309', border: '#fde68a' },
    CONFIRMED:  { bg: '#eff8ff', text: '#1e6fe8', border: '#bfe3fd' },
    COMPLETED:  { bg: '#f0fdf4', text: '#15803d', border: '#bbf7d0' },
    CANCELLED:  { bg: '#fef2f2', text: '#dc2626', border: '#fecaca' },
    NO_SHOW:    { bg: '#f8fafc', text: '#64748b', border: '#e2e8f0' },
    RESCHEDULED:{ bg: '#f5f3ff', text: '#7c3aed', border: '#ddd6fe' },
  };
  return map[status] || { bg: '#f8fafc', text: '#64748b', border: '#e2e8f0' };
}

export function getPaymentStatusColor(status: string): { bg: string; text: string } {
  const map: Record<string, { bg: string; text: string }> = {
    PAID:    { bg: '#f0fdf4', text: '#15803d' },
    PENDING: { bg: '#fffbeb', text: '#b45309' },
    FAILED:  { bg: '#fef2f2', text: '#dc2626' },
    REFUNDED:{ bg: '#f5f3ff', text: '#7c3aed' },
  };
  return map[status] || { bg: '#f8fafc', text: '#64748b' };
}
