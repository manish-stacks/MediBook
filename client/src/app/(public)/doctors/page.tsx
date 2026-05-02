import { Suspense } from 'react';
import DoctorsPage from './DoctorsPage';

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DoctorsPage />
    </Suspense>
  );
}