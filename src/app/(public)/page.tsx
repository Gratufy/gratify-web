import React from 'react';
import PublicHomeClient from '@/components/public/PublicHomeClient';

export default function PublicHome() {
  return (
    <div className="container flex min-h-[calc(100dvh-env(safe-area-inset-bottom))] flex-col items-center">
      <PublicHomeClient />
    </div>
  );
}
