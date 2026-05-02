import { Suspense } from 'react';
import WritePrescriptionPage from './WritePrescriptionPage';

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <WritePrescriptionPage />
    </Suspense>
  );
}