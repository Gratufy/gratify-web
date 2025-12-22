import AdminMainClient from '@/components/admin/main/AdminMainClient';
import { getBusinessesCount } from '@/lib/actions/getBusinessesCount';
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';

import { DEFAULT_ADMIN_FILTERS } from '@/const/filters-url';

import { getBusinessesForAdmin } from '@/lib/actions/admin/getBusinessesForAdmin';
import { queryKeys } from '@/lib/reactQuery/queryKeys';

export default async function AdminMain() {
  const queryClient = new QueryClient();
  const total = await getBusinessesCount();

  const defaultParams = DEFAULT_ADMIN_FILTERS;
  await queryClient.prefetchQuery({
    queryKey: [queryKeys.adminBusinesses(defaultParams)],
    queryFn: () => getBusinessesForAdmin({ ...defaultParams }),
  });

  const dehydratedState = dehydrate(queryClient);
  return (
    <HydrationBoundary state={dehydratedState}>
      <div className="w-full lg:flex">
        <AdminMainClient totalBusinesses={total} />
      </div>
    </HydrationBoundary>
  );
}
