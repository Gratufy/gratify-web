import React from 'react';
import PublicHomeClient from '@/components/public/PublicHomeClient';

export default function PublicHome() {
  return (
    <div className="flex min-h-[calc(100dvh-env(safe-area-inset-bottom))] flex-col items-center pl-0 pr-0">
      <PublicHomeClient />
    </div>
  );
}
