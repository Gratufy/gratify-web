import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';

import { getBusinesses } from '@/lib/actions/businesses';
import { PAGE_SIZE } from '@/const/business';
import HeroSection from '@/components/shared/client-shared/HeroSection';

export default async function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const queryClient = new QueryClient();

  await queryClient.prefetchInfiniteQuery({
    queryKey: [
      'businesses',
      {
        city: '__all__',
        categoryId: '__all__',
        sortBy: 'newest',
        scope: 'public',
        showOnlineStatus: 'all',
      },
    ],
    queryFn: async ({ pageParam = 0 }) => {
      const result = await getBusinesses({
        city: '__all__',
        categoryId: '__all__',
        sortBy: 'newest',
        scope: 'public',
        showOnlineStatus: 'all',
        limit: PAGE_SIZE,
        offset: pageParam,
      });
      return result;
    },
    initialPageParam: 0,
  });
  const dehydratedState = dehydrate(queryClient);
  return (
    <HydrationBoundary state={dehydratedState}> {children}</HydrationBoundary>
  );
}
