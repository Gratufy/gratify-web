import React from 'react';

import AdminMainSection from '@/components/admin/main/AdminMainSection';

function AdminMainDesktop({ totalBusinesses }: { totalBusinesses: number }) {
  return (
    <div className="flex w-full flex-col max-[1024px]:px-4">
      {/* <AdminSidebar /> */}
      <AdminMainSection totalBusinesses={totalBusinesses} />
    </div>
  );
}

export default AdminMainDesktop;
