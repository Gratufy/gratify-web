import PublicHeader from '@/components/public/PublicHeader/PublicHeader';
import PublicFooter from '@/components/public/PublicFooter/PublicFooter';

export default function LegalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <PublicHeader />
      <main className="flex flex-1 items-center justify-center">
        {children}
      </main>
      <PublicFooter />
    </div>
  );
}
