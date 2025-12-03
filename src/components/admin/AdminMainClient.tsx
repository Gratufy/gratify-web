import React from 'react';
import AdminMainDesktop from './AdminMainDesktop';
import AdminMainMobile from './AdminMainMobile';

function AdminMainClient() {
  return (
    <div className="container">
      <AdminMainDesktop />
      <AdminMainMobile />
    </div>
  );
}

export default AdminMainClient;
