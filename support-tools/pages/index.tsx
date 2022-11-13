import { Suspense } from 'react';
import SearchWrapper from './components/SearchWrapper';

export default function Home() {
  return (
    <Suspense fallback={<div>Loading</div>}>
      <SearchWrapper />
    </Suspense>
  );
}
