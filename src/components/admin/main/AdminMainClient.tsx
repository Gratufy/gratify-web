import React from 'react';
import AdminMainDesktop from '@/components/admin/main/AdminMainDesktop';
import AdminMainMobile from '@/components/admin/main/AdminMainMobile';

function AdminMainClient({ totalBusinesses }: { totalBusinesses: number }) {
  return (
    <>
      <AdminMainDesktop totalBusinesses={totalBusinesses} />
      <AdminMainMobile />
    </>
  );
}

export default AdminMainClient;
