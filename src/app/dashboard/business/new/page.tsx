import React from 'react';

import BusinessFormNew from '@/components/shared/newForm/BusinessFormNew';
import GoBackButton from '@/components/ui/custom-ui/GoBackButton';

export default function BusinessNew() {
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="container w-full max-[1024px]:px-4">
        <GoBackButton href="/dasboard/business" className="w-8 py-2 pr-2" />
      </div>
      <h2 className="title-h2 mx-auto mb-10 text-center">
        Створити бізнес-картку
      </h2>

      <BusinessFormNew />
    </div>
  );
}
