// new one
'use client';
import React, { useRef, useEffect } from 'react';
import { BusinessWithCategoryName } from '@/types';

import BusinessCardShot from './BusinessCardShot';
import Link from 'next/link';

// interface BusinessListSimpleProps {
//   businesses: BusinessWithCategoryName[];

//   isLoading?: boolean;
//   isError?: boolean;
//   error?: Error | null;
// }
type BusinessListProps = {
  businesses: BusinessWithCategoryName[];
  selectedCity?: string;
  isLoading?: boolean;
  isError?: boolean;
  error?: Error | null;
  fetchNextPage?: () => void;
  hasNextPage?: boolean;
  isFetchingNextPage?: boolean;
  enableInfiniteScroll?: boolean; // 🔑 управляет включением/выключением скролла
  linkPrefix?: string; // 🔑 для разных маршрутов: `/business` или `/dashboard/business`
  includeCityQuery?: boolean; // 🔑 включать ли город в query параметры
};

function BusinessList({
  businesses,
  selectedCity = '__all__',
  isLoading,
  isError,
  error,
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
  enableInfiniteScroll = false,
  linkPrefix = '/business',
  includeCityQuery = false,
}: BusinessListProps) {
  const loadMoreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!enableInfiniteScroll) return;
    if (!loadMoreRef.current) return;

    const observer = new IntersectionObserver((entries) => {
      if (
        entries[0].isIntersecting &&
        hasNextPage &&
        !isFetchingNextPage &&
        fetchNextPage
      ) {
        fetchNextPage();
      }
    });

    observer.observe(loadMoreRef.current);
    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage, enableInfiniteScroll]);

  return (
    <section className="flex flex-1 flex-col items-center">
      {isLoading && <p>Loading...</p>}
      {isError && <p>Error: {error?.message}</p>}

      {businesses.length > 0 && (
        <ul className="flex w-full flex-col items-center justify-center gap-5 lg:gap-10">
          {businesses.map((b) => (
            <li
              key={b.id}
              className="shadow-card w-full overflow-hidden bg-white pb-5"
            >
              <Link
                // href={{
                //   pathname: `/dashboard/business/${b.id}`,
                //   // query: { city: selectedCity },
                // }}
                href={{
                  pathname: `${linkPrefix}/${b.id}`,
                  ...(includeCityQuery && selectedCity !== '__all__'
                    ? { query: { city: selectedCity } }
                    : {}),
                }}
                className="block h-full w-full"
              >
                <article className="w-full" key={b.id}>
                  <BusinessCardShot
                    business={b}
                    // selectedCity="__all__"
                    // isFavorite
                  />
                </article>
              </Link>
            </li>
          ))}
        </ul>
      )}
      {enableInfiniteScroll && (
        <div ref={loadMoreRef} className="h-4">
          {isFetchingNextPage && <p>Loading more...</p>}
        </div>
      )}
    </section>
  );
}

export default BusinessList;
