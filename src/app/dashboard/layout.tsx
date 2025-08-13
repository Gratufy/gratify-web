import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { getBusinesses } from "@/lib/actions/businesses";
import BusinessFooter from "@/components/business/BusinessFooter/BusinessFooter";
import BusinessHeader from "@/components/business/BusinessHeader/BusinessHeader";

export default async function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: [
      "businesses",
      {
        city: "__all__",
        categoryId: "__all__",
        sortBy: "newest",
        scope: "business_user",
      },
    ],
    queryFn: () =>
      getBusinesses({
        city: "__all__",
        categoryId: "__all__",
        sortBy: "newest",
        scope: "business_user",
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
