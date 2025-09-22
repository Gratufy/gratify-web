import PublicFooter from '@/components/public/PublicFooter/PublicFooter';
import LoginHeader from '@/components/login/LoginHeader';

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <LoginHeader />
      <main className="flex min-h-screen items-center justify-center">
        {children}
      </main>
      <PublicFooter />
    </>
  );
}
