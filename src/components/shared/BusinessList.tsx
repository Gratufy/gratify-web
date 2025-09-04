'use client';
import { useEffect, useRef } from 'react';

import { BusinessWithCategoryName } from '@/types';
import BusinessCardShot from './BusinessCardShot';

interface BusinessListProps {
  businesses: BusinessWithCategoryName[];
  fetchNextPage: () => void; // если нужен infinite scroll
  hasNextPage?: boolean;
  isFetchingNextPage?: boolean;
  isLoading?: boolean;
  isError?: boolean;
  error?: Error | null;
}
function BusinessList({
  businesses,
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
  isError,
  isLoading,
  // error,
}: BusinessListProps) {
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
              {/* selectedCity={city} */}
              <BusinessCardShot business={b} />
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
    </section>
  );
}

export default BusinessList;
