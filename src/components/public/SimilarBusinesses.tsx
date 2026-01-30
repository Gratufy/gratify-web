import React from 'react';
import { BusinessWithCategoryName } from '@/types/business';

import Link from 'next/link';
import SimilarCardShort from './SimilarCardShort';

interface SimilarBusinessesProps {
  similarBusinesses: BusinessWithCategoryName[];
}

function SimilarBusinesses({ similarBusinesses }: SimilarBusinessesProps) {
  return (
    <section className="lg:gap-25 xl:gap-30 w-full lg:w-[1024px] lg:px-[50px] lg:pb-5 xl:w-[1440px] xl:px-[150px] xl:pb-11">
      <h2 className="title-h3 text-center lg:mb-6">Вас можуть зацікавити</h2>

      <ul className="flex flex-col lg:flex-row lg:gap-6">
        {similarBusinesses.map((business) => (
          <li key={business.id} className="flex-1">
            <Link href={`/business/${business.id}`}>
              <article className="w-full overflow-hidden">
                <SimilarCardShort business={business} />
              </article>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default SimilarBusinesses;
