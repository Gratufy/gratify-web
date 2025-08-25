import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

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
        showOnlineStatus: "all",
      },
    ],
    queryFn: () =>
      getBusinesses({
        city: "__all__",
        categoryId: "__all__",
        sortBy: "newest",
        scope: "admin",
        showOnlineStatus: "all",
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
