import PublicFooter from '@/components/public/PublicFooter/PublicFooter';
import PublicHeader from '@/components/public/PublicHeader/PublicHeader';
import HeroSection from '@/components/shared/HeroSection';

export default async function UserLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen flex-col">
      <PublicHeader />
      <main className="flex flex-1 flex-col">
        <HeroSection />
        {children}
      </main>
      <PublicFooter />
    </div>
  );
}
