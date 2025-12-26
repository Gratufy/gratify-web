import React from 'react';
import AdminSidebarDesktop from './AdminSidebarDesktop';
import AdminSidebarMobile from './AdminSidebarMobile';
import AdminNewSidebarMobile from './AdminNewSidebarMobile';

function AdminSidebarManager() {
  return (
    <>
      <div className="hidden flex-col lg:flex">
        <AdminSidebarDesktop />
      </div>
      <div className="border-b-icons-grey-30 container flex flex-col border-b px-4 lg:hidden">
        <AdminNewSidebarMobile />
      </div>
    </>
  );
}

export default AdminSidebarManager;
