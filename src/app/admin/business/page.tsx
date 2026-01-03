import React from 'react';
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';
import { queryKeys } from '@/lib/reactQuery/queryKeys';

import AdminBusinessClient from '@/components/admin/business/AdminBusinessClient';
import { getBusinesses } from '@/lib/actions/businesses';
import { GetBusinessesParams } from '@/types';

export default async function BAdminBusinessPage() {
  const queryClient = new QueryClient();
  const defaultParams: GetBusinessesParams = {
    city: '__all__',
    categoryId: '__all__',
    scope: 'admin',
  };
  await queryClient.prefetchQuery({
    queryKey: queryKeys.businessList(defaultParams),
    queryFn: () => getBusinesses(defaultParams),
  });

  const dehydratedState = dehydrate(queryClient);
  return (
    <HydrationBoundary state={dehydratedState}>
      <div className="xl:pb-15 flex w-full items-center pb-10 pt-5 lg:container lg:pb-14 lg:pt-5">
        <AdminBusinessClient />
      </div>
    </HydrationBoundary>
  );
}
