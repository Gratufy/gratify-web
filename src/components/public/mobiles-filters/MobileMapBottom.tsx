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
    <BusinessMapAll
      businesses={businesses}
      className="h-150 flex w-full"
      selectedCity={city}
    />
  );
}

export default MobileMapBottom;
