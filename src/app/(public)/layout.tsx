import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import PublicFooter from "@/components/public/PublicFooter/PublicFooter";
import PublicHeader from "@/components/public/PublicHeader/PublicHeader";
import { getBusinesses } from "@/lib/actions/businesses";

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
        scope: "public",
      },
    ],
    queryFn: () =>
      getBusinesses({
        city: "__all__",
        categoryId: "__all__",
        sortBy: "newest",
        scope: "public",
      }),
  });
  const dehydratedState = dehydrate(queryClient);
  return (
    <HydrationBoundary state={dehydratedState}>
      <PublicHeader />
      <main>{children}</main>
      <PublicFooter />
    </HydrationBoundary>
  );
}
