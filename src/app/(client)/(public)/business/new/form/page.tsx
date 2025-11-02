import React from 'react';

import GoBackButton from '@/components/ui/GoBackButton';
import BusinessFormNew from '@/components/shared/BusinessFormNew';

function publicNewBusiness() {
  return (
    <div className="pb-15 container flex flex-1 flex-col items-center justify-center">
      <div className="w-full max-[1024px]:px-4">
        <GoBackButton href="/" className="w-8 py-2 pr-2" />
      </div>
      <h2 className="title-h2 mx-auto mb-10 text-center">
        Створити бізнес-картку
      </h2>
      <BusinessFormNew />
    </div>
  );
}
export default publicNewBusiness;
