import React from 'react';

import AdminMainSection from '@/components/admin/main/AdminMainSection';

function AdminMain({ totalBusinesses }: { totalBusinesses: number }) {
  return (
    <div className="max-[1024px]:max-w-150 flex w-full flex-col max-[1024px]:mx-auto">
      {/* <AdminSidebar /> */}
      <AdminMainSection totalBusinesses={totalBusinesses} />
    </div>
  );
}

export default AdminMain;
