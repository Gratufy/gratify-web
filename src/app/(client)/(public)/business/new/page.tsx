// import { BusinessForm } from '@/components/shared/BusinessForm';
import React from 'react';
import { Plus } from 'lucide-react';
import Link from 'next/link';

function publicNewBusiness() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-4">
      <div className="flex w-[340px] flex-col items-center">
        <p className="title-h4 mb-8 text-center font-bold">
          Почніть із малого: створіть бізнес-картку, щоб показати, хто ви та чим
          займаєтесь
        </p>
        <Link
          href="/dashboard/business/new"
          className="shadow-menu bg-background-main-300 flex items-center justify-center px-3 py-[6px] text-sm"
        >
          <Plus className="mr-2 size-4" /> <span>Додати</span>
        </Link>
      </div>

      {/* <BusinessForm /> */}
    </div>
  );
}

export default publicNewBusiness;
