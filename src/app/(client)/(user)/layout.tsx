import HeroSection from '@/components/shared/client-shared/HeroSection';

export default async function UserLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    //
    <main className="flex flex-1 flex-col">
      <HeroSection />
      {children}
    </main>
  );
}
