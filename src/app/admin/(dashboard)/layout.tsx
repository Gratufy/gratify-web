import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';
import { verifySession } from '@/lib/dal';
import { redirect } from 'next/navigation';

import { getBusinesses } from '@/lib/actions/businesses';

import AdminSidebar from '@/components/admin/shared/AdminSidebar';

export default async function AdminDashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: [
      'businesses',
      {
        city: '__all__',
        categoryId: '__all__',
        sortBy: 'newest',
        scope: 'admin',
        showOnlineStatus: 'all',
      },
    ],
    queryFn: () =>
      getBusinesses({
        city: '__all__',
        categoryId: '__all__',
        sortBy: 'newest',
        scope: 'admin',
        showOnlineStatus: 'all',
      }),
  });

  const session = await verifySession();

  if (!session) {
    redirect('/login');
  }

  if (session.role !== 'ADMIN') {
    redirect('/no-access');
  }

  const dehydratedState = dehydrate(queryClient);
  return (
    <HydrationBoundary state={dehydratedState}>
      <div className="bg-background-grey-50 flex min-h-screen w-full lg:flex lg:gap-6">
        <AdminSidebar />

        {children}
      </div>
    </HydrationBoundary>
  );
}
