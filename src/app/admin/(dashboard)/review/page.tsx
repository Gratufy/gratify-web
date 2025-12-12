import React from 'react';

import AdminReviewClient from '@/components/admin/reviews/AdminReviewClient';

const AdminReviewPage = async () => {
  return (
    <div className="flex w-full flex-col items-center">
      <AdminReviewClient />
    </div>
  );
};

export default AdminReviewPage;
