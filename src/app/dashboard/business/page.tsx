import React from 'react';

import BusinessHomeClient from '@/components/shared/BusinessHomeClient';

export default function BusinessHome() {
  return (
    // container
    <div className="xl:pb-15 flex w-full items-center pb-10 pt-5 lg:container lg:pb-14 lg:pt-5">
      <BusinessHomeClient />
    </div>
  );
}
