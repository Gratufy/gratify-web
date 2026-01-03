import AdminModeringClient from '@/components/admin/modering/AdminModeringClient';

import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';

import { DEFAULT_ADMIN_FILTERS } from '@/const/filters-url';

import { getBusinessesForAdmin } from '@/lib/actions/admin/getBusinessesForAdmin';
import { queryKeys } from '@/lib/reactQuery/queryKeys';
import { getBusinessesCount } from '@/lib/actions/getBusinessesCount';

export default async function AdminModering() {
  const queryClient = new QueryClient();
  const total = await getBusinessesCount();

  const defaultParams = DEFAULT_ADMIN_FILTERS;
  await queryClient.prefetchQuery({
    queryKey: queryKeys.adminBusinesses(defaultParams),
    queryFn: () => getBusinessesForAdmin({ ...defaultParams }),
  });

  const dehydratedState = dehydrate(queryClient);
  return (
    <HydrationBoundary state={dehydratedState}>
      <div className="w-full lg:flex lg:flex-col lg:items-center">
        {/* <AdminModeringList /> */}
        <AdminModeringClient totalBusinesses={total} />
      </div>
    </HydrationBoundary>
  );
}
