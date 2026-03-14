// new one
'use client';
import React, { useRef, useEffect, useState, ReactNode } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { useAuth } from '@/stores/useUserStore';
import { BusinessWithCategoryName } from '@/types';

import { Spinner } from '@/components/ui/spinner';
import { CustomAlertDialog } from '@/components/ui/custom-ui/CustomAlertDialog';

import BusinessCardShot from '@/components/shared/BusinessCardShot';
import BusinessListSkeleton from '@/components/shared/skeletons/BusinessListSkeleton';

interface BusinessListProps {
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
}

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
      {isLoading && <BusinessListSkeleton count={4} />}
      {isError && <p>Error: {error?.message}</p>}
      {businesses.length > 0 && (
        <ul className="flex w-full max-w-full flex-col items-center justify-center gap-5 overflow-hidden px-1 pb-1 lg:gap-10">
          {businesses.map((b) => (
            <li
              key={b.id}
              className={cn(
                'h-[226px]bg-background-white-3 w-full overflow-hidden pb-5 transition-[color,box-shadow] lg:h-[248px] xl:h-[260px]',
                'dark:focus:border-elements-main-500 dark:hover:bg-card-hover-dark dark:focus:bg-card-hover-dark dark:shadow-none dark:focus:border-2',
                'shadow-card hover:shadow-card-hover focus:shadow-card-hover'
              )}
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
                    e.preventDefault(); // block navigation if modal is open
                  }
                }}
                className="block h-full w-full"
              >
                <article className="w-full overflow-hidden">
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
        classNameTitle="text-center xl:placeholder-base! placeholder-sm! font-normal"
        classNameDescription="sr-only"
        onAction={onConfirm}
      />
      {/* for LIGHT HOUSE */}
      {hasNextPage && <div aria-hidden className="h-[300px]" />}
    </section>
  );
}

export default BusinessList;
