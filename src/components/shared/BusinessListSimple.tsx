'use client';
import React from 'react';
import { BusinessWithCategoryName } from '@/types';

import BusinessCardShot from './BusinessCardShot';

interface BusinessListSimpleProps {
  businesses: BusinessWithCategoryName[];

  isLoading?: boolean;
  isError?: boolean;
  error?: Error | null;
}
function BusinessListSimple({
  businesses,
  isLoading,
  isError,
  error,
}: BusinessListSimpleProps) {
  return (
    <section className="flex flex-1 flex-col items-center">
      {isLoading && <p>Loading...</p>}
      {isError && <p>Error: {error?.message}</p>}
      {businesses.length === 0 && !isLoading && !isError && (
        <p className="placeholder-sm lg:placeholder-base">
          Ви ще не додали жодного бізнесу до улюблених
        </p>
      )}
      {businesses.length > 0 && (
        <ul className="flex w-full flex-col items-center justify-center gap-5 lg:gap-10">
          {businesses.map((b) => (
            <li
              key={b.id}
              className="shadow-card w-full overflow-hidden bg-white pb-5"
            >
              <article className="w-full" key={b.id}>
                <BusinessCardShot
                  business={b}
                  selectedCity="__all__"
                  // isFavorite
                />
              </article>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export default BusinessListSimple;
