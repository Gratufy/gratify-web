import Footer from '@/components/public/PublicFooter/Footer';
import PublicHeader from '@/components/public/PublicHeader/PublicHeader';
import { UserFavoritesProvider } from '@/providers/UserFavoritesProvider';

export default async function ClientLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen flex-col">
      <PublicHeader />
      <UserFavoritesProvider> {children}</UserFavoritesProvider>

      <Footer />
    </div>
  );
}
