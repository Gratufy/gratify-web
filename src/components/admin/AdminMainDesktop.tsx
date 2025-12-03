import React from 'react';
import AdminSidebar from './AdminSidebar';
import AdminHomeSection from './AdminHomeSection';

function AdminMainDesktop() {
  return (
    <div className="hidden w-full lg:flex lg:gap-6">
      <AdminSidebar />
      <AdminHomeSection />
    </div>
  );
}

export default AdminMainDesktop;
