import React from "react";

import BusinessReviewTable from "@/components/admin/BusinessReviewTable";

const AdminReviewPage = async () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-2xl font-bold mb-4">Admin: Businesses and Reviews</h1>

      <p>Here you can manage all business reviews.</p>
      <BusinessReviewTable />
    </div>
  );
};

export default AdminReviewPage;
