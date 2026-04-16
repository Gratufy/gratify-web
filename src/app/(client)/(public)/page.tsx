import React from 'react';
import type { Metadata } from 'next';
import PublicHomeClient from '@/components/public/PublicHomeClient';
import HeroSection from '@/components/shared/client-shared/HeroSection';

export const metadata: Metadata = {
  title: 'Головна',
  description: 'Знижки та спеціальні пропозиції для військових',
};

export default function PublicHome() {
  return (
    <main className="flex flex-1 flex-col">
      <HeroSection />
      <div className="flex flex-col items-center pl-0 pr-0">
        <PublicHomeClient />
      </div>
    </main>
  );
}
