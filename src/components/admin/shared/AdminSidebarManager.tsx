import React from 'react';
import AdminSidebarDesktop from './AdminSidebarDesktop';
import AdminSidebarMobile from './AdminSidebarMobile';

function AdminSidebarManager() {
  return (
    <>
      <div className="hidden flex-col lg:flex">
        <AdminSidebarDesktop />
      </div>
      <div className="border-b-icons-grey-30 flex flex-col border-b lg:hidden">
        <AdminSidebarMobile />
      </div>
    </>
  );
}

export default AdminSidebarManager;
