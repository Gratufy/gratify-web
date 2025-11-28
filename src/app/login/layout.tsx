import { Suspense } from 'react';
import Footer from '@/components/public/PublicFooter/Footer';
import PublicHeader from '@/components/public/PublicHeader/PublicHeader';

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col">
      <Suspense fallback={<div>...</div>}>
        <PublicHeader />
      </Suspense>
      <main className="flex flex-1 items-center justify-center">
        {children}
      </main>
      <Footer />
    </div>
  );
}
