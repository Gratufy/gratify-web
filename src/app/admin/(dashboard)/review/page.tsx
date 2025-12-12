import React from 'react';

import AdminReviewClient from '@/components/admin/reviews/AdminReviewClient';

const AdminReviewPage = async () => {
  return (
    <div className="flex w-full flex-col items-center lg:px-[50px] lg:py-10">
      <AdminReviewClient />
    </div>
  );
};

export default AdminReviewPage;
