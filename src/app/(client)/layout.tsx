import { Suspense } from 'react';
import Footer from '@/components/public/PublicFooter/Footer';
import PublicHeader from '@/components/public/PublicHeader/PublicHeader';

export default async function ClientLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen flex-col">
      <Suspense fallback={<div>...</div>}>
        <PublicHeader />
      </Suspense>

      {children}

      <Footer />
    </div>
  );
}
