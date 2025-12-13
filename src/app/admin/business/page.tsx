import React from 'react';

import GoBackButton from '@/components/ui/custom-ui/GoBackButton';

export default async function BAdminBusinessPage() {
  return (
    <div className="container flex min-h-screen flex-col items-center justify-center lg:pb-20 xl:pb-20">
      <div className="max-[1024px]:max-w-150 w-full px-4 lg:w-[1024px] lg:px-[50px] lg:py-2 xl:w-[1440px] xl:px-[150px]">
        <GoBackButton href="/dashboard/business" className="w-8 py-2 pr-2" />
      </div>
      Власні бізнеси
    </div>
  );
}
