import React from 'react';
import AdminMain from '@/components/admin/main/AdminMain';

function AdminMainClient({ totalBusinesses }: { totalBusinesses: number }) {
  return (
    <>
      <AdminMain totalBusinesses={totalBusinesses} />
    </>
  );
}

export default AdminMainClient;
