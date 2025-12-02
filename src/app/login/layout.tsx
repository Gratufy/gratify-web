import Footer from '@/components/public/PublicFooter/Footer';
import PublicHeader from '@/components/public/PublicHeader/PublicHeader';

export default function LoginLayout({
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
      <Footer />
    </div>
  );
}
