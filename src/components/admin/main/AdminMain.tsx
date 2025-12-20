import React from 'react';

import AdminMainSection from '@/components/admin/main/AdminMainSection';

function AdminMain({ totalBusinesses }: { totalBusinesses: number }) {
  return (
    <div className="bg-background-white flex w-full flex-col">
      {/* <AdminSidebar /> */}
      <AdminMainSection totalBusinesses={totalBusinesses} />
    </div>
  );
}

export default AdminMain;
