import React from 'react';

import AdminModeratingSection from './AdminModeratingSection';

function AdminModeringClient({ totalBusinesses }: { totalBusinesses: number }) {
  return (
    // className="bg-background-white w-full flex-col lg:mt-3 lg:flex lg:p-5"
    <div className="max-[1024px]:max-w-150 w-full flex-col max-[1024px]:mx-auto lg:flex">
      <AdminModeratingSection totalBusinesses={totalBusinesses} />
    </div>
  );
}

export default AdminModeringClient;
