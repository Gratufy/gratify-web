import { Suspense } from 'react';

import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';
import { queryKeys } from '@/lib/reactQuery/queryKeys';
import { getBusinesses } from '@/lib/actions/businesses';

import { verifySession } from '@/lib/dal';
import { redirect } from 'next/navigation';
// import { queryKeys } from '@/lib/reactQuery/queryKeys';
import PublicHeader from '@/components/public/PublicHeader/PublicHeader';
import Footer from '@/components/public/PublicFooter/Footer';
// import FakeBusinessHeader from '@/components/business/BusinessHeader/FakeBusinessHeader';

export default async function BusinessLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: queryKeys.businessList({
      city: '__all__',
      categoryId: '__all__',
      sortBy: 'newest',
      scope: 'business_user',
      showOnlineStatus: 'all',
    }),

    queryFn: () =>
      getBusinesses({
        city: '__all__',
        categoryId: '__all__',
        sortBy: 'newest',
        scope: 'business_user',
        showOnlineStatus: 'all',
      }),
  });
  const session = await verifySession();

  if (!session) {
    redirect('/login');
  }

  if (session.role !== 'BUSINESS') {
    redirect('/no-access');
  }
  const dehydratedState = dehydrate(queryClient);
  return (
    <HydrationBoundary state={dehydratedState}>
      <div className="flex min-h-screen flex-col">
        {/* <FakeBusinessHeader /> */}
        <Suspense fallback={<div>...</div>}>
          <PublicHeader />
        </Suspense>
        <main className="flex flex-1 flex-col">{children}</main>
        <Footer />
      </div>
    </HydrationBoundary>
  );
}
