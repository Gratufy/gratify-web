// new one
'use client';
import React, { useRef, useEffect, useState, ReactNode } from 'react';

import { BusinessWithCategoryName } from '@/types';

import BusinessCardShot from './BusinessCardShot';
import Link from 'next/link';
import BusinessListSkeleton from './skeletons/BusinessListSkeleton';
import { Spinner } from '../ui/spinner';
import { useAuth } from '@/stores/useUserStore';
import { CustomAlertDialog } from '../ui/custom-ui/CustomAlertDialog';

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
  // for modal
  const { isLoggedIn } = useAuth();
  const [open, setOpen] = useState(false);
  const [alertTitle, setAlertTitle] = useState('');
  const [actionContent, setActionContent] = useState<ReactNode>(null);
  const [onConfirm, setOnConfirm] = useState<() => void>(() => {});
  //////
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
    <section className="flex flex-1 flex-col items-center overflow-hidden">
      {isLoading && <BusinessListSkeleton count={6} />}

      {isError && <p>Error: {error?.message}</p>}

      {businesses.length > 0 && (
        <ul className="flex w-full max-w-full flex-col items-center justify-center gap-5 overflow-hidden lg:gap-10">
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
                onClick={(e) => {
                  if (!isLoggedIn && open) {
                    e.preventDefault(); // блокируем переход, пока модалка открыта
                  }
                }}
                className="block h-full w-full"
              >
                <article className="w-full overflow-hidden" key={b.id}>
                  <BusinessCardShot
                    business={b}
                    setOpen={setOpen}
                    isLoggedIn={isLoggedIn}
                    setAlertTitle={setAlertTitle}
                    setActionContent={setActionContent}
                    setOnConfirm={setOnConfirm}
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
      <CustomAlertDialog
        open={open}
        onOpenChange={setOpen}
        // title="Для додавання в обране, авторизуйтесь будь ласка"
        title={alertTitle}
        description={alertTitle}
        actionContent={actionContent}
        //cancelText={cancelText}
        classNameTitle="xl:placeholder-base! placeholder-sm! font-normal"
        classNameDescription="sr-only"
        onAction={onConfirm}
      />
    </section>
  );
}

export default BusinessList;
