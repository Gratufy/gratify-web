import React from 'react';

import AdminMainSection from '@/components/admin/main/AdminMainSection';

function AdminMainDesktop({ totalBusinesses }: { totalBusinesses: number }) {
  return (
    <div className=" w-full flex-col flex">
      {/* <AdminSidebar /> */}
      <AdminMainSection totalBusinesses={totalBusinesses} />
    </div>
  );
}

export default AdminMainDesktop;
