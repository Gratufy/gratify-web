import React from 'react';

import BusinessFormNew from '@/components/shared/newForm/BusinessFormNew';
import GoBackButton from '@/components/ui/custom-ui/GoBackButton';

import type { Metadata } from 'next';
export const metadata: Metadata = {
  title: 'Бізнес дешборд - Gratify',
  description:
    'Сторінка для створення нових бізнесів користувача на платформі Gratify',
};
export default function BusinessNew() {
  return (
    <div className="flex flex-col items-center justify-center">
      {/*  */}
      <div className="container w-full max-[1024px]:px-4 lg:py-2">
        <GoBackButton href="/dashboard/business" className="w-8 py-2 pr-2" />
      </div>
      <h2 className="title-h2 mx-auto mb-10 text-center">
        Створити бізнес-картку
      </h2>
      <BusinessFormNew />
    </div>
  );
}
