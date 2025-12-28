import React from 'react';

import IconModering from '@/assets/icons/menu/icon-modering.svg';
import AdminModeratingSection from './AdminModeratingSection';

function AdminModeringClient({ totalBusinesses }: { totalBusinesses: number }) {
  return (
    // className="bg-background-white w-full flex-col lg:mt-3 lg:flex lg:p-5"
    <div className="max-[1024px]:max-w-150 w-full max-[1024px]:mx-auto lg:flex lg:flex-col">
      {/*  mobile nav title */}
      <div className="bg-background-main-100 flex items-center justify-center gap-3 py-3 lg:hidden">
        <IconModering className="size-5" />
        <span className="title-h4">Модерування</span>
      </div>
      <AdminModeratingSection totalBusinesses={totalBusinesses} />
    </div>
  );
}

export default AdminModeringClient;
