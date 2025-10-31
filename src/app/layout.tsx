import type { Metadata } from 'next';
import { Ubuntu_Sans, Roboto } from 'next/font/google';
import './globals.css';
import { dehydrate, QueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/reactQuery/queryKeys';

import { ReactQueryProvider } from '@/providers/ReactQueryProvider';
import { ThemeProvider } from '@/providers/theme-provider';
import ClientProvider from '@/providers/UserProvider';
import { getAllBusinessCategories } from '@/lib/actions/businessCategories';
import { getAllSpecialOffers } from '@/lib/actions/specialOffers';

const ubuntuSans = Ubuntu_Sans({
  subsets: ['latin', 'latin-ext'],
  weight: ['400', '500', '700'],
  variable: '--font-family',
});

const roboto = Roboto({
  subsets: ['latin', 'latin-ext'],
  weight: ['500'],
  variable: '--second-family',
});

export const metadata: Metadata = {
  title: 'Gratify',
  description: 'Find your discount',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  //const supabase = await createClient();
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: queryKeys.businessCategories,
    queryFn: getAllBusinessCategories,
  });

  // Prefetch global special offers
  await queryClient.prefetchQuery({
    queryKey: queryKeys.specialOffers,
    queryFn: getAllSpecialOffers,
  });
  const dehydratedState = dehydrate(queryClient);

  return (
    <html lang="uk" suppressHydrationWarning>
      <body className={`${ubuntuSans.variable} ${roboto.variable}`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ReactQueryProvider dehydratedState={dehydratedState}>
            {children}
            <ClientProvider />
          </ReactQueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
