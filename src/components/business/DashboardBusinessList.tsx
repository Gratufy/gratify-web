// new one
'use client';
import React, { useRef, useEffect } from 'react';
import { BusinessWithCategoryName } from '@/types';
import { Trash2 } from 'lucide-react';
import EditPen from '@/assets/icons/general/feedback-edit.svg';
import Link from 'next/link';

import { Spinner } from '../ui/spinner';
import BusinessListSkeleton from '../shared/skeletons/BusinessListSkeleton';
import BusinessCardShot from '../shared/BusinessCardShot';

import { BUSINESS_STATUS_LABELS } from '@/const/business';
import { getBusinessStatusBgColor } from '@/lib/helpers/getBusinessStatusColorBg';
import DeleteEditBusinessBtns from './DeleteEditBusinessBtns';

// interface BusinessListSimpleProps {
//   businesses: BusinessWithCategoryName[];

//   isLoading?: boolean;
//   isError?: boolean;
//   error?: Error | null;
// }
type DashboardBusinessListProps = {
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

function DashboardBusinessList({
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
}: DashboardBusinessListProps) {
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
    <section className="flex w-full flex-1 flex-col items-center overflow-hidden">
      {isLoading && <BusinessListSkeleton count={6} />}
      {isError && <p>Error: {error?.message}</p>}

      {businesses.length > 0 && (
        <ul className="flex w-full flex-col items-center justify-center gap-10 overflow-hidden lg:gap-10">
          {businesses.map((b) => (
            <li
              key={b.id}
              className="bg-background-grey-50 flex w-full flex-col items-center overflow-hidden py-5"
              onMouseEnter={() => onHover?.(b.id)}
              onMouseLeave={() => onHover?.(null)}
            >
              {/* Status */}
              <div
                className={`max-[1024px]:max-w-150 mb-1 flex w-full items-center px-5 py-2 ${getBusinessStatusBgColor(b.status)}`}
              >
                <span className="placeholder-xs mr-2">Статус</span>{' '}
                <span className="title-h6">
                  {BUSINESS_STATUS_LABELS[b.status]}
                </span>
              </div>
              <Link
                prefetch={false}
                href={{
                  pathname: `${linkPrefix}/${b.id}`,
                  ...(includeCityQuery && selectedCity !== '__all__'
                    ? { query: { city: selectedCity } }
                    : {}),
                }}
                className="max-[1024px]:max-w-150 block h-full w-full"
              >
                <article
                  className="bg-background-white w-full overflow-hidden pb-5"
                  key={b.id}
                >
                  <BusinessCardShot
                    business={b}
                    // selectedCity="__all__"
                    // isFavorite
                  />
                </article>
              </Link>
              <DeleteEditBusinessBtns id={b.id} />
              {/* <div className="max-[1024px]:max-w-150 flex w-full items-center justify-between px-4">
                <Link
                  href={`/dashboard/business/${b.id}/edit`}
                  className="shadow-menu bg-background-main-300 placeholder-sm flex cursor-pointer items-center px-3 py-[6px]"
                >
                  <EditPen className="size-6 pr-[6px] xl:size-6" />{' '}
                  <span>Внести зміни</span>
                </Link>
                <button className="text-text-warning bg-background-white shadow-menu border-icons-color-error placeholder-sm flex cursor-pointer items-center border px-3 py-[6px]">
                  <Trash2 className="size-6 pr-[6px] xl:size-6" />
                  <span>Видалити</span>
                </button>
              </div> */}
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

export default DashboardBusinessList;
