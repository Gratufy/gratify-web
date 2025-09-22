import PublicHeader from '@/components/public/PublicHeader/PublicHeader';
import PublicFooter from '@/components/public/PublicFooter/PublicFooter';

export default function LegalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <PublicHeader />
      <main className="flex min-h-screen items-center justify-center">
        {children}
      </main>
      <PublicFooter />
    </>
  );
}
