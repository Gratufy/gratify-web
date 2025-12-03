import HeroSection from '@/components/shared/client-shared/HeroSection';

export default function LegalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <main className="flex flex-1 flex-col">
        <HeroSection />
        {children}
      </main>
    </>
  );
}
