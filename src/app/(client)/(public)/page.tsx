import React from 'react';
import PublicHomeClient from '@/components/public/PublicHomeClient';
import HeroSection from '@/components/shared/client-shared/HeroSection';
export const metadata = {
  title: 'Gratify — головна',
  description:
    'Платформа для пошуку бізнесів та спеціальних пропозицій для військових в Україні',
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
