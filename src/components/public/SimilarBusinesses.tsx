import React from 'react';
import { BusinessWithCategoryName } from '@/types/business';

import Link from 'next/link';
import SimilarCardShort from './SimilarCardShort';

interface SimilarBusinessesProps {
  similarBusinesses: BusinessWithCategoryName[];
}

function SimilarBusinesses({ similarBusinesses }: SimilarBusinessesProps) {
  return (
    <section className="max-[1024px]:max-w-150 w-full lg:w-[1024px] lg:px-[50px] lg:pb-5 xl:w-[1440px] xl:px-[150px]">
      <h2 className="title-h3 mb-6 text-center">Вас можуть зацікавити</h2>

      <ul className="flex flex-col gap-6 lg:flex-row">
        {similarBusinesses.map((business) => (
          <li
            key={business.id}
            className="dark:hover:bg-card-hover-dark dark:focus:bg-card-hover-dark dark:focus:border-elements-main-500 bg-background-white-3 hover:shadow-card-hover focus:shadow-card-hover flex-1"
          >
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
