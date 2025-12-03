import React from 'react';
import AdminMainDesktop from './AdminMainDesktop';
import AdminMainMobile from './AdminMainMobile';

function AdminMainClient({ totalBusinesses }: { totalBusinesses: number }) {
  return (
    <>
      <AdminMainDesktop totalBusinesses={totalBusinesses} />
      <AdminMainMobile />
    </>
  );
}

export default AdminMainClient;
