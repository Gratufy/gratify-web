import React from 'react';

import BusinessReviewTable from '@/components/admin/BusinessReviewTable';

const AdminReviewPage = async () => {
  return (
    <div className="flex flex-col items-center justify-center p-4">
      <h1 className="mb-4 text-2xl font-bold">Admin: Businesses and Reviews</h1>

      <p>Here you can manage all business reviews.</p>
      <BusinessReviewTable />
    </div>
  );
};

export default AdminReviewPage;
