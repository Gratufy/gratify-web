import React from 'react';
import dynamic from 'next/dynamic';

import { BusinessWithCategoryName } from '@/types';
const BusinessMapAll = dynamic(
  () => import('@/components/shared/BusinessMapAll'),
  {
    ssr: false,
  }
);

export type MobileMapBottomProps = {
  businesses: BusinessWithCategoryName[];
  city?: string;
  className?: string;
};
function MobileMapBottom({ businesses, city }: MobileMapBottomProps) {
  return (
    <div className="p-5">
      <BusinessMapAll
        businesses={businesses}
        className="h-100 flex w-full"
        selectedCity={city}
      />
    </div>
  );
}

export default MobileMapBottom;
