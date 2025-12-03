import React from 'react';
import AdminMainList from './AdminMainList';

function AdminMainSection({ totalBusinesses }: { totalBusinesses: number }) {
  return (
    <div className="w-full lg:pt-3">
      <AdminMainList totalBusinesses={totalBusinesses} />
    </div>
  );
}

export default AdminMainSection;
