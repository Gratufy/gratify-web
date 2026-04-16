import { verifySession } from '@/lib/dal';
import { redirect } from 'next/navigation';

import AdminSidebarManager from '@/components/admin/shared/AdminSidebarManager';

import type { Metadata } from 'next';
export const metadata: Metadata = {
  title: 'Адмін панель - Gratify',
  description: 'Панель управління бізнесами користувача на платформі Gratify',
};

export default async function AdminDashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await verifySession();

  if (!session) {
    redirect('/login');
  }

  if (session.role !== 'ADMIN') {
    redirect('/no-access');
  }

  // const dehydratedState = dehydrate(queryClient);
  return (
    // <HydrationBoundary state={dehydratedState}>    </HydrationBoundary>
    <div className="bg-background-grey-50 flex min-h-screen w-full flex-col lg:flex lg:flex-row lg:gap-6">
      <AdminSidebarManager />

      <main className="w-full lg:pr-[50px] xl:pr-[100px]"> {children}</main>
    </div>
  );
}
