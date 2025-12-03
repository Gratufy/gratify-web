import React from 'react';
import AdminSidebar from './AdminSidebar';
import AdminMainSection from './AdminMainSection';

function AdminMainDesktop() {
  return (
    <div className="hidden w-full lg:flex lg:gap-6">
      <AdminSidebar />
      <AdminMainSection />
    </div>
  );
}

export default AdminMainDesktop;
