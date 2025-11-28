'use client';
import { Suspense } from 'react';
import HeaderSearchClient from './HeaderSearchClient';

export default function PublicHeader() {
  return (
    <header className="bg-background-main-50 w-full">
      <Suspense>
        <HeaderSearchClient />
      </Suspense>
    </header>
  );
}
