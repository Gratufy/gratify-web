import PublicFooter from '@/components/public/PublicFooter/PublicFooter';
import LoginHeader from '@/components/login/LoginHeader';

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
      <PublicFooter />
    </div>
  );
}
