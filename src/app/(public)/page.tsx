import React from 'react';
import PublicHomeClient from '@/components/public/PublicHomeClient';

export default function PublicHome() {
  return (
    <div className="flex min-h-[100dvh] flex-col items-center justify-center p-4">
      <h1 className="mb-2 text-2xl font-bold">
        Welcome to the Public Home Page
      </h1>

      <PublicHomeClient />
    </div>
  );
}
