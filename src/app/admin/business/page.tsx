import React from 'react';

import GoBackButton from '@/components/ui/custom-ui/GoBackButton';
import AdminBusinessClient from '@/components/admin/business/AdminBusinessClient';

export default async function BAdminBusinessPage() {
  return (
    <div className="xl:pb-15 flex w-full items-center pb-10 pt-5 lg:container lg:pb-14 lg:pt-5">
      <AdminBusinessClient />
    </div>
  );
}
