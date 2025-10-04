// new one
'use client';
import React, { useRef, useEffect } from 'react';
import { BusinessWithCategoryName } from '@/types';

import BusinessCardShot from './BusinessCardShot';
import Link from 'next/link';
import BusinessListSkeleton from './skeletons/BusinessListSkeleton';
import { Spinner } from '../ui/spinner';

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
  onHover?: (id: string | null) => void;
  hasNextPage?: boolean;
  isFetchingNextPage?: boolean;
  enableInfiniteScroll?: boolean; // on/off infinity scroll
  linkPrefix?: string; // for different routes: `/business` , `/dashboard/business`
  includeCityQuery?: boolean; // CityQuery only for public list for now
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
  onHover,
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
      {isLoading && <BusinessListSkeleton count={6} />}
      {isError && <p>Error: {error?.message}</p>}

      {businesses.length > 0 && (
        <ul className="flex w-full flex-col items-center justify-center gap-5 lg:gap-10">
          {businesses.map((b) => (
            <li
              key={b.id}
              className="shadow-card w-full overflow-hidden bg-white pb-5"
              onMouseEnter={() => onHover?.(b.id)}
              onMouseLeave={() => onHover?.(null)}
            >
              <Link
                prefetch={false}
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
          {isFetchingNextPage && <Spinner />}
        </div>
      )}
    </section>
  );
}

export default BusinessList;
