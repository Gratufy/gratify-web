import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';
import PublicFooter from '@/components/public/PublicFooter/PublicFooter';
import PublicHeader from '@/components/public/PublicHeader/PublicHeader';
import { getBusinesses } from '@/lib/actions/businesses';
import { PAGE_SIZE } from '@/const/business';
import { queryKeys } from '@/lib/reactQuery/queryKeys';
// import FakePublicHeader from '@/components/public/PublicHeader/FakePublicHeader';
import HeroSection from '@/components/shared/HeroSection';

export default async function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const queryClient = new QueryClient();

  // await queryClient.prefetchQuery({
  //   queryKey: queryKeys.businessList({
  //     city: '__all__',
  //     categoryId: '__all__',
  //     sortBy: 'newest',
  //     scope: 'public',
  //     showOnlineStatus: 'all',
  //   }),
  // queryFn: () =>
  //   getBusinesses({
  //     city: "__all__",
  //     categoryId: "__all__",
  //     sortBy: "newest",
  //     scope: "public",
  //     showOnlineStatus: "all",
  //     limit: PAGE_SIZE,
  //     offset: 0,
  //   }),
  //});

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
    <HydrationBoundary state={dehydratedState}>
      {/* <FakePublicHeader /> */}
      <div className="flex min-h-screen flex-col">
        <PublicHeader />
        <main className="flex flex-1 flex-col">
          <HeroSection />
          {children}
        </main>
        <PublicFooter />
      </div>
    </HydrationBoundary>
  );
}
