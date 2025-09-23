import { BusinessForm } from '@/components/shared/BusinessForm';
import React from 'react';

function publicNewBusiness() {
  return (
    <div className="flex flex-col items-center justify-center p-4">
      <h2 className="mb-2 text-2xl font-bold">
        Welcome to the PUBLIC NEW Business
      </h2>

      <BusinessForm />
    </div>
  );
}

export default publicNewBusiness;
