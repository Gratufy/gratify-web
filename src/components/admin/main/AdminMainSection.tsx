import React from 'react';
import AdminMainList from '@/components/admin/AdminMainList';

function AdminMainSection({ totalBusinesses }: { totalBusinesses: number }) {
  return (
    <div className="bg-background-white w-full lg:mt-3 lg:p-5">
      {/*  Title*/}
      <h2 className="lg:title-h5 mb-2 underline">
        Всього бізнеси: {totalBusinesses}
      </h2>
      <AdminMainList />
    </div>
  );
}

export default AdminMainSection;
