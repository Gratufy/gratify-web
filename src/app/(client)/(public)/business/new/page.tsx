import React from 'react';
import { Plus } from 'lucide-react';
import Link from 'next/link';

function publicNewBusinessStart() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-4">
      <div className="flex w-[340px] flex-col items-center lg:w-[520px]">
        <p className="title-h4 mb-8 text-center font-bold">
          Почніть із малого: створіть бізнес-картку, щоб показати, хто ви та чим
          займаєтесь
        </p>
        <Link href="/business/new/form" className="btn-aprove">
          <Plus className="mr-2 size-4 xl:size-5" />{' '}
          <span>Створити бізнес-картку</span>
        </Link>
      </div>

      {/* <BusinessForm /> */}
    </div>
  );
}

export default publicNewBusinessStart;
