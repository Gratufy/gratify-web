import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';
import { getBusinessesForAdmin } from '@/lib/actions/businesses';
import BusinessFooter from '@/components/business/BusinessFooter/BusinessFooter';

// import { queryKeys } from '@/lib/reactQuery/queryKeys';
import PublicHeader from '@/components/public/PublicHeader/PublicHeader';
// import FakeBusinessHeader from '@/components/business/BusinessHeader/FakeBusinessHeader';

export default async function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const queryClient = new QueryClient();

  // await queryClient.prefetchQuery({
  //   queryKey: queryKeys.businessList({
  //     city: "__all__",
  //     categoryId: "__all__",
  //     sortBy: "newest",
  //     scope: "business_user",
  //     showOnlineStatus: "all",
  //   }),

  //   queryFn: () =>
  //     getBusinesses({
  //       city: "__all__",
  //       categoryId: "__all__",
  //       sortBy: "newest",
  //       scope: "business_user",
  //       showOnlineStatus: "all",
  //     }),
  // });
  await queryClient.prefetchQuery({
    queryKey: [
      'adminBusinesses',
      {
        reviewStatus: undefined,
        businessStatus: undefined,
        city: '__all__',
        categoryId: '__all__',
        showOnlineStatus: 'all',
        sortBy: 'newest',
      },
    ],
    queryFn: () =>
      getBusinessesForAdmin({
        reviewStatus: undefined,
        businessStatus: undefined,
        city: '__all__',
        categoryId: '__all__',
        showOnlineStatus: 'all',
        sortBy: 'newest',
      }),
  });
  const dehydratedState = dehydrate(queryClient);
  return (
    <HydrationBoundary state={dehydratedState}>
      <div className="flex min-h-screen flex-col">
        {/* <FakeBusinessHeader /> */}
        <PublicHeader />
        <main className="flex flex-1 flex-col">{children}</main>
        <BusinessFooter />
      </div>
    </HydrationBoundary>
  );
}
