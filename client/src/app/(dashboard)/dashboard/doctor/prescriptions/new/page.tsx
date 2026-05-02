import { Suspense } from 'react';
import WritePrescriptionPage from './WritePrescriptionPage';

export default function Page() {
  return (
    <Suspense fallback={<div className="pt-24 text-center"><div className="w-8 h-8 border-2 border-brand-600 border-t-transparent rounded-full animate-spin mx-auto" /></div>}>
      <WritePrescriptionPage />
    </Suspense>
  );
}