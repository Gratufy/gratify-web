import React from 'react';
import AdminSidebar from './AdminSidebar';
import AdminMainSection from './AdminMainSection';

function AdminMainDesktop({ totalBusinesses }: { totalBusinesses: number }) {
  return (
    <div className="hidden w-full flex-col lg:flex">
      {/* <AdminSidebar /> */}
      <AdminMainSection totalBusinesses={totalBusinesses} />
    </div>
  );
}

export default AdminMainDesktop;
