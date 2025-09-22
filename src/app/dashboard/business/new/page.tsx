import React from 'react';
import { BusinessForm } from '@/components/shared/BusinessForm';

export default function BusinessNew() {
  return (
    <div className="flex flex-col items-center justify-center p-4">
      <h1 className="mb-2 text-2xl font-bold">
        Welcome to the FORM NEW Business
      </h1>
      <p className="mb-1 text-lg">
        Тут буде форма для створення нового бізнесу власником
      </p>

      <p className="italic">
        На навігацію поки не звертати увагу. Це виключно для мене і тимчасово
      </p>
      <BusinessForm />
    </div>
  );
}
