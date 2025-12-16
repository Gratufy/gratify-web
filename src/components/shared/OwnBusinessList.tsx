// new one for Dashboard and Admin pages- OwnBusinessList.tsx
'use client';
import React, { useRef, useEffect, useState, ReactNode } from 'react';
import Link from 'next/link';

import { BusinessWithCategoryName } from '@/types';
import {
  BUSINESS_STATUS_LABELS,
  
} from '@/const/business';

import { useAuth } from '@/stores/useUserStore';
import {
  getBusinessStatusBgColor,
  getBusinessStatusCardBgColor,
} from '@/lib/helpers/getBusinessStatusColorBg';

import { Spinner } from '@/components/ui/spinner';
import { CustomAlertDialog } from '@/components/ui/custom-ui/CustomAlertDialog';

import BusinessCardShot from '@/components/shared/BusinessCardShot';
import DeleteEditBusinessBtns from '@/components/business/DeleteEditBusinessBtns';

import { BusinessStatusForm } from '../admin/shared/BusinessStatusForm';

type OwnBusinessListProps = {
  businesses: BusinessWithCategoryName[];
  selectedCity?: string;
  isLoading?: boolean;
  isError?: boolean;
  isFetching?: boolean;
  error?: Error | null;
  fetchNextPage?: () => void;
  // onHover?: (id: string | null) => void;
  hasNextPage?: boolean;
  isFetchingNextPage?: boolean;
  enableInfiniteScroll?: boolean; // on/off infinity scroll
  linkPrefix?: string; // for different routes: `/business` , `/dashboard/business`
  includeCityQuery?: boolean; // CityQuery only for public list for now
};

function OwnBusinessList({
  businesses,
  selectedCity = '__all__',
  // isLoading,
  isError,
  error,
  fetchNextPage,

  hasNextPage,
  isFetchingNextPage,
  enableInfiniteScroll = false,
  linkPrefix = '/business',
  includeCityQuery = false,
  // onHover,
}: OwnBusinessListProps) {
  const loadMoreRef = useRef<HTMLDivElement>(null);
  // for modal
  const { isLoggedIn, profile } = useAuth();
  const currentUserId = profile?.userId;
  const isAdmin = profile?.role === 'ADMIN';
  // const isOwner = currentUserId === businesses[0].ownerId; // assume all businesses belong to the same owner
  const [open, setOpen] = useState(false);
  const [alertTitle, setAlertTitle] = useState('');
  const [actionContent, setActionContent] = useState<ReactNode>(null);
  const [onConfirm, setOnConfirm] = useState<() => void>(() => {});
  

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
    <section className="flex w-full flex-1 flex-col items-center overflow-hidden lg:w-[764px] xl:w-[900px]">
      {isError && <p>Error: {error?.message}</p>}

      {businesses.length > 0 && (
        <ul className="flex w-full flex-col items-center justify-center gap-10 overflow-hidden lg:gap-10">
          {businesses.map((b) => (
            <li
              key={b.id}
              className={` ${getBusinessStatusCardBgColor(b.status)} flex w-full flex-col items-center overflow-hidden py-5 lg:px-6 lg:py-3`}
              // onMouseEnter={() => onHover?.(b.id)}
              // onMouseLeave={() => onHover?.(null)}
            >
              {/* Status */}
              <div
                className={`max-[1024px]:max-w-150 mb-1 flex w-full items-center lg:mb-2 lg:gap-6`}
              >
                <div>
                  {b.status === 'draft' || b.status === 'approved' ? (
                  
                      <BusinessStatusForm
                        businessId={b.id}
                        currentStatus={b.status}
                        owner
                      />
                   
                  ) : (
                    <div
                      className={`flex w-full shrink-0 items-center px-5 py-2 lg:w-[170px] lg:px-1 xl:w-[194px] ${getBusinessStatusBgColor(b.status)}`}
                    >
                      <span className="placeholder-xs xl:placeholder-sm mr-2">
                        Статус
                      </span>
                      <span className="title-h6">
                        {BUSINESS_STATUS_LABELS[b.status]}
                      </span>
                    </div>
                  )}
                </div>

                <DeleteEditBusinessBtns
                  id={b.id}
                  className="hidden lg:flex"
                  isAdmin={isAdmin}
                  isOwner={currentUserId === b.ownerId}
                  businessStatus={b.status}
                />
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
              <DeleteEditBusinessBtns
                id={b.id}
                isAdmin={isAdmin}
                isOwner={currentUserId === b.ownerId}
                className="lg:hidden"
                businessStatus={b.status}
              />
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

export default OwnBusinessList;
