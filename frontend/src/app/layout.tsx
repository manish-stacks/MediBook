// src/app/layout.tsx
import type { Metadata } from 'next';
import './globals.css';
import { Providers } from '@/components/layout/Providers';

export const metadata: Metadata = {
  title: { default: 'MediBook — Book Doctor Appointments Online', template: '%s | MediBook' },
  description: 'India\'s trusted healthcare platform. Book appointments with top doctors, manage prescriptions, and access your health records.',
  keywords: ['doctor appointment', 'book doctor', 'online consultation', 'healthcare', 'MediBook'],
  openGraph: {
    title: 'MediBook — Book Doctor Appointments Online',
    description: 'India\'s trusted healthcare platform',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="min-h-screen bg-white font-sans">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
