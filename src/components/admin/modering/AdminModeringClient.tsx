import React from 'react';
import AdminBusinessesList from '@/components/admin/shared/AdminBusinessesList';

function AdminModeringClient() {
  return (
    <div className="bg-background-white w-full flex-col lg:mt-3 lg:flex lg:p-5">
      <AdminBusinessesList />
    </div>
  );
}

export default AdminModeringClient;
