import React from 'react';

import AdminMainSection from '@/components/admin/main/AdminMainSection';

function AdminMainClient({ totalBusinesses }: { totalBusinesses: number }) {
  return (
    <div className="max-[1024px]:max-w-150 flex w-full flex-col max-[1024px]:mx-auto">
      <AdminMainSection totalBusinesses={totalBusinesses} />
    </div>
  );
}

export default AdminMainClient;
