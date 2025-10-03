// import {
//   dehydrate,
//   HydrationBoundary,
//   QueryClient,
// } from "@tanstack/react-query";
// import { getBusinesses } from "@/lib/actions/businesses";

import PublicFooter from '@/components/public/PublicFooter/PublicFooter';
import PublicHeader from '@/components/public/PublicHeader/PublicHeader';
import HeroSection from '@/components/shared/HeroSection';

export default async function UserLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  /*   const queryClient = new QueryClient();
  // HIRE CHANGE TO FAVORITES
  await queryClient.prefetchQuery({
    queryKey: [
      "businesses",
      {
        city: "__all__",
        categoryId: "__all__",
        sortBy: "newest",
        scope: "user",
      },
    ],
    queryFn: () =>
      getBusinesses({
        city: "__all__",
        categoryId: "__all__",
        sortBy: "newest",
        scope: "user",
      }),
  }); */
  // const dehydratedState = dehydrate(queryClient);
  return (
    <>
      <div className="flex min-h-screen flex-col">
        <PublicHeader />
        <main className="flex flex-1 flex-col">
          <HeroSection />
          {children}
        </main>
        <PublicFooter />
      </div>
    </>

    //  </HydrationBoundary>
  );
}
