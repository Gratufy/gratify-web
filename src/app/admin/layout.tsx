import { verifySession } from '@/lib/dal';
import { redirect } from 'next/navigation';

import Footer from '@/components/public/PublicFooter/Footer';
import PublicHeader from '@/components/public/PublicHeader/PublicHeader';

export default async function AdminLayout({
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

  return (
    <div className="flex min-h-screen flex-col">
      <PublicHeader />
      <div className="flex h-full w-full flex-1 flex-col">{children}</div>
      <Footer />
    </div>
  );
}
