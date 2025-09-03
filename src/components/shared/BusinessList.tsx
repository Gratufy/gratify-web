'use client';
import { useEffect, useRef, useState } from 'react';

import { useInfiniteBusinesses } from '@/hooks/useBusinesses';
import { OnlineFilter, Scope, SortBy } from '@/types';
import BusinessCardShot from './BusinessCardShot';
import dynamic from 'next/dynamic';
const BusinessMapAll = dynamic(
  () => import('@/components/shared/BusinessMapAll'),
  {
    ssr: false,
  }
);
import { Button } from '../ui/button';

interface BusinessListProps {
  city?: string;
  categoryId?: string;
  showOnlineStatus?: OnlineFilter;
  sortBy?: SortBy;
  scope: Scope;
}
function BusinessList({
  city,
  categoryId,
  showOnlineStatus,
  sortBy,
  scope,
}: BusinessListProps) {
  const [showMap, setShowMap] = useState(false);
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
  } = useInfiniteBusinesses({
    city,
    categoryId,
    showOnlineStatus,
    sortBy,
    scope,
  });
  const businesses = data?.pages.flatMap((page) => page.data) ?? [];

  useEffect(() => {
    if (!loadMoreRef.current) return;
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    });
    observer.observe(loadMoreRef.current);
    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  const loadMoreRef = useRef<HTMLDivElement>(null);

  return (
    <section className="flex flex-1 flex-col items-center pb-20 lg:pb-8">
      {/* {isError && <p>Помилка: {error?.message}</p>}
      {isLoading && <p>Loading...</p>} */}
      {businesses.length > 0 && (
        <ul className="flex w-full flex-col items-center justify-center gap-5 lg:gap-10">
          {businesses.map((b) => (
            <li key={b.id} className="shadow-card w-full">
              <BusinessCardShot business={b} selectedCity={city} />
            </li>
          ))}
        </ul>
      )}
      <div ref={loadMoreRef} className="h-4">
        {isFetchingNextPage && <p>Loading more...</p>}
        {/* {!hasNextPage && <p className="text-gray-500">Більше бізнесів немає</p>} */}
      </div>
      {businesses.length === 0 && !isLoading && !isError && (
        <p className="text-2xl"> Нема бізнесів в цьому місті</p>
      )}

      {businesses.length > 0 && (
        <Button onClick={() => setShowMap((prev) => !prev)}>Show Map</Button>
      )}
      {showMap && (
        <BusinessMapAll
          businesses={businesses}
          className="w-full"
          selectedCity={city}
        />
      )}
    </section>
  );
}

export default BusinessList;
