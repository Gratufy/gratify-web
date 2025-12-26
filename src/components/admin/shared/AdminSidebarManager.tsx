import React from 'react';
import AdminSidebarDesktop from './AdminSidebarDesktop';

import AdminSidebarMobile from './AdminSidebarMobile';

function AdminSidebarManager() {
  return (
    <>
      <aside className="hidden flex-col lg:flex">
        <AdminSidebarDesktop />
      </aside>
      <div className="border-b-icons-grey-30 container flex flex-col border-b px-4 lg:hidden">
        <AdminSidebarMobile />
      </div>
    </>
  );
}

export default AdminSidebarManager;
