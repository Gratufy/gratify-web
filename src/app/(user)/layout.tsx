// import {
//   dehydrate,
//   HydrationBoundary,
//   QueryClient,
// } from "@tanstack/react-query";
// import { getBusinesses } from "@/lib/actions/businesses";
import UserFooter from "@/components/user/UserFooter/UserFooter";
import UserHeader from "@/components/user/UserHeader/UserHeader";

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
    // <HydrationBoundary state={dehydratedState}>
    <>
      <UserHeader />
      <main>{children}</main>
      <UserFooter />
    </>

    // </HydrationBoundary>
  );
}
