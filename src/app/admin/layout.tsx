import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { ReactQueryProvider } from "@/providers/ReactQueryProvider";
import AdminFooter from "@/components/admin/AdminFooter/AdminFooter";
import AdminHeader from "@/components/admin/AdminHeader/AdminHeader";
import { getBusinesses } from "@/lib/actions/businesses";

export default async function AdminLayout({
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
        scope: "admin",
      },
    ],
    queryFn: () =>
      getBusinesses({
        city: "__all__",
        categoryId: "__all__",
        sortBy: "newest",
        scope: "admin",
      }),
  });
  const dehydratedState = dehydrate(queryClient);
  return (
    <HydrationBoundary state={dehydratedState}>
      <AdminHeader />
      <main>{children}</main>
      <AdminFooter />
    </HydrationBoundary>
  );
}
