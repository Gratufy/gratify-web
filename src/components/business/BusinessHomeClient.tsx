'use client';
import React, { useMemo } from 'react';
import { useBusinesses } from '@/hooks/useBusinesses';
import { Plus } from 'lucide-react';
import { useDashboardSearchStore } from '@/stores/dashboardSearchStore';
//import BusinessList from '../shared/BusinessList';
import { UserFavoritesProvider } from '@/providers/UserFavoritesProvider';
import NotFoundComponent from '../shared/NotFoundComponent';
import DashboardBusinessList from './DashboardBusinessList';
import Link from 'next/link';
import BusinessListSkeleton from '../shared/skeletons/BusinessListSkeleton';

function BusinessHomeClient() {
  const search = useDashboardSearchStore((s) => s.search);
  const {
    data: businesses,
    isLoading: isBusinessesLoading,
    isError: isBusinessesError,
    error,
  } = useBusinesses({
    city: '__all__',
    categoryId: '__all__',
    scope: 'business_user',
  });

  const filtered = useMemo(() => {
    if (!businesses?.data) return [];

    return businesses.data.filter((b) =>
      b.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [businesses, search]);
  return (
    <UserFavoritesProvider>
      {/* {isBusinessesFetching && <BusinessListSkeleton count={6} />} lg:w-[764px] xl:w-[900px]*/}

      <div className="flex w-full flex-col items-center">
        {isBusinessesLoading && (
          <div className="lg:mt-25 mt-20 flex w-[600px] flex-col items-center overflow-hidden lg:w-[764px] xl:w-[900px]">
            <BusinessListSkeleton count={6} />
          </div>
        )}
        {/* {isBusinessesLoading && <BusinessListSkeleton count={6} />} */}
        {businesses?.data.length === 0 &&
          !isBusinessesLoading &&
          !isBusinessesError && <NotFoundComponent business />}
        {businesses &&
          businesses?.data.length > 0 &&
          filtered.length === 0 &&
          !isBusinessesLoading &&
          !isBusinessesError && <NotFoundComponent />}
        {filtered && filtered.length > 0 && (
          <>
            <div className="max-[1024px]:max-w-150 mb-5 w-full px-4 lg:mb-10 lg:w-[764px] lg:px-0 xl:w-[900px]">
              <h2 className="title-h2 mb-5 text-center lg:mb-8 xl:mb-5">
                Мої бізнес-картки
              </h2>
              <div className="flex w-full items-center justify-between">
                <Link
                  href="/dashboard/business/new"
                  className="xl:placeholder-base shadow-menu bg-background-main-300 placeholder-sm flex cursor-pointer items-center px-3 py-[6px] xl:px-5 xl:py-2"
                >
                  <Plus className="mr-[6px] size-4 xl:mr-3 xl:size-5" />{' '}
                  <span>Додати нову</span>
                </Link>
                <button className="xl:placeholder-base bg-background-white shadow-menu border-background-main-300 placeholder-sm flex cursor-pointer items-center border px-3 py-[6px] xl:px-5 xl:py-2">
                  Зв&rsquo;язатись з адміном
                </button>
              </div>
            </div>
            <DashboardBusinessList
              // businesses={businesses?.data ?? []}
              businesses={filtered}
              isLoading={isBusinessesLoading}
              isError={isBusinessesError}
              error={error}
              linkPrefix="/dashboard/business"
            />
          </>
        )}
      </div>
    </UserFavoritesProvider>
  );
}

export default BusinessHomeClient;
