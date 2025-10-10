import LoginHeader from '@/components/login/LoginHeader';
import Footer from '@/components/public/PublicFooter/Footer';

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col">
      <LoginHeader />
      <main className="flex flex-1 items-center justify-center">
        {children}
      </main>
      <Footer />
    </div>
  );
}
