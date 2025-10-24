import React from 'react';

import BusinessHomeClient from '@/components/business/BusinessHomeClient';

export default function BusinessHome() {
  return (
    // container
    <div className="flex w-full items-center pb-10 pt-5 lg:container lg:pb-14 lg:pt-5">
      <BusinessHomeClient />
    </div>
  );
}
