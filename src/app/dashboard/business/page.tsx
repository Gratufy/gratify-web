import React from 'react';

import BusinessHomeClient from '@/components/business/BusinessHomeClient';

export default function BusinessHome() {
  return (
    <div className="flex flex-col items-center justify-center p-4">
      <h1 className="mb-2 text-2xl font-bold">
        Welcome to the Business Home Page
      </h1>

      <h2 className="mb-2 text-xl font-bold">
        Список ВЛАСНИХ бізнесів with all status
      </h2>
      <BusinessHomeClient />
    </div>
  );
}
