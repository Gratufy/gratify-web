import PublicFooter from '@/components/public/PublicFooter/DesktopFooter';
import PublicHeader from '@/components/public/PublicHeader/PublicHeader';
import HeroSection from '@/components/shared/HeroSection';
import React from 'react';

export default async function NoAccessLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col">
      <PublicHeader />
      <main className="flex flex-1 flex-col">
        <HeroSection />
        {children}
      </main>
      <PublicFooter />
    </div>
  );
}
