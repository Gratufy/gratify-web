import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { getBusinesses } from "@/lib/actions/businesses";
import BusinessFooter from "@/components/business/BusinessFooter/BusinessFooter";
import BusinessHeader from "@/components/business/BusinessHeader/BusinessHeader";
import { queryKeys } from "@/lib/reactQuery/queryKeys";

export default async function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: queryKeys.businessList({
      city: "__all__",
      categoryId: "__all__",
      sortBy: "newest",
      scope: "business_user",
      showOnlineStatus: "all",
    }),

    queryFn: () =>
      getBusinesses({
        city: "__all__",
        categoryId: "__all__",
        sortBy: "newest",
        scope: "business_user",
        showOnlineStatus: "all",
      }),
  });
  const dehydratedState = dehydrate(queryClient);
  return (
    <HydrationBoundary state={dehydratedState}>
      <BusinessHeader />
      <main>{children}</main>
      <BusinessFooter />
    </HydrationBoundary>
  );
}
