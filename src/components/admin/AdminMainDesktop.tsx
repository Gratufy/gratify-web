import React from 'react';
import AdminSidebar from './AdminSidebar';
import AdminMainSection from './AdminMainSection';

function AdminMainDesktop() {
  return (
    <div className="hidden w-full flex-col lg:flex">
      {/* <AdminSidebar /> */}
      <AdminMainSection />
    </div>
  );
}

export default AdminMainDesktop;
