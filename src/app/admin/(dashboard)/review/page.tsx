import React from 'react';
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';
import { getBusinessesForAdmin } from '@/lib/actions/admin/getBusinessesForAdmin';
import { queryKeys } from '@/lib/reactQuery/queryKeys';

import AdminReviewClient from '@/components/admin/reviews/AdminReviewClient';
import { DEFAULT_ADMIN_FILTERS_WITH_REVIEW_STATUS } from '@/const/filters-url';

const AdminReviewPage = async () => {
  const queryClient = new QueryClient();
  const defaultParams = DEFAULT_ADMIN_FILTERS_WITH_REVIEW_STATUS;
  await queryClient.prefetchQuery({
    queryKey: [queryKeys.adminBusinesses(defaultParams)],
    queryFn: () => getBusinessesForAdmin({ ...defaultParams }),
  });

  const dehydratedState = dehydrate(queryClient);
  return (
    <HydrationBoundary state={dehydratedState}>
      <div className="flex w-full flex-col items-center">
        <AdminReviewClient />
      </div>
    </HydrationBoundary>
  );
};

export default AdminReviewPage;
