import React from 'react';
import GoBackButton from '@/components/ui/custom-ui/GoBackButton';

function page() {
  return (
    <div className="container flex flex-col items-center justify-center">
      <div className="max-[1024px]:max-w-150 w-full px-4 lg:w-[1024px] lg:px-[50px] lg:py-2 xl:w-[1440px] xl:px-[150px]">
        <GoBackButton href="/" className="w-8 py-2 pr-2" />
      </div>
      <div className="px-4 lg:px-0">
        <h2 className="title-h3">Умови використання</h2>
        <p className="placeholder-base">
          Ці умови описують правила та положення, які регулюють використання
          нашого сервісу.
        </p>
      </div>
    </div>
  );
}

export default page;
