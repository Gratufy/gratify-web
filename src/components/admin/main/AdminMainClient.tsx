import React from 'react';
import AdminMainDesktop from '@/components/admin/main/AdminMainDesktop';

function AdminMainClient({ totalBusinesses }: { totalBusinesses: number }) {
  return (
    <>
      <AdminMainDesktop totalBusinesses={totalBusinesses} />
    </>
  );
}

export default AdminMainClient;
