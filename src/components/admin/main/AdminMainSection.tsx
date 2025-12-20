import React from 'react';
import AdminDesktopBusinessesList from '@/components/admin/shared/AdminDesktopBusinessesList';
import AdminMobileBusinessList from '../shared/AdminMobileBusinessList';

function AdminMainSection({ totalBusinesses }: { totalBusinesses: number }) {
  return (
    <div className="bg-background-white w-full lg:mt-3 lg:p-5">
      {/*  Title*/}
      <h2 className="lg:title-h5 mb-2 underline">
        Всього бізнеси: {totalBusinesses}
      </h2>
      <div className="hidden lg:block">
        <AdminDesktopBusinessesList />
      </div>
      <div className="lg:hidden">
        <AdminMobileBusinessList />
      </div>
    </div>
  );
}

export default AdminMainSection;
