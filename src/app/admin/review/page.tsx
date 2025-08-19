import React from "react";
import BusinessTable from "@/components/admin/BusinessTable";
import { getBusinessesWithReviewStatus } from "@/lib/actions/businesses";

const AdminReviewPage = async () => {
  const businessesFiltered = await getBusinessesWithReviewStatus();
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-2xl font-bold mb-4">Admin: Businesses and Reviews</h1>

      <p>Here you can manage all business reviews.</p>
      <BusinessTable initialData={businessesFiltered} />
    </div>
  );
};

export default AdminReviewPage;
