// new one
'use client';
import React, { useRef, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { BusinessWithCategoryName } from '@/types';
import IconUser from '@/assets/icons/general/icon-user.svg';

import BusinessCardShot from './BusinessCardShot';
import Link from 'next/link';
import BusinessListSkeleton from './skeletons/BusinessListSkeleton';
import { Spinner } from '../ui/spinner';
import { useAuth } from '@/stores/useUserStore';
import { CustomAlertDialog } from '../ui/CustomAlertDialog';

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
  const router = useRouter();
  const { isLoggedIn } = useAuth();
  const loadMoreRef = useRef<HTMLDivElement>(null);
  // for modal
  const [open, setOpen] = useState(false);
  const [alertTitle, setAlertTitle] = useState('');
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
                    open={open}
                    setOpen={setOpen}
                    isLoggedIn={isLoggedIn}
                    setAlertTitle={setAlertTitle}
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
        actionContent={
          <>
            <IconUser className="mr-3 inline size-4 xl:size-5" />
            Вхід
          </>
        }
        // cancelText="Отмена"
        classNameTitle="placeholder-base! font-normal"
        classNameDescription="sr-only"
        onAction={() => router.push('/login')}
      />
    </section>
  );
}

export default BusinessList;
