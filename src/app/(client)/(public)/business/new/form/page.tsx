import React from 'react';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { BusinessForm } from '@/components/shared/BusinessForm';
import GoBackButton from '@/components/ui/GoBackButton';

function publicNewBusiness() {
  return (
    <div className="container flex flex-1 flex-col items-center justify-center">
      <div className="w-full max-[1024px]:px-4">
        <GoBackButton href="/" className="w-8 py-2 pr-2" />
      </div>
      <h2 className="title-h2 text-center">Створити бізнес-картку</h2>
      <BusinessForm />
    </div>
  );
}
export default publicNewBusiness;
